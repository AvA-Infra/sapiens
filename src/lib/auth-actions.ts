"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { safeNext } from "@/lib/auth";
import { ipFromHeaders, rateLimit } from "@/lib/ratelimit";
import { loginSchema, newPasswordSchema, resetRequestSchema, signupSchema } from "@/lib/schemas";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/config/site";

export type AuthState = {
  error?: string;
  fieldErrors?: Partial<Record<"nome" | "email" | "password" | "confirm" | "consent", string>>;
  message?: string;
};

const NOT_CONFIGURED = "A plataforma ainda está sendo configurada. Fale com a gente pelo WhatsApp.";

function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const out: NonNullable<AuthState["fieldErrors"]> = {};
  for (const i of issues) {
    const k = i.path[0] as keyof typeof out;
    out[k] ??= i.message;
  }
  return out;
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error.issues) };

  const ip = ipFromHeaders(await headers());
  const [byIp, byEmail] = await Promise.all([
    rateLimit(`login:ip:${ip}`, 10, 10 * 60 * 1000),
    rateLimit(`login:email:${parsed.data.email.toLowerCase()}`, 6, 10 * 60 * 1000),
  ]);
  if (!byIp.ok || !byEmail.ok) return { error: "Muitas tentativas. Tente de novo em alguns minutos." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  // Mensagem única: não revela se o e-mail existe.
  if (error) return { error: "E-mail ou senha incorretos." };

  const next = String(formData.get("next") ?? "");
  if (!next) {
    // Sem destino pedido: professor cai direto no painel, aluno nos cursos dele.
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
    if (profile?.role === "admin" || profile?.role === "professor") redirect("/admin");
  }
  redirect(safeNext(next));
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const parsed = signupSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    password: formData.get("password"),
    consent: formData.get("consent") === "on",
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error.issues) };

  const ip = ipFromHeaders(await headers());
  if (!(await rateLimit(`signup:ip:${ip}`, 5, 60 * 60 * 1000)).ok) {
    return { error: "Muitas tentativas. Tente de novo mais tarde." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { nome: parsed.data.nome }, emailRedirectTo: `${site.url}/auth/confirmar?next=/aluno` },
  });
  if (error) return { error: "Não foi possível criar a conta. Confira os dados e tente de novo." };

  // Com confirmação de e-mail desligada o Supabase já devolve a sessão.
  if (data.session) redirect("/aluno");
  return { message: "Conta criada. Confira seu e-mail para confirmar o cadastro e depois entre." };
}

/**
 * Esqueci minha senha: manda o e-mail com o link. A resposta é sempre a mesma,
 * exista ou não a conta, para não revelar quem está cadastrado.
 */
export async function requestPasswordReset(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const parsed = resetRequestSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error.issues) };

  const ip = ipFromHeaders(await headers());
  const [byIp, byEmail] = await Promise.all([
    rateLimit(`reset:ip:${ip}`, 5, 60 * 60 * 1000),
    rateLimit(`reset:email:${parsed.data.email.toLowerCase()}`, 3, 60 * 60 * 1000),
  ]);
  if (!byIp.ok || !byEmail.ok) return { error: "Muitas tentativas. Tente de novo mais tarde." };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${site.url}/auth/confirmar?next=/nova-senha`,
  });
  return {
    message:
      "Se este e-mail tiver conta no site, você vai receber um link para criar uma senha nova. Confira também a caixa de spam.",
  };
}

/** Nova senha, depois de abrir o link do e-mail (o link já deixou a pessoa logada). */
export async function updatePassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const parsed = newPasswordSchema.safeParse({ password: formData.get("password"), confirm: formData.get("confirm") });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error.issues) };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return { error: "O link expirou ou já foi usado. Peça um novo em \"Esqueci minha senha\"." };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return {
      error:
        error.code === "same_password"
          ? "A nova senha precisa ser diferente da anterior."
          : "Não foi possível trocar a senha agora. Tente de novo.",
    };
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
  redirect(profile?.role === "admin" || profile?.role === "professor" ? "/admin" : "/aluno");
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}

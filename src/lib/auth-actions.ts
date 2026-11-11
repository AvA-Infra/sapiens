"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { safeNext } from "@/lib/auth";
import { ipFromHeaders, rateLimit } from "@/lib/ratelimit";
import { loginSchema, signupSchema } from "@/lib/schemas";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/config/site";

export type AuthState = {
  error?: string;
  fieldErrors?: Partial<Record<"nome" | "email" | "password" | "consent", string>>;
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
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  // Mensagem única: não revela se o e-mail existe.
  if (error) return { error: "E-mail ou senha incorretos." };

  redirect(safeNext(String(formData.get("next") ?? "")));
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
    options: { data: { nome: parsed.data.nome }, emailRedirectTo: `${site.url}/entrar` },
  });
  if (error) return { error: "Não foi possível criar a conta. Confira os dados e tente de novo." };

  // Com confirmação de e-mail desligada o Supabase já devolve a sessão.
  if (data.session) redirect("/aluno");
  return { message: "Conta criada. Confira seu e-mail para confirmar o cadastro e depois entre." };
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}

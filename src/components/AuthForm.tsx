"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { requestPasswordReset, signIn, signUp, updatePassword, type AuthState } from "@/lib/auth-actions";

const field =
  "mt-1.5 block min-h-12 w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink focus:border-sky-500";
const link = "font-semibold text-sky-600 underline underline-offset-2";
const initial: AuthState = {};

function FieldError({ id, text }: { id: string; text?: string }) {
  return text ? (
    <p id={id} className="mt-1 text-sm font-medium text-red-700">
      {text}
    </p>
  ) : null;
}

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signIn, initial);
  const fe = state.fieldErrors ?? {};
  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="font-semibold text-navy-900">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={field}
          aria-invalid={fe.email ? true : undefined}
          aria-describedby={fe.email ? "email-erro" : undefined}
        />
        <FieldError id="email-erro" text={fe.email} />
      </div>
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="password" className="font-semibold text-navy-900">Senha</label>
          <Link href="/esqueci-senha" className="text-sm font-semibold text-sky-600 underline underline-offset-2">
            Esqueci minha senha
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={field}
          aria-invalid={fe.password ? true : undefined}
          aria-describedby={fe.password ? "password-erro" : undefined}
        />
        <FieldError id="password-erro" text={fe.password} />
      </div>
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 font-medium text-red-800">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Entrando..." : "Entrar"}
      </Button>
      <p className="text-center text-ink-soft">
        Ainda não tem conta?{" "}
        <Link href="/cadastrar" className={link}>
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}

export function SignupForm() {
  const [state, action, pending] = useActionState(signUp, initial);
  const fe = state.fieldErrors ?? {};

  if (state.message) {
    return (
      <div role="status" className="rounded-card bg-sky-100 p-6 text-navy-900">
        <p className="font-display text-3xl font-bold">Quase lá.</p>
        <p className="mt-1">{state.message}</p>
        <Link href="/entrar" className={`mt-4 inline-block ${link}`}>
          Ir para o login
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      <div>
        <label htmlFor="nome" className="font-semibold text-navy-900">Nome</label>
        <input
          id="nome"
          name="nome"
          autoComplete="name"
          required
          className={field}
          aria-invalid={fe.nome ? true : undefined}
          aria-describedby={fe.nome ? "nome-erro" : undefined}
        />
        <FieldError id="nome-erro" text={fe.nome} />
      </div>
      <div>
        <label htmlFor="email" className="font-semibold text-navy-900">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={field}
          aria-invalid={fe.email ? true : undefined}
          aria-describedby={fe.email ? "email-erro" : undefined}
        />
        <FieldError id="email-erro" text={fe.email} />
      </div>
      <div>
        <label htmlFor="password" className="font-semibold text-navy-900">
          Senha <span className="font-normal text-ink-soft">(mínimo de 8 caracteres)</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={field}
          aria-invalid={fe.password ? true : undefined}
          aria-describedby={fe.password ? "password-erro" : undefined}
        />
        <FieldError id="password-erro" text={fe.password} />
      </div>
      <div>
        <label className="flex items-start gap-3">
          <input type="checkbox" name="consent" className="mt-1.5 size-5 accent-navy-900" />
          <span>
            Concordo com a{" "}
            <Link href="/privacidade" className={link}>
              política de privacidade
            </Link>{" "}
            e os{" "}
            <Link href="/termos" className={link}>
              termos de uso
            </Link>
            .
          </span>
        </label>
        <FieldError id="consent-erro" text={fe.consent} />
      </div>
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 font-medium text-red-800">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Criando conta..." : "Criar conta"}
      </Button>
      <p className="text-center text-ink-soft">
        Já tem conta?{" "}
        <Link href="/entrar" className={link}>
          Entrar
        </Link>
      </p>
    </form>
  );
}

/** Esqueci minha senha: pede o e-mail e manda o link. */
export function ResetRequestForm({ linkError }: { linkError?: boolean }) {
  const [state, action, pending] = useActionState(requestPasswordReset, initial);
  const fe = state.fieldErrors ?? {};

  if (state.message) {
    return (
      <div role="status" className="rounded-card bg-sky-100 p-6 text-navy-900">
        <p className="font-display text-3xl font-bold">Confira seu e-mail.</p>
        <p className="mt-1">{state.message}</p>
        <Link href="/entrar" className={`mt-4 inline-block ${link}`}>
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      {linkError && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 font-medium text-red-800">
          Esse link expirou ou já foi usado. Peça um novo abaixo.
        </p>
      )}
      <p className="text-ink-soft">Informe o e-mail da sua conta. Vamos mandar um link para você criar uma senha nova.</p>
      <div>
        <label htmlFor="email" className="font-semibold text-navy-900">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={field}
          aria-invalid={fe.email ? true : undefined}
          aria-describedby={fe.email ? "email-erro" : undefined}
        />
        <FieldError id="email-erro" text={fe.email} />
      </div>
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 font-medium text-red-800">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enviando..." : "Enviar link"}
      </Button>
      <p className="text-center text-ink-soft">
        Lembrou?{" "}
        <Link href="/entrar" className={link}>
          Entrar
        </Link>
      </p>
    </form>
  );
}

/** Nova senha: aberta pelo link do e-mail. */
export function NewPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, initial);
  const fe = state.fieldErrors ?? {};
  return (
    <form action={action} className="space-y-5" noValidate>
      <div>
        <label htmlFor="password" className="font-semibold text-navy-900">
          Nova senha <span className="font-normal text-ink-soft">(mínimo de 8 caracteres)</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={field}
          aria-invalid={fe.password ? true : undefined}
          aria-describedby={fe.password ? "password-erro" : undefined}
        />
        <FieldError id="password-erro" text={fe.password} />
      </div>
      <div>
        <label htmlFor="confirm" className="font-semibold text-navy-900">Repita a nova senha</label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          className={field}
          aria-invalid={fe.confirm ? true : undefined}
          aria-describedby={fe.confirm ? "confirm-erro" : undefined}
        />
        <FieldError id="confirm-erro" text={fe.confirm} />
      </div>
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 font-medium text-red-800">
          {state.error}{" "}
          <Link href="/esqueci-senha" className="underline underline-offset-2">
            Pedir novo link
          </Link>
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Salvando..." : "Salvar nova senha"}
      </Button>
    </form>
  );
}

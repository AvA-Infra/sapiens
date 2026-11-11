import { z } from "zod";

/** Schema do formulário de contato. Usado no cliente (UX) e no servidor (segurança). */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100, "Nome muito longo"),
  email: z.string().trim().email("E-mail inválido").max(160),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[\d\s()+-]*$/, "Use apenas números")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(10, "Escreva ao menos 10 caracteres").max(2000, "Mensagem muito longa"),
  consent: z.literal(true, { error: "É preciso concordar com a política de privacidade" }),
  // Honeypot: humanos não veem nem preenchem. Bots preenchem.
  website: z.string().max(0).optional(),
  // Instante em que o formulário foi exibido (ms). Envios instantâneos são bots.
  startedAt: z.number(),
  // Token do Cloudflare Turnstile (obrigatório só quando as chaves estão configuradas).
  turnstileToken: z.string().max(4096).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Login e cadastro (área do aluno). */
export const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido").max(160),
  password: z.string().min(1, "Informe a senha").max(200),
});

export const signupSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100, "Nome muito longo"),
  email: z.string().trim().email("E-mail inválido").max(160),
  password: z.string().min(8, "Use ao menos 8 caracteres").max(200),
  consent: z.literal(true, { error: "É preciso concordar com a política de privacidade" }),
});

export const commentSchema = z.object({
  lessonId: z.string().uuid(),
  body: z.string().trim().min(1, "Escreva sua dúvida").max(2000, "Texto muito longo"),
});

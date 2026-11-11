import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui/Section";

export const metadata: Metadata = { title: "Política de privacidade" };

const h2 = "text-3xl font-bold text-navy-900";

export default function PrivacidadePage() {
  return (
    <>
      <PageHeader eyebrow="LGPD" title="Política de privacidade" />
      <Section>
        <div className="max-w-2xl space-y-5 text-lg">
          <p className="rounded-card border border-dashed border-sky-500/60 bg-sky-50 p-4 text-base">
            <strong className="text-sky-600">[PREENCHER]</strong> Rascunho técnico. Revise com a escola (e, de preferência, com um
            advogado) antes de publicar: razão social, CNPJ e canal do encarregado de dados.
          </p>

          <h2 className={h2}>Quais dados coletamos</h2>
          <p>
            Nome, e-mail, telefone (opcional) e a mensagem enviada pelo formulário de contato. Para alunos, também os dados de
            cadastro (nome, e-mail e senha protegida por criptografia), a matrícula, o progresso nas aulas e as dúvidas escritas
            nas aulas.
          </p>

          <h2 className={h2}>Para que usamos</h2>
          <p>Responder seu contato, gerenciar matrículas e o acesso à área do aluno. Não vendemos dados.</p>

          <h2 className={h2}>Com quem os dados passam</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>Supabase:</strong> hospedagem do banco de dados e do login da plataforma.</li>
            <li><strong>Provedor de vídeo (Bunny):</strong> entrega das videoaulas aos alunos matriculados.</li>
            <li><strong>Cloudflare Turnstile:</strong> verificação anti-robô no formulário de contato, quando ativada.</li>
            <li><strong>Instagram (Meta):</strong> a página “Quem cursa, aprova” exibe as publicações originais da escola. Ao carregá-las, o Instagram pode definir cookies e coletar dados de navegação, conforme a política da própria Meta.</li>
            <li><strong>Google Maps:</strong> mapas nas páginas de contato e estrutura, com o mesmo tipo de coleta pelo Google.</li>
          </ul>

          <h2 className={h2}>Alunos aprovados</h2>
          <p>
            Nomes, cursos e fotos de alunos aprovados são exibidos a partir de publicações da escola. Se você aparece e quer ser
            removido, fale com a gente e atendemos o pedido.
          </p>

          <h2 className={h2}>Seus direitos</h2>
          <p>
            Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento, pelo WhatsApp ou e-mail da escola,
            conforme a Lei 13.709/2018 (LGPD).
          </p>

          <h2 className={h2}>Cookies</h2>
          <p>
            Usamos cookies essenciais, como o de sessão do login. Não há rastreadores de publicidade nossos. Os conteúdos
            incorporados (Instagram e Google Maps) podem definir cookies próprios.
          </p>
        </div>
      </Section>
    </>
  );
}

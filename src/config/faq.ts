/**
 * Perguntas frequentes. Aparecem na home, na página /duvidas e (as respondidas) no Google, como dados estruturados.
 *
 * Regra: só responda com o que a escola confirma. Para perguntas ainda sem resposta oficial,
 * deixe `answer: null`: o site mostra a pergunta e encaminha a pessoa para o WhatsApp,
 * e a pergunta fica FORA dos dados estruturados do Google.
 */
export type Faq = { id: string; question: string; answer: string | null };

export const faqs: Faq[] = [
  {
    id: "onde-fica",
    question: "Onde fica a Sapiens?",
    answer:
      "Na Av. Vinte e Oito de Março, 574, Centro de Campos dos Goytacazes, dentro do Shopping Avenida 28. Você pode passar para conhecer o espaço antes de se matricular.",
  },
  {
    id: "para-quais-provas",
    question: "Para quais provas o curso prepara?",
    answer:
      "Para os vestibulares de Medicina e de outras carreiras da saúde e para o ENEM. As aprovações publicadas incluem faculdades públicas e particulares, em Campos e em outros estados.",
  },
  {
    id: "matricula",
    question: "Como faço a matrícula?",
    answer:
      "Pelo WhatsApp ou pessoalmente, na unidade. Ainda não há matrícula online: a gente conversa com você, explica as turmas e reserva a vaga.",
  },
  {
    id: "aulas-online",
    question: "Tem aula online?",
    answer:
      "O curso é presencial. A plataforma online, com videoaulas, materiais e acompanhamento do progresso, está sendo preparada para os alunos matriculados.",
  },
  {
    id: "aprovados-reais",
    question: "As aprovações do site são reais?",
    answer:
      "Sim. Cada aprovação do mural “Quem cursa, aprova” corresponde a uma publicação no Instagram da Sapiens, e você pode abrir a publicação original em cada cartão.",
  },
  // [PREENCHER] respostas oficiais da escola. Enquanto `answer` for null, o site encaminha para o WhatsApp.
  { id: "horarios", question: "Quais são os dias e horários das aulas?", answer: null },
  { id: "valores", question: "Quanto custa e quais são as formas de pagamento?", answer: null },
  { id: "aula-experimental", question: "Posso assistir a uma aula antes de decidir?", answer: null },
  { id: "bolsas", question: "Vocês oferecem bolsas ou descontos?", answer: null },
];

export const answeredFaqs = faqs.filter((f): f is Faq & { answer: string } => f.answer !== null);

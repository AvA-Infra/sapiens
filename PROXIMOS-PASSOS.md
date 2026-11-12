# Próximos passos, em ordem

1. **Supabase:** em *Authentication > URL Configuration*, coloque `https://sapiens28.vercel.app` em *Site URL* e *Redirect URLs*. Depois teste criar uma conta em `/cadastrar` e enviar uma mensagem em `/contato` (passados os 10 minutos). Esses dois fluxos ainda não foram testados no site publicado.
2. **Virar admin:** depois de criar sua conta, rode no SQL Editor do Supabase o comando que está no README (seção "Banco de dados"), trocando o e-mail pelo seu.
3. **Conteúdo real da escola:** turmas, horários, valores, professores, fotos, depoimentos, história e missão. A tabela "O que ainda falta a escola informar" no README mostra o arquivo de cada item. Enquanto isso, o site mostra `[PREENCHER]` nesses pontos.
4. **Revisão dos artigos do blog** por um professor, e das respostas em `src/config/faq.ts`.
5. **Planos:** os valores atuais são fictícios. Troque pelos reais em `src/config/plans.ts` antes de divulgar o site.
6. **Privacidade e termos:** preencher razão social, CNPJ e encarregado de dados, e passar por um advogado.
7. **Domínio definitivo:** registrar (por exemplo um .com.br), apontar para a Vercel e definir `NEXT_PUBLIC_SITE_URL`. Só então o site aparece no Google.
8. **Estatísticas:** ativar *Analytics* no painel do projeto na Vercel.

## Para trabalhar a dois daqui em diante

Seu sócio clona o repositório, roda `npm install` e `npm run dev`, e recebe de você os valores do `.env.local` por um canal seguro. Para mudanças maiores, vale criar uma branch e abrir um Pull Request: a Vercel gera um link de prévia para vocês verem antes de publicar.

Próximo trabalho natural: o item 3. Passe os dados da escola, mesmo soltos, e o Claude encaixa tudo no site.

## Lembrete extra

- Trocar o token do Upstash (Reset Token no painel da Upstash), porque ele apareceu num print, e atualizar o valor na Vercel.

# Como publicar um artigo no blog

Cada artigo é um arquivo `.md` nesta pasta. Não há painel nem banco de dados: criou o arquivo e deu push, o artigo entra no site.

## Passo a passo

1. Crie um arquivo com o nome que vai aparecer no endereço, em minúsculas, sem acentos e com hífens.
   Exemplo: `como-escolher-o-curso.md` vira `/blog/como-escolher-o-curso`.
2. Comece o arquivo com o cabeçalho abaixo (as três linhas de `---` são obrigatórias):

   ```md
   ---
   titulo: Título do artigo
   resumo: Uma ou duas frases. Aparece na lista do blog, no Google e ao compartilhar no WhatsApp.
   data: 2026-12-01
   assunto: ENEM
   ---
   ```

   - `data` sempre no formato `AAAA-MM-DD`. Os artigos são ordenados por ela.
   - `assunto` é um rótulo curto (ENEM, Redação, Medicina, Organização...).
   - Se o título ou o resumo tiver dois-pontos, coloque o texto entre aspas: `titulo: "Redação: por onde começar"`.
   - Para deixar um artigo guardado sem publicar, acrescente a linha `rascunho: sim`.

3. Escreva o texto em Markdown logo abaixo:

   ```md
   Parágrafo de abertura.

   ## Subtítulo

   Texto com **negrito** e um [link para outra página](/cursos).

   - item de lista
   - outro item
   ```

   Use `##` para subtítulos (o título principal vem do cabeçalho). Tabelas e listas numeradas também funcionam.

4. Confira no seu computador com `npm run dev`, em `http://localhost:3000/blog`.
5. `git add`, `git commit` e `git push`.

## Cuidados

- Só publique informação que a escola confirma. Regras de prova mudam: quando citar algo de edital, diga para o leitor conferir o edital do ano.
- Não prometa aprovação nem use números que a escola não possa comprovar.
- Texto direto, em português do Brasil, sem emojis.

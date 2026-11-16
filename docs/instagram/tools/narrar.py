# Gera a narração (voz Thalita, Microsoft) e os tempos de cada palavra. Uso: python3 narrar.py <pasta>
import asyncio, json, os, sys, edge_tts
LINES = [
  "Vai prestar Medicina em 2027?",
  "Então presta atenção: uma tarde de prova pode virar um ano inteiro de estudo com bolsa.",
  "O Exame de Bolsa do Sapiens é na quarta-feira, dia 25 de novembro, das duas e meia às cinco e meia da tarde, no segundo piso do Shopping Avenida 28.",
  "As inscrições estão abertas! O link do formulário está na legenda. Ficou com dúvida? Chama a gente no WhatsApp.",
  "Sapiens, Curso de Biomédicas. Vem pro Sapiens!",
]
async def main(out):
  words = []
  for i, text in enumerate(LINES, 1):
    c = edge_tts.Communicate(text, "pt-BR-ThalitaMultilingualNeural", rate="+8%", boundary="WordBoundary", proxy=os.environ.get("HTTPS_PROXY"))
    w = []
    with open(f"{out}/c{i}.mp3", "wb") as f:
      async for ch in c.stream():
        if ch["type"] == "audio": f.write(ch["data"])
        elif ch["type"] == "WordBoundary": w.append([ch["text"], ch["offset"] / 1e7, (ch["offset"] + ch["duration"]) / 1e7])
    words.append(w)
  json.dump(words, open(f"{out}/palavras.json", "w"), ensure_ascii=False)
asyncio.run(main(sys.argv[1]))

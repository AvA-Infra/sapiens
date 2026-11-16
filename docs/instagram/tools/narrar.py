# Gera a narração (voz Thalita, Microsoft) e os tempos de cada palavra. Uso: python3 narrar.py <pasta>
import asyncio, json, os, sys, edge_tts
LINES = [
  "Vai prestar Medicina em 2027?",
  "Então presta atenção: uma tarde de prova pode virar um ano inteiro de estudo com bolsa.",
  "O Exame de Bolsa do Sápiens é na quarta-feira, dia 25 de novembro, das duas e meia às cinco e meia da tarde, no segundo piso do Shopping Avenida 28.",
  "As inscrições estão abertas! O link do formulário está na legenda. Ficou com dúvida? Chama a gente no WhatsApp.",
  "Esse é o Sápiens, o curso de Biomédicas que te prepara pra aprovação. Vem pro Sápiens!",
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
  # Linha do tempo: cada fala começa 0,25 s depois da anterior terminar.
  starts, t = [], 0.3
  for i in range(len(LINES)):
    starts.append(round(t, 2))
    t += float(os.popen(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {out}/c{i+1}.mp3").read()) + 0.25
  end = round(t + 1.2, 2)
  json.dump(words, open(f"{out}/palavras.json", "w"), ensure_ascii=False)
  with open(f"{out}/palavras.js", "w") as f:
    f.write("window.WORDS=" + json.dumps(words, ensure_ascii=False) + ";\n")
    f.write("window.TIMELINE=" + json.dumps({"S": starts, "END": end}) + ";\n")
asyncio.run(main(sys.argv[1]))

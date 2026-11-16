#!/usr/bin/env bash
# Refaz o Reels inteiro: narração (voz Thalita) -> frames -> MP4 com áudio.
# Os tempos de cada fala saem de narracao/palavras.js (gerado por tools/narrar.py).
set -euo pipefail
cd "$(dirname "$0")/.."
F="${TMPDIR:-/tmp}/reels-frames"; rm -rf "$F"; mkdir -p "$F"
[ "${PULAR_NARRACAO:-}" = 1 ] || python3 tools/narrar.py narracao
node tools/render-reels.js "$F"
read -r FILTER END < <(python3 - <<'PY'
import json, re
js = open("narracao/palavras.js").read()
tl = json.loads(re.search(r"window.TIMELINE=(.*);", js).group(1))
parts = [f"[{i}]adelay={int(s*1000)}|{int(s*1000)}[a{i}]" for i, s in enumerate(tl["S"])]
mix = "".join(f"[a{i}]" for i in range(len(tl["S"])))
print(";".join(parts) + f";{mix}amix=inputs={len(tl['S'])}:normalize=0,apad=whole_dur={tl['END']},loudnorm=I=-14:TP=-1.5[out]", tl["END"])
PY
)
ffmpeg -loglevel error -y $(for i in 1 2 3 4 5; do echo -i narracao/c$i.mp3; done) -filter_complex "$FILTER" -map "[out]" -ar 44100 -ac 2 "$F/narracao.wav"
ffmpeg -loglevel error -y -framerate 30 -i "$F/%04d.png" -i "$F/narracao.wav" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -shortest -movflags +faststart reels-exame-de-bolsa-2027.mp4
echo "Pronto: reels-exame-de-bolsa-2027.mp4 (${END}s)"

#!/usr/bin/env bash
# Refaz o Reels inteiro: narração (voz Thalita) -> frames -> MP4 com áudio.
# Os tempos de início das falas (300, 3450, ...) precisam bater com S[] em reels-exame-de-bolsa-2027.html.
set -euo pipefail
cd "$(dirname "$0")/.."
F="${TMPDIR:-/tmp}/reels-frames"; rm -rf "$F"
python3 tools/narrar.py narracao
python3 -c "import json;w=json.load(open('narracao/palavras.json'));open('narracao/palavras.js','w').write('window.WORDS='+json.dumps(w,ensure_ascii=False)+';')"
node tools/render-reels.js "$F"
ffmpeg -loglevel error -y -i narracao/c1.mp3 -i narracao/c2.mp3 -i narracao/c3.mp3 -i narracao/c4.mp3 -i narracao/c5.mp3 -filter_complex \
  "[0]adelay=300|300[a];[1]adelay=3450|3450[b];[2]adelay=8750|8750[c];[3]adelay=17750|17750[d];[4]adelay=25550|25550[e];[a][b][c][d][e]amix=inputs=5:normalize=0,apad=whole_dur=31,loudnorm=I=-14:TP=-1.5[out]" \
  -map "[out]" -ar 44100 -ac 2 "$F/narracao.wav"
ffmpeg -loglevel error -y -framerate 30 -i "$F/%04d.png" -i "$F/narracao.wav" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -shortest -movflags +faststart reels-exame-de-bolsa-2027.mp4

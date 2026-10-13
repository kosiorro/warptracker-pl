#!/bin/sh
# Pobiera modele 3D (CC0, Quaternius) z warptracker.com do game/models/
mkdir -p models
cd models
for f in hero knight sword helmet skeleton bat ghost demon; do
  echo "pobieram $f.glb..."
  curl -sL "https://warptracker.com/models/$f.glb" -o "$f.glb"
done
echo "Gotowe. Uruchom serwer w game/: python3 -m http.server 8080"

@echo off
REM Pobiera modele 3D (CC0, Quaternius) z warptracker.com do game\models\
cd /d "%~dp0game"
if not exist models mkdir models
cd models
for %%f in (hero knight sword helmet skeleton bat ghost demon) do (
  echo pobieram %%f.glb...
  curl -sL "https://warptracker.com/models/%%f.glb" -o "%%f.glb"
)
echo Gotowe. W folderze game uruchom: python -m http.server 8080
pause

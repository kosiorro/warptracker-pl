# Warptracker PL 🇵🇱

Polska edycja [Warptrackera](https://github.com/ilrein/warptracker) — open source'owego ARPG w stylu Diablo, które działa w przeglądarce (Three.js, MIT).

Jesteś Tropicielem. Wyrwy — strumienie zła — rozdzierają świat. Wybierz Zakon, weź łowy przy ogniu Żarowarty i zejdź na Czarne Bagna. Rozbij iglice, zapieczętuj wyrwy, zejdź do Pustego Kurhanu i rozbij Serce Wyrwy.

## Co dodaliśmy względem oryginału

| Mod | Klawisz | Opis |
|---|---|---|
| 🌍 Tłumaczenie PL | — | cała gra po polsku (UI, questy, dialogi, loot, klasy) |
| 🎒 Sakwa | — | 20 miejsc; gorsze dropy lecą do sakwy zamiast się rozpadać, a zdjęte itemy wracają do niej |
| 🧍 Karta postaci | `C` / `I` | paperdoll ze slotami Broń / Zbroja / Talizman + ikony SVG (gem kolorowany wg rzadkości) |
| ⚔️ Wyposażenie startowe | — | świeże postaci dostają miecz (+12 obr.), kirys (+15 życia) i talizman (+8 many) |
| 🛠️ Panel admina | `P` | baza przedmiotów: twórz/edytuj/zakładaj/upuszczaj w świecie, podgląd 3D modeli, eksport/import JSON, własne dropy przy zabójstwach |
| 🌿 Trawa | — | proceduralna tekstura podłoża (szum 3-oktawowy, mroźna zieleń bagien) |
| 💪 Balans | — | bazowe obrażenia podwojone: `(26 + 6×poziom) × mnożnik klasy` |

## Uruchomienie

Gra wymaga serwowania po HTTP (przeglądarka blokuje WebGL/fetch z `file://`).

```sh
git clone https://github.com/kosiorro/warptracker-pl.git
cd warptracker-pl/game

# 1. modele 3D są już w repo (base64 w game/models/b64/) — nic nie trzeba pobierać.
#    (opcjonalnie: ../pobierz-modely.sh pobiera oryginalne pliki GLB bezpośrednio)

# 2. odpal serwer (z API zapisu dla panelu admina):
python3 serwer.py             # port 8080; własny: python3 serwer.py 3000
#    (python3 -m http.server też zadziała, ale panel nie będzie mógł zapisywać plików)
# 3. gra:      http://localhost:8080
#    panel admina (osobna strona, pełny): http://localhost:8080/admin.html
```

## Struktura repo

```
game/                  → gotowa gra (odpal game/index.html przez serwer)
  index.html
  assets/
    index-FsptR_Zn.js  → loader: składa 12 części w jeden moduł i startuje grę
    admin.js           → panel admina (P): baza przedmiotów + podgląd 3D
    (własne modele: game/models/NAZWA.glb + lista w panelu — patrz niżej)
    parts/p01–p12.js   → spatchowany bundle gry (PL + mody)
    index-BEkZlT_U.css → style
  models/b64/          → modele 3D (base64+gzip; loader dekoduje je w locie)
                       (opcjonalnie: prawdziwe pliki GLB przez pobierz-modely.sh)
mods/
  charsheet.js         → czytelne źródło: karta postaci + sakwa + starter
  admin.js             → czytelne źródło: panel admina + trawa
pobierz-modely.sh|.bat → pobiera 8 modeli GLB z warptracker.com (CC0)
```

**Dlaczego parts/?** Bundle gry to ~1 MB zminifikowanego JS — GitHub contents API nie przyjmuje tak dużych plików w jednym kawałku, więc trzymamy go podzielonego na 12 części, a mały loader (`assets/index-FsptR_Zn.js`) skleja je w przeglądarce w Blob-URL i importuje jako moduł. Loader ustawia też `window.__WTdebug` (THREE + pomocniki), więc oryginalny `debug-*.js` nie jest już potrzebny.

## GitHub Pages (opcjonalnie)

Gra może działać też online przez GitHub Pages. Pages serwuje tylko katalog główny repo, więc trzeba przekopiować zawartość `game/` do roota (index.html + assets/ + models/ — modele GLB trzeba wtedy wrzucić do repo ręcznie, bo skrypt tylko pobiera). Potem: **Settings → Pages → Deploy from a branch → main / (root)**.

## Panel admina — osobna strona (`/admin.html`)

Panel zmienia **pliki gry** (bazę i kod — trwale, do gita), nie tylko stan partii:

- **🗄 Baza gry / Kod** — edytor pliku `game/data/gamedata.json` (dialogi NPC, pula przedmiotów, dropChance) **i edytor kodu gry** (mody, loader, HTML, części bundla). Zapisy idą prosto na dysk przez API serwera (`serwer.py`); potem `git commit` + F5 w grze
- **Dialogi / NPC** — przyjazne formularze nad kwestiami Serry, Marka, Vess i Branna — edytują ten sam plik `gamedata.json`
- **Przedmioty** — zakładanie, sakwa, import/eksport, podgląd 3D (stan sesji)
- **Modele 3D** — lista własnych .glb
- **Postać** — klasa, poziom, XP, rozdział fabuły (zapis gry)
- **Kopia / Reset** — eksport/import całego stanu

**Baza gry = plik.** `game/data/gamedata.json` jest źródłem prawdy dla dialogów i bazowych przedmiotów — gra ładuje go przy starcie (bridge.js), dropy z puli lecą przy zabójstwach. Zmiany widoczne po F5.

Strona i gra dzielą localStorage (ten sam serwer) — najlepiej trzymać je w dwóch kartach obok siebie. Przycisk **Pauza** w nagłówku panelu (i **ESC** w grze) zamraża/wznawia grę z poziomu panelu. Dialogi i dropy działają natychmiast; postać/ekwipunek wymagają F5 w grze. Podgląd 3D na stronie korzysta z CDN three.js (bez internetu reszta panelu działa normalnie).

## Własne modele 3D (.glb)

1. Wrzuć plik do `game/models/` — nazwa bez rozszerzenia staje się identyfikatorem, np. `game/models/moja-bron.glb`
2. Otwórz panel admina (**P**) → sekcja **Modele 3D (własne)** → wpisz `moja-bron` i kliknij **+**
3. Odśwież grę (F5) — model zostanie załadowany razem z resztą i pojawi się na liście **model 3D** przy przedmiotach
4. Wybierz go w edytorze przedmiotu — podgląd 3D od razu pokaże Twój model

Brakujący plik `.glb` jest pomijany z ostrzeżeniem w konsoli (gra nie odmówi startu).

## Sterowanie

- **WASD** — ruch, **mysz** — celowanie, **LPM** — combo mieczem
- **SPACE** — unik (i-frames), **1/2/3** — umiejętności, **E** — rozmowa
- **C / I** — karta postaci (papierowa lalka + sakwa), **P** — panel admina, **ESC** — menu gry (pauza, zapis/wczytanie, nowa gra, dźwięk), **M** — dźwięk, **kółko** — zoom

## Menu gry, sklep i zapisy

- **ESC** otwiera menu gry: wróć do gry, karta postaci, zapis gry (3 sloty), wczytanie, dźwięk, nowa gra.
- **Zapis / wczytanie**: migawka całego stanu (bohater, ekwipunek, sakwa, statystyki, złoto) ląduje w `localStorage` w 3 slotach.
- **Sklep**: w rozmowie z NPC w mieście pojawia się przycisk **🛒 Handel** — kupuj przedmioty z bazy gry (gamedata.json) za złoto, sprzedawaj zawartość sakwy. Start: 🪙 50.
- **Tooltipy**: najedź kursorem na przedmiot (karta postaci, sklep, ekwipunek) — zobaczysz nazwę i statystyki.

## Licencje i podziękowania

- Gra oryginalna: [ilrein/warptracker](https://github.com/ilrein/warptracker) — **MIT**
- Modele 3D: Quaternius — **CC0** (pobierane z warptracker.com)
- Tłumaczenie PL + mody: ta edycja — **MIT**

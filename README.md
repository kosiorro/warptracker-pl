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
| 🛠️ Panel admina | `P` | pełny edytor przedmiotów: twórz, edytuj, zakładaj, usuwaj — zmiany działają natychmiast |
| 🌿 Trawa | — | proceduralna tekstura podłoża (szum 3-oktawowy, mroźna zieleń bagien) |
| 💪 Balans | — | bazowe obrażenia podwojone: `(26 + 6×poziom) × mnożnik klasy` |

## Uruchomienie

Gra wymaga serwowania po HTTP (przeglądarka blokuje WebGL/fetch z `file://`).

```sh
git clone https://github.com/kosiorro/warptracker-pl.git
cd warptracker-pl/game

# 1. pobierz modele 3D (CC0, ~3 MB) — jednorazowo:
../pobierz-modely.sh        # Linux/macOS
# ..\pobierz-modely.bat    # Windows

# 2. odpal serwer:
python3 -m http.server 8080   # lub: python -m http.server 8080 / npx serve .
# 3. otwórz: http://localhost:8080
```

## Struktura repo

```
game/                  → gotowa gra (odpal game/index.html przez serwer)
  index.html
  assets/              → kod (JS/CSS, w tym wszystkie mody)
  models/              → modele 3D (generuje skrypt pobierania)
mods/
  charsheet.js         → czytelne źródło: karta postaci + sakwa + starter
  admin.js             → czytelne źródło: panel admina + trawa
pobierz-modely.sh|.bat → pobiera 8 modeli GLB z warptracker.com (CC0)
```

## Sterowanie

- **WASD** — ruch, **mysz** — celowanie, **LPM** — combo mieczem
- **SPACE** — unik (i-frames), **1/2/3** — umiejętności, **E** — rozmowa
- **C / I** — karta postaci, **P** — panel admina, **M** — dźwięk, **kółko** — zoom

## Licencje i podziękowania

- Gra oryginalna: [ilrein/warptracker](https://github.com/ilrein/warptracker) — **MIT**
- Modele 3D: Quaternius — **CC0** (pobierane z warptracker.com)
- Tłumaczenie PL + mody: ta edycja — **MIT**

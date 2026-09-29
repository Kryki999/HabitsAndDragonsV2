# Ideas Inbox

Tu wrzucamy **surowe** pomysły. Rozrzut do filarów robi partner / agent.

---

## Dump — 2026-08-16 ekran straganu

Tap hotspotu → grafika babki + straganu, itemy po bokach.  
Lock kierunku: kadr 3 (nie crop placu), 6 pustych gniazd, SKU = UI.  
Plik: [`reference/art/prompt-vendor-shop.md`](reference/art/prompt-vendor-shop.md).  
**Superseded 2026-09-24:** gniazda i dolny pasek sprzedaży wyszły. Zostaje kadr 3 + katalog Buy / Sell w chrome (lookdev `shop`).

---

## Dump — 2026-08-15 produkcja mapy (AI + pan/zoom)

Założyciel: szata graficzna / mapa z generatorów AI; czy 4K 16:9 pod scroll.  
Rozstrzygnięcie wtedy: **nie 16:9**; kwadrat 4096² MVP; dwa podejścia (still vs warstwy życia).  
Dopisek (ten sam dzień): **dwa kadry** — najpierw close-upy lokacji, orbita później jako ogólny widok (nie 1:1).  
**Superseded 2026-09-25:** nie kwadrat, nie pinch, nie hub w środku. **Pionowy pasek** 390×1920, Crownhaven na dole, lock X, B=200, środek-albo-para. Dwa kadry (pasek ≠ close-up) **zostają**.  
Plik: [`24-map-production.md`](24-map-production.md).

## Dump — 2026-09-25 mapa = pielgrzymka

Fit-width zabił Y na korytarzu 9:16. Founder: wyższy pasek, nie zoom z powrotem. Graybox zatwierdzony (B=200, Vampire skrzydło+rezerwa). Nie generować artu zanim generator nie dostanie szarego PNG jako composition lock.

## Dump — dodatkowe pomysły (po prototypie)

**2026-07-30 — wizja „Mapa królestwa / isekai”** (główny zwrot produktu):

- Nie kotwiczyć w prototypie; rewrite OK.
- Onboarding: cinematic real→RPG (Re:Zero vibe), styl cartoon (Rick&Morty × Vox Machina × S&F); respawn w stolicy; NPC (kapusta) pyta kim jesteś; klasy TBD (możliwy kill).
- Finch = psychologia/UX; my = bohater królestwa nie kurczak.
- Home: awans w stolicy (rynnsztok→wpływ), nie rozwój izolowanej wioski.
- Jedna mapa spina lokacje, NPC, fabułę, lochy (1–3 tier’y), travel (wyprawy czasowe + teleporty).
- Wyprawy czasowe: **keep** (Finch rano/wieczór) — pushback na wcześniejsze „park”.
- Art: Rive postaci; AI video na fabułę; mapa musi być wow.
- Plik: `15-onboarding-arrival.md`; synteza: `00-final-picture.md`.

## Dump — archiwum (~2 miesiące temu)

**2026-07-30** — katalog: [`reference/archive-concept-mid.md`](reference/archive-concept-mid.md).  
Rola teraz: **budulec** (Drogi, karta, Mentor, hex, itemy) pod nową mapę — nie „patch na V1”.

## Dump — 2026-07-31 Akt 1 lokacje (burza)

Pełny tekst: [`23-act1-location-brainstorm.md`](23-act1-location-brainstorm.md) — **Rev B** (wieczór) = aktualny zarys założyciela.  
Rev A = archiwum w tym samym pliku (§H).

## Dump — 2026-08-01 ekonomia Akt 1

Model roboczy w [`06-economy-loot.md`](06-economy-loot.md): diminishing XP, gold sink, energia walki, potrójna bramka mapy, ~30 dni do Titana. Progi vs Rev B: `23` §I.

## Dump — 2026-08-01 emotki + skup

Emotki = kolekcja kosmetyczna (`05`/`06`). Skup: zwykły ~10–15g, unikaty/heroiki drożej ale pensja nawyków = main; aukcje PARK; 2 klucze loch PARK.

## Dump — rzeczy mylące / konflikty w głowie

- Klasy: zostawić czy zabić na rzecz Dróg?
- Jak mocno spiąć mistrzów Dróg z NPC na mapie?
- Item power vs flex
- Auth vs cinematic order

## Dump — 2026-08-04 pałac / doradca / Main vs punkty

- L7 „drobiazg po 2 dniach” = słabe → szukać prawdziwej nagrody.
- Punkty eksploracji = **tylko side**; Main ★ odblokowuje się **levelem** (auto na mapie), nie konkuruje o punkt.
- Po ★1: sława → zaproszenie do **pałacu** w Crownhaven (wcześniej zamek w tle) → **doradca** (nie król jeszcze) → daje **chatę** (Dom Lv2).
- Pałac = warstwa **huba** (jak menelnia góra/dół), **nie** 11. pin mgły. 5 side + 4 Main + stolica = enough Akt 1.
- Po Titanie: schody w pałacu → **audiencja u króla** (seed Akt 2 / Wizard King later).
- → Lock roboczy w `17`, `21` G, `23` B4.

## Przeniesione (log)

| Data | Fragment | Trafił do |
|------|----------|-----------|
| 2026-09-24 | 5 SS sheet look-dev (Home/Hero/onboarding/streak/shop) | [`reference/ui/mocks/`](reference/ui/mocks/) |
| 2026-09-24 | Goldeny Hero / streak / level-up / sklep (kierunek `shop.png`) / 2× onboarding; Talk out z NPC; niższa AllyCard; poświata za kartą → szew do tab bara; brak Fight/Talk w kit-sheet | [`reference/ui/design-bible.md`](reference/ui/design-bible.md) v2.2, `19`, `15`, `06` §7 |
| 2026-09-24 | Founder: PeekCard „Enter”; sklep Buy / Sell jako zakładki; LevelNav z lookdev = najnowsza nawigacja pięter. Szept, dolny pasek sprzedaży, winda z etykietami, gniazda SKU = superseded | `reference/ui/design-bible.md` v2.3, `00`, `06` §7, `18`, `19` S06, `21`, `23` B0–B1, `24`, `prompt-vendor-shop` |
| 2026-09-24 | LevelNav bez nazwy piętra przy przytrzymaniu. Winieta babki later — na razie wycinek Crownhaven | `reference/ui/design-bible.md`, `18`, `21`, `prompt-vendor-shop` |
| 2026-07-30 | Archiwum mid-concept | `reference/archive-concept-mid.md` |
| 2026-07-30 | Wizja mapa/isekai/onboarding | `00`, `01`, `03`, `04`, `09`, `10`, `15` |
| 2026-08-04 | Pałac / doradca / Main vs punkty | `17`, `21`, `23` |
| 2026-08-04 | Crownhaven 3 hotspoty + koło/kubeczki + loot Gutterjack | `23` B0–B2, `06` 11b, `21` G |
| 2026-08-05 | Cross-location keys (loch → piętro/warstwa innej lokacji) | **PARK** — seed poniżej |
| 2026-08-05 | D2 = Crown Approaches (nie Merchant's Cut) | `23` D2 |

## Dump — 2026-08-05 cross-keys między lokacjami

Seed: z lochów mogą dropić **klucze lokalizacji** (nie tylko „klucz walki”), które odblokowują **dodatkową warstwę** indziej — wzór: menelnia (piwnica / parter / piętro). Np. klucz z Approaches → piwnica w innej lokacji / bonus feature.  
**Nie** mylić z kluczami CD walki (`06`). System later — po ustabilizowaniu hub + R1.

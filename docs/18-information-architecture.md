# 18 — Information Architecture (główny HUD / taby)

> Burza 2026-07-30: po onboardingu — jak wygląda codzienny UI.  
> **Smoki:** PARK (gryzie się z mapą; wrócimy osobno).  
> Day 0–7 doprecyzowujemy **po** decyzji o tabach.

---

## Co zostaje z intuicji prototypu (V1 → V2)

| V1 tab | Intuicja | V2 |
|--------|----------|-----|
| Zamek + lista zadań | Home + nawyki IRL | **Questy** — czysta lista + winieta domu w stolicy |
| D&D (karty lochów/smoki) | Słaba immersja, karty | **Świat** (mapa + lokacja) — nie karty |
| Hero | Ekwipunek, hex, milestone | **Bohater** — keep |
| Kingdom | Znajomi / inni gracze | **Społeczność** — Hall of Heroes (`08`); nie ranking V1 |
| Mędrzec | Zawsze dostępny guide | **Mentor / Tawerna** — keep (fullscreen w środku) |

---

## Napięcie do rozstrzygnięcia (2 osobne decyzje)

### Decyzja A — „Gdzie jestem?” (obecność postaci)

| Model | Opis | Plus | Minus |
|-------|------|------|-------|
| **A1. Hub stały** | Winieta na Questy **zawsze** = dom w stolicy (rynnsztok→chata→zamek). Lokacje ogarniasz w Świecie. | Czysty habit focus; czytelny awans „domu” | Mniej „jestem w lesie” na home |
| **A2. Obecność twarda** | Postać realnie jest w lokacji; Questy pokazują tło tej lokacji. Podróż wymagana. | Max immersja podróży | Tarcie; home miesza nawyki z travel state |
| **A3. Soft focus** | Dom w stolicy na Questy; na Mapie wybierasz **fokus** lokacji (bez „przeprowadzki”). Wyprawa timer = **OUT** tego MVP. | Habit czysty + mapa żywa | — |

### Decyzja B — Mapa vs zakładka lokacji

| Model | Opis |
|-------|------|
| **B1. Dwa taby** | `Lokacja` (treść miejsca) + `Mapa` (odkrywanie) |
| **B2. Jeden tab Świat** | Domyślnie mapa; tap w pin → drill-in lokacji (historia, NPC, lochy). Start wyprawy = **OUT** tego MVP |

---

## Rekomendacja współtwórcy (propozycja do potwierdzenia)

**A3 + B2** → **5 tabów**, bez smoków, bez osobnego D&D.

### Dlaczego A3
- Sam powiedziałeś: **pierwszy ekran ma być bardzo czysty pod listę zadań IRL** — to święte.
- Awans stolicy (rynnsztok→zamek) zostaje **najważniejszym klockiem home** — nie rozmywamy go skakaniem po biomach na tym samym tabie.
- Wyprawy czasowe (Finch) = **Cel later**, nie ten slice (lock 2026-10-06). Ten slice: pin otwarty levelem, Enter od razu.

### Dlaczego B2 (Mapa + lokacja w jednym)
- Osobno `Lokacja` + `Mapa` + Questy + Bohater + Social + Mentor = **6** i wrażenie ciężaru.
- Jedna zakładka **Świat**: najpierw piękna mapa (wow), potem głębokość lokacji — to jest właściwy zastępnik kart D&D.

### Jak grasz w lokację bez „przeprowadzki”
1. Questy → odhaczasz życie (tło = Twój dom w stolicy).  
2. Świat → mapa → wybierasz Piramidę → widzisz historię / lochy / NPC.  
3. Odpalasz loch albo misję sojusznika **od razu** (fokus).  
4. Albo Enter od razu (ten slice). Wyprawa timer = **OUT** tego MVP.

Zwoje teleportu = natychmiastowy fokus / skip timera (później).

---

## Playground lock — drill Crownhaven (2026-09-21)

Jak gracz chodzi po Świecie **w apce teraz** (nie nowy tab, nie lista wyjść):

1. **Mapa królestwa** — piny bez nazw. Tap otwartego pinu → **PeekCard** (miniatura, nazwa, „Enter”). Szept po tapie = superseded (LOCK 2026-09-24, lookdev `world-map`). Kamera i siatka: **LOCK 2026-09-25** (`24`).
2. **Hub Crownhaven** — pełny still do tab bara. HUD: Capital / Crownhaven. Wejścia = hotspoty na grafice. **Back** → mapa. Zero listy lokacji pod obrazkiem.
3. **Tawerna** — HUD: kicker = miejsce (`Tavern`), tytuł = piętro (`Ground` / `Cellar`). Góra-prawo: **LevelNav** — strzałki ▲▼ między piętrami, **kłódka** zamiast strzałki gdy piętro zamknięte (tap = warunek), kropki głębokości. Lookdev (`world-gutterjack`, hub) = jedyna wersja; winda z etykietami z 2026-09-21 = superseded. Przytrzymanie strzałki nie pokazuje nazwy piętra — nazwa jest w SceneHead ([`reference/ui/design-bible.md`](reference/ui/design-bible.md)). Jedna decyzja na ekran: Back opuszcza miejsce (→ hub), strzałki zmieniają piętro. Ten sam komponent dla poziomów lochów (Common → Elite → Champion).
4. **Cellar / Gutterjack** — kompaktowa karta walki na dole (nazwa + win% · 4 dropy + Fight), max ~18% ekranu. LevelNav w prawym górnym rogu.
5. **Account HUD** — Questy, Hero, Social, Mentor. **Nie** na tabie World (lock 2026-09-22). V1 `TabsWithTopBar`: avatar + pierścień XP, nick, `Lv.n`; **pills** gold + keys (surface, thin purple border, radius 20); prawo: mail (stub/disabled) + settings (haptics). `__DEV__`: badge **DEV** otwiera panel (long-press na pills = skrót). Production: bez badge/panelu. Streak PARK (brak globalnego streak w `habits`).

Hotspot schodów na stillu jest **opcjonalny** i woła to samo `setFloor` co strzałki — nie drugie menu. Struktura pięter jest gotowa na trzecie piętro (Upper = locked placeholder). Kod `world/FloorLift.tsx` = stara winda, do wymiany na LevelNav przy porcie UI.

---

## Playground lock — kamera paska (2026-09-25)

Plansza królestwa — produkt, nie korytarz 9:16:

1. **Kamera** — fit-width, **zero panu X**, **zero pinch**. Jedna skala. Scroll tylko góra–dół. Spawn = dolny fold (Crownhaven). Graybox 390×1920, B=200. Kwadrat 4:5 / hub w środku / zoom 1.85× = superseded (`24`).
2. **Piny** — rzędy: albo jeden środek, albo para L/P. Vampire = skrzydło + rezerwa, nie na trakcie. Otwarte (level OK): sticker landmarku. Zamknięte (za niski level): **kłódka**. Fog of war **nie** jest chrome. `MapPin.current` = kursor wyboru (awatar skacze). Tap kłódki nie otwiera lokacji.
3. **Account HUD** — zostaje na Questy, Hero, Social, Mentor. Na World paska nie ma: plansza full-bleed pod status barem. Bez górnej lawendowej poświaty.

---

## Proponowany główny HUD (5 tabów)

| # | Tab | Job | Co widać |
|---|-----|-----|----------|
| 1 | **Questy** | Habit core | Czysta lista nawyków IRL + winieta bohatera w **domu stolicy** (tier wpływu). |
| 2 | **Świat** | RPG fantasy | **Mapa królestwa** (cała widoczna) → drill-in **lokacji** (NPC, lochy). Unlock pinu = level. |
| 3 | **Bohater** | Tożsamość / flex | 2 sloty, hex polish. Tytuły **PARK**. Emotki **OUT**. |
| 4 | **Społeczność** | Hall of Heroes (flex) | Calling card + koło + bohaterowie doliny. Peek = przycięty Hero. Soft gate L4/D2. [`08`](08-social.md). |
| 5 | **Mentor** | Placeholder | Tab zostaje. **Mentor AI OUT** tego MVP. |

### Świadomy park
- Smoki (osobna decyzja później)
- Osobny tab „tylko lokacja” (wchłonięty przez Świat)
- Osobny tab D&D-karty
- Ranking, mapa zamków, DM, gildie, tawerna-multiplayer — [`08`](08-social.md) PARK/KILL; tab zostaje hallem

---

## Alternatywa jeśli wolisz twardą podróż (A2)

Wtedy: Questy tło = aktualna lokacja; Świat/Mapa = zmiana obecności (wyprawa lub teleport).  
**Koszt:** każda sesja nawyków zależy od travel state — ryzykownie dla „Finch-prostej” codzienności. Możliwe jako **tryb późniejszy**, nie default launch.

---

## Alternatywa 6 tabów (jeśli B1)

Questy | Lokacja | Mapa | Bohater | Społeczność | Mentor  
Warunek: Mentor jako **HUD icon** zamiast taba → wracamy do 5.

---

## Status decyzji

| Temat | Status |
|-------|--------|
| Smoki w HUD | **PARK** |
| Questy = czysta lista IRL + dom stolicy | **PROPOSE KEEP** |
| Świat = mapa + drill lokacji | **PROPOSE KEEP** |
| Crownhaven hub / tawerna / piętra | **LOCK** — hotspoty, nie lista wyjść. Piętra/poziomy = **LevelNav** z lookdev (strzałki + kłódka), 2026-09-24; labeled lift z 2026-09-21 unieważniony |
| World chrome / ikony | **LOCK v2** (2026-09-24) — still bez HUD; nameplate z kotwicą na landmarku; sticker (treść) vs MingCute Fill (system); ten sam tab bar co Home + szew. Fog of war **nie** jest chrome mapy (2026-10-06). Canvas `mgła` = tło sheetów A/B, nie overlay FoW. [`reference/ui/design-bible.md`](reference/ui/design-bible.md) |
| Mapa: tap pinu | **LOCK** (2026-09-24) — PeekCard (nazwa + „Enter”); piny dalej bez nazw. Szept = superseded |
| Mapa: kamera + siatka | **LOCK** (2026-09-25) — pionowy pasek, lock X, bez pinch, Crownhaven na dole, B=200, środek-albo-para. [`24`](24-map-production.md) |
| Bohater / Społeczność / Mentor | **PROPOSE KEEP** tabów (Społeczność = Hall of Heroes, LOCK `08` 2026-09-25). **Mentor AI OUT** · tytuły **PARK** (2026-10-06) |
| Obecność twarda vs soft focus | **Czeka na Twój werdykt** (rekomendacja: soft focus A3) |
| Day 0–7 | Po potwierdzeniu HUD |

---

## Pytanie do Ciebie (jedna odpowiedź wystarczy)

Wybierz:
1. **A3+B2** — rekomendacja (5 tabów, dom w stolicy, mapa=świat; wyprawa timer **OUT** tego MVP)  
2. **A2** — twarda obecność (postać zawsze „jest” w lokacji)  
3. **B1** — osobno Lokacja i Mapa (świadomie 6 albo Mentor w HUD)

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
| Kingdom | Znajomi / inni gracze | **Społeczność** — keep |
| Mędrzec | Zawsze dostępny guide | **Mentor / Tawerna** — keep (fullscreen w środku) |

---

## Napięcie do rozstrzygnięcia (2 osobne decyzje)

### Decyzja A — „Gdzie jestem?” (obecność postaci)

| Model | Opis | Plus | Minus |
|-------|------|------|-------|
| **A1. Hub stały** | Winieta na Questy **zawsze** = dom w stolicy (rynnsztok→chata→zamek). Lokacje ogarniasz w Świecie. | Czysty habit focus; czytelny awans „domu” | Mniej „jestem w lesie” na home |
| **A2. Obecność twarda** | Postać realnie jest w lokacji; Questy pokazują tło tej lokacji. Podróż wymagana. | Max immersja podróży | Tarcie; home miesza nawyki z travel state |
| **A3. Soft focus** | Dom w stolicy na Questy; na Mapie wybierasz **fokus** lokacji (bez „przeprowadzki”). Opcjonalna **wyprawa** = timer + beat (Finch wieczór). | Habit czysty + mapa żywa + wyprawy mają sens | Trzeba dobrze nazwać UX („fokus” ≠ „mieszkam tu”) |

### Decyzja B — Mapa vs zakładka lokacji

| Model | Opis |
|-------|------|
| **B1. Dwa taby** | `Lokacja` (treść miejsca) + `Mapa` (odkrywanie) |
| **B2. Jeden tab Świat** | Domyślnie mapa; tap w pin → drill-in lokacji (historia, NPC, lochy, start wyprawy) |

---

## Rekomendacja współtwórcy (propozycja do potwierdzenia)

**A3 + B2** → **5 tabów**, bez smoków, bez osobnego D&D.

### Dlaczego A3
- Sam powiedziałeś: **pierwszy ekran ma być bardzo czysty pod listę zadań IRL** — to święte.
- Awans stolicy (rynnsztok→zamek) zostaje **najważniejszym klockiem home** — nie rozmywamy go skakaniem po biomach na tym samym tabie.
- Wyprawy czasowe dalej mają po co istnieć (Finch), bez wymuszania travel do każdego locha.

### Dlaczego B2 (Mapa + lokacja w jednym)
- Osobno `Lokacja` + `Mapa` + Questy + Bohater + Social + Mentor = **6** i wrażenie ciężaru.
- Jedna zakładka **Świat**: najpierw piękna mapa (wow), potem głębokość lokacji — to jest właściwy zastępnik kart D&D.

### Jak grasz w lokację bez „przeprowadzki”
1. Questy → odhaczasz życie (tło = Twój dom w stolicy).  
2. Świat → mapa → wybierasz Piramidę → widzisz historię / lochy / NPC.  
3. Odpalasz loch albo misję sojusznika **od razu** (fokus).  
4. Albo startujesz **wyprawę** (timer) → wieczorem check (immersja podróży bez blokowania nawyków).

Zwoje teleportu = natychmiastowy fokus / skip timera (później).

---

## Playground lock — drill Crownhaven (2026-09-21)

Jak gracz chodzi po Świecie **w apce teraz** (nie nowy tab, nie lista wyjść):

1. **Mapa królestwa** — piny bez nazw; nazwa w HUD / szept po tapie otwartego miejsca. Kamera i kłódki: lock 2026-09-22.
2. **Hub Crownhaven** — pełny still do tab bara. HUD: Capital / Crownhaven. Wejścia = hotspoty na grafice. **Back** → mapa. Zero listy lokacji pod obrazkiem.
3. **Tawerna** — HUD: kicker hubu (`Crownhaven`) + tytuł miejsca (`Tavern`). Góra-prawo: **winda z etykietami** (Upper later / Ground / Cellar). Aktywne piętro podświetlone; tap = skok. Jedna decyzja na ekran: Back opuszcza miejsce (→ hub), winda zmienia piętro.
4. **Cellar / Gutterjack** — walka bez przebudowy (tray rarity + Fight CTA, win% góra-prawo). Winda w tym samym stacku, nad win%.
5. **Account HUD** — Questy, Hero, Social, Mentor. **Nie** na tabie World (lock 2026-09-22). V1 `TabsWithTopBar`: avatar + pierścień XP, nick, `Lv.n`; **pills** gold + keys (surface, thin purple border, radius 20); prawo: mail (stub/disabled) + settings (haptics). `__DEV__`: badge **DEV** otwiera panel (long-press na pills = skrót). Production: bez badge/panelu. Streak PARK (brak globalnego streak w `habits`).

Hotspot schodów na stillu jest **opcjonalny** i woła to samo `setFloor` co winda — nie drugie menu. Structure windy jest gotowa na trzecie piętro (Upper = locked placeholder).

---

## Playground lock — kamera korytarza (2026-09-22)

Plansza królestwa w apce teraz:

1. **Zoom** — jedna skala produktowa. Gracz tylko panuje. Pinch i przyciski +/- są wyłączone. Clamp krawędzi zostaje.
2. **Piny** — małe kółka, bez nazw. Odkryte: ikona landmarku (Crownhaven = zamek). Nieodkryte: ta sama wielkość, **kłódka** zamiast landmarku. Tap kłódki nie otwiera lokacji.
3. **Account HUD** — zostaje na Questy, Hero, Social, Mentor. Na World paska nie ma: plansza full-bleed pod status barem, tytuł HUD pod safe area.

---

## Proponowany główny HUD (5 tabów)

| # | Tab | Job | Co widać |
|---|-----|-----|----------|
| 1 | **Questy** | Habit core | Czysta lista nawyków IRL + winieta bohatera w **domu stolicy** (tier wpływu). Chip: „wyprawa w toku” jeśli aktywna. |
| 2 | **Świat** | RPG fantasy | **Mapa królestwa** → drill-in **lokacji** (lore, sojusznik, lochy 1–n, start wyprawy). |
| 3 | **Bohater** | Tożsamość / flex | 2 sloty, hex, milestone’y gry, odblokowane lokacje, tytuły. |
| 4 | **Społeczność** | Social | Znajomi, inni bohaterowie doliny / królestwa. |
| 5 | **Mentor** | Coach | Wejście do tawerny → **fullscreen** rozmowa (+ mood). Dostęp zawsze, niezależnie od fokusu mapy. |

### Świadomy park
- Smoki (osobna decyzja później)
- Osobny tab „tylko lokacja” (wchłonięty przez Świat)
- Osobny tab D&D-karty

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
| Crownhaven hub / tawerna / winda | **LOCK playground** (2026-09-21) — hotspoty + labeled lift, nie lista wyjść |
| Bohater / Społeczność / Mentor | **PROPOSE KEEP** |
| Obecność twarda vs soft focus | **Czeka na Twój werdykt** (rekomendacja: soft focus A3) |
| Day 0–7 | Po potwierdzeniu HUD |

---

## Pytanie do Ciebie (jedna odpowiedź wystarczy)

Wybierz:
1. **A3+B2** — rekomendacja (5 tabów, dom w stolicy, mapa=świat, wyprawy opcjonalne)  
2. **A2** — twarda obecność (postać zawsze „jest” w lokacji)  
3. **B1** — osobno Lokacja i Mapa (świadomie 6 albo Mentor w HUD)

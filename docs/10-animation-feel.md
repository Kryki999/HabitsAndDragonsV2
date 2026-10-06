# 10 — Animation & Game Feel

> **Status:** szkic feel + **Rive lock** (postacie / close-up) + **LOCK 2026-10-06** żywy świat / motion walki kartami (post-MVP, nie ten slice).

## Z prototypu

Lottie, Reanimated, haptics, loot trajectory, battle modal — dobre lekcje feel. Nie dogmat stacku.

## Cel (final)

- **Postacie i UI motion:** **Rive** (decyzja założyciela).
- **Filmiki fabularne / quest reveals / onboarding isekai:** **AI-generated video** (osobny pipeline, ostra kontrola jakości i stylu).
- **Spójność z mapą:** filmiki i Rive siedzą w **tej samej bible** co świat (`09`) — painterly world + graphic characters, wspólna paleta/światło; nie osobne IP per klip.
- Must-feel: odhacz nawyku, drop itemu, win lochu, awans domu w stolicy, hex reveal. **Nie** ten slice: powrót z wyprawy, odsłonięcie FoW.
- **Mapa żyje:** pasek = diorama (Image+gesty teraz; Skia later); **życie „jedna całość”** przede wszystkim na **close-up lokacji w Rive** — nie całe królestwo w jednym `.riv`. Rive = HUD/aktorzy/sceny, nie silnik mapy (`09`, `12`, `24`).
- **Świat oddycha, walka rusza się** (later): idle / sway na close-upach; walka kartami = boss i gracz **przeciw sobie**, nie statyczne karty. Lock: sekcja **2026-10-06** poniżej. **Nie ten MVP.**
- Wzorzec Finch: satysfakcja z **drugiego wejścia dnia** (sprawdzenie wyniku).

---

## Żywy świat + motion walki kartami (LOCK 2026-10-06)

Lock Krystiana. Kierunek smaku / later — **nie** nowy scope MVP, **nie** nowe zależności, **nie** brief programistyczny.

### Źródło smaku / teoria motion

[John (Meta / Threads, Reels): animations that make vibe-coded apps feel alive](https://www.youtube.com/watch?v=f-Ar8mwm3kQ)

Teoria: mikro-ruch, który sprawia, że apka **żyje**. U nas to idzie dalej niż bounce UI.

### Player feel

Świat H&D ma **żyć** — nie tylko mikro UI bounce. Postacie w lokacjach i lochach oddychają, kołyszą się, małe idle. Gdy przyjdzie walka kartami (~1 min), boss i gracz **ruszają się przeciw sobie**: skill leci, trafienie, VFX, boss odpowiada — agency i satysfakcja, nie statyczne karty.

### Dwie warstwy (nie mylić)

1. **Chrome / UI** — Lottie / Reanimated / spring (odhacz nawyku, loot, poranek, equip). Częściowo już w grze (`Z prototypu`).
2. **Świat + walka** — Rive (postacie: rest-state → akcja → z powrotem do rest), gest + particles + layout na beaty walki. Zgodnie z lockiem Rive w tym filarze i w `09` (close-up / aktorzy, nie silnik mapy).

### Kolejność budowy (post-MVP, nie teraz)

1. Idle na 1–2 kluczowych NPC / bossie (Rive, **zawsze wraca do rest**).
2. Jeden „hero moment” walki (skill throw → hit → sparkle).
3. Dopiero potem pełniejsza walka kartami + więcej lokacji.

### MVP tego **nie** robi

- nowych zależności pod ten lock
- pełnego silnika animacji
- Rive na całe królestwo (mapa = diorama; życie na close-upach — już w Cel powyżej / `09` / `24`)

### Steering dla agentów

Nie mów „zrób animacje”. Nazwij **beat** + **technikę** (spring / path / particles / state machine) + **ludzki taste review**. AI samo nie wie, co dobrze leży.

---

## Otwarte

- Kto zatwierdza AI clip (human gate) zanim trafi do gracza?
- Fallback gdy AI video nie gotowe (illustrated panels + Rive)?
- Długość onboardingu cinematic vs skip/accessibility?
- Look-dev: 1 klip Crownhaven + 1 Rive hero w tej samej palecie (gate „jedna gra?”)

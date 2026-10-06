# 00 — Final Picture (obraz całej gry)

> **Status:** szkic roboczy po lockach produktu (2026-07-30) + **mapa LOCK 2026-09-25** (`24`) + **MVP lock 2026-10-06** (poniżej).  
> Prototyp V1 = referencja UX zadań/kalendarza/feel — **nie** kotwica architektury. Rewrite OK, jeśli final jest lepszy.

---

## MVP lock 2026-10-06

Wąski slice dla agentów i czytelników Biblii. Lokacje Aktu 1 **już są**; fabuła aktu / narracja Main = **odroczona**. UI kit **już wylądował** ([`reference/ui/design-bible.md`](reference/ui/design-bible.md) LOCK v2.3).

**IN (ten slice):** mapa **bez fog of war** (całe królestwo widoczne) · piny otwiera **poziom bohatera** · onboarding · Crownhaven / tutorial · level-gated miejsca Aktu 1 · prawdziwy loot + postęp Hero · hex polish.

**OUT (nie ten slice):** fog of war · fabuła aktu / narracja · emotki · Mentor AI · tytuły (**PARK**).

Pętla: solo nawyki → Crownhaven / tutorial → miejsca Aktu 1 za levelem → real loot + Hero.

Starsze locki (Discover once, Mentor fullscreen, emotki jako wiadro lootu) zostają w filarach jako **Cel / later** — **nie** jako near-term. Fog of war **nie** jest chrome archetypu E ([`design-bible`](reference/ui/design-bible.md)).

---

## W jednym akapicie

Budzisz się w **kolorowym królestwie RPG** (cartoon fantasy). Zaczynasz jako nikt w **stolicy Crownhaven**, odhaczasz realne nawyki jako zasługi, awansujesz od rynsztoka do wpływu. **Ten slice:** mapa królestwa jest **w całości widoczna** (bez fog of war); zablokowane piny to kłódki z poziomem. Lochy i NPC siedzą w lokacjach. Fabuła aktu, Mentor AI, emotki i tytuły = poza tym MVP.

---

## Doświadczenie gracza (dzień z życia) — szkic

1. Rano: hex polish + odhaczenie nawyków.
2. W ciągu dnia: życie realne = paliwo EXP/zasług.
3. Wieczorem (Finch): mapa / Hero / loot — co odblokował level, co spadło z lochu.
4. Co jakiś czas: nowa lokacja (gate = level), loch, lepszy dom w stolicy.

---

## Filary produktu

| Filar | Jedno zdanie | Doc |
|-------|--------------|-----|
| Arrival / Onboarding | Isekai wejście + stworzenie postaci w scenie stolicy | `15-onboarding-arrival.md` |
| Core loop | Nawyki → XP/gold (diminishing) → level + lochy (CD/klucze); ~30 dni Akt 1 | `03`, `06` |
| Kingdom Map | Pielgrzymka w pionie (fit-width, pan Y); **ten slice: bez fog, unlock = level**; Cel later: Discover once; Main ★ + side; Titan ~30 dni | `17`, `20`, `21`, `23`, `24`, `06` |
| Dungeons & Loot | Darmowe CD per tier + klucze; **Common → Elite → Champion → Titan**; flex + mikro | `06` |
| Paths / identity | Drogi later; **klasy KILL**; hex poranny; affinity NPC | `05` |
| Living memory | Ukryta karta gracza — świat pamięta; Mentor AI **OUT** tego MVP | `04` + `07` |
| Mentor | Tab zostaje; **Mentor AI OUT** tego slice (`07`) | `07-ai-sage.md` |
| Social | Hall of Heroes — calling card, koło, dolina; peek = przycięty Hero; later layer; **tytuły PARK** | `08` |
| Feel | Cartoon; Rive (postacie + close-up); AI cinematics; mapa wow; **emotki OUT** tego MVP | `09`, `10`, `06` |

---

## Główny HUD (zamrożony kierunek)

5 tabów: **Questy** · **Świat** (mapa→lokacja) · **Bohater** · **Społeczność** (Hall of Heroes, later) · **Mentor**.  
Szczegóły: [`18-information-architecture.md`](18-information-architecture.md) · lock Social: [`08-social.md`](08-social.md).

---

## Jak działa — szkic spięcia

```text
Real habits ──► XP (diminishing) / gold (cap) / affinity
                    │
                    ├── Level ≥ próg pinu ──► mapa (bez fog)
                    ├── Darmowe CD per loch + klucze ──► lochy ──► loot flex
                    └── Nocny hex ──► poranny reveal

STOLICA (hub) ──► MAPA KRÓLESTWA (cała widoczna, bez fog)
                    ├── pin unlocked = hero level
                    ├── locked tap = from level X (bez Enter)
                    └── lokacja = NPC i/lub loch (CD / klucz)
```

Gold **nie** odblokowuje fabuły. Model: [`06`](06-economy-loot.md).
---

## Gdzie jest kod (V2)

Cienki scaffold: `apps/mobile` (Expo Router, 5 tabów z `18`). **Day 0:** first-run gate (`hnd-onboarding-local`) → C2 stall-keeper (arrival + required name + 6 one-tap lifestyle questions) → starter dailies **assigned from answers** (3–5, `stat` + `hexAxes`) → Quests. Soft handoff World → Crownhaven → Tavern cellar / Gutterjack (`skipEntryGate` + `tutorialLock` on first clear). Later mornings (after `onboarding.complete`): Welcome → streak → hex expand. Tab **Questy** = V1 Castle UI na domain store `habits`. Tab **Hero** = V1 Hero UI (EN) na domain store `hero` (**prawdziwy hex** z tagów nawyków + equipment shell). Tab **World** = playground mapa królestwa: **pasek ~1:5**, fit-width, pan tylko pion, spawn na Crownhaven (dół); **bez fog of war**; piny rzędy środek-albo-para, unlock = `hero.playerLevel`; PeekCard „Enter” na odblokowanym pinie, locked = „from level X”; Crownhaven (stragan / tawerna+Gutterjack / pałac po ★1) → close-upy lokacji Akt 1 z hotspotami NPC/loch (poziomy Common→Elite/Champion; nawigacja = LevelNav; combat = Gutterjack chrome). Master w apce jeszcze = stary korytarz 941×1672 — nowy pasek dopiero po grayboxie (`24`). Pasek konta V1 (avatar / Lv / gold+keys pills / mail stub / settings) z store `hero` na Questach, Hero, Social i Mentorze — nie na World (plansza full-bleed pod status barem). Chrome produktu = lookdev / [`reference/ui/design-bible.md`](reference/ui/design-bible.md) (**LOCK v2.3**): tap pinu → PeekCard „Enter”; sklep = zakładki Buy / Sell; piętra = LevelNav. Szept po tapie, dolny pasek sprzedaży, winda z etykietami, pinch i pan X = superseded. Social = hall w apce na mock store; **koncept LOCK** Hall of Heroes (`08`). Mentor = later. V1 nie jest kotwicą architektury — [`reference/v1-to-v2-architecture-audit.md`](reference/v1-to-v2-architecture-audit.md).

## Na czym stoi (tech) — kierunki

- App shell: **Expo / RN** (habit UX) — nie silnik gry jako całość (`12`).
- Mapa: pionowy pasek + pan Y, **bez fog of war** (Image+gesty teraz; Skia later na życie paska). Pin locked = glyph + required level. Close-up lokacji → tap hotspotu = kadr NPC (stragan = shop). Kamera: [`24`](24-map-production.md). Unlock pinów = **level**.
- Animacje postaci/itemów + **close-up lokacji (życie):** **Rive**.
- Pasek królestwa: ilustracja, nie całe królestwo w Rive. Pinch mapa→close-up = PARK.
- Cinematics: **pre-render AI video** + human gate (+ fallback panele).
- Backend / Mentor: Supabase kierunek; AI tylko przez backend.
- Ekonomia: [`06`](06-economy-loot.md) — sumienność, darmowe CD lochów + klucze, gold = sink.

---

## Czego świadomie nie robimy teraz

- Druga Habitica (klasy + milion systemów day 1).
- Osobno: achievements + eksploracje + sojusznicy + lochy jako cztery niepowiązane meta-gry — **scalamy w mapę**.
- Kotwiczenie w „rozwój obozu” tylko dlatego, że był w prototypie.
- Fog of war / wyprawa discover / Mentor AI / emotki / tytuły — **nie** ten slice (lock 2026-10-06).
- Fail pierwszej wyprawy odkrycia (gdyby discover wrócił: KILL).
- Ranking / podgląd nawyków na Social — hall jest galerią flexu, nie habit-police (`08`).

---

## Notatka dla agentów

Nie kotwicz w prototypie. **Ten slice:** [`00`](00-final-picture.md) MVP lock 2026-10-06. Pytanie nadrzędne: **czy to wzmacnia mapę królestwa (bez fog, unlock = level) + lekką codzienność Finch?** Jeśli nie — park lub kill, nawet jeśli było w V1.

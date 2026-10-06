# 00 — Final Picture (obraz całej gry)

> **Status:** szkic roboczy po lockach produktu (2026-07-30) + **mapa LOCK 2026-09-25** (`24`).  
> Prototyp V1 = referencja UX zadań/kalendarza/feel — **nie** kotwica architektury. Rewrite OK, jeśli final jest lepszy.

---

## W jednym akapicie

Budzisz się w **kolorowym królestwie RPG** (cartoon fantasy). Zaczynasz jako nikt w **stolicy**, odhaczasz realne nawyki jako zasługi, awansujesz od rynsztoka do wpływu, a świat widać na **pełnej mapie korytarza**: zablokowane miejsca to spokojne kłódki z poziomem, nie mgła. Lochy, NPC i fabuła siedzą w lokacjach; Main ★ prowadzi do Titanów. Mentora pytasz o życie w lore gry, nie w ChatGPT.

---

## Doświadczenie gracza (dzień z życia) — szkic

1. Rano: krótki rytuał (mood / Mentor) + odhaczenie nawyków.
2. W ciągu dnia: życie realne = paliwo EXP/zasług.
3. Wieczorem (Finch): sprawdź wyprawę odkrycia / mapę — co wróciło, co się odblokowało.
4. Co jakiś czas: nowa lokacja, NPC, loch, tytuł, lepszy dom w stolicy.

---

## Filary produktu

| Filar | Jedno zdanie | Doc |
|-------|--------------|-----|
| Arrival / Onboarding | Isekai wejście + stworzenie postaci w scenie stolicy | `15-onboarding-arrival.md` |
| Core loop | Nawyki → XP/gold (diminishing) → level + lochy (CD/klucze); ~30 dni Akt 1 | `03`, `06` |
| Kingdom Map | Pielgrzymka w pionie (fit-width, pan Y); **bez mgły wojny**; pin = hero level ≥ próg; Main ★ + side; Titan ~30 dni | `17`, `20`, `21`, `23`, `24`, `06` |
| Dungeons & Loot | Darmowe CD per tier + klucze; **Common → Elite → Champion → Titan**; flex + mikro | `06` |
| Paths / identity | Drogi later; **klasy KILL**; hex poranny; affinity NPC | `05` |
| Living memory | Ukryta karta gracza — świat i Mentor pamiętają | `04` + `07` |
| Mentor | Fullscreen coach w lore (Day 0–1) | `07-ai-sage.md` |
| Social | Hall of Heroes — calling card, koło, dolina; peek = przycięty Hero; later layer | `08` |
| Feel | Cartoon; Rive (postacie + close-up); emotki; AI cinematics; mapa wow | `09`, `10`, `06` |

---

## Główny HUD (zamrożony kierunek)

5 tabów: **Questy** · **Świat** (mapa→lokacja) · **Bohater** · **Społeczność** (Hall of Heroes, later) · **Mentor**.  
Szczegóły: [`18-information-architecture.md`](18-information-architecture.md) · lock Social: [`08-social.md`](08-social.md).

---

## Jak działa — szkic spięcia

```text
Real habits ──► XP (diminishing) / gold (cap) / affinity
                    │
                    ├── Level ≥ próg pinu ──► mapa (bez mgły)
                    ├── Darmowe CD per loch + klucze ──► lochy ──► loot flex
                    └── Nocny hex ──► poranny reveal

STOLICA (hub) ──► MAPA KRÓLESTWA (pełny korytarz)
                    ├── pin unlocked = hero level
                    ├── locked tap = from level X (bez Enter)
                    └── lokacja = NPC i/lub loch (CD / klucz)
```

Gold **nie** odblokowuje fabuły. Model: [`06`](06-economy-loot.md).
---

## Gdzie jest kod (V2)

Cienki scaffold: `apps/mobile` (Expo Router, 5 tabów z `18`). Tab **Questy** = V1 Castle UI na domain store `habits`. Tab **Hero** = V1 Hero UI (EN) na domain store `hero` (hex demo + equipment shell). Tab **World** = playground mapa królestwa: **pasek ~1:5**, fit-width, pan tylko pion, spawn na Crownhaven (dół); **bez mgły wojny**; piny rzędy środek-albo-para, unlock = `hero.playerLevel`; PeekCard „Enter” na odblokowanym pinie, locked = „from level X”; Crownhaven (stragan / tawerna+Gutterjack / pałac po ★1) → close-upy lokacji Akt 1 z hotspotami NPC/loch (poziomy Common→Elite/Champion; nawigacja = LevelNav; combat = Gutterjack chrome). Master w apce jeszcze = stary korytarz 941×1672 — nowy pasek dopiero po grayboxie (`24`). Pasek konta V1 (avatar / Lv / gold+keys pills / mail stub / settings) z store `hero` na Questach, Hero, Social i Mentorze — nie na World (plansza full-bleed pod status barem). Chrome produktu = lookdev / [`reference/ui/design-bible.md`](reference/ui/design-bible.md) (**LOCK v2.3**): tap pinu → PeekCard „Enter”; sklep = zakładki Buy / Sell; piętra = LevelNav. Szept po tapie, dolny pasek sprzedaży, winda z etykietami, pinch i pan X = superseded. Social = hall w apce na mock store; **koncept LOCK** Hall of Heroes (`08`). Mentor = later. V1 nie jest kotwicą architektury — [`reference/v1-to-v2-architecture-audit.md`](reference/v1-to-v2-architecture-audit.md).

## Na czym stoi (tech) — kierunki

- App shell: **Expo / RN** (habit UX) — nie silnik gry jako całość (`12`).
- Mapa: pionowy pasek + pan Y (Image+gesty teraz; Skia later na życie). Pin locked = glyph + required level. Close-up lokacji → tap hotspotu = kadr NPC (stragan = shop). Kamera: [`24`](24-map-production.md).
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
- Fail pierwszej wyprawy odkrycia.
- Ranking / podgląd nawyków na Social — hall jest galerią flexu, nie habit-police (`08`).

---

## Notatka dla agentów

Nie kotwicz w prototypie. Pytanie nadrzędne: **czy to wzmacnia mapę królestwa + lekką codzienność Finch + immersję pamięci świata?** Jeśli nie — park lub kill, nawet jeśli było w V1.

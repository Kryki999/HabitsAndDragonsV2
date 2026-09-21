# 00 — Final Picture (obraz całej gry)

> **Status:** szkic roboczy po lockach produktu (2026-07-30).  
> Prototyp V1 = referencja UX zadań/kalendarza/feel — **nie** kotwica architektury. Rewrite OK, jeśli final jest lepszy.

---

## W jednym akapicie

Budzisz się w **kolorowym królestwie RPG** (cartoon fantasy). Zaczynasz jako nikt w **stolicy**, odhaczasz realne nawyki jako zasługi, awansujesz od rynsztoka do wpływu, a świat odkrywasz na **mapie w mgle**: pierwsza wyprawa odblokowuje lokację na stałe, potem wracasz bez czekania. Lochy, NPC i fabuła siedzą w lokacjach; Main ★ prowadzi do Titanów. Mentora pytasz o życie w lore gry, nie w ChatGPT.

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
| Kingdom Map | Discover once; Main ★ + side; bramki: level + aktywne dni + ★; Titan ~30 dni | `17`, `20`, `21`, `23`, `06` |
| Dungeons & Loot | Darmowe CD per tier + klucze; **Common → Elite → Champion → Titan**; flex + mikro | `06` |
| Paths / identity | Drogi later; **klasy KILL**; hex poranny; affinity NPC | `05` |
| Living memory | Ukryta karta gracza — świat i Mentor pamiętają | `04` + `07` |
| Mentor | Fullscreen coach w lore (Day 0–1) | `07-ai-sage.md` |
| Feel | Cartoon; Rive (postacie + close-up); emotki; AI cinematics; mapa wow | `09`, `10`, `06` |

---

## Główny HUD (zamrożony kierunek)

5 tabów: **Questy** · **Świat** (mapa→lokacja) · **Bohater** · **Społeczność** · **Mentor**.  
Szczegóły: [`18-information-architecture.md`](18-information-architecture.md).

---

## Jak działa — szkic spięcia

```text
Real habits ──► XP (diminishing) / gold (cap) / affinity
                    │
                    ├── Level + aktywne dni + poprzedni ★ ──► piny mapy + dom
                    ├── Darmowe CD per loch + klucze ──► lochy ──► loot flex
                    └── Nocny hex ──► poranny reveal

STOLICA (hub) ──► MAPA KRÓLESTWA
                    ├── pierwsza wyprawa = odkrycie
                    ├── potem szybki dostęp
                    └── lokacja = NPC i/lub loch (CD / klucz)
```

Gold **nie** odblokowuje fabuły. Model: [`06`](06-economy-loot.md).
---

## Gdzie jest kod (V2)

Cienki scaffold: `apps/mobile` (Expo Router, 5 tabów z `18`). Tab **Questy** = V1 Castle UI na domain store `habits`. Tab **Hero** = V1 Hero UI (EN) na domain store `hero` (hex demo + equipment shell). Tab **World** = playground mapa królestwa (piny + fog) → Crownhaven / tawerna (Ground + winda) → Cellar / Gutterjack, oraz close-upy lokacji Akt 1 ze stilli w `assets` (boss approach = ten sam combat flow). Globalny pasek konta (avatar / Lv / gold / keys) z store `hero`, nad tabami jak V1. Social / Mentor = later. V1 nie jest kotwicą architektury — [`reference/v1-to-v2-architecture-audit.md`](reference/v1-to-v2-architecture-audit.md).

## Na czym stoi (tech) — kierunki

- App shell: **Expo / RN** (habit UX) — nie silnik gry jako całość (`12`).
- Mapa: ilustracja + mgła + pan/zoom (Skia / gesty) → close-up lokacji → tap hotspotu = kadr NPC (stragan = shop).
- Animacje postaci/itemów + **close-up lokacji (życie):** **Rive**.
- Mapa zoom-out: ilustracja + Skia (nie całe królestwo w Rive).
- Cinematics: **pre-render AI video** + human gate (+ fallback panele).
- Backend / Mentor: Supabase kierunek; AI tylko przez backend.
- Ekonomia: [`06`](06-economy-loot.md) — sumienność, darmowe CD lochów + klucze, gold = sink.

---

## Czego świadomie nie robimy teraz

- Druga Habitica (klasy + milion systemów day 1).
- Osobno: achievements + eksploracje + sojusznicy + lochy jako cztery niepowiązane meta-gry — **scalamy w mapę**.
- Kotwiczenie w „rozwój obozu” tylko dlatego, że był w prototypie.
- Fail pierwszej wyprawy odkrycia.

---

## Notatka dla agentów

Nie kotwicz w prototypie. Pytanie nadrzędne: **czy to wzmacnia mapę królestwa + lekką codzienność Finch + immersję pamięci świata?** Jeśli nie — park lub kill, nawet jeśli było w V1.

# 19 — Screen Inventory

> Lista ekranów = wynik journey + IA, nie punkt startu.  
> Status: **szkielet Slice** — uzupełniamy w kolejnej sesji po dopięciu Day 0–7.

## Legenda

- **Slice Y** = musi istnieć w vertical slice  
- **Park** = później  
- Typ: `flow` / `tab` / `modal` / `fullscreen`

## A. Vertical Slice (minimum produktu)

| ID | Ekran | Przestrzeń | Typ | Cel gracza | Slice |
|----|-------|------------|-----|------------|-------|
| S01 | Cinematic isekai | P0 | flow | Wejść emocjonalnie | Y |
| S02 | Dialog kapusta + form postaci | P0 | flow | Kim jestem. Pytania = archetyp C2: NPC pyta w dymku, 1 pytanie / ekran ([lista](reference/ui/golden/onboarding-choice.png), [siatka](reference/ui/golden/onboarding-pick.png)) | Y |
| S03 | Stolica — hub (dom tier 0) | P2 | tab | Widzę gdzie żyję | Y |
| S04 | Lista questów / nawyków | P1 | tab/panel | Odhaczam dzień | Y |
| S05 | Feedback nagrody (XP/gold) | global | modal | Satysfakcja. Duże momenty = C1 celebracja ([streak](reference/ui/golden/flow-streak.png), [level-up](reference/ui/golden/flow-levelup.png)) | Y |
| S06 | Mapa królestwa (fog + piny) | P3 | tab | Obietnica świata. **Pasek** fit-width, pan Y (`24` LOCK 2026-09-25). Tap otwartego pinu → PeekCard + „Enter” (LOCK 2026-09-24). Piny bez nazw | Y |
| S07 | Widok lokacji (NPC i/lub loch) | P3 | drill | RPG atom. Playground: hub still + tawerna Ground / strzałki LevelNav / Cellar; mapa → still lokacji Akt 1 | Y |
| S08 | Loch — run / wynik | P3 | flow | Boss/loot | Y |
| S09 | Start wyprawy + timer | P3 | modal | Wyjazd | Y |
| S10 | Powrót wyprawy (wieczór) | P3 | modal | Finch check | Y |
| S11 | Mentor fullscreen + mood | P4 | fullscreen | Coach / pamięć | Y |
| S12 | Bohater — profil + 2 sloty | P5 | tab | Flex / tożsamość ([`golden/hero.png`](reference/ui/golden/hero.png)) | Y |
| S13 | Stragan — sklep | P2 drill | drill | Tap straganu → ekran A: winieta babki + dymek, Buy / Sell loot, katalog 3×2 ([`golden/shop.png`](reference/ui/golden/shop.png)). Puste gniazda na stillu = superseded | Y |
| S14 | Kuźnia — Torrik | P3 drill | drill | Ally / affinity 1/2/3 — AllyCard ([`reference/ui/golden/world-npc-torrik.png`](reference/ui/golden/world-npc-torrik.png)) | Y |
| S15 | Loch Stillgaze (Anvil Glade) | P3 flow | flow | Common 1-poziom; still: [`prompt-stillgaze-dungeon.md`](reference/art/prompt-stillgaze-dungeon.md) | Y |
| S16 | Loch Gutterjack (piwnica menelni) | P3 flow | flow | Common tutorial; dojście: hub → tawerna Ground → strzałka ▼ Cellar; still: [`prompt-gutterjack-dungeon.md`](reference/art/prompt-gutterjack-dungeon.md) | Y |
| S17 | Closed Way — close-up szlaku | P3 drill | drill | ★1 lokacja; [`prompt-closed-way-closeup.md`](reference/art/prompt-closed-way-closeup.md) | Y |
| S18 | Champion Skarne (Closed Way) | P3 flow | flow | Main ★; still: [`prompt-closed-way-dungeons.md`](reference/art/prompt-closed-way-dungeons.md) | Y |

Social (Hall of Heroes) jest **LOCK koncepcji** [`08`](08-social.md) (2026-09-25). **Expo 2026-09-25:** hall + peek A + dwa sheety kodu na mock store (`apps/mobile/social`) — later layer vs Akt 1, ale tab nie jest już stubem „wkrótce”.

| ID | Ekran | Przestrzeń | Typ | Cel gracza | Slice |
|----|-------|------------|-----|------------|-------|
| S19 | Społeczność — Hall of Heroes | P5 | tab | Galeria: calling card + koło + dolina. Archetyp B | later |
| S20 | Peek — winieta domu + drip + hex | P5 | stack | A: dom jak Questy, scroll, EQ potem StatHex. Zero nawyków | later |
| S21 | Enter a code | P5 | sheet | Ich kod jako zwykły tekst → invite + akceptacja | later |
| S22 | Your code | P5 | sheet | Twój kod widoczny + kopiuj na końcu pola | later |

## B. Park (świadomie nie w slice)

| ID | Ekran | Dlaczego park |
|----|-------|---------------|
| … | Ranking global / friends | KILL na M1 (`08`) — drabinka wstydu |
| … | Friends mapa (zamki) | Druga mapa obok królestwa |
| … | DM / presence / gildie | Later, nie first ship Social |
| … | Tawerna z avatarami graczy | Tawerna = Mentor + Gutterjack |
| … | 8 Dróg katalog | Slice: max 1 mistrz |
| … | Crafting / wheel / marketplace | Later |
| … | Multi-tier loch 2–3 | Slice: 1 tier |
| … | Teleport inventory deep | Slice: 1 zwój lub skip |
| … | Achievements gablota | Unlock = mapa |

## C. Do dopisania razem

Gdy domkniemy journey: kalendarz nawyków (z prototypu — reuse?), settings, auth gates, loot detail, path level-up, capital upgrade celebration…

---

## Następny krok sesji

1. Doprecyzować Day 0 w `17` (auth, mentor, klasy).  
2. Potwierdzić hipotezę tabów w `18`.  
3. Rozwinąć wiersze Slice w `19` o wejścia/wyjścia (skąd→dokąd).

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
| S02 | Dialog kapusta + form postaci | P0 | flow | Kim jestem | Y |
| S03 | Stolica — hub (dom tier 0) | P2 | tab | Widzę gdzie żyję | Y |
| S04 | Lista questów / nawyków | P1 | tab/panel | Odhaczam dzień | Y |
| S05 | Feedback nagrody (XP/gold) | global | modal | Satysfakcja | Y |
| S06 | Mapa królestwa (fog + 1 lokacja) | P3 | tab | Obietnica świata | Y |
| S07 | Widok lokacji (NPC i/lub loch) | P3 | drill | RPG atom | Y |
| S08 | Loch — run / wynik | P3 | flow | Boss/loot | Y |
| S09 | Start wyprawy + timer | P3 | modal | Wyjazd | Y |
| S10 | Powrót wyprawy (wieczór) | P3 | modal | Finch check | Y |
| S11 | Mentor fullscreen + mood | P4 | fullscreen | Coach / pamięć | Y |
| S12 | Bohater — profil + 2 sloty | P5 | tab | Flex / tożsamość | Y |
| S13 | Stragan — babka + sklep | P2 drill | drill | Kup / sprzedaj / guide #1 | Y |
| S14 | Kuźnia — Torrik | P3 drill | drill | Ally / affinity | Y |
| S15 | Loch Stillgaze (Anvil Glade) | P3 flow | flow | Common 1-poziom; still: [`prompt-stillgaze-dungeon.md`](reference/art/prompt-stillgaze-dungeon.md) | Y |
| S16 | Loch Gutterjack (piwnica menelni) | P3 flow | flow | Common tutorial; still: [`prompt-gutterjack-dungeon.md`](reference/art/prompt-gutterjack-dungeon.md) | Y |
| S17 | Closed Way — close-up szlaku | P3 drill | drill | ★1 lokacja; [`prompt-closed-way-closeup.md`](reference/art/prompt-closed-way-closeup.md) | Y |
| S18 | Champion Skarne (Closed Way) | P3 flow | flow | Main ★; still: [`prompt-closed-way-dungeons.md`](reference/art/prompt-closed-way-dungeons.md) | Y |

## B. Park (świadomie nie w slice)

| ID | Ekran | Dlaczego park |
|----|-------|---------------|
| … | Ranking / friends mapa | Social later |
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

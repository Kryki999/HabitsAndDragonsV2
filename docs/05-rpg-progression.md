# 05 — RPG Progression

> Sync ekonomii: [`06-economy-loot.md`](06-economy-loot.md) (2026-08-01).

## Z prototypu

- 4 klasy (warrior/hunter/mage/paladin) mapowane na cele życiowe; nie hard-lockują ścieżek.
- 3 osie gameplay XP (STR/AGI/INT) + poziom z sumy.
- Hex 6 osi (Oracle) — osobna warstwa „charakteru”.
- Tytuły gameplay + osobne titles narracyjne (niespójne).
- Trudność easy/medium/hard → XP/gold.

## Cel (final)

- **Klasy: KILL** na launch / MVP.
- Tożsamość przez: stolica (dom), **loadout (outfit + atrybut)**, hex, affinity NPC. **Tytuły PARK. Emotki OUT** tego MVP (`00`).
- Skill tree: **PARK**.
- **Loadout:** tylko **2 sloty EQ** (outfit + atrybut) — świadomie bez hełm/zbroja/buty (nie Habitica).
- **Emotki:** Cel later — kolekcjonerskie animacje postaci; 1 equipped; drop loch / NPC / ★; kosmetyka only (`06`). **Ten slice: OUT.**
- **Level / wpływ** z XP nawyków (diminishing + soft-cap dnia) — główna oś odblokowań.
- **Aktywne dni** — druga oś pace Aktu 1 (sumienność).
- **Dom:** stodoła → **chata po ★1** (doradca) → **murowany po ★3 Osiris** (doradca) · gold = skin.
- **Early unlock ladder (`17`):** punkty side L3/4/6/7/9/10/**12** · L5 ★1 · L8 ★2 · L11 ★3 · L13 Titan · clear ★1→chata · clear ★3→Dom Lv3 · **11 lokacji** (6 side+4 Main+hub).
- **Hex 6 osi:** nocny batch → poranny reveal (Welcome → streak → wczorajsze delty + animacja hex). Akt 1 **bez** win% w lochach (świadomie — no-force drogi życia). Walka = level + afiksy itemów + first clear + pot (`06`). Osie: Strength, Agility, Intelligence, Vitality, Spirit, Discipline. Tag `hexAxes` na nawyku (0–2); untagged custom nie wymyśla statów.
- **NPC affinity:** 3 levele per sojusznik — równolegle do levela postaci ([`06`](06-economy-loot.md), [`23`](23-act1-location-brainstorm.md)).

### Co odblokowuje co (skrót)

| Progres | Odblokowuje |
|---------|-------------|
| Level / wpływ | **Ten slice:** piny mapy (unlock = level) + progi domu. Cel later: punkty odkrycia, Main ★ z dniami — **nie** „L9 = Mag” |
| Aktywne dni | Progi mapy / Main (z levelem + ★) |
| Soft breadth (≥2 R1) | Pool R2 otwarty do wyboru (Mag / cmentarz / …) |
| Main ★ ukończony | Następny beat fabularny (chronologia) |
| Złoto | Klucze, flex, skin domu — **nie** piny fabuły |
| Darmowe CD / klucze | Wejścia do lochów → loot |

## Otwarte

- Kiedy pierwsza Droga wchodzi w MVP miesiąc 1? (raczej later)
- Hex: widoczny od razu na Bohaterze (hex polish IN; SoT = `hero.hexStats`, nie mock). Mentor AI **OUT**.
- Twarde progi level ↔ dzień kalendarza Aktu 1 — tabela w [`06`](06-economy-loot.md).

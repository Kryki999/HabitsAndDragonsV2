# Habits & Dragons — mobile (V2)

Expo Router shell. Biblia produktu: [`../../docs/README.md`](../../docs/README.md).

## Run

```bash
npm install
npx expo start
```

Typecheck: `npm run typecheck`

## Co tu jest (i czego nie ma)

- 5 tabów: Questy · **World** · **Hero** · Społeczność · Mentor
- Tab **Questy** = V1 Castle UI 1:1 (HomeScenePanel, HabitCard + overlay, calendar, chronicles, sort, add quest)
- Tab **Hero** = V1 Hero UI 1:1 (sheet + hex radar, equipment/backpack shell, timeline, heatmap) on a thin `hero/` store
- Tab **World** = playground: kingdom map first → Crownhaven hub → tavern Ground (labeled floor lift) → Cellar / Gutterjack fight (approach → clash → outcome → loot roll), on a thin `world/` store + `combat/` module
- Zustand **habits/** + **hero/** + **world/** (hub|map|interior+floor, discovered flags, gutterjackCleared). Fight loot lands in `hero` inventory.

**Nie:** god-store, Groq / Oracle, smoki, klasy, tab D&D, `profiles.game_state`.
Gold/XP na kartach Questy są **wizualne** (stub). Hero gold / XP ring / hex are a demo slice — not the full RPG economy. Loot trajectory and the real level curve are not ported.

World stills: map/hub JPEGs in `assets/images/world/`; tavern Ground uses `tavernsage.png` (landscape stand-in); Gutterjack fight still is `mietek.png`. Pin / hotspot / floor tables: `world/layout.ts` + `world/interiors.ts`.

V1 is the UX source to copy, not the architecture anchor.

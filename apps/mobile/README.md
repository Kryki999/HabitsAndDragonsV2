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
- Tab **World** = playground: kingdom map (fog + Act 1 pins) → Crownhaven hub → tavern Ground (labeled floor lift) → Cellar / Gutterjack, or pin → location still → boss approach / NPC still. Store `world` + `combat/`.
- Zustand **habits/** + **hero/** + **world/** (hub|map|interior+floor|location|encounter, discovered flags, cleared bosses). Fight loot lands in `hero` inventory. World top HUD reads gold / keys / level from `hero` (keys start at 0).

**Nie:** god-store, Groq / Oracle, smoki, klasy, tab D&D, `profiles.game_state`.
Gold/XP na kartach Questy są **wizualne** (stub). Hero gold / XP ring / hex are a demo slice — not the full RPG economy. Loot trajectory and the real level curve are not ported.

World stills: map/hub JPEGs in `assets/images/world/`; tavern Ground uses `tavernsage.png` (landscape stand-in); Gutterjack fight still is `mietek.png`. Map location stills are the V1 9:16 dump (`piraci.png`, `las.png`, …) wired in `world/locations.ts`. Pin / hotspot / fog / floor tables: `world/layout.ts` + `world/interiors.ts`.

V1 is the UX source to copy, not the architecture anchor.

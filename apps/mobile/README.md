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
- Tab **World** = playground: Crownhaven hub still → kingdom map (pan/zoom + pins) → Gutterjack cellar stub, on a thin `world/` store
- Zustand **habits/** + **hero/** + **world/** (hub|map|location, discovered flags, gutterjackCleared)

**Nie:** god-store, Groq / Oracle, smoki, klasy, tab D&D, `profiles.game_state`.
Gold/XP na kartach Questy są **wizualne** (stub). Hero gold / XP ring / hex are a demo slice — not the full RPG economy. Loot trajectory and the real level curve are not ported.

V1 raster assets were gitignored (`assets/` in V1). Hero slots use Lucide glyphs. World stills live in `apps/mobile/assets/images/world/` (`map-kingdom.png`, `hub-crownhaven.png`, `dungeon-gutterjack.png`). Pin coordinates: `world/layout.ts`.

V1 is the UX source to copy, not the architecture anchor.

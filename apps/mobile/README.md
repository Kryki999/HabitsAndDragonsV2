# Habits & Dragons — mobile (V2)

Expo Router shell. Biblia produktu: [`../../docs/README.md`](../../docs/README.md).

## Run

```bash
npm install
npx expo start
```

Typecheck: `npm run typecheck`

## Co tu jest (i czego nie ma)

- 5 tabów: Questy · Świat · Bohater · Społeczność · Mentor
- Tab **Questy** = V1 Castle UI 1:1 (HomeScenePanel, HabitCard + overlay, calendar, chronicles, sort, add quest)
- Zustand **tylko** `habits/` — CRUD, complete, order, schedule, activity dates (AsyncStorage)
- World / Social / Mentor = stub. Hero = tytuł.

**Nie:** god-store, Groq / Oracle, smoki, klasy, tab D&D, `profiles.game_state`, mapa.
Gold/XP na kartach są **wizualne** (stub); loot trajectory i krzywa poziomu nie są portowane.

V1 jest źródłem UX Zamku do skopiowania, nie kotwicą architektury.

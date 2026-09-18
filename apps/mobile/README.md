# Habits & Dragons — mobile (V2 scaffold)

Cienki plasterek Expo Router. Biblia produktu: [`../../docs/README.md`](../../docs/README.md).

## Run

```bash
npm install
npx expo start
```

Typecheck: `npm run typecheck`

## Co tu jest (i czego nie ma)

- 5 tabów: Questy · Świat · Bohater · Społeczność · Mentor
- Zustand **tylko** `habits/` — CRUD, complete, historia dni (AsyncStorage)
- Questy: karta + overlay, dodawanie, kalendarz, heatmapa GitHub-like, kroniki (log dnia)
- World / Social / Mentor = stub. Hero = tytuł.

**Nie:** god-store, Groq, smoki, klasy, tab D&D, `profiles.game_state`, mapa, XP/gold.

UX Zamku V1 (co KEEP/KILL): [`../../docs/reference/v1-quests-ux-audit.md`](../../docs/reference/v1-quests-ux-audit.md).

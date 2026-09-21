# Habits & Dragons V2

Monorepo: **Concept Bible** + cienka apka Expo. Nie fork V1.

| Ścieżka | Co to jest |
|---------|------------|
| [`docs/`](docs/README.md) | Biblia produktu (wizja, świat, pętle, art). Start: [`docs/25-welcome.md`](docs/25-welcome.md) |
| [`apps/mobile/`](apps/mobile) | Aplikacja V2 (Expo / RN / Expo Router) |
| [`AGENTS.md`](AGENTS.md) | Zasady dla agentów: najpierw koncepcja, kod tylko na wyraźne polecenie |

V1 (UX reference only): [HabitsAndDragons](https://github.com/Kryki999/HabitsAndDragons). Nie kopiujemy `gameStore`, Groq w kliencie, ani `profiles.game_state`.

## Jak odpalić apkę

```bash
cd apps/mobile
npm install
npx expo start
```

Typecheck: `npm run typecheck` w `apps/mobile`.

Pięć tabów: **Questy · World · Hero · Społeczność · Mentor**. Questy = V1 Castle UI na store `habits`. Hero = V1 Hero UI na cienkim store `hero` (EN). World = playground mapa (piny + fog) → Crownhaven / tawerna (winda) → Gutterjack, plus close-upy lokacji Akt 1 (store `world` + `combat/`). Społeczność / Mentor = placeholdery.

Pełna mapa filarów: [`docs/README.md`](docs/README.md).

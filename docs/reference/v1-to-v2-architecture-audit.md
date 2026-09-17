# V1 → V2 architecture audit

> Krótki werdykt dla agentów i ludzi, którzy znają prototyp.  
> Źródło V1: [HabitsAndDragons](https://github.com/Kryki999/HabitsAndDragons).  
> V2 nie jest forkiem. Rewrite OK, jeśli final z Biblii jest lepszy.

## KEEP (UX / feel)

| Z V1 | Po co |
|------|--------|
| **HabitCard feel** | Checkbox osobną strefą, spring scale, strike-through, „gruba” karta z dolnym paskiem |
| **Haptics** | Heavy na complete, light na tap karty — satysfakcja Finch, nie ozdoba |
| **Castle list patterns** | Czysta lista nawyków IRL jako pierwszy ekran dnia (V2: tab **Questy**) |
| **Loot trajectory (later)** | Lot złota/XP z checkboxa — park na później, nie w pierwszym PR |
| Expo / RN / Expo Router jako **shell** | Lekka habit-apka, nie silnik gry |
| Supabase jako **kierunek** backendu | Auth, social, save — ale nie dump V1 sync |

## REWRITE

| V1 | V2 |
|----|-----|
| Jeden `store/gameStore.ts` | **Domain stores**: `habits` / `world` / `hero` / `social` / `mentor` — osobno |
| Liczby ekonomii w kliencie | Liczby z Biblii (`06-economy-loot.md`); serwer jako prawda later |
| `profiles.game_state` jsonb blob | Świadomy model; **nie** przenosimy blob-sync z V1 |
| Tab D&D + karty lochów | Tab **Świat** = mapa → close-up lokacji |
| Groq / LLM w kliencie | AI **tylko przez backend** (`07`, `12`) |
| Hub = upgrade obozu / zamku | Hub = **stolica** + awans domu |

## KILL (nie w V2, zwłaszcza nie w pierwszym PR)

- God-store (`gameStore.ts` i cokolwiek, co wie o smokach + klasach + lochach + nawykach naraz)
- Client Groq / LLM keys w apce
- Tab D&D / dragon lair / karty lochów w nawigacji
- **Klasy** na MVP (warrior / hunter / mage / paladin)
- **Smoki w nawigacji** i unlock ze streaku jako filar HUD

## PARK

- Smoki jako fantasy later (gryzie się z mapą; wracamy osobno — `18`)
- Loot trajectory, battle modal, Lottie home scene
- Hex radar, heatmapa, Daily Flow, Sage onboarding wizard
- Friends / ranking (tab **Społeczność** istnieje jako stub)
- Mapa królestwa (tab **Świat** = playground, nie budujemy mapy w pierwszym PR)
- Full Hero port (ekwipunek, hex, milestone) — tab **Bohater** = tytuł
- Supabase Auth + cloud sync — opcjonalne; pierwszy PR = **lokalne nawyki**

## Pierwszy PR (scope lock)

Dokładnie:

1. Higiena folderów: Biblia tylko w `docs/`, krótki root README, `AGENTS.md` wskazuje docs + `apps/mobile`.
2. Cienki Expo Router: 5 tabów (Questy · Świat · Bohater · Społeczność · Mentor).
3. Zustand **tylko** `habits` (CRUD + complete locally) + HabitCard-like feel + haptic.
4. World / Social / Mentor = stub. Hero = minimalny shell.
5. Zero Groq, zero smoków, zero klas, zero D&D taba, zero `game_state` jsonb.

Nie: mapa, ekonomia, Mentor LLM, ekwipunek, Auth-sync.

# V1 → V2 — audyt architektury (read-only)

> **Rola:** checklista dla kogoś, kto projektuje architekturę V2.  
> **Nie** jest to redesign produktu, specyfikacja UX, ani plan kodu.  
> **Źródła:** V1 HEAD [`Kryki999/HabitsAndDragons@d45d5df`](https://github.com/Kryki999/HabitsAndDragons/tree/d45d5df01edbe31f1b4a10501a330e29f2382dab) (GitHub API, 2026-09-17) + Concept Bible w tym repo.  
> **Zasada:** V1 = lekcje UX / feel. Bible = kierunek produktu. Architektury V1 **nie kopiujemy**.

Uwaga vs [`prototype-v1.md`](prototype-v1.md): as-is Bible wspomina `secretIdentity`, `generateLivingWorldContext` i nocny batch Oracle → hex. **W aktualnym HEAD V1 tych bytów nie ma.** Źródłem prawdy as-is jest kod, nie ten fragment referencji.

---

### TLDR

- Expo / RN / Expo Router zostaje jako shell; rewrite to **model stanu + serwer**, nie framework.
- God-store Zustand + AsyncStorage + `profiles.game_state` jsonb = jeden blob last-write-wins. Na V2 to nie przeżyje mapy, CD lochów i anti-cheatu.
- UX warty przeniesienia: odhacz (checkbox + overlay), undo z ledgerem, kalendarz planowania, heatmapa, loot-do-HUD, haptics, HUD XP/gold, 2-slot loadout, widoczny % walki, rytuał porannego otwarcia.
- Prawda gry (XP/gold/klucze/lochy/dzień) w V1 żyje w kliencie (`Math.random`, `completeHabit` w store). Bible wymaga serwera jako SoT — [`docs/25-welcome.md`](../25-welcome.md) §6.2.
- Klasy, smoki, obóz-zamek, karty D&D, morning gold, klucz Groq w bundlu — KILL/PARK zgodnie z Bible, nie „ulepszać”.
- TanStack Query jest w root layout i **nigdzie nie jest używany**; sync to ręczny debounce upsert.
- Dzień gry = `toISOString().slice(0,10)` (UTC), tick tylko przy mouncie. Reset strefy / północ lokalna = dług.
- Dual economy: nawyki + Epic Sage + rytuały Hero + debug `setState` — V2 musi mieć **jeden** pipeline nagród.
- Start V2: kontrakt dnia + event log ekonomii + offline odhacz z reconcile; UI Questy dopiero na tym kontrakcie.
- Nie portować `store/gameStore.ts`. Portować wzorce interakcji z `HabitCard` / `TaskCardOverlay` / kalendarza / trajectory.

---

### Mapa V1 (stack, warstwy, kluczowe ścieżki)

**Stack** ([`package.json`](https://github.com/Kryki999/HabitsAndDragons/blob/d45d5df01edbe31f1b4a10501a330e29f2382dab/package.json), [`app.json`](https://github.com/Kryki999/HabitsAndDragons/blob/d45d5df01edbe31f1b4a10501a330e29f2382dab/app.json)): Expo 54, RN 0.81, Expo Router 6, Zustand 5 persist → AsyncStorage, Supabase JS, TanStack Query (martwy wrapper), Reanimated 4, Lottie, Groq z `EXPO_PUBLIC_GROQ_API_KEY` ([`.env.example`](https://github.com/Kryki999/HabitsAndDragons/blob/d45d5df01edbe31f1b4a10501a330e29f2382dab/.env.example)). Start: `npx rork start` + scheme `rork-app`.

**Warstwy (jak jest, nie jak powinno być):**

```text
app/_layout.tsx
  QueryClientProvider          ← pusty; zero useQuery
  AuthProvider                 ← sesja + bootstrap profilu
  LootTrajectoryProvider       ← feel gold → HUD
  AuthGate / DailyLoginSync / CloudSync
  Stack: (auth) | onboarding | (tabs)

(tabs)/_layout.tsx             ← HUD + 5 tabów
  index          Castle / Questy
  dragon-lair    D&D (lochy, smoki, sklep kluczy)
  hero           profil, hex mock, heatmapa, rytuały
  kingdom        friends + ranking (mock + real)
  sage           czat Groq + epic quest

store/gameStore.ts             ← JEDYNY store: state + rules + persist
lib/economy.ts + gameEngine.ts ← liczby i RNG walki (klient)
lib/cloudState.ts              ← subset blob → profiles.game_state
supabase/schema.sql            ← profiles jsonb + friendships + daily_reflections
```

**Kluczowe ścieżki runtime**

| Ścieżka | Co się dzieje |
|---------|----------------|
| Cold start | persist AsyncStorage (`habits-dragons-game`) → `AuthProvider` `getSession` → `bootstrapProfile` → `hydrateFromCloud` last-write-wins |
| Odhacz | `HabitCard` checkbox → `completeHabit` (fatigue, cap gold, drop klucza `Math.random`) → ledger + heatmapa → `CloudSync` debounce 450 ms upsert |
| Nowy dzień | `DailyLoginSync` **raz** w `useEffect([])`: `processDailyLogin` + `resetDailyHabits`; eventualmente Daily Flow overlay |
| Walka | `resolveDungeonBattle`: zjedz klucz → sleep 3 s → `rollDungeonBattleResult` (`Math.random`) → item lub gold |
| Mentor | `fetchSageReply` → `postGroqChatCompletion` z kluczem w kliencie |
| Social | `kingdom.tsx` czyta `friendships` + `profiles`; ranking miesza znajomych z `REALM_MOCK_HEROES` |
| Onboarding | `SageOnboardingWizard` (klasa, imię, fokus, deep profile) → `completeRealmOnboarding` + `OnboardingService.generateStarterHabits` |

**Backend V1 (całość):** trzy tabele. `profiles.game_state` jsonb jest dumpem prawie całego `GameState`. Brak event logu, brak ticku serwera, brak Edge Functions, brak RLS na gold/XP. Policy `profiles_select_public_for_social` = `using (true)` — każdy zalogowany czyta cudze profile (w tym jsonb).

---

### KEEP — konkretne rzeczy UX / mechaniki / wzorce z V1 warte przeniesienia

Każdy punkt: **wzorzec**, nie implementacja store.

1. **Odhacz jako dwa gesty (szybki vs głęboki)** — V1 `components/HabitCard.tsx` + `components/TaskCardOverlay.tsx`. Checkbox = Heavy haptic + complete/uncomplete; tap karty = shared-element overlay (jedna oś `expandProgress`, hole-in-list). Bible: Questy = czysta lista IRL ([`docs/18-information-architecture.md`](../18-information-architecture.md), [`docs/19-screen-inventory.md`](../19-screen-inventory.md) S04/S05). Przenieść **gest i feel**, nie layout Zamku.

2. **Undo z ledgerem dnia** — V1 `habitCompletionLog` + `uncompleteHabit` w `store/gameStore.ts`. Cofa XP/gold/klucz/heatmapę. V2: ten sam kontrakt psychologiczny ([`docs/02-psychology.md`](../02-psychology.md) — zero kary), ale jako **kompensujący event** na serwerze, nie mutacja blobu.

3. **Lista: daily vs one-off + due-date** — V1 `Habit.taskType` / `scheduledDate` (`types/game.ts`), filtrowanie w `app/(tabs)/index.tsx`, sort `lib/castleQuestOrder.ts` + drag `react-native-draggable-flatlist`. Bible 15/03: starter habits + zwykła lista, nie „RPG quest log”. KEEP model listy; nazwa „Zamek” i tło obozu — nie.

4. **Kalendarz planowania (nie mapa)** — V1 `components/ExpeditionCalendarModal.tsx` (~1.9k linii): miesiąc, fokus dnia, past read-only, drag kolejności dnia, refleksja, dodawanie na datę. W V2 **wyprawa** = timer discover na mapie ([`docs/03-core-loop.md`](../03-core-loop.md), [`docs/00-final-picture.md`](../00-final-picture.md)). KEEP: calendar-as-planner dla nawyków (otwarte w [`docs/19-screen-inventory.md`](../19-screen-inventory.md) „kalendarz nawyków — reuse?”). KILL: mylenie tej nazwy z wyprawą królestwa.

5. **Loot trajectory → HUD gold** — V1 `providers/LootTrajectoryProvider.tsx` + rejestr celu w `app/(tabs)/_layout.tsx`. Reanimated, pending gold in-flight, pulse. Bible [`docs/10-animation-feel.md`](../10-animation-feel.md): must-feel odhaczenia. KEEP jako referencję motion; V2 może Rive, ale **kontrakt** (source tap → HUD) zostaje.

6. **Haptics jako bramka globalna** — V1 `lib/hapticsGate.ts` + toggle w store/Settings; tab bar w `_layout.tsx` Light impact na zmianę taba. KEEP ustawienie + mapowanie Light/Heavy na odhacz. Nie Lottie-jako-wszystko ([`docs/12-tech-stack.md`](../12-tech-stack.md)).

7. **Kompaktowy HUD: pierścień XP + gold** — V1 `app/(tabs)/_layout.tsx` (`CircularProgress`, gold target). Bible 5 tabów: Questy · Świat · Bohater · Społeczność · Mentor ([`docs/00-final-picture.md`](../00-final-picture.md)). KEEP informacyjny scent (poziom, gold); KILL stała czerwona kropka maila i ikony klasowe.

8. **Rytuał pierwszego otwarcia dnia** — V1 `components/DailyFlowModal.tsx`: Recap → Streak overlay, bez hardware-back. Bible: poranny hex reveal, **bez** morning gold ([`docs/03-core-loop.md`](../03-core-loop.md), [`docs/06-economy-loot.md`](../06-economy-loot.md)). KEEP sekwencję fullscreen „dzień się zaczął”; treść recapa przepisać na prawdziwy nocny batch hex, nie `YESTERDAY_FACTORS` z `DailyRecapScreen.tsx`.

9. **Heatmapa + kroniki dnia** — V1 `activityByDate`, `completedHabitNamesByDate`, `components/ActivityHeatmap.tsx`, `ActivityChroniclesModal`. Bible 02/25: heatmapa jako nagroda wizualna po capie XP. KEEP dane aktywności jako **agregat z eventów**, nie drugi ręczny słownik w store.

10. **2 sloty loadout (outfit + relic)** — V1 `equippedOutfitId` / `equippedRelicId`, `equipItemById` w store, Hero `BackpackInventoryBody`. Bible [`docs/05-rpg-progression.md`](../05-rpg-progression.md): outfit + **atrybut**, lock atrybutu do resetu dnia. KEEP liczbę slotów i UI plecaka; relic → atrybut z nowymi regułami (serwer).

11. **Widoczny % walki przed tapem** — V1 `lib/gameEngine.ts` `computeDungeonWinChanceBreakdown` + UI lochów. Bible 25 §5.4: auto-resolve z jawnym %. KEEP breakdown w UI; **składniki** przepisać (level Δ, first clear, afiksy equipped, affinity, pot — **nie** smok, nie STR/AGI/INT weakness, nie hex w Akcie 1).

12. **Opóźnienie walki jako feel, nie jako silnik** — V1 `BATTLE_SIMULATION_MS` + `BattleSimulationModal` / `resolveDungeonBattle`. KEEP 1–3 s widowiska po **już zatwierdzonym** rollu serwera. Nie: zjedz klucz, potem `setTimeout`, potem `Math.random` (utrata klucza przy kill apki).

13. **Mentor: krótki lore, typing, fallback mgły** — V1 `lib/sageLlm.ts` (2–3 zdania, `SAGE_ERROR_ORACLE`), `TypingOracle` w `app/(tabs)/sage.tsx`. Bible [`docs/07-ai-sage.md`](../07-ai-sage.md) + 12: fullscreen z tawerny, LLM tylko backend. KEEP ton i UX błędu; KILL prompt z klasą i klucz w kliencie.

14. **Starter habits z profilu, nie z wall-of-form** — V1 `services/onboardingService.ts` (pula + tagi bólu, 3 nawyki). Bible [`docs/15-onboarding-arrival.md`](../15-onboarding-arrival.md): idea starterów KEEP, klasy KILL, zero 80 pytań. KEEP rule-engine puli **bez** `classBonus`.

15. **Auth surface (metody)** — V1 `providers/AuthProvider.tsx`: password, OTP, Google/Apple, timeouty, recover session z AsyncStorage. Bible 20: świat najpierw, soft gate. KEEP zestaw metod i twardość błędów storage; **kolejność** vs cinematic — otwarte (15/20). Nie kopiować `forceBypassAuth`.

16. **Refleksje jako osobna tabela** — V1 `supabase/schema.sql` `daily_reflections` + `lib/dailyReflections.ts` (upsert, graceful missing-table). Jedyny fragment V1, który **nie** jest wrzucony w jsonb. KEEP wzorzec „wrażliwe / append-only obok save'a”; nie duplikować jednocześnie w `dailyReflectionByDate` store (dziś drift vs `pickCloudGameState`).

---

### REWRITE — stan / backend / sync / architektura do przepisania

1. **God-store monolith** — V1 jedyny store: `store/gameStore.ts` (~1190 linii, `GameState` ∪ `GameActions`). Persist `partialize` miesza ekonomię, czat, UI sort, haptics, onboarding. Bible [`docs/12-tech-stack.md`](../12-tech-stack.md): Zustand **domenowo** (habits / world / hero / social). **Ryzyko jeśli nie:** każdy ekran subskrybuje wszystko; niemożliwy test reguł; mapa i CD wejdą w ten sam blob.

2. **Kluczowe pola tożsamości wypadają z local persist** — `partialize` w `gameStore.ts` **nie** zapisuje `playerClass`, `heroDisplayName`, `heroGender`, `onboardingComplete` (są w cloud snapshot). Merge zgaduje `onboardingComplete` z `playerClass`. **Ryzyko:** bez sesji / po reinstall wizard wraca albo imię ginie; AuthGate zależy od flagi, której lokalnie nie ma.

3. **Trzy rozjechane snapshoty tego samego stanu** — local persist `partialize` ≠ `lib/cloudState.ts` `CloudGameState` ≠ `hydrateFromCloud` merge. Cloud **nie** niesie `dailyReflectionByDate`, `lastDailyWelcomeDate`, `appLoginStreak`, `lastAcknowledgedPlayerLevel`. Lokal nie niesie identity. **Ryzyko:** „dlaczego nie dostał golda / nie widział Daily Flow” — nieodtwarzalne ([`docs/25-welcome.md`](../25-welcome.md) pytanie event log vs snapshot).

4. **Last-write-wins upsert całego jsonb** — V1 `components/CloudSync.tsx`: `useGameStore.subscribe` → debounce 450 ms → `profiles.upsert({ game_state: snapshot })`. Zero wersji, zero patchy, flush on background. `hydrateFromCloud` na loginie nadpisuje lokal. **Ryzyko:** dwa urządzenia / offline complete → utrata dnia; race bootstrap vs pierwsze odhaczenie.

5. **Silnik gry w reducerze UI** — `completeHabit` / `purchaseDungeonKeyWithGold` / `rollDungeonBattleResult` mutują salda w kliencie. Bible 25 §6.2: XP, gold, klucze, CD, roll walki i lootu = serwer. **Ryzyko:** infinite gold z debug `useGameStore.setState` w `dragon-lair.tsx`; farm kluczy; nie da się audytować Aktu.

6. **RNG i anti-cheat** — `lib/economy.ts` `rollDungeonKeyDrop`, `lib/gameEngine.ts` `Math.random()`, `lib/weightedLoot.ts`, drop smoka w `completeHabit`. **Ryzyko:** klient = kasyno. V2: serwerowy roll + seed; klient pokazuje wynik.

7. **Zjedz klucz przed rolliem** — `resolveDungeonBattle`: `consumeDungeonKeyForRun` → `await sleep(BATTLE_SIMULATION_MS)` → roll. Crash w trakcie = klucz stracony, brak lootu. V2: transakcja `spend → roll → grant` atomowa, animacja po fakcie.

8. **Dzień gry = UTC ISO, tick tylko na mount** — `getTodayString()` w store = `new Date().toISOString().split('T')[0]`; kalendarz buduje siatkę z **lokalnego** `Date(y, m-1, d)` (`ExpeditionCalendarModal.tsx`). `DailyLoginSync.tsx` odpala raz. Brak AppState → północ. Bible 25 otwarte: lokalna północ vs UTC vs timezone. **Ryzyko:** streak/pasm gold pęka o 01:00 w PL; drugi open dnia nie resetuje ekonomii.

9. **Trzy osie XP + klasa jako tożsamość save'a** — `strengthXP|agilityXP|intelligenceXP`, `player_class` check constraint w `supabase/schema.sql`. Bible [`docs/05-rpg-progression.md`](../05-rpg-progression.md) / [`docs/20-pre-world-locklist.md`](../20-pre-world-locklist.md): klasy KILL; jeden XP → level/wpływ + aktywne dni. **Ryzyko jeśli zostawić schemat:** każdy nowy feature (mapa, affinity) dopina się do STR/AGI/INT.

10. **Hex jest UI-fakerem, Oracle wagi są martwe** — `AIStatService.analyzeTask` zapisuje `oracleStatWeights` na habicie; **nic ich nie agreguje**. Hero `HeroHexRadarChart` bez props = `MOCK_HERO_HEX_STATS` (`constants/heroHexStats.ts`). Daily Recap liczy hex z XP/streak + sztuczne `YESTERDAY_FACTORS`. Bible: nocny batch → poranny reveal, hex **nie** w win% Akt 1. **Ryzyko:** zbudujesz „hex” na mocku i nigdy nie będzie karty gracza.

11. **Druga i trzecia ekonomia obok capu nawyków** — cap 100g + fatigue po 19. tasku (`lib/economy.ts`) vs Hero `claimHeroDailyQuest` (`constants/heroQuestSystem.ts`, m.in. `daily_save_progress` **zawsze true**) vs Sage +50g poza capem vs morning +20g. Bible LOCK: pasma 1–5 / 6–10 / 11+ = 0, max 300g, morning gold KILL. **Ryzyko:** V2 „zportuje cap” i zostawi dziury w rytuałach/epic — balans Aktu 1 pada.

12. **AI w bundlu** — `lib/groqClient.ts` `EXPO_PUBLIC_GROQ_API_KEY`; Sage i Oracle ten sam fetch. Brak rate limit, brak karty gracza, czat w jsonb. Bible 12/07/25: Edge/API, zero klucza w apce, living-memory osobno. **Ryzyko:** wyciek klucza + koszt + prywatność mood/onboarding.

13. **Schema „jeden jsonb na usera”** — `supabase/schema.sql`: `profiles.game_state`, friendships, reflections. Habits, inventory, dungeon CD, map pins **nie istnieją** jako tabele. RLS social otwarte. Bible 25 §6.3 domeny. **Ryzyko:** nie da się zapytać „kto clearował ★1”; LiveOps content w ekranach (`constants/gameplayConfig.ts` hardcoded bossy).

14. **Auth gate rozjechany z produktem** — `components/AuthGate.tsx` + `app/(auth)/welcome.tsx`: `forceBypassAuth = true`. CloudSync i DailyLoginSync wymagają sesji (`app/_layout.tsx` `AuthenticatedEffects`). Bible: soft gate po 1. wartości. **Ryzyko:** V2 launch z bypassem albo odwrotnie — twardy login przed cinematic isekai.

15. **QueryClient jako fałszywa warstwa serwera** — `app/_layout.tsx` owrapowuje apkę; **zero** `useQuery`/`useMutation` w repo. Friends fetch ręczny w `kingdom.tsx`. V2: React Query (lub analog) na **serwerowe** odczyty (profil, mapa, social); lokalny cache nawyków osobno. **Ryzyko jeśli nie:** drugi ad-hoc fetch + trzeci persist.

16. **Onboarding = 12 kroków klasy + deep profile w wizardzie** — `components/SageOnboardingWizard.tsx` (`LAST_STEP = 12`, klasa krok 2). Zapis równolegle do store i upsert profilu. Bible 15: scena stolicy, nie formularz; klasy KILL. Rewrite flow (produkt już zdecydowany) **i** pipeline zapisu (identity vs habits vs mentor card).

---

### KILL — rzeczy z V1 do porzucenia

1. **Klasy jako mechanika i kolumna DB** — V1 `PlayerClass`, `CLASS_*` w `hero.tsx`/`sageLlm.ts`, check `player_class` w schema. Bible [`docs/05-rpg-progression.md`](../05-rpg-progression.md), [`docs/20-pre-world-locklist.md`](../20-pre-world-locklist.md), [`docs/25-welcome.md`](../25-welcome.md): **KILL**. Nie zostawiać „na razie flavor” w save'ie.

2. **Smoki + buffy do ekonomii/walki** — V1 `DRAGON_CONFIGS`, `setActiveDragon`, carousel w `dragon-lair.tsx`, `getActiveDragonBuffs`. Bible 18/20/00: **PARK w HUD / KILL jako system launchu**. Nie przenosić unlock 10/25/40 streak do V2 slice.

3. **Hub „Humble Camp → Dragon Fortress”** — V1 `constants/kingdomTiers.ts` + `HomeScenePanel.tsx` (base/armory, char_mage, camp backgrounds). Bible 00/03/15: stolica Crownhaven, dom stodoła→chata→mur po ★, **nie** izolowany obóz. Kill kotwicę visual i `getCastleTier(level)`.

4. **Tab D&D jako karty lochów** — V1 `app/(tabs)/dragon-lair.tsx` + `components/dungeons.tsx` lista wyzwań. Bible 18: Świat = mapa → drill lokacji; karty D&D świadomie porzucone. Kill IA taba; walka zostaje jako flow S08 w lokacji ([`docs/19-screen-inventory.md`](../19-screen-inventory.md)).

5. **Morning gold** — V1 `GOLD_MORNING_STREAK` + `processDailyLogin` w store. Bible [`docs/06-economy-loot.md`](../06-economy-loot.md): **KILL**. Login = hex + aktywny dzień, nie +20g.

6. **Fatigue V1 (1.0 do 19. tasku)** — `fatigueMultiplierForTaskIndex` w `lib/economy.ts`. Sprzeczne z LOCK pasmami 1–5 / 6–10 / 11+=0. Nie „dostroić”; zastąpić tabelą z 06.

7. **Klucz Groq w kliencie i public env** — `lib/groqClient.ts`, `.env.example`. Bible 12: świadomie odrzucone. Kill pipeline; nie owijaj tym samym fetchy w V2.

8. **Rork jako runtime produktu** — `package.json` scripts `npx -y rork start`, `app.json` scheme `rork-app`, origin `https://rork.com/`, `@rork-ai/toolkit-sdk`. Dev scaffolding, nie produkt. V2: EAS ([`docs/12-tech-stack.md`](../12-tech-stack.md)).

9. **Mailbox stub + wieczny notification dot** — `components/MailboxModal.tsx` jedna wiadomość beta; `styles.notificationDot` zawsze. Bible prototype-v1 + 19: nie slice. Kill z HUD albo zastąpić prawdziwym systemem later.

10. **Ranking z mockami jako „Królestwo”** — `constants/realmMockHeroes.ts` + `lib/kingdomLeaderboard.ts` sort po streak. Tab V1 Kingdom ≠ mapa V2. Social launch cienki ([`docs/08-social.md`](../08-social.md), [`docs/18-information-architecture.md`](../18-information-architecture.md)). Kill mock leaderboard jako default IA.

11. **Debug cheaty w ekranie gry** — `dragon-lair.tsx`: add gold/keys/XP/streak, seed mock history, `devResetOnboarding`. W prod path. Kill z UI; w V2 tylko dev menu za flagą, nigdy `setState` na saldach.

12. **Hero rytuały jako dziurawy gold tap** — `daily_save_progress: true` zawsze; `daily_affirmations` = „był czat Sage”. Druga meta-gra na tym samym goldzie. Slice V2: S04 lista + S05 feedback, nie daily bingo ([`docs/19-screen-inventory.md`](../19-screen-inventory.md) park achievements).

13. **Nieużywane zależności / martwe trasy** — `@nkzw/create-context-hook` (brak importów), `expo-location` (brak użycia), `app/onboarding/more.tsx` redirect. `QueryClient` bez zapytań. Nie ciągnąć do V2 „bo było w package.json”.

14. **Otwarte RLS profili** — `profiles_select_public_for_social using (true)` w `supabase/schema.sql` wystawia `game_state` (nawyki, czat, gold). Bible 08/25: MVP privacy, nie docelowe. Kill w V2 nawet na launch social-thin.

15. **Synergy gear ↔ bossId w kliencie** — `GEAR_ITEMS.synergyBossId` w `constants/gameplayConfig.ts`. Lekki power creep sprzeczny z deklaracją „loot nie psuje nawyków”; V2 afiksy z katalogu serwera, nie hardcoded w bundlu UI.

---

### PARK — ważne, ale nie teraz

1. **Smoki jako fantasy companion** — produkt PARK ([`docs/18-information-architecture.md`](../18-information-architecture.md), [`docs/20-pre-world-locklist.md`](../20-pre-world-locklist.md)). Nie projektować tabeli `dragons` day 1. Zależność: czy wracają jako emotki/Rive, czy w ogóle.

2. **Social (friends, ranking, mapa znajomych)** — V1 szkielet `friendships` + search po `player_id`. Bible 08/19: later; soft gate ~L4. Zależność: RLS, co jest publiczne (level? tytuł? nie jsonb). Nie blokuje Day 0 → Gutterjack.

3. **Realtime Supabase** — brak w V1; Bible 12: later, MVP polling/push. Nie projektować kanałów zanim nie ma serwerowego ticku.

4. **Freeze / eliksir czasu** — V1 `useElixirOfTimeOnHabit`, gold 350. Bible 02: zero kary za miss; freeze gryzie się z „nie toksyczny FOMO”. PARK aż do decyzji streak UI.

5. **Epic quest Mentora (+gold poza listą)** — V1 Sage +50g, reroll 20g. Bible 06: seed +100 **jeśli wróci**. Nie implementować w slice; Mentora najpierw jako coach ([`docs/07-ai-sage.md`](../07-ai-sage.md) otwarte).

6. **Kontrakt Living World / karta gracza** — nie istnieje w HEAD V1 (wbrew `prototype-v1.md`). Bible 07/04 otwarte. PARK schemat karty aż do locku Mentora; nie wsadzać onboarding deep-profile 1:1 do promptu.

7. **CMS treści świata** — V1 bossy/loot w `constants/gameplayConfig.ts`. Bible 25 pytanie 7. Slice może JSON w repo; CMS later. Nie hardcoded UI ekranów.

8. **Skia vs Image+gesty na mapie; Rive vs bitmapa close-up** — otwarte [`docs/12-tech-stack.md`](../12-tech-stack.md). Nie wybierać silnika mapy, zanim jest stan fog/pin (dane). Art pipeline [`docs/24-map-production.md`](../24-map-production.md) nie blokuje backendu dnia.

9. **Analytics vendor** — brak w V1. Bible 12 otwarte (Day 1/7, odkrycia, clear ★). Wpiąć po event logu, nie odwrotnie.

10. **Aukcje / marketplace / koło / IAP** — PARK M1 ([`docs/06-economy-loot.md`](../06-economy-loot.md), [`docs/14-monetization-liveops.md`](../14-monetization-liveops.md) puste). Fair-play: płatność nie kupuje Aktu — to constraint ekonomii, nie feature.

11. **Hex w walce** — świadomie nie Akt 1 (05/06). Nie przenosić `weaknessStat` klasowego z `gameEngine.ts` „tymczasowo jako hex”.

12. **Auth timing vs isekai** — otwarte 15/20. Architektura: daj **anonymous/local progress** + późniejszy bind; nie czekaj na lock cinematicu, żeby zacząć SoT nawyków.

---

### Rekomendowana kolejność startu V2 (krótko, bez kodu)

Cel cienkiego backendu z [`docs/25-welcome.md`](../25-welcome.md): **Day 0 → Gutterjack → pierwszy pin mapy**, bez portu `gameStore.ts`.

1. **Zamknąć kontrakt dnia** (nawet jako ADR w `docs/13-game-systems.md`, nie kod): timezone, „aktywny dzień”, pasma 1–5/6–10, kto jest SoT. Bez tego każdy ekran zgaduje jak V1 UTC.

2. **Identity cienka:** Auth (metody z V1) + profil (imię, wygląd, **bez klasy**) + `onboardingComplete`. Soft gate: gra lokalna aż do 1. wartości, potem bind ([`docs/20-pre-world-locklist.md`](../20-pre-world-locklist.md)).

3. **Habits jako pierwsza domena z eventem:** CRUD + schedule + complete/uncomplete. Klient optymistyczny (KEEP feel HabitCard). Serwer: event `habit_completed` → gold/XP/key wg tabeli 06, ledger do undo. Offline: kolejka eventów, nie pełny dump stanu.

4. **Day tick na serwerze** (cron lub `ensure_today` przy sync): reset pasm, hex batch wczoraj, lock atrybutu, CD lochów. Klient nie woła `processDailyLogin` tylko na mount.

5. **Shell Expo 5 tabów** z pustym Światem: port **Questy** (lista + overlay + haptics + trajectory) na nowym API. HUD XP/gold czyta salda z reconcile, nie z boga-store.

6. **Combat v1 serwerowy:** jeden loch (Gutterjack) — free + 100% ([`docs/25-welcome.md`](../25-welcome.md) §5.4). Potem CD + klucz. Roll i loot na serwerze; modal walki tylko prezentuje.

7. **World state minimalny:** fog + 1 pin + expedition timer (S06/S09/S10 w [`docs/19-screen-inventory.md`](../19-screen-inventory.md)). Osobny store/domena `world`, nie pole w habits blob.

8. **Mentor proxy:** jeden endpoint, rate limit, bez Groq w apce. Kontekst = karta (nawet pusta) + level/dni; nie cały chat history w `game_state`.

9. **Dopiero potem:** inventory/loadout lock, stragan, affinity, social RLS. Nie równolegle z punktem 3.

**Świadomie nie na starcie:** port jsonb sync, port smoków/klas/obozu, Unity, Skia-mapa-wow zanim pin ma stan, React Query „na cały god-store”.

---

*Koniec audytu. Ten plik nie zmienia filarów Bible; spory produktowe rozstrzygać w `00` / `06` / `12` / `13`, nie tutaj.*

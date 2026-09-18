# V1 Castle / Habits UX → V2 Questy audit

> **Rola:** inwentarz UX Zamku (nawyki) z prototypu i checklist portu na tab **Questy**.  
> **Źródło V1:** [HabitsAndDragons](https://github.com/Kryki999/HabitsAndDragons) — `app/(tabs)/index.tsx` (Castle), `components/HabitCard.tsx`, overlaye, kalendarz, kroniki, heatmapa.  
> **Cel V2:** ten sam *feel* pętli osobistego rozwoju. **Bez** RPG (XP/gold/klasy/smoki/lochy/Mentor AI).  
> **Stan:** P0 z tej checklisty ląduje w `apps/mobile` w tym PR. Reszta = P1/P2.

Powiązane: [`prototype-v1.md`](prototype-v1.md) (as-is produktu), [`v1-to-v2-architecture-audit.md`](v1-to-v2-architecture-audit.md) (architektura KEEP/REWRITE/KILL).

---

## 1. Screen inventory (V1)

Castle nie jest jednym ekranem — to **hub + stos modalny**. Lista poniżej jest tym, co gracz realnie dotyka przy nawykach.

| ID | Powierzchnia | Plik V1 | Co robi |
|----|----------------|---------|---------|
| C1 | **Castle home** | `app/(tabs)/index.tsx` | Lista due na dziś: scena domu, command header, sekcje Habits / Side quests, karta „Add New Quest” |
| C2 | **HabitCard** | `components/HabitCard.tsx` | Gruba karta: ikona + nazwa, dolny pasek 4 px, checkbox **osobną strefą**, body **nie** odhacza |
| C3 | **TaskCardOverlay** | `components/TaskCardOverlay.tsx` | Shared-element expand z `measure` karty → Modal + Reanimated `expandProgress`. Compact layout = kopia wiersza karty, potem expanded (ikona, badge typu). Akcje: Edit / Complete·Undo / Reschedule; góra: Delete + Close. Karta w liście `opacity: 0` („dziura”) na czas overlayu |
| C4 | **Add habit** | `components/AddHabitModal.tsx` | (a) bottom-sheet „Forge a New Habit”: Suggested vs Custom; (b) full-screen Suggested (lista + plan date chips); (c) full-screen Custom (typ daily/one-off, nazwa, ikona, Forge). **Oracle Groq** przy custom |
| C5 | **Edit quest** | inline Modal w Castle | Full-screen: nazwa, opis, ikona, Daily / One-off |
| C6 | **Reschedule** | inline Modal w Castle | Tomorrow / Next Week + `YYYY-MM-DD` |
| C7 | **Expedition calendar** | `components/ExpeditionCalendarModal.tsx` | Ogromny planning center: week swiper (52 tyg wstecz), expandable month grid, lista dnia (overlay na wierszu), add/edit/reschedule, refleksja dnia, past vs future |
| C8 | **Chronicles** | `components/ActivityChroniclesModal.tsx` | Heatmapa ogólna → tap dzień → read-only log; druga sekcja: heatmapa **jednego** nawyku + streak/best/total; archive |
| C9 | **Activity heatmap** | `components/ActivityHeatmap.tsx` | GitHub-like: tygodnie w poziomie, Pn–Nd w pionie, 5 poziomów intensywności, legend less/more, auto-scroll do „teraz” |
| C10 | **Day quest log** | `components/DayQuestLogReadOnly.tsx` | Read-only wiersze dnia + orphan completions + daily reflection |
| C11 | **Hero timeline** | `components/HeroQuestTimeline.tsx` | **Nie** kronika nawyków — rytuały Hero + epickie milestone’y z gold claim. RPG meta, nie Questy |
| C12 | **Home scene** | `components/HomeScenePanel.tsx` | Lottie/scena obozu, tier zamku z levela gracza |
| C13 | **Sort sheet** | `components/TaskSortBottomSheet.tsx` | Default vs custom order; custom → `DraggableFlatList` |
| C14 | **Loot trajectory** | `providers/LootTrajectoryProvider.tsx` | Cząstki monet z checkboxa → HUD złota (bezier, pulse celu) |
| C15 | **Haptics** | `lib/hapticsGate.ts` | Light na tap karty / ikony; Heavy na complete i otwarcie add |
| C16 | **Celebrations** | `CelebrationOverlayHost`, `PlayerLevelUpOverlay`, `DragonStreakWelcomeOverlay`, `DailyFlowModal` | RPG overlays — nie część listy nawyków, ale siedzą w shellu |

### 1.1 Gestes / animacje (feel)

- **Checkbox:** Heavy haptic + spring `1 → 1.2 → 1` (complete) albo `1 → 0` (undo). Osobny `Pressable`, `hitSlop`.
- **Body karty:** Light haptic → `measure` → overlay. **Nie** toggle.
- **Overlay open:** spring `damping: 22, stiffness: 240`; compact fade-out do 0.35, expanded fade-in 0.35–0.75; akcje dopiero ~480 ms.
- **Overlay close:** ten sam spring wstecz; `useAnimatedReaction` woła `onClose` przy progress `< 0.14` (karta już `opacity: 0`) — unika zacinania Modal vs lista.
- **Add:** Heavy przy wyborze ścieżki i forge.
- **Lista:** wejście — spring skali sceny domu + fade/slide headera (~420 ms).
- **Loot:** lot monet z `pageX/pageY` checkboxa — satysfakcja *po* odhaczeniu, nie zamiast springa checkboxa.

### 1.2 Model danych nawyku (V1, wycinek)

`Habit` w `types/game.ts`: `name`, `description`, `icon`, `taskType` (`daily` \| `one-off`), `scheduledDate`, `completedToday`, `completionDates[]`, streaki, `difficulty`, `stat` (STR/AGI/INT), `oracleStatWeights`, `isFrozen`, plus **globalnie w god-store:** `activityByDate`, `completedHabitNamesByDate`, ledger XP/gold.

Castle default list: aktywne, `scheduledDate` puste albo `<= dziś`. Kalendarz dla daily: powtarza od daty startu; one-off = dokładnie ten dzień.

**Uwaga:** V1 często buduje `YYYY-MM-DD` z `toISOString().split('T')[0]` (UTC). V2 ma trzymać **lokalny** dzień — rewrite, nie kopia.

---

## 2. KEEP (UX / feel / wzorce komponentów)

Portujemy **zachowanie i ciężar UI**, nie pliki 1:1.

| Wzorzec | Dlaczego |
|---------|----------|
| Czysta lista IRL jako pierwszy ekran dnia | Biblia `18` — Questy = habit core, nie mapa |
| Gruba karta + dolny pasek 4 px + strike-through | Natychmiastowy „to jest gra”, bez loot |
| Checkbox ≠ body | Szybkie odhaczenie vs. otwarcie karty |
| Overlay expand z origin `measure` | To jest *wow* Zamku; lista bez tego jest Excel |
| Heavy haptic na complete, Light na tap karty | Finch: satysfakcja w palcu |
| Spring checkbox (overshoot) | Tanie, działa bez Rive |
| Command header: kalendarz \| postęp `n/m` \| kroniki | Trzy drzwi do historii / planowania, lista zostaje czysta |
| Sekcje Nawyki / Jednorazowe | Dwa rytmy życia; bez klas |
| Karta „Dodaj quest” na dole listy (nie tylko input w tab barze) | Celowy akt, nie pole w footerze |
| Add: choose sheet → suggested **lub** custom | Niski próg + własny quest |
| Ikona emoji na queście | Skanowanie listy |
| Daily vs one-off + data planu | Kalendarz ma co pokazać |
| Historia `completionDates` | Heatmapa i streak bez ekonomii |
| Heatmapa GitHub-like (5 poziomów, Pn–Nd, scroll do dziś) | „Nie zrywaj łańcucha” — personal-dev, nie XP |
| Kalendarz: pasek tygodnia (litery + numer + kropka aktywności) + siatka miesiąca | Planowanie dnia bez RPG „wyprawy” |
| Past day = read-only | Uczciwa historia; nie edytujesz wczoraj z listy |
| Lazy-mount overlay (`hasOpenedRef`) | V1 naprawiał freeze po close — nie cofamy tego |
| Lokalny persist | V2: AsyncStorage domain store, nie cloud blob |

---

## 3. REWRITE (stan i implementacja)

| V1 | V2 |
|----|-----|
| `useGameStore` wie o smokach, gold, klasach, Sage, heatmapie naraz | **Tylko** `habits/` Zustand: CRUD + complete + historia dat |
| `completedToday` + osobny `activityByDate` + `completedHabitNamesByDate` + ledger | `completionDates[]` na habicie; mapa aktywności **derived** |
| `difficulty` → XP/gold | **Brak** trudności w P0 (albo later jako etykieta, zero nagród) |
| `stat` / Oracle weights / Groq `analyzeTask` | Kill na create; suggested lista statyczna |
| `toISOString()` day keys | `YYYY-MM-DD` **lokalny** |
| LootTrajectory → HUD złota | Burst cząstek z checkboxa **bez** złota / bez HUD ekonomii |
| `HomeScenePanel` + castle tier z `getPlayerLevel()` | Nie portujemy obozu. Questy: lista + heatmapa jako „życie”, nie upgrade chatki |
| `ExpeditionCalendarModal` (~2k linii, drag, refleksje, nested add) | Cieńszy kalendarz: tydzień + miesiąc + focus dnia na liście |
| `ActivityChroniclesModal` czyta god-store + archive + per-habit trail | Kroniki: heatmapa + log dnia z domain store. Per-habit trail = P1 |
| Edit/reschedule full-screen w Castle + kopia w kalendarzu | Jedne modale z Questy, overlay je otwiera |
| LinearGradient / lucide / draggable-flatlist | V2: paleta `theme/colors`, Ionicons, bez drag w P0 |
| Overlay pokazuje `+XP` / `+gold` | Overlay: nazwa, ikona, badge typu, streak; complete bez waluty |

Nie kopiujemy `gameStore.ts`, `AIStatService`, `profiles.game_state`, client Groq.

---

## 4. KILL / PARK

### KILL (nie w Questy, nie w tym PR)

- XP, gold, cap 100, morning gold, key drop, fatigue
- `difficulty` jako silnik nagród
- Klasy, hex, Oracle, „Consulting the Oracle…”
- Elixir freeze / FROZEN badge
- Smoki, lochy, D&D, god-store
- `HeroQuestTimeline` (rytuały z gold claim) — to tab Bohater / RPG, nie kronika nawyków
- Scena zamku / Lottie home / kingdom tiers na liście questów
- Suggested copy o wojownikach, Valyrian steel, +STR (zostawiamy IRL, ewentualnie lekki smak świata **bez** klas)

### PARK (świadomie later)

| Item | Gdzie |
|------|--------|
| Per-habit heatmap trail + archive z Kronik | P1 |
| Daily reflection w logu dnia | P1 (żyje bliżej Mentora / Bohatera) |
| Custom sort + drag & drop | P1 |
| Pełny planning center w kalendarzu (edycja dnia, nested add) | P2 |
| LootTrajectory do HUD (gdy będzie XP/gold z Biblii `06`) | P2 — P0 ma lokalny burst bez ekonomii |
| Winieta domu w stolicy nad listą | P1, gdy będzie art tieru (`18` A3) |
| Daily Flow / level-up / streak dragon overlays | Shell RPG, nie Questy |
| Cloud sync nawyków | Park (`architecture-audit`) |
| Timeline pionowy „wszystkie dni” jak feed | P1 stub w Kronikach |

---

## 5. Ordered port checklist

### P0 — ten PR (rdzeń pętli)

Sukces: Questy **wyraźnie** mniej nagie niż scaffold — lista / dodaj / complete + kalendarz **albo** heatmapa z wzorców V1.

1. **Store domain:** `icon`, `taskType`, `scheduledDate`, `completionDates[]`; migracja ze starych `{ name, completedOn }`.
2. **HabitCard:** checkbox vs body; ikona; meta typu; spring + Heavy haptic; **nie** complete na tap body.
3. **TaskCardOverlay:** expand z origin, complete/undo, edit, reschedule, delete — **zero** XP/gold.
4. **Add quest:** karta na liście + modal choose → suggested IRL **lub** custom (nazwa, ikona, daily/one-off, data). Bez Groq.
5. **Complete feel:** spring checkbox + burst cząstek (wizualny echo LootTrajectory, bez monet i HUD).
6. **Command header:** ikona kalendarza · `n/m questów` · ikona kronik.
7. **Sekcje** Nawyki / Jednorazowe + empty state.
8. **Kalendarz:** pasek tygodnia + siatka miesiąca → focus dnia na liście (past = read-only).
9. **Heatmapa:** GitHub-like w Kronikach; kompakt na Questy (tap komórki → kroniki / focus). Intensywność = liczba completionów, nie XP.
10. **Kroniki P0:** heatmapa + log dnia (nazwy odhaczonych). Timeline/refleksje = stub + TODO P1.
11. Edit / usuń / przełóż z overlayu. Persist AsyncStorage.

### P1

- Per-habit heatmap + streak/best/total w Kronikach
- Pionowy feed dni (timeline) zamiast samego stuba
- Custom order listy
- Bogatszy empty / first-quest coaching (bez Mentora LLM)
- Winieta stolicy (statyczna), gdy art gotowy
- Refleksja dnia (lokalna), jeśli produktowo ma siedzieć przy Kronikach a nie Mentorze

### P2

- Kalendarz jako pełny planning center
- Burst → przyszły HUD zasług (zgodnie z `06`, nie V1 gold)
- Archive vs delete, difficulty jako etykieta
- Sync chmury świadomym modelem (nie jsonb `game_state`)

---

## 6. Mapowanie V1 → V2 powierzchnie

| V1 | V2 tab / plik |
|----|----------------|
| Castle list + header + add card | `habits/QuestsScreen.tsx` |
| HabitCard + TaskCardOverlay | `habits/HabitCard.tsx`, `habits/TaskCardOverlay.tsx` |
| AddHabitModal − Oracle | `habits/AddQuestModal.tsx` |
| Expedition calendar (obcięty) | `habits/CalendarModal.tsx` |
| ActivityHeatmap | `habits/ActivityHeatmap.tsx` |
| Chronicles − RPG | `habits/ChroniclesModal.tsx` |
| gameStore habits slice | `habits/store.ts` |
| HomeScene / loot HUD / Hero timeline / Daily Flow | nie w Questy |

---

## 7. Werdykt produktowy

Zamek V1 działał, bo **lista była ciężka i gesty były rozdzielone** (odhacz vs otwórz), a historia (kalendarz + heatmapa) była jeden tap od postępu dnia. RPG na kartach (XP, gold, Oracle) **nie** jest tym, co trzyma codzienność — to szum względem Biblii (`18`: pierwszy ekran = czysta praca IRL).

V2 Questy ma skopiować **ciężar i gesty**, spiąć historię z domain `habits`, i zostawić złoto/mapę/Mentora innym tabom.

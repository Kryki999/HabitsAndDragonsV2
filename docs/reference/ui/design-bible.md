# UI Bible — Habits & Dragons

> **Status:** LOCK v2.3 · 2026-09-24 (founder: PeekCard „Enter”; sklep Buy / Sell jako zakładki; LevelNav z lookdev = jedyna nawigacja pięter, bez nazwy przy przytrzymaniu; winieta sklepu na razie = wycinek Crownhaven). Jedyne źródło prawdy dla wyglądu *chrome* (wszystko, co nie jest malunkiem świata). Lookdev + goldeny wygrywają ze starszym opisem w `06` / `18` / `23` i z kodem playgroundu (`FloorLift`, szept po tapie).  
> **Zastąpiła** wcześniejszy `kit.md` (usunięty; wnioski w sekcji 11).  
> **Kreska świata** (stille, mapa, postacie) nadal: [`../art/style-kit.md`](../art/style-kit.md).

Ten plik ma trzy warstwy. Czytaj w tej kolejności:

1. **Obrazy** — [`golden/`](golden/) (renderowane wzorce). Najpierw patrzysz, potem czytasz.
2. **Reguły** — ten plik.
3. **Wartości** — [`lookdev/tokens.css`](lookdev/tokens.css) + [`lookdev/components.css`](lookdev/components.css). Liczby są tylko tam; w kodzie RN mają się nazywać tak samo.

| Golden | Archetyp | Co pokazuje |
|--------|----------|-------------|
| [`home-quests.png`](golden/home-quests.png) | A · Sheet + winieta | Karty na mgle, pills, habit row, tab bar |
| [`shop.png`](golden/shop.png) | A · Sheet + winieta | Sklep straganu: babka + dymek na górze, Buy/Sell, katalog 3×2 (featured, brak złota, wyprzedane) |
| [`hero.png`](golden/hero.png) | B · Stos kart (pełny scroll) | Account bar, profil + XP, hex 6 statów, ekwipunek 2 sloty + plecak, mapa nawyków |
| [`flow-streak.png`](golden/flow-streak.png) | C1 · Celebracja | Promienie, portret w medalionie, wielka liczba, tydzień streaka, Button.flow |
| [`flow-levelup.png`](golden/flow-levelup.png) | C1 · Celebracja | Złote promienie, plakietka LV, rząd nagród, punkt drogi |
| [`onboarding-choice.png`](golden/onboarding-choice.png) | C2 · Pytanie | Pasek kroków, NPC pyta w dymku, lista jednokrotnego wyboru, Button.primary |
| [`onboarding-pick.png`](golden/onboarding-pick.png) | C2 · Pytanie | To samo, siatka wielokrotnego wyboru (3 pierwsze questy) |
| [`world-map.png`](golden/world-map.png) | E · Mapa | Fit-width, piny (sticker / lock / current), PeekCard; **bez fog of war**; bez górnej poświaty. Chrome — nie kompozycja świata |
| [`world-map-gray.png`](golden/world-map-gray.png) | E · Mapa (kłódka) | Siatka 390×1920, B=200, środek-albo-para. Composition lock pod nowy art (`24`) |
| [`world-crownhaven.png`](golden/world-crownhaven.png) | D · Scena (hub) | Nameplate'y na malunku, scene head, szew dokowany |
| [`world-gutterjack.png`](golden/world-gutterjack.png) | D · Scena (encounter) | LevelNav (strzałki), kompaktowa karta bossa: szanse, łup, Fight |
| [`world-npc-torrik.png`](golden/world-npc-torrik.png) | D · Scena (NPC sojusznik) | Kompaktowa karta sojusznika: za co rośnie (streak), 3 poziomy z progami i nagrodami |
| [`kit-sheet.png`](golden/kit-sheet.png) | — | Wszystkie komponenty i tokeny na jednej planszy (w tym EncounterCard i AllyCard) |

Źródła mocków (kierunek, z którego to wyciągnięto): [`mocks/`](mocks/) — Home, Hero, Streak, Sklep, Onboarding.

---

## 1. DNA — dziewięć zasad

Jeśli nowy ekran łamie którąś z nich, jest spoza gry. Reszta pliku to rozwinięcie.

1. **Mgła to płótno.** Tło aplikacji to periwinkle mist (`canvas`). Nie biel, nie ciemny fiolet, nie gradient-tęcza.
2. **Świat jest ciepły, UI jasne i chłodne, a spotykają się przez szew.** Malunek nigdy nie kończy się twardą krawędzią pod UI. Rozpuszcza się w mgłę (`seam`) dokładnie tam, gdzie zaczyna się chrome.
3. **Biel = rzecz, którą dotykasz albo czytasz.** Karty, pills, plakietki, przyciski są białe i nieprzezroczyste. Zero „szkła” (translucent glass) i zero cienkich obwódek.
4. **Wszystko, co się wciska, ma wargę (lip).** Twarda dolna krawędź 3–4 px w ciemniejszym tonie tego samego koloru. To robi „grę” zamiast „SaaS-u”.
5. **Zaokrąglone i grube.** Promienie 14/20/28/pill. Nunito 800–900. Nic cienkiego, nic ostrego.
6. **Dwa języki ikon, nigdy wymieszane.** *Glyph* (mono, system: back, check, lock) i *sticker* (kolor, treść: nawyk, miejsce, waluta, tab). Trzeci świat to *item art* (łup), rysowany kreską świata.
7. **Złoto znaczy nagrodę.** Monety, XP, „featured”, legendary. Nie dekoracja, nie drugi kolor CTA.
8. **Jedna główna akcja na ekran.** Jeden `btn-primary`. Reszta to nawigacja albo drugorzędne.
9. **Malunek jest projektowany pod UI.** Każdy still ma strefy na nagłówek, plakietki i dolny panel. Jeśli nie ma, poprawia się still, a nie wciska UI na siłę.

---

## 2. Tokeny

Wartości zmierzone z mocków (próbkowanie PNG), nie „na oko”. Pełna lista: [`lookdev/tokens.css`](lookdev/tokens.css).

**Kolor**

| Token | Hex | Użycie |
|-------|-----|--------|
| `canvas` | `#91A2F2` | Tło aplikacji (sheety A/B), szew. **Nie** overlay fog of war na mapie E |
| `canvas-hi` | `#A9BBFB` | Tab bar, jaśniejsza mgła |
| `canvas-deep` | `#7483DC` | Panel *na* mgle (Crown Day), nie karta |
| `surface` | `#FFFFFF` | Karty, pills, plakietki, przycisk flow |
| `surface-2` / `-3` | `#ECEFFC` / `#DDE2FB` | Studzienki ikon, check-btn, sloty, locked |
| `ink` | `#151638` | Tekst na bieli |
| `ink-2` / `ink-3` | `#5C6080` / `#9AA0C3` | Tekst drugorzędny / wyłączony |
| `on-canvas` | `#FFFFFF` + `shadow-on-canvas` | Tekst bezpośrednio na mgle |
| `brand` / `brand-deep` | `#6570F6` / `#4A52D1` | Primary CTA + jego warga, aktywne stany |
| `brand-soft` | `#DFE3FF` | Tło aktywnego elementu na bieli (back w scene head) |
| `gold` / `gold-deep` | `#FDB43C` / `#E8870F` | Nagroda, progress XP, featured |
| `success` / `danger` | `#5FCF8A` / `#F2685A` | Win chance, done / boss tag, błąd |
| `r-common/unique/heroic/artifact` | `#C9CEE6` `#5AA7F5` `#A56BF5` `#FDB43C` | **Tylko** ramki itemów. Nazwy = 4 tiery z [`06`](../../06-economy-loot.md) §10 (Zwykły · Unikat · Heroiczny · Artefakt). Waluta (moneta, klucz) = zawsze `common`. |

**Typografia:** tylko **Nunito** (Google Fonts, OFL). Hero-num 900/104 (tylko liczba na celebracji) · Display 900/44 · H1 900/24 · H2 800/20 · Body 700/16 · Label 800/14 · Caption 800/11 CAPS +8% tracking. Waga poniżej 700 nie istnieje.

**Promienie:** 10 · 14 · 20 · 28 · pill. Karta = 28. Kafel/slot = 14–18. Przycisk = pill.

**Odstępy:** siatka 4 pt. Margines ekranu 16. Przerwa między kartami 10. Wnętrze karty 14–18. Tab bar = `tabbar-h` 96; dolna karta sceny stoi 12 nad nim.

**Cienie:** trzy i tylko trzy — `lip-*` (warga, twarda), `drop-sm/md` (miękki, niebieskawy, na mgle), `drop-on-art` (ciemniejszy, na malunku). Nigdy czarny cień na mgle.

**Ruch:** press = scale 0.96 + warga znika (90 ms). Pojawienie = pop `ease-pop` 220 ms. Pulsuje tylko kotwica plakietki i aktywny pin, nie cały ekran.

---

## 3. Ikony — trzy szuflady

To była główna wpadka poprzedniego kitu: jednokolorowe fioletowe glify udawały ikony z mocków. W mockach ikony tabów, walut i nawyków to **kolorowe naklejki z białą obwódką** (die-cut sticker). Glif mono jest tam tylko w roli systemowej (menu, filtr, kalendarz, check).

| Szuflada | Co | Wygląd | Źródło |
|----------|----|--------|--------|
| **Glyph** | back, close, check, lock, settings, filter, add, calendar | Mono, wypełniony, w kolorze tekstu/brand | [MingCute](https://www.mingcute.com) **Fill** (Apache-2.0). Tylko ta paczka. |
| **Sticker** | Taby, waluty, nawyki, miejsca, akcje (Fight), kategorie | Kolor, płaski, zaokrąglony, **biała obwódka die-cut** + miękki cień | Baza: [Fluent Emoji **Flat**](https://icon-sets.iconify.design/fluent-emoji-flat/) (MIT, ~1500 szt.). Obwódka dodawana w kodzie, nie w pliku. Marka (moneta, klucz, 5 tabów) = custom w tym samym języku. |
| **Item art** | Łup, ekwipunek, przedmioty w sklepie | Kreska świata (gruby kontur, cel-shade), przezroczyste tło | Style-kit + SCENE „item portrait”. Nie z żadnej paczki. |

Reguły:

- Glyph **nigdy** nie stoi sam na malunku i nigdy nie oznacza treści (nawyk, miejsce, przedmiot).
- Sticker zawsze siedzi w chrome: w studzience (`well`), w medalionie plakietki, w pillu, w tabie, w przycisku.
- Jedna baza stickerów. Brakuje czegoś we Fluent Flat → rysujemy 1 sticker w tym samym stylu. Nie dokładamy Twemoji / Noto / Icons8.
- Moneta H&D jest **własna** ([`lookdev/assets/hd-coin.svg`](lookdev/assets/hd-coin.svg): złoto + korona). Waluta to marka, nie emoji.
- 5 stickerów tabu to jedyny custom art, który warto zamówić wcześnie (są na ekranie zawsze). Do tego czasu: scroll · world-map · avatar bohatera · handshake · man-mage.

---

## 4. Komponenty

Nazwy = klasy w [`lookdev/components.css`](lookdev/components.css) = przyszłe komponenty w `apps/mobile/ui/`. Nowy ekran składa się **wyłącznie** z tych klocków. Potrzebujesz nowego? Najpierw dopisz go tu i do `kit-sheet`, potem używaj.

### Wspólne (każdy archetyp)

| Komponent | Anatomia | Reguły |
|-----------|----------|--------|
| `TabBar` | `canvas-hi`, górne rogi 28, 5 tabów: sticker 34 + label 12/800 biały | Aktywny = biała plama 60% + label `canvas-ink`. Identyczny na **każdym** tabie, także na World. Nigdy biały pasek, nigdy glify. |
| `Button.primary` | pill 58, `brand`, warga `brand-deep`, label 900/19 biały, opcjonalny sticker | Jeden na ekran. W aplikacji i na scenie. |
| `Button.flow` | pill 58, biały, warga `surface-3`, label `ink` | Tylko na celebracjach (C1: streak, level-up, nagroda). Pytania onboardingu (C2) mają `Button.primary`. |
| `Button.soft` | pill 50, `brand-soft`, warga jasna, label `brand-deep` (+ glyph) | Drugorzędna akcja **wewnątrz białej karty** („Open chronicles”). Nigdy na mgle, nigdy jako główna akcja. |
| `IconButton` | koło 44, biały, warga, glyph `brand` | Wariant `ghost` = sam biały glyph na mgle/malunku z cieniem (hamburger). |
| `CheckButton` | 56×52, r16, `surface-2`, warga, check `brand` | Tylko odhaczanie. Done = `success` + biały check. |
| `CurrencyPill` | pill 36, biały, sticker waluty 26 + liczba 900/16 | Zawsze w prawym górnym rogu, w kolejności gold → keys → avatar. |
| `Avatar` | koło, biała obwódka 3, twarz bohatera | Ten sam obraz w pasku konta, tabie Hero i pinie mapy. |
| `AccountBar` | Avatar 44 · imię 900/17 + „Lv n” · spacer · CurrencyPill ×2 · IconButton settings 40 | Góra archetypów A (bez winiety) i B. Nie na World. Tekst na mgle = biały z `shadow-on-canvas`. |
| `Portrait` | koło z białą obwódką 4 + **złoty pierścień z wargą**; wariant `xl` 196 na celebracjach (+ halo) | Profil Hero (84, z `edit` w rogu), celebracje (xl, z `medal-badge` stickerem albo `LvBadge`). |
| `LvBadge` | złoty pill 48, biała obwódka 4, warga `gold-deep`, „LV 5” 900 | Tylko na dole `Portrait`. Level-up i ewentualnie profil. |
| `Card` | biały, r28, `drop-sm` + delikatna warga | Wszystko, co jest „rzeczą” na mgle. |
| `PanelInset` | `canvas-deep`, r28 | Nagłówek sekcji z treścią *na* mgle (Crown Day). Nie do list. |
| `SectionHead` | glyph + tekst 900/21 biały z `shadow-on-canvas` + akcje po prawej | Nad listą/siatką na mgle. |
| `Caption` | 800/11 CAPS | Kicker nad nazwą, etykieta sekcji w karcie. |
| `Progress` | pill 26 biały, fill złoty z wargą, wartość 900/15 `ink` w środku | XP, dzień, cel. Nie do HP bossa (tam liczba albo `success/danger`). |
| `HabitRow` | Card 76–84: uchwyt · well 56 ze stickerem · tytuł 800/18 · nagroda · CheckButton | Wzorzec każdej listy z akcją. |
| `ItemTile` | kwadrat r18, ramka 3 px + warga w kolorze rarity, tło = rarity 16% na bieli | Item art w środku (70%). Ilość w prawym dolnym rogu. Do czasu item portraits: sticker Fluent jako placeholder. |
| `Slot` | kwadrat r14–16, `surface-2`, wewnętrzna obwódka `surface-3`; opcjonalnie duch przedmiotu (szary 35%) + kółko `add` | Pusty slot ekwipunku / plecaka. Pełny slot = `ItemTile`. |
| `EquipSlot` | ItemTile/Slot 112 + nazwa 900/15 + Caption (typ · rarity) | Dokładnie 2 na Hero: Outfit i Relic ([`05`](../../05-rpg-progression.md)). |
| `SegmentedControl` | tor r18 + opcje r14 h38; aktywna = `brand` + warga | Na bieli: tor `surface-2`. Na mgle (`on-canvas`): tor `canvas-deep`, aktywna biała. Nie do poziomów miejsca (to `LevelNav`). |
| `Chip` | biały pill 34, glyph `brand` + tekst 800/13 + **wartość** 900 | Informacja, nie akcja (odświeżenie sklepu, filtr aktywny). |
| `StatHex` | SVG 200: 3 pierścienie `surface-3`, wypełnienie `brand` 28%, kropki. **Sticker 28** na wierzchołku, **8px luzu** od krawędzi radaru (nie na samej siatce). Hit 40. Tap → pigułka **pod wykresem** (nie na środku). Ponowny tap / tap w siatkę zamyka. | Kolejność osi = `HERO_HEX_STAT_AXIS_ORDER`. Skala = max bieżących wartości. Stickery: kit-sheet „Hero stat set”. |
| `Heatmap` | siatka 7 × 12 tyg., kafel r5; 5 poziomów `surface-2` → `success-deep`; dziś = złota obwódka | Chronicles. Legenda Less → More pod spodem. |

### Na malunku (archetyp D/E)

| Komponent | Anatomia | Reguły |
|-----------|----------|--------|
| `SceneHead` | pill min 56, biały, warga + `drop-on-art`; back w kółku `brand-soft`; kicker (miejsce-rodzic) + nazwa 900/18, do 2 linii | Zawsze lewy górny róg, pod status barem. Jeden back na ekran. Root (mapa) = bez back. Długa nazwa nie dostaje ellipsy. |
| `Nameplate` | pill 46: medalion ze stickerem + **jedna** nazwa 900/16 → ogonek → kotwica (biała kropka, pierścień `brand`) | Kotwica stoi **dokładnie** na landmarku. Max 4 na ekran. Jedna nazwa miejsca (Tavern, Palace, House). Bez podtytułu: ani bossa, ani „cleared”, ani warunku. `featured` (złoty) = następny krok gracza, max 1. `locked` = glyph lock, `ink-2`. Powód zamknięcia = toast po tapie, nie druga linia. |
| `MapPin` | koło 46 ze **własnym** stickerem lokacji + ogonek; `current` = avatar 56 w złotym pierścieniu; `locked` = 36, `surface-3`, glyph lock | Bez nazw (lock 2026-09-22). Nazwa pojawia się w `PeekCard` po tapie. `current` = **kursor wyboru** (ten pin, który spikowałeś) — nie „tu mieszkasz”. Po tapie awatar skacze na wybrany pin, zanim gracz wciśnie Enter. |
| `PeekCard` | Card na dole nad tab barem: miniatura still 64 · kicker · nazwa 900/18 (do 2 linii) · meta · `Button.primary` compact („Enter”) | Jedna na raz. Tap w inny pin podmienia treść. Długa nazwa lokacji nie dostaje ellipsy. |
| `SceneCard` | Kompaktowa Card na dole sceny, nad tab barem. **Max ~150 px (≤ 18% ekranu).** | Wspólna baza dla `EncounterCard` i `AllyCard`. Szczegóły = tap → bottom sheet, nie wyższa karta. Postać na stillu musi być widoczna co najmniej do kolan. |
| `EncounterCard` | Rząd 1: nazwa 900/20 (do 2 linii) + tag BOSS · `win-pill` (72% WIN) po prawej. Rząd 2: 4 mini ItemTile (46) + `Button.primary` Fight wypełnia resztę | Tap w item → loot detail. Tap w win-pill → rozbicie szans. Fight zawsze w karcie, nigdy nad nią. Długa nazwa bossa nie dostaje ellipsy. |
| `AllyCard` | Rząd 1: imię 900/20 (do 2 linii) + tag ALLY · `RaiseChip` po prawej (sticker źródła + „Streak **7 / 10**”). `Track`: 3 węzły 34 (sticker nagrody) na złotym pasku, pod węzłem „LV n · próg” + nazwa nagrody. ~125 px. | Bez przycisku akcji, dopóki nie ma dialogu NPC (Talk = później, wraca w miejsce chipu, chip schodzi do sheetu). Węzeł: zrobiony = zielony pierścień + check; następny = złoty + poświata; zamknięty = kłódka. Napis pod węzłem ma 12 px luzu, żeby nie wchodził w pierścień. Pasek = postęp do **następnego** poziomu. Źródło wzrostu zawsze widoczne w chipie. |
| `LevelNav` | Pionowy biały pill 56: strzałka ▲ (koło 44, `brand`, warga) · kropki głębokości (tu = złota) · strzałka ▼ | Prawy górny róg; jedyna kontrolka po tej stronie. Otwarty poziom = strzałka. Zamknięty = **kłódka** (`surface-3`), tap = toast z warunkiem. Brak poziomu w tę stronę = brak przycisku. Nazwa bieżącego poziomu siedzi w `SceneHead` (kicker = miejsce, nazwa = piętro). Przytrzymanie strzałki **nie** pokazuje nazwy. Swipe góra/dół = skrót do tego samego, przejście = pionowy slajd kamery. |
| `Seam` | gradient `canvas` 0 → 100% | Na dole każdego malunku, który styka się z chrome. Winieta (A): na dole winiety, 100–140 px. |
| `Seam.dock` | zakotwiczony do dołu ekranu; pełna mgła **dokładnie** na górnej krawędzi tab bara, pod nim dalej mgła; `--fade` = widoczna mgła nad tab barem | Każda scena D i mapa E. Hub: fade ~90. Scena z kartą: fade ~60 (mgła tylko pod kartą, nie „poświata” nad nią). Rogi tab bara zawsze stoją na mgle, nigdy na malunku. |
| `ScrimTop` | gradient ciemnogranatowy 55% → 0, 150 px | Tylko na ciemnych/gęstych malunkach pod status barem. **Mapa: bez ScrimTop i bez górnej lawendowej poświaty.** Mgła wojny (shader, `canvas-hi`) zostaje. Dolny `Seam.dock` zostaje. |

### NPC mówi (A, C2)

| Komponent | Anatomia | Reguły |
|-----------|----------|--------|
| `SpeechBubble` | biała r22, warga + cień (`drop-on-art` na malunku, `drop-md` na mgle), Caption `brand` z rolą/imieniem, tekst 800/15 albo pytanie 900/21; ogonek `tail-left` / `tail-down-left` | Ogonek zawsze wskazuje mówiącego. Max 3 linie. Na winiecie stoi w spokojnym miejscu obok twarzy, nigdy na niej. |
| `NpcAsk` | twarz NPC 72 w białym kole + `SpeechBubble tail-left` | Każde pytanie onboardingu zadaje postać świata, nie formularz ([`15`](../../15-onboarding-arrival.md): „każdy krok = scena w świecie”). |

### Sklep (A)

| Komponent | Anatomia | Reguły |
|-----------|----------|--------|
| `ShopTile` | Card r20: ItemTile · nazwa 800/13 (1 linia) · `Price` | Siatka 3 kolumny, max 6 SKU (ekonomia `06` §7). Tap = bottom sheet z opisem i `Button.primary` „Buy”. |
| `Price` | pill 28 `gold-soft`, moneta 20 + liczba 900/15 | Za mało złota = liczba `danger`. Wyprzedane = szary item + „Sold out”. |
| `ShopTile.featured` | złota obwódka z wargą + `corner` („This week”) | Max 1 na sklep. To rotacja tygodnia, nie reklama. |
| Nagłówek katalogu | `SegmentedControl.on-canvas` (Buy / Sell loot) + `Chip` odświeżenia | Sprzedaż loot = druga zakładka tego samego ekranu. |

### Flow (C1 celebracja, C2 pytanie)

| Komponent | Anatomia | Reguły |
|-----------|----------|--------|
| `FlowBackdrop` | radial mgły (jaśniej w centrum) + `Rays` (stożki bieli 20%, maska radialna) + 4–6 `Spark` | Tylko C1. Wariant `gold` (złote promienie, złoty środek) = level-up i awanse. Streak/nagroda = białe. |
| `HeroNum` + `FlowTitle` | liczba 900/104 z twardym cieniem `canvas-ink` + tytuł Display CAPS | Jedna liczba na ekran. Tytuł max 2 słowa. |
| `StreakWeek` | Card: 7 dni (Caption), węzły 36 na linii; zrobione = `brand` + check; dziś = biały 44 ze złotym pierścieniem + sticker korony; przyszłe = `surface-3` | Linia wypełnia się do dziś. Korona = Crown Streak (ta sama co Crown Day na Home). |
| `RewardRow` | 3 kolumny: ItemTile 72–84 + wartość 900/14 + Caption typu | Max 3 nagrody + 1 wiersz „+1 path point” (`gold-soft`). Więcej = „and 2 more” w sheecie. |
| `StepBar` | IconButton back 40 · tor 14 (`canvas-ink` 38%) z białym wypełnieniem · „4 / 12” | Góra każdego pytania C2. Liczba kroków jest zawsze widoczna. |
| `ChoiceRow` | Card r22 h68: well 48 ze stickerem · tytuł 800/17 + podpis · kółko wyboru | Jeden wybór. Wybrany = `brand-soft` + obwódka `brand` z wargą + check. Max 5–6 na ekran. |
| `ChoiceTile` | Card r22, siatka 2 kol.: well 50 · tytuł 900/16 · meta (czas) · kółko w rogu | Wielokrotny wybór; limit pokazany nad siatką („3 / 3”). Max 6 na ekran. |

---

## 5. Archetypy ekranów

Każdy ekran aplikacji jest jednym z pięciu (C ma dwa warianty). Zanim agent narysuje ekran, **nazywa archetyp**.

```text
A · SHEET + WINIETA          B · STOS KART             C1 · CELEBRACJA     C2 · PYTANIE
┌──────────────┐             ┌──────────────┐          ┌──────────────┐    ┌──────────────┐
│ status  pills│             │ account bar  │          │ (mgła +      │    │[<] ━━━━ 4/12 │
│   MALUNEK    │  ~45%       │ ┌──────────┐ │          │  promienie)  │    │(NPC)[dymek   │
│  (NPC+dymek) │             │ │  karta   │ │          │  (PORTRET)   │    │     pytanie] │
│ ░░░szew░░░░░ │             │ └──────────┘ │          │      7       │    │ podpowiedź   │
│ [seg] [chip] │             │ section head │          │  DAY STREAK  │    │ [wybór     ] │
│ [karta]      │             │ ┌──────────┐ │          │ ┌──────────┐ │    │ [wybór  ✓  ] │
│ [karta]      │             │ │  karta   │ │          │ │  karta   │ │    │ [wybór     ] │
│ ═══ tab bar ═│             │ ═══ tab bar ═│          │ (btn flow)   │    │ (btn primary)│
└──────────────┘             └──────────────┘          └──────────────┘    └──────────────┘
Questy, Sklep, NPC-sklep,    Hero, Social, Settings,   streak, level-up,   onboarding
Mentor wejście               Chronicles, Inventory     nagroda, awans      (10–15 pytań)

D · SCENA (still full-bleed)                E · MAPA
┌──────────────┐  ┌──────────────┐          ┌──────────────┐
│[scene head]  │  │[head]    [▲] │          │  (plansza    │
│   ⬭ plate    │  │          [•] │          │[head]  🔒    │
│      │       │  │    BOSS  [▼] │          │     ⚔  🔒    │
│  ⬭   •  ⬭    │  │   / NPC      │          │     (avatar) │
│  •       •   │  │              │          │┌────────────┐│
│░░░░szew░░░░░░│  │░░░░szew░░░░░░│          ││ peek card  ││
│═══ tab bar ══│  │[scene card ] │          │└────────────┘│
└──────────────┘  │═══ tab bar ══│          │═══ tab bar ══│
 hub / lokacja     └──────────────┘          └──────────────┘
                   encounter / NPC (karta ≤ 18%)
```

| Archetyp | Zasada kompozycji | Ekrany (z [`19`](../../19-screen-inventory.md)) |
|----------|-------------------|--------------------------------------------------|
| **A · Sheet + winieta** | Malunek zajmuje górne ~40–45%, rozpuszcza się w mgłę; pierwsza karta/panel **zachodzi** na szew. Na winiecie: account bar (Questy) albo back + pills (drill, np. sklep). Jeśli na winiecie jest NPC, mówi `SpeechBubble` obok twarzy. | S03/S04 Questy (dom), S13 Sklep ([golden](golden/shop.png)), sprzedawcy NPC, wejście Mentora |
| **B · Stos kart** | Mgła z jaśniejszą górą. Account bar, potem karty jedna pod drugą, sekcje z `SectionHead`. Ekran przewija się; tab bar stoi. Golden renderuje pełny scroll. | S12 Hero ([golden](golden/hero.png)), Social, Settings, Chronicles, Inventory, kalendarz |
| **C1 · Celebracja** | Pełny ekran bez tab bara. `FlowBackdrop` + jeden bohater kadru (`Portrait.xl` albo obiekt) + `HeroNum`/`FlowTitle` + jedna karta informacji + `Button.flow`. Karta mówi, **co to daje dalej** (np. „3 dni do Iron blade”). | Streak ([golden](golden/flow-streak.png)), level-up ([golden](golden/flow-levelup.png)), S05 nagroda, awans stolicy, S10 powrót wyprawy, loot reveal |
| **C2 · Pytanie** | Pełny ekran bez tab bara. Góra: przyciemniony kadr świata rozpuszczony w mgłę. `StepBar` → `NpcAsk` (pytanie w dymku) → podpowiedź → `ChoiceRow` albo `ChoiceTile` → `Button.primary`. **Jedno pytanie na ekran.** | S01–S02 onboarding ([lista](golden/onboarding-choice.png), [siatka](golden/onboarding-pick.png)), późniejsze pytania Mentora |
| **D · Scena** | Still do krawędzi. Chrome tylko w 4 miejscach: lewy górny (SceneHead), prawy górny (LevelNav, jeśli miejsce ma poziomy), plakietki na landmarkach, dół (kompaktowa SceneCard albo nic). Bez account bara. Postać jest bohaterem kadru; UI zajmuje max ~18% wysokości na dole. | S07 hub/lokacja, S14 kuźnia (AllyCard), S16/S15/S18 encounter (EncounterCard), stragan/doradca |
| **E · Mapa** | Plansza **fit-width** (szerokość = jeden ekran). Wysokość = **pasek** ~5× (graybox 390×1920) — pan tylko góra–dół, spawn na dole (Crownhaven). Piny rzędy środek-albo-para. **Całe królestwo widać** — fog of war **nie** jest chrome (LOCK 2026-10-06). Piny: sticker / kłódka (unlock = **level**) / current. PeekCard na dole. Bez górnej poświaty. Bez account bara. Bez pinch. | S06 mapa królestwa |

Modal (S09 start wyprawy, loot detail) = **bottom sheet**: biały, górne rogi 28, uchwyt, przyciemnienie `ink` 40% pod spodem. Wewnątrz te same komponenty.

---

## 6. UI na malunku — reguły World

Tu poprzednie próby się sypały. Każdy wiersz to jedna wpadka i reguła, która ją zamyka.

| Co było źle (stare kompozyty) | Reguła |
|-------------------------------|--------|
| Szklane (88%) pastylki bez głębi „pływały” nad obrazem jak tooltipy z przeglądarki | **Nieprzezroczysta biel + warga + `drop-on-art`.** Chrome na malunku ma być *obiektem*, który rzuca cień na świat. |
| Plakietki nie wskazywały niczego, stały „gdzieś obok” | **Ogonek + kotwica na landmarku.** Gracz widzi, *co* kliknie. Kotwica pulsuje delikatnie. |
| Fioletowe glify mono w plakietkach i w lootach | **Sticker w medalionie** (plakietki), **item art w ramce rarity** (łup). |
| Biały płaski tab bar i obraz ucięty twardą krawędzią | **Ten sam tab bar co Home + szew.** To dwie rzeczy, które mówią „to ta sama apka”. |
| Fight nachodził na tray, tray leżał na nogach bossa | **Strefy.** Dolna karta wyrasta z szwu i ma w sobie całą akcję (kto → szanse → łup → Fight) w dwóch rzędach. Nic nie wisi między kartą a malunkiem. |
| Karta bossa (v1 tej biblii) zasłaniała ~⅓ kadru | **SceneCard ≤ 18% ekranu.** Szczegóły schodzą do bottom sheetu po tapie. Boss/NPC widoczny do kolan. |
| Winda z etykietami (Upper/Ground/Cellar) jak menu z przeglądarki | **LevelNav: strzałki + kłódka.** Gdzie jestem mówi SceneHead; strzałki tylko przenoszą. |
| Niebieska „poświata” za dolną kartą: szew 150 px wystawał nad kartę, a kończył się 2 px nad tab barem, więc w jego zaokrąglonych rogach prześwitywał malunek | **`Seam.dock`.** Pełna mgła dokładnie na krawędzi tab bara, pod nim dalej mgła; nad kartą tylko ~60 px. |

Dodatkowo:

- **Rozmieszczenie plakietek:** plakietka nad kotwicą, w najspokojniejszym miejscu obok landmarku (niebo, ściana, markiza). Nie na twarzy postaci. Min. 12 px od SceneHead i krawędzi ekranu.
- **Hierarchia:** featured (złoty) → zwykłe → locked. Gracz w 0,5 s widzi, dokąd iść dalej.
- **Status bar:** biały na ciemnym malunku (z `ScrimTop`), `ink` na mapie (malunek pod status barem, bez wash).
- **Mgła wojny = `canvas-hi`.** Nieznane jest z tej samej mgły co interfejs. To najmocniejszy most między światem a UI; nie zmieniać na szarość/czerń.

---

## 7. Brief dla grafiki (dopisz do SCENE)

UI jest tak dobre, jak still pod nim. Każdy nowy still z [`../art/style-kit.md`](../art/style-kit.md) dostaje w SCENE blok stref zależnie od archetypu:

```text
UI SAFE ZONES (do not paint UI, keep these calm):
- Top 14%: sky / ceiling / plain wall — header sits here. No faces, no key props.
- Bottom [12% for hub | 30% for encounter or NPC]: simple floor (cobbles, planks, sand). Will fade into UI mist.
- Next to each hotspot: one calm area (sky, wall, awning) about 30% of screen width for a name label.
- Top-right corner (about 16% width x 25% height): nothing important — level arrows sit here.
- Focal character (boss / NPC) upper-middle: head between 20% and 40% of height, knees above 72%.
- Cool ambient light at the edges is welcome (dusk blue, window light); the UI is periwinkle.
```

Winieta sklepu / NPC (archetyp A) zamiast tego:

```text
UI SAFE ZONES (vignette, top ~42% of the phone):
- Character on the LEFT half, waist-up, looking at camera. Face between 15% and 30% of vignette height.
- RIGHT half upper area calm (wall, sky, shelf) about 50% width x 35% height: speech bubble sits here.
- Top 12%: calm, back button and currency pills sit here.
- Bottom 30% of the vignette: counter / props only. It fades into UI mist.
```

Stille, które już są (Crownhaven, Gutterjack, Torrik), mieszczą się w tych strefach wystarczająco. Winieta sklepu na goldenie **zostaje wycinkiem z Crownhaven** do czasu dedykowanego kadru babki ([`../art/prompt-vendor-shop.md`](../art/prompt-vendor-shop.md)) — nie blokuje portu sklepu. Nowe kadry, gdy przyjdą, generujemy już z tym blokiem.

---

## 8. Jak zlecać ekran agentowi

Wklej to (uzupełnij nawiasy):

```text
Build screen [NAZWA] for Habits & Dragons.
1. Read docs/reference/ui/design-bible.md and look at every PNG in docs/reference/ui/golden/.
2. Archetype: [A | B | C1 | C2 | D | E]. Closest golden: [plik].
3. Use only components from section 4 and tokens from lookdev/tokens.css. No new colors, radii, shadows, fonts, or icon sets.
4. Content: [co jest na ekranie, w kolejności ważności]. Primary action: [jedna].
5. Before code: build lookdev/[nazwa].html from the same CSS, render with lookdev/render.ps1, and compare side by side with the closest golden.
6. Run the gate (section 9). Show me the PNG. Only then implement in apps/mobile.
```

Nowy komponent = osobne zlecenie: dopisz do sekcji 4, dodaj do `kit-sheet.html`, wyrenderuj, dopiero potem użyj.

Nowe pytanie onboardingu = tylko treść: kopia `onboarding-choice.html` (jeden wybór) albo `onboarding-pick.html` (kilka), zmienia się licznik kroku, tekst w dymku, 4–6 opcji ze stickerami. Layout się nie zmienia.

---

## 9. Gate — odrzuć ekran, jeśli

- [ ] Położony obok goldenów wygląda jak inna aplikacja (miniatura, 2 sekundy)
- [ ] Tło inne niż `canvas` / malunek / szew
- [ ] Jest kolor, promień, cień albo font spoza tokenów
- [ ] Coś wciskalnego nie ma wargi; coś jest półprzezroczystym szkłem
- [ ] Glyph mono oznacza treść albo stoi sam na malunku
- [ ] Sticker bez białej obwódki albo z innej paczki
- [ ] Więcej niż jeden `btn-primary`
- [ ] Tab bar inny niż w goldenach
- [ ] Malunek kończy się twardą krawędzią przy chrome (brak szwu)
- [ ] Plakietka bez kotwicy albo na twarzy; > 4 plakietek; > 1 featured
- [ ] Element nachodzi na inny (Fight na trayu, plakietka na headerze)
- [ ] Na scenie dolna karta wyższa niż ~18% ekranu albo zasłania postać powyżej kolan
- [ ] Poziomy miejsca jako lista/menu z etykietami zamiast LevelNav
- [ ] HUD/ikony namalowane w stillu
- [ ] W rogach tab bara widać malunek albo mgła wystaje wysoko nad dolną kartę (szew nie jest `dock`)
- [ ] Pytanie onboardingu bez NPC (goły formularz) albo więcej niż jedno pytanie na ekran
- [ ] Celebracja bez informacji „co to daje dalej” albo z więcej niż 3 nagrodami w rzędzie
- [ ] Ramka rarity na walucie albo nazwy rarity spoza 4 tierów

---

## 10. Most do kodu (gdy padnie „implementuj”)

```text
apps/mobile/ui/
  tokens.ts        ← 1:1 z lookdev/tokens.css (te same nazwy)
  Sticker.tsx      ← Fluent Flat SVG + biała obwódka (shadow/outline w RN)
  Glyph.tsx        ← MingCute Fill
  Button (primary/flow/soft), IconButton, CheckButton, CurrencyPill, Avatar,
  AccountBar, Portrait, LvBadge, Card, PanelInset, SectionHead, Progress,
  ItemTile, Slot, EquipSlot, SegmentedControl, Chip, StatHex, Heatmap, TabBar,
  SceneHead, Nameplate, MapPin, PeekCard, SceneCard (EncounterCard, AllyCard),
  LevelNav, Seam (+dock), SpeechBubble, NpcAsk, ShopTile, Price,
  FlowBackdrop, StreakWeek, RewardRow, StepBar, ChoiceRow, ChoiceTile
```

Domeny (`habits`, `world`, `hero`) składają ekrany z tych klocków; nie definiują własnych kolorów. Font: `@expo-google-fonts/nunito` (700/800/900). Obecne `constants/colors.ts` (ciemny V1) i Lucide wychodzą przy porcie ekranu, nie wcześniej.

---

## 11. Decyzje

| Data | Decyzja | Dlaczego |
|------|---------|----------|
| 2026-09-24 | Kolor chrome = **periwinkle z mocków** (`#91A2F2`), nie „lilac shift” | Poprzedni lookdev przesunął hue na bladą lawendę i biel, przez co World przestał wyglądać jak Home. Mocki są źródłem, nie punktem wyjścia do dryfu. |
| 2026-09-24 | **Nieprzezroczysta biel + warga** zamiast szkła 88% | Szkło na gęstej kresce czyta się jak tooltip przeglądarki. Warga = gra. |
| 2026-09-24 | **Sticker** (Fluent Flat + die-cut) jako język ikon treści; MingCute Fill **tylko** system | Mocki używają kolorowych naklejek. Mono-glify w plakietkach były główną przyczyną „SaaS-owego” World. |
| 2026-09-24 | **Szew (seam)** obowiązkowy między malunkiem a chrome | Łączy World z Home tym samym gestem co winieta. |
| 2026-09-24 | **Mgła wojny = `canvas-hi`** | Nieznane i interfejs z tej samej mgły; najmocniejszy most świat ↔ UI. |
| 2026-09-24 | Nameplate = **ogonek + kotwica** na landmarku | Gracz musi widzieć, *co* klika. |
| 2026-09-24 | Nameplate = **jedna nazwa** | Founder: podtytuł (boss, „inside”, „cleared”, warunek) zlewa się z nazwą i nie jest potrzebny. Powód kłódki zostaje w toaście. |
| 2026-09-24 (v2.3) | Mapa: tap pinu → **PeekCard** z „Enter” | **LOCK** founder. Piny zostają bez nazw (lock 09-22); nazwa i akcja mają swój dom. Szept po tapie = superseded. |
| 2026-09-24 | Gutterjack: win chance i łup **w EncounterCard**, nie w rogu | Jedna strefa decyzji: kto, ile szans, co wypadnie, Fight. |
| 2026-09-24 (v2.1, potwierdzone v2.3) | **LevelNav** (strzałki ▲▼ + kłódka + kropki głębokości) zastępuje windę z etykietami | Lookdev (`world-gutterjack`, hub) = najnowsza wersja. Winda = menu, strzałki = gra. Nazwę piętra niesie SceneHead. Przytrzymanie strzałki nie pokazuje nazwy (LOCK founder). Unieważnia lock „labeled lift” z `18` (2026-09-21). Kod `FloorLift` = stary playground, do wymiany przy porcie. |
| 2026-09-24 (v2.1) | **SceneCard ≤ 18% ekranu**; EncounterCard w 2 rzędach | Karta v1 zasłaniała ~⅓ bossa. Boss/NPC to bohater kadru. |
| 2026-09-24 (v2.1) | **AllyCard**: 3 poziomy z nagrodami + „grows with” + licznik | Affinity 1/2/3 (`17`, `25`) musi pokazywać cel i drogę na jednym rzucie oka. Treść nagród i stat wzrostu na goldenie = placeholder. |
| 2026-09-24 | Bohater w UI = postać z [`mage.png`](../../../apps/mobile/assets/images/mage.png) (kreska świata) | Mocki mają miękki styl postaci spoza style-kitu. Chrome bierzemy z mocków, postacie z kreski świata. |
| 2026-09-24 (v2.2) | **`Seam.dock`** na każdej scenie i mapie | Founder: niebieska poświata za kartą była za długa i nie zgrywała się z tab barem (puste rogi). Mgła kończy się na krawędzi tab bara. |
| 2026-09-24 (v2.2) | **AllyCard bez Talk**; źródło wzrostu w chipie w 1. rzędzie; karta ~125 px (było ~177) | Founder: Talk nie ma funkcji; NPC ma być lepiej widoczny. Talk wraca, gdy powstanie dialog NPC. |
| 2026-09-24 (v2.2) | Torrik rośnie od **globalnego streaka** (5 / 10 / 20 dni) | Zgodnie z [`06`](../../06-economy-loot.md) §9. Streak i affinity kowala spięte także na ekranie streaka („3 dni do Iron blade”). |
| 2026-09-24 (v2.2) | Rarity w tokenach = **common / unique / heroic / artifact** | Nazwy z ekonomii (`06` §10), nie z MMO (rare/epic/legendary). |
| 2026-09-24 (v2.3) | **Sklep = archetyp A**: winieta z babką + dymek, pod spodem katalog 3 kol. (max 6 SKU), **Buy / Sell loot jako zakładki** | **LOCK** founder. Golden [`shop.png`](golden/shop.png). Gniazda SKU na stillu i dolny pasek sprzedaży = superseded. Winieta na razie = wycinek Crownhaven; dedykowany kadr babki = later. |
| 2026-09-24 (v2.2) | **C dzieli się na C1 celebrację i C2 pytanie** | Mocki onboardingu mają fioletowy primary i listę wyborów, streak ma biały flow i promienie. To dwa różne rytmy: nagroda vs decyzja. |
| 2026-09-24 (v2.2) | Pytania onboardingu **zadaje NPC** (stall keeper), jedno pytanie na ekran, `StepBar` z licznikiem | `15`: „każdy krok = scena w świecie”. 10–15 pytań znosi się, jeśli każde to jeden tap i widać koniec. |
| 2026-09-24 (v2.2) | Celebracje używają **`Portrait.xl`** (twarz z `mage.png`), nie postaci w całości | Nie ma jeszcze wyciętej postaci bohatera w pozie radości. Medalion działa z każdym avatarem. |
| 2026-09-24 (v2.2) | Hero: account bar → profil (XP + hex + Stats/Titles/Emotes) → Equipment (Outfit + Relic + plecak) → Chronicles (heatmapa 12 tyg.) | Mock `hero.png` + `05` (2 sloty, tytuły, emotki, hex 6 osi z kodu). Plecak 15 (5×3) = superseded 2026-09-25. |
| 2026-09-25 | **StatHex**: ikona na wierzchołku, nazwa+liczba w pigułce **pod wykresem** | Founder: etykiety obok osi nie mieszczą się; pigułka na środku zasłaniała radar. Lookdev `hero.html` + `ui/StatHex.tsx`. Golden `hero.png` = stale do re-renderu. |
| 2026-09-25 | **StatHex**: sticker **8px od krawędzi** radaru | Founder: ikony nachodziły na siatkę. `ICON_GAP` w `ui/StatHex.tsx` + te same offsety w lookdev. |
| 2026-09-25 | Hero inventory = **4×4 (16 slotów)**, większe kafelki | Founder: 5 w rzędzie było za ciasno. Lookdev `hero.html` + `BackpackInventoryBody`. |
| 2026-09-25 | Mapa: **bez górnej lawendowej poświaty**; kamera **fit-width**, pan tylko pion; `MapPin.current` = wybrany pin | Founder: wash od status bara zasłaniał malunek; zoom 1.85× psuł spawn i pozwalał na pan w bok. Awatar to kursor wyboru, nie znacznik domu. |
| 2026-09-25 | Mapa produkt = **pasek 390×1920**, B=200, Crownhaven na **dole**, Vampire skrzydło+rezerwa | Fit-width na 9:16 zabił scroll. Kwadrat 4:5 / hub w środku / pinch = superseded. Graybox: `world-map-gray`. Biblia: [`24`](../../24-map-production.md). |
| 2026-09-25 | Długie nazwy **łamią się / ściskają**, nie `…` | Founder: „quests left today”, PeekCard lokacji, karty bossa/NPC obcinały tekst. SectionHead zostaje 900/21; PeekCard/SceneHead 900/18; Encounter/Ally 900/20; max 2 linie. |

**Odrzucone wcześniej (nie wracać):** neonowe/cyanowe markery z mocków ChatGPT World · Lucide i cienkie outline (Tabler, Feather, Heroicons) · kółka-naklejki z ikonami leżące na malunku · HUD, ikony lub przyciski namalowane w stillu · ciemny fiolet V1 (`#0d0a14`) jako tło tabów · Phosphor / Solar / Iconsax jako paczka ikon · mieszanie paczek („bo zabrakło kufelka”) · Lordicon / animowane naklejki na stillu · szklane pastylki 88% i biały płaski tab bar (kompozyty z 2026-09-24, usunięte po gate) · szept po tapie pinu · winda z etykietami pięter · nazwa piętra przy przytrzymaniu strzałki LevelNav · 6 gniazd SKU namalowanych na stillu straganu · dolny pasek „sprzedaj loot” · druga linia na nameplate (boss, cleared, warunek) · górna lawendowa poświata (`.fog` / `topFog`) na mapie · pan w lewo–prawo na mapie królestwa · pinch na mapie · kwadrat ~4:5 z hubem w środku · stretch obecnego korytarza 9:16 „żeby było wyżej” · trzy piny w jednym rzędzie · Vampire na trakcie (kręgosłupie) · ten sam sticker mieczy na wszystkich pinach.

---

## 12. Otwarte

- [ ] **Styl postaci w winietach:** kreska świata (jak `mage.png`, rekomendacja) czy miękki styl z mocków (Wayfarer)? Dwa style postaci w jednej grze = dryf.
- [ ] Custom 5 stickerów tabu (rekomendacja: tak, jako pierwszy zamówiony asset UI).
- [ ] Item portraits w kresce świata: pipeline i pierwsze 8 sztuk (monety, wino, mikstura, klejnot, …).
- [ ] Affinity pozostałych sojuszników (temat nawyków) i nagrody Lv 1/2/3 Torrika (Repairs / Iron blade / Masterwork = placeholder) — treść do `17`/`23`.
- [ ] Talk / dialog NPC: kiedy i co robi. Do tego czasu AllyCard bez przycisku.
- [ ] Onboarding: lista 10–15 pytań (treść, kolejność, co wolno pominąć) i gdzie wpada cinematic isekai — do `15`. Golden = tylko wzór karty.
- [ ] Art later: dedykowana winieta straganu ([`prompt-vendor-shop.md`](../art/prompt-vendor-shop.md)); na razie wycinek Crownhaven. Wycięta postać bohatera w pozie radości do C1.
- [ ] Level-up: „+1 path point” — potwierdzić z `05`/`17` (drogi są later).
- [ ] Dark mode: nie planujemy (mgła jest tożsamością). Potwierdzić.

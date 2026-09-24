# UI Bible — Habits & Dragons

> **Status:** LOCK v2.1 · 2026-09-24 (LevelNav, kompaktowa SceneCard, AllyCard). Jedyne źródło prawdy dla wyglądu *chrome* (wszystko, co nie jest malunkiem świata).  
> **Zastępuje:** [`kit.md`](kit.md) w sprawach wyglądu (tamten zostaje jako log decyzji).  
> **Kreska świata** (stille, mapa, postacie) nadal: [`../art/style-kit.md`](../art/style-kit.md).

Ten plik ma trzy warstwy. Czytaj w tej kolejności:

1. **Obrazy** — [`golden/`](golden/) (renderowane wzorce). Najpierw patrzysz, potem czytasz.
2. **Reguły** — ten plik.
3. **Wartości** — [`lookdev/tokens.css`](lookdev/tokens.css) + [`lookdev/components.css`](lookdev/components.css). Liczby są tylko tam; w kodzie RN mają się nazywać tak samo.

| Golden | Archetyp | Co pokazuje |
|--------|----------|-------------|
| [`home-quests.png`](golden/home-quests.png) | A · Sheet + winieta | Karty na mgle, pills, habit row, tab bar |
| [`world-map.png`](golden/world-map.png) | E · Mapa | Piny, mgła wojny = mgła UI, peek card |
| [`world-crownhaven.png`](golden/world-crownhaven.png) | D · Scena (hub) | Nameplate'y na malunku, scene head, szew |
| [`world-gutterjack.png`](golden/world-gutterjack.png) | D · Scena (encounter) | LevelNav (strzałki), kompaktowa karta bossa: szanse, łup, Fight |
| [`world-npc-torrik.png`](golden/world-npc-torrik.png) | D · Scena (NPC sojusznik) | Karta sojusznika: 3 poziomy, co odblokowują, za co rośnie, Talk |
| [`kit-sheet.png`](golden/kit-sheet.png) | — | Wszystkie komponenty i tokeny na jednej planszy |

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
| `canvas` | `#91A2F2` | Tło aplikacji, szew, mgła wojny |
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
| `r-common/rare/epic/legendary` | `#C9CEE6` `#5AA7F5` `#A56BF5` `#FDB43C` | **Tylko** ramki itemów |

**Typografia:** tylko **Nunito** (Google Fonts, OFL). Display 900/44 · H1 900/24 · H2 800/20 · Body 700/16 · Label 800/14 · Caption 800/11 CAPS +8% tracking. Waga poniżej 700 nie istnieje.

**Promienie:** 10 · 14 · 20 · 28 · pill. Karta = 28. Kafel/slot = 14–18. Przycisk = pill.

**Odstępy:** siatka 4 pt. Margines ekranu 16. Przerwa między kartami 10. Wnętrze karty 14–18.

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
| `Button.flow` | pill 58, biały, warga `surface-3`, label `ink` | Tylko na pełnoekranowych flow na mgle (onboarding, streak, level-up). |
| `IconButton` | koło 44, biały, warga, glyph `brand` | Wariant `ghost` = sam biały glyph na mgle/malunku z cieniem (hamburger). |
| `CheckButton` | 56×52, r16, `surface-2`, warga, check `brand` | Tylko odhaczanie. Done = `success` + biały check. |
| `CurrencyPill` | pill 36, biały, sticker waluty 26 + liczba 900/16 | Zawsze w prawym górnym rogu, w kolejności gold → keys → avatar. |
| `Avatar` | koło, biała obwódka 3, twarz bohatera | Ten sam obraz w pasku konta, tabie Hero i pinie mapy. |
| `Card` | biały, r28, `drop-sm` + delikatna warga | Wszystko, co jest „rzeczą” na mgle. |
| `PanelInset` | `canvas-deep`, r28 | Nagłówek sekcji z treścią *na* mgle (Crown Day). Nie do list. |
| `SectionHead` | glyph + tekst 900/21 biały z `shadow-on-canvas` + akcje po prawej | Nad listą/siatką na mgle. |
| `Caption` | 800/11 CAPS | Kicker nad nazwą, etykieta sekcji w karcie. |
| `Progress` | pill 26 biały, fill złoty z wargą, wartość 900/15 `ink` w środku | XP, dzień, cel. Nie do HP bossa (tam liczba albo `success/danger`). |
| `HabitRow` | Card 76–84: uchwyt · well 56 ze stickerem · tytuł 800/18 · nagroda · CheckButton | Wzorzec każdej listy z akcją. |
| `ItemTile` | kwadrat r18, ramka 3 px + warga w kolorze rarity, tło = rarity 16% na bieli | Item art w środku (70%). Ilość w prawym dolnym rogu. |
| `SegmentedControl` | biała karta r22, opcje r16; aktywna = `brand` + warga | Poziomo (Stats/Overview, filtry). Nie do poziomów miejsca (to `LevelNav`). Locked = glyph lock + `ink-3`. |

### Na malunku (archetyp D/E)

| Komponent | Anatomia | Reguły |
|-----------|----------|--------|
| `SceneHead` | pill 56, biały, warga + `drop-on-art`; back w kółku `brand-soft`; kicker (miejsce-rodzic) + nazwa 900/20 | Zawsze lewy górny róg, pod status barem. Jeden back na ekran. Root (mapa) = bez back. |
| `Nameplate` | pill 46: medalion ze stickerem + nazwa 900/16 (+ `sub` CAPS) → ogonek → kotwica (biała kropka, pierścień `brand`) | Kotwica stoi **dokładnie** na landmarku. Max 4 na ekran. Wariant `featured` (złoty) = następny krok gracza, max 1. `locked` = glyph lock, `ink-2`, powód w `sub`. |
| `MapPin` | koło 46 ze stickerem + ogonek; `current` = avatar 56 w złotym pierścieniu; `locked` = 36, `surface-3`, glyph lock | Bez nazw (lock 2026-09-22). Nazwa pojawia się w `PeekCard` po tapie. |
| `PeekCard` | Card na dole nad tab barem: miniatura still 64 · kicker · nazwa · meta · `Button.primary` („Enter”) | Jedna na raz. Tap w inny pin podmienia treść. |
| `SceneCard` | Kompaktowa Card na dole sceny, nad tab barem. **Max ~150 px (≤ 18% ekranu).** | Wspólna baza dla `EncounterCard` i `AllyCard`. Szczegóły = tap → bottom sheet, nie wyższa karta. Postać na stillu musi być widoczna co najmniej do kolan. |
| `EncounterCard` | Rząd 1: nazwa 900/22 + tag BOSS · `win-pill` (72% WIN) po prawej. Rząd 2: 4 mini ItemTile (46) + `Button.primary` Fight wypełnia resztę | Tap w item → loot detail. Tap w win-pill → rozbicie szans. Fight zawsze w karcie, nigdy nad nią. |
| `AllyCard` | Rząd 1: imię + tag ALLY · mały primary („Talk”). `Track`: 3 węzły poziomów (sticker nagrody) na złotym pasku postępu, pod węzłem „LV n” + nazwa nagrody. `Raise`: sticker + „Grows with **X** quests” + licznik `3 / 5` | Węzeł: zrobiony = zielony pierścień + check; następny = złoty pierścień + poświata; zamknięty = kłódka. Pasek liczy postęp do **następnego** poziomu. Zawsze widać, za co rośnie. |
| `LevelNav` | Pionowy biały pill 56: strzałka ▲ (koło 44, `brand`, warga) · kropki głębokości (tu = złota) · strzałka ▼ | Prawy górny róg; jedyna kontrolka po tej stronie. Otwarty poziom = strzałka. Zamknięty = **kłódka** (`surface-3`), tap = toast z warunkiem. Brak poziomu w tę stronę = brak przycisku. Nazwa bieżącego poziomu siedzi w `SceneHead` (kicker = miejsce, nazwa = piętro). Swipe góra/dół = skrót do tego samego, przejście = pionowy slajd kamery. |
| `Seam` | gradient `canvas` 0 → 100% | Na dole każdego malunku, który styka się z chrome. Wysokość 90–220 px zależnie od archetypu. |
| `ScrimTop` | gradient ciemnogranatowy 55% → 0, 150 px | Tylko na ciemnych/gęstych malunkach pod status barem. Na mapie zamiast niego mgła. |

---

## 5. Archetypy ekranów

Każdy ekran aplikacji jest jednym z pięciu. Zanim agent narysuje ekran, **nazywa archetyp**.

```text
A · SHEET + WINIETA          B · STOS KART             C · FLOW / CELEBKA
┌──────────────┐             ┌──────────────┐          ┌──────────────┐
│ status  pills│             │ account bar  │          │   (mgła +    │
│   MALUNEK    │  ~45%       │ ┌──────────┐ │          │  promienie)  │
│ ░░░szew░░░░░ │             │ │  karta   │ │          │   POSTAĆ     │
│ [panel inset]│             │ └──────────┘ │          │  DISPLAY 44  │
│ section head │             │ section head │          │ ┌──────────┐ │
│ [karta]      │             │ ┌──────────┐ │          │ │  karta   │ │
│ [karta]      │             │ │  karta   │ │          │ └──────────┘ │
│ ═══ tab bar ═│             │ ═══ tab bar ═│          │ (btn flow)   │
└──────────────┘             └──────────────┘          └──────────────┘
Questy, Sklep, NPC-sklep,    Hero, Social, Settings,   Onboarding, streak,
Mentor wejście               Chronicles, Inventory     level-up, loot reveal,
                                                       awans stolicy

D · SCENA (still full-bleed)                E · MAPA
┌──────────────┐  ┌──────────────┐          ┌──────────────┐
│[scene head]  │  │[head]    [▲] │          │░░ mgła wojny░│
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
| **A · Sheet + winieta** | Malunek zajmuje górne ~45%, rozpuszcza się w mgłę; pierwsza karta/panel **zachodzi** na szew. Account bar na malunku. | S03/S04 Questy (dom), S13 Sklep, sprzedawcy NPC, wejście Mentora |
| **B · Stos kart** | Sama mgła (opcjonalnie niebo/zamek na górze jako dekor). Karty jedna pod drugą, sekcje z `Caption`. | S12 Hero, Social, Settings, Chronicles, Inventory, kalendarz |
| **C · Flow / celebka** | Pełny ekran bez tab bara. Mgła + promienie + jedna postać/obiekt. Display 44. Jedna karta informacji. `Button.flow` na dole. | S01–S02 onboarding, S05 nagroda, streak, level-up, awans stolicy, S10 powrót wyprawy |
| **D · Scena** | Still do krawędzi. Chrome tylko w 4 miejscach: lewy górny (SceneHead), prawy górny (LevelNav, jeśli miejsce ma poziomy), plakietki na landmarkach, dół (kompaktowa SceneCard albo nic). Bez account bara. Postać jest bohaterem kadru; UI zajmuje max ~18% wysokości na dole. | S07 hub/lokacja, S14 kuźnia (AllyCard), S16/S15/S18 encounter (EncounterCard), stragan/doradca |
| **E · Mapa** | Plansza z pinami, mgła wojny w kolorze `canvas-hi`, PeekCard na dole. Bez account bara. | S06 mapa królestwa |

Modal (S09 start wyprawy, loot detail) = **bottom sheet**: biały, górne rogi 28, uchwyt, przyciemnienie `ink` 40% pod spodem. Wewnątrz te same komponenty.

---

## 6. UI na malunku — reguły World

Tu poprzednie próby się sypały. Pięć przyczyn i pięć reguł.

| Co było źle (stare kompozyty) | Reguła |
|-------------------------------|--------|
| Szklane (88%) pastylki bez głębi „pływały” nad obrazem jak tooltipy z przeglądarki | **Nieprzezroczysta biel + warga + `drop-on-art`.** Chrome na malunku ma być *obiektem*, który rzuca cień na świat. |
| Plakietki nie wskazywały niczego, stały „gdzieś obok” | **Ogonek + kotwica na landmarku.** Gracz widzi, *co* kliknie. Kotwica pulsuje delikatnie. |
| Fioletowe glify mono w plakietkach i w lootach | **Sticker w medalionie** (plakietki), **item art w ramce rarity** (łup). |
| Biały płaski tab bar i obraz ucięty twardą krawędzią | **Ten sam tab bar co Home + szew.** To dwie rzeczy, które mówią „to ta sama apka”. |
| Fight nachodził na tray, tray leżał na nogach bossa | **Strefy.** Dolna karta wyrasta z szwu i ma w sobie całą akcję (kto → szanse → łup → Fight) w dwóch rzędach. Nic nie wisi między kartą a malunkiem. |
| Karta bossa (v1 tej biblii) zasłaniała ~⅓ kadru | **SceneCard ≤ 18% ekranu.** Szczegóły schodzą do bottom sheetu po tapie. Boss/NPC widoczny do kolan. |
| Winda z etykietami (Upper/Ground/Cellar) jak menu z przeglądarki | **LevelNav: strzałki + kłódka.** Gdzie jestem mówi SceneHead; strzałki tylko przenoszą. |

Dodatkowo:

- **Rozmieszczenie plakietek:** plakietka nad kotwicą, w najspokojniejszym miejscu obok landmarku (niebo, ściana, markiza). Nie na twarzy postaci. Min. 12 px od SceneHead i krawędzi ekranu.
- **Hierarchia:** featured (złoty) → zwykłe → locked. Gracz w 0,5 s widzi, dokąd iść dalej.
- **Status bar:** biały na ciemnym malunku (z `ScrimTop`), `ink` na mapie z mgłą.
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

Stille, które już są (Crownhaven, Gutterjack), mieszczą się w tych strefach wystarczająco. Nowe kadry generujemy już z tym blokiem.

---

## 8. Jak zlecać ekran agentowi

Wklej to (uzupełnij nawiasy):

```text
Build screen [NAZWA] for Habits & Dragons.
1. Read docs/reference/ui/design-bible.md and look at every PNG in docs/reference/ui/golden/.
2. Archetype: [A | B | C | D | E]. Closest golden: [plik].
3. Use only components from section 4 and tokens from lookdev/tokens.css. No new colors, radii, shadows, fonts, or icon sets.
4. Content: [co jest na ekranie, w kolejności ważności]. Primary action: [jedna].
5. Before code: build lookdev/[nazwa].html from the same CSS, render with lookdev/render.ps1, and compare side by side with the closest golden.
6. Run the gate (section 9). Show me the PNG. Only then implement in apps/mobile.
```

Nowy komponent = osobne zlecenie: dopisz do sekcji 4, dodaj do `kit-sheet.html`, wyrenderuj, dopiero potem użyj.

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

---

## 10. Most do kodu (gdy padnie „implementuj”)

```text
apps/mobile/ui/
  tokens.ts        ← 1:1 z lookdev/tokens.css (te same nazwy)
  Sticker.tsx      ← Fluent Flat SVG + biała obwódka (shadow/outline w RN)
  Glyph.tsx        ← MingCute Fill
  Button, IconButton, CheckButton, CurrencyPill, Avatar, Card, PanelInset,
  SectionHead, Progress, ItemTile, SegmentedControl, TabBar,
  SceneHead, Nameplate, MapPin, PeekCard, SceneCard (EncounterCard, AllyCard),
  LevelNav, Seam
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
| 2026-09-24 | Mapa: tap pinu → **PeekCard** z „Enter” | Piny zostają bez nazw (lock 09-22), a nazwa i akcja mają swój dom. *Propozycja — potwierdzić.* |
| 2026-09-24 | Gutterjack: win chance i łup **w EncounterCard**, nie w rogu | Jedna strefa decyzji: kto, ile szans, co wypadnie, Fight. |
| 2026-09-24 (v2.1) | **LevelNav** (strzałki ▲▼ + kłódka + kropki głębokości) zastępuje windę z etykietami | Decyzja foundera: winda = menu, strzałki = gra. Nazwę piętra niesie SceneHead. Unieważnia lock „labeled lift” z `18` (2026-09-21). |
| 2026-09-24 (v2.1) | **SceneCard ≤ 18% ekranu**; EncounterCard w 2 rzędach | Karta v1 zasłaniała ~⅓ bossa. Boss/NPC to bohater kadru. |
| 2026-09-24 (v2.1) | **AllyCard**: 3 poziomy z nagrodami + „grows with” + licznik | Affinity 1/2/3 (`17`, `25`) musi pokazywać cel i drogę na jednym rzucie oka. Treść nagród i stat wzrostu na goldenie = placeholder. |
| 2026-09-24 | Bohater w UI = postać z [`mage.png`](../../../apps/mobile/assets/images/mage.png) (kreska świata) | Mocki mają miękki styl postaci spoza style-kitu. Chrome bierzemy z mocków, postacie z kreski świata. |

Stare kompozyty (odrzucone jako kierunek, zostają dla pamięci): [`mocks/world-crownhaven.png`](mocks/world-crownhaven.png), [`mocks/world-gutterjack.png`](mocks/world-gutterjack.png).

---

## 12. Otwarte

- [ ] **Styl postaci w winietach:** kreska świata (jak `mage.png`, rekomendacja) czy miękki styl z mocków (Wayfarer)? Dwa style postaci w jednej grze = dryf.
- [ ] Custom 5 stickerów tabu (rekomendacja: tak, jako pierwszy zamówiony asset UI).
- [ ] Item portraits w kresce świata: pipeline i pierwsze 8 sztuk (monety, wino, mikstura, klejnot, …).
- [ ] PeekCard na mapie — potwierdzić vs obecne „szept po tapie”.
- [ ] Affinity: za co rośnie każdy sojusznik (stat hexa? typ nawyku?) i co daje Lv 1/2/3 — treść do `17`/`23`; golden Torrika ma placeholdery.
- [ ] LevelNav: czy pokazać nazwę piętra docelowego przy przytrzymaniu strzałki (tooltip) — testować na urządzeniu.
- [ ] Archetyp B i C nie mają jeszcze goldena (Hero, streak/level-up) — następne dwa rendery.
- [ ] Dark mode: nie planujemy (mgła jest tożsamością). Potwierdzić.

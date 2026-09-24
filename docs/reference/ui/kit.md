# UI kit — język stylu (nie dosłowna zawartość mocków)

> **SUPERSEDED 2026-09-24 → [`design-bible.md`](design-bible.md)** (wygląd, tokeny, komponenty, archetypy, gate) + [`golden/`](golden/) (wzorce). Ten plik zostaje jako **log drogi**. Unieważnione tu: „lilac shift” hue, szkło 88%, MingCute jako jedyna paczka (teraz tylko system; treść = sticker), biały tab bar w lookdevie, kompozyty Fazy 2 (odrzucone na gate).

> **Status:** lock roboczy 2026-09-24.  
> **Po co ten plik:** zlokalizować *wygląd* apki. Kolejne ekrany zlecasz agentowi: „zrób X w kitcie”. Widgety na SS (jaja, zaimki, 11:56 timer) **nie** są mechaniką.  
> **Ikonki UI:** [MingCute Filled](https://www.mingcute.com) (Apache-2.0). Nie Outline.

**Dwie gramatyki, jeden kit.** Sheet (Questy, Hero, Sklep, flow onboarding/streak) = winieta + karty. World = czysty still + mało overlay. Tokeny te same.

**Sheet look-dev:** 5 PNG w [`mocks/`](mocks/). Bierzemy **kierunek** (lilac, karty, złoto, CTA, winieta). Nie kopiujemy tab barów ani copy 1:1.

| Ekran | Plik | Kierunek stylu | Nie jest lockiem treści |
|-------|------|----------------|-------------------------|
| Questy | [`mocks/home-quests.png`](mocks/home-quests.png) | Winieta domu + lista + pills | 3 taby; „50 goals” |
| Hero | [`mocks/hero.png`](mocks/hero.png) | Karty, hex, sloty | 3 taby |
| Onboarding | [`mocks/onboarding.png`](mocks/onboarding.png) | Flow fullscreen, winieta, rzędy wyboru | Jaja ≠ klasy; he/him ≠ produkt. **CTA ma być jak na streaku** (jasny pill), fiolet z tego SS = drift |
| Streak | [`mocks/streak.png`](mocks/streak.png) | Celebka + jasny przycisk „Let's go” = wzorzec CTA na flow | Filar streak = PARK w `18` |
| Sklep | [`mocks/shop.png`](mocks/shop.png) | **LOCK UI sklepu:** babka-winieta (jak Home) + siatka itemów + gold. To sheet, nie kadr 3. | Tab Mentor=stragan; timer 11:56; SKU mebli. Puste gniazda na stillu = **superseded** |

CTA: **w apce (sheet)** fiolet wypełniony (Home/Hero/Sklep). **Flow fullscreen** (onboarding, streak, celebki) jasny pill jak streak. Onboarding na SS ma zły przycisk — przy zleceniu popraw.

Sklep: tap straganu na World → ten ekran (winieta + grid), nie inventory namalowane w JPEG. Still babki = header, jak izba na Questach. Stary lock pustych gniazd w [`../art/prompt-vendor-shop.md`](../art/prompt-vendor-shop.md) = tylko portret/winieta, nie layout SKU.

**Faza 2 (złożone):** [`mocks/world-crownhaven.png`](mocks/world-crownhaven.png) · [`mocks/world-gutterjack.png`](mocks/world-gutterjack.png). Źródło HTML: [`lookdev/`](lookdev/). Gate: czy to ta sama apka co Home/Hero?

---

## Z prototypu / apki teraz

- V1/V2 shell = **ciemny fiolet** (`#0d0a14`, gold `#ffc845`, Lucide). To nie jest finalny produkt.
- Playground World: still + `OverlayHud` dark-gold + kółka Lucide na hotspotach.
- Mocki ChatGPT World: cyan neon na malunku, inny tab bar — **odrzucone jako język**.

---

## Cel (lock)

**Jedna rodzina, dwie gramatyki.**

| | Home / Hero | World |
|--|-------------|-------|
| Gatunek | Sheet: ilustracja w ramce + karty | Cinematic: still 9:16, chrome na wierzchu |
| Tło | Lilac mist | Malunek (ciepły świat) |
| HUD | Account bar + lista / grid | Title pill + markery / CTA / tray. **Bez** account bara (`18`) |

Nie wsadzamy listy kart pod Crownhaven. Nie malujemy HUD w generatorze. Nie wracamy do V1 dark jako tła tabów.

```text
ciepły świat (stille, item art)
        ×
chłodny chrome (lilac mist, biel, fiolet CTA, złoto)
        =
inwersja: obraz = ogień, UI = mgiełka
```

Złoto jest **mostem** (monety, XP, active pin). Świata nie rekolorujemy pod UI.

„Nie fiolet-default AI” w `09` zostaje dla **obraza**. Chrome produktu **może** być lilac — właśnie po to, żeby mapa nie musiała być fioletowa.

---

## Kolor

Home/Hero lockują **jasność i layout**. Kręcimy tylko **hue** mocków (periwinkle → lilac), nie V1-night.

| Token | Kierunek | Nie |
|-------|----------|-----|
| Canvas / tab bar | Lilac mist — jasność mocków, hue ~255–265, niska saturacja | Lodowy błękit; `#9b6dff` jako tło strony |
| Karta | Biel | Ciemny `surface` V1 |
| Tekst | Ciemny fiolet-navy | Krem V1 na jasnym |
| CTA / tab active | Średni fiolet (kuzyn V1, **na bieli**) | Cyan neon |
| Złoto | Zostaje (monety mocków / `#ffc845`) | Drugi metal |
| World overlay | Biel/lilac szkło ~88% + cień | Wylany fiolet na kadr |

Hexy: **zmockować z PNG Home** przy Fazie 1 (jeden source). Powyższe = kierunek, nie paleta produkcyjna.

---

## Ikony — lock final (nie dziedziczymy prototypu)

V1/V2 Lucide-w-kółku, cyan neon z ChatGPT i kółka z listy nawyków na Home **nie są produktem**. Home/Hero ~90% = jasny sheet (karty, lista, layout). **Nie** = „wszędzie kółeczka”.

### Styl znaczka (wszędzie)

**RPG cartoon, wypełniony, chunky — jak uproszczony mag.** Zero neonu, zero świecącej obwódki, zero cienkiego Lucide.

### Kółko: tak / nie zależy od ekranu

| Gdzie | Kółko? | Co zamiast / dlaczego |
|-------|--------|------------------------|
| **World still** (Crownhaven, lokacja) | **Nie.** Kółko na malunku = naklejka z prototypu, tylko ładniejsza. | Tapiesz **miejsce** (stragan, tawerna, pałac — already hotspot 0.5s). Podpis = mały **chip/pill** jak tytuł Crownhaven (ten jedyny element mocka World, który już był z rodziny Home). Opcjonalnie mały znaczek **w chipie** obok nazwy, nie na warzywach. Lekki ciepły glow na landmarku later, nie cyan. |
| **Mapa z orbity** | Mały pin (lock 2026-09-22) | To skala królestwa, nie close-up. Inna robota. |
| **Lista nawyków (Home)** | Kółko **wolno** — to wiersz listy, nie obraz | Finch: kategoria w well. Można kiedyś zdjąć; nie przenosimy tego na miasto. |
| **Ekwipunek / loot tray** | Nie kółko — **kwadrat** | Ramka = UI, rysunek itemu = świat. |
| **Fight** | To **przycisk** (pill / duży primary), nie ikona mieczy w powietrzu | Ten sam fiolet CTA co Home, nie neonowy krąg. |
| **Tab bar** | Nie kółko | 5 małych ilustracji-logo. |

Dlaczego nie „goła ikona na dachówkach”: albo zginie w kresce miasta (ten sam cartoon), albo wrzaśnie neonem (ChatGPT). Trzecia droga: **chrome to obiekt** (chip, przycisk, slot) — znaczek mieszka w nim, nie na JPEG.

### Trzy szuflady (po locku)

| Szuflada | Co | Skąd |
|----------|----|------|
| **1. Pasek** | 5 logo tabów | Custom. Nie paczka. 5 tabów z `18`. |
| **2. Znaczki UI** | Sklep, kufel, zamek, lock, check, liść… | **LOCK: [MingCute Filled](https://www.mingcute.com).** Na World w chipie. Na Home w wierszu. Dziury dorysowujemy, nie druga paczka. |
| **3. Itemy** | Miecz, wino, moneta | Style-kit, później. Nie z paczki. |

### Co z tego wynika

1. Neon = **kill**. Final ≠ mock World i ≠ V1.
2. Kółka na mieście = **kill**. Twoje wyczucie jest tu lepsze niż poprzednia rada.
3. Szukasz Fill/Bold cartoon **nie po to, by kleić je na bruk**, tylko do chipów, listy, przycisków.
4. Itemów nie rozwiązuje żadna biblioteka.

---

## Jakiego TYPU ikon szukać (jedno zdanie)

Szukasz **filled / solid / fill** — mały piktogram z **jednej pełnej plamy**, zaokrąglony, bez świecenia.

To ten sam gatunek co **liść / mydło / kropla** na Twoim Home.  
To **nie** neon z Crownhaven, **nie** cienka kreska Lucide, **nie** rysunek itemu jak mag, **nie** emoji.

Na stronie zestawu klikasz **tylko** jeden filtr:

| Kliknij | Nie klikaj |
|---------|------------|
| **Fill / Filled / Solid / Bold** | Outline, Linear, Thin, Broken, Duotone, Color 3D, Animated, Neon |

Jedna strona: [MingCute](https://www.mingcute.com) → **Filled**. Phosphor / Solar = odrzucone (2026-09-24).

---

## Gdzie szukać ikon (tylko szuflada 2)

Otwórz [MingCute](https://www.mingcute.com), filtr **Filled**. Outline z tej samej strony = nie.

Phosphor / Solar / Iconsax / Hugeicons / IconPark = **archiwum kandydatów**. Nie mieszamy. Dziura w MingCute Filled → dorysuj 1 glif w tym samym języku (pełna plama, zaokrąglony), nie dokładaj zestawu.

### Start tutaj — szuflada 2 (wypełniony cartoon, nie neon)

| Zestaw | Link | Po co patrzeć |
|--------|------|----------------|
| **MingCute** (filled) | [mingcute.com](https://www.mingcute.com) · [Iconify](https://icon-sets.iconify.design/mingcute/) | Najbliżej „cute cartoon UI” z mocków Home |
| **Phosphor** (Bold **i** Fill) | [phosphoricons.com](https://phosphoricons.com) · [Iconify](https://icon-sets.iconify.design/ph/) | Czysty, spójny, MIT; Fill = pełna plama, nie obwódka |
| **Solar** (Bold) | [docs](https://solar-icons.vercel.app/docs/v2) · [Iconify](https://icon-sets.iconify.design/solar/) | Grubszy, „premium app 2024” |
| **Iconsax** (Bold / Bulk) | [iconsax.io](https://iconsax.io) · [Iconify](https://icon-sets.iconify.design/iconsax/) | Dużo RPG-adjacent (miecz, tarcza, sklep) |
| **Hugeicons** | [hugeicons.com](https://hugeicons.com) · [Iconify](https://icon-sets.iconify.design/hugeicons/) | Szeroki katalog — wybrać **jeden** styl (stroke vs solid) |
| **IconPark** | [iconpark](https://iconpark.oceanengine.com/official) · [Iconify](https://icon-sets.iconify.design/icon-park/) | Bywa bardziej „rysunkowy” |

### Kolorowe naklejki (szuflada 1 — pasek; nie na mapę)

| Zestaw | Link | Uwaga |
|--------|------|--------|
| Icons8 — filtry **Cute Color**, **Doodle**, **Windows 11 Color** | [icons8.com/icons](https://icons8.com/icons) | Łatwo zejść w mix paczek. Jedna linia albo nic |
| Fluent Emoji Flat | [Iconify](https://icon-sets.iconify.design/fluent-emoji-flat/) | Za bardzo emoji na mapę. Ewentualnie habit-row, nie World |
| Streamline (Color / Ultimate) | [streamlinehq.com](https://www.streamlinehq.com) | Płatne, spójne; nie na itemy |

### Itemy (szuflada 3 — nie szukaj tu HUD-u)

| Zestaw | Link | Uwaga |
|--------|------|--------|
| Kenney (Game Icons, Board Game Icons) | [kenney.nl/assets](https://kenney.nl/assets) | CC0, za bardzo boardgame — ref kształtu, nie drop do apki |
| game-icons.net | [game-icons.net](https://game-icons.net) | **Nie** na chrome — grimdark, inna kreska |
| Itemy H&D | style-kit + SCENE „item portrait” | Właściwy pipeline C |

### System (chevron, X, settings) — jeśli nie weźmiemy z B

Phosphor Bold **albo** MingCute filled — nie Lucide (za cienki SaaS). Backup: [Remix](https://remixicon.com), [Material Symbols](https://fonts.google.com/icons) (Rounded + Fill).

### Zakaz

- Mix: Lucide + neon ChatGPT + tab-sticker + Flaticon „bo zabrakło kufelka”
- [Flaticon](https://www.flaticon.com) / Freepik packs bez wybranej **jednej** rodziny
- [Lordicon](https://lordicon.com) na stillu World (animowana naklejka = tandeta z `09`)
- Twemoji / Noto na hotspotach mapy
- Cienkie outline: Lucide, Tabler, Feather, Heroicons — nie nasz produkt

---

## Lista glifów na pierwszy sheet (look-dev, nie atlas)

**System:** back, check, lock, settings, close.  
**World hub:** store/stall, beer/cup, castle.  
**Encounter:** swords (Fight), wine, gold coins, leaf/herb, mug.  
**Nawyki (z Home, do zgrania):** leaf, soap, droplet.

Dziura w wybranym zestawie → **dopisz 1 glif w STYLE LOCK** (siatka, białe tło, zero sceny), nie druga biblioteka.

---

## Cztery ramki World (nowy still wlatuje w ramkę)

1. **Mapa** — piny lock 2026-09-22 (małe, bez nazw, kłódka na mgle). Tytuł ekranowy. Bez account bara.
2. **Hub / close-up** — TitlePill (back + nazwa) + 1–3 **chipy z nazwą** przy landmarku (opcjonalnie znaczek w chipie). Tap w miejsce. Zero kółek na malunku. Zero listy wyjść.
3. **Encounter** — TitlePill + **winda** góra-prawo (`18`) + Fight (primary fiolet, nie cyan krąg) + dolny tray dropów.
4. **Sklep** — nie ramka World. Tap straganu → **sheet** jak [`mocks/shop.png`](mocks/shop.png) (winieta + siatka). Inny NPC (kowal itd.) może zostać still + chip; nie malować SKU w JPEG.

Stille look-dev już w apce: `apps/mobile/assets/images/world/hub-crownhaven.jpg`, `apps/mobile/assets/images/mietek.png`. Nie generować nowych miast pod HUD.

Odrzut kompozytu: goła/neon ikona na twarzy lub dachu; kółko-naklejka na stillu; dwa backi; inny tab bar; CTA w cyanie; HUD w JPEG.

---

## Kod later (nie teraz)

Nie Tamagui / Storybook / NativeBase. Folder `apps/mobile/ui/` gdy powiesz **implementuj**:

```text
tokens → ~10 prymitywów (Button 2–3, Card, Pill, Chip, IconButton, Progress, Slot, TitlePill)
       → wzorce w domenie (HabitCard, OverlayHud, HotspotMarker, FightCta, LootTray)
```

`FightCta` używa tokenów CTA. Nie jest `Button size="xl"`. `components/` (HabitCard, backpack, radar) zostają wzorcami, nie „biblioteką”.

---

## Plan działania

```text
FAZA 0  ten plik + sync 09 / 18 / 00 / style-kit     ← 2026-09-24
FAZA 1  MingCute Filled LOCK.
        5 SS w `docs/reference/ui/mocks/` (Home, Hero, onboarding, streak, sklep) ← 2026-09-24
        zostało: hexy z PNG
FAZA 2  2 kompozyty: [`mocks/world-crownhaven.png`](mocks/world-crownhaven.png) · [`mocks/world-gutterjack.png`](mocks/world-gutterjack.png)
        HTML źródło: [`lookdev/`](lookdev/)  — **gate: ta sama apka co Home/Hero?**
FAZA 3  kod ui/ — osobne „implementuj”
```

Park po gate: item portraits, reszta lokacji, Social/Mentor ekrany, Rive pulse.

**Ban w każdej fazie:** pełny ekran World z HUD w generatorze; mix ikon; V1 dark jako canvas tabów.

---

## Otwarte

- [x] Zestaw ikon UI: **MingCute Filled** (2026-09-24)
- [x] 5 SS look-dev w `docs/reference/ui/mocks/` (2026-09-24)
- [x] 2 kompozyty World (Crownhaven + Gutterjack) — 2026-09-24, czekają na gate
- [ ] 5 tab-stickerów: custom (rekomendacja) vs MingCute
- [ ] Lilac mist: o ile stopni od mocka (zobaczyć na stillu Crownhaven, nie na białej karcie)

---

## Notatka dla agentów

Nie kopiować kółek z listy nawyków na still World. Nie dziedziczyć V1 Lucide ani ChatGPT neon.  
World = tap landmark + chip z nazwą. Znaczek mieszka w chrome, nie na JPEG.  
Kod `apps/mobile/ui` tylko po jawnym implementuj + po gate Fazy 2.

# 08 — Social

> **LOCK 2026-09-25:** Hall of Heroes. Flex-only. Later layer z zarezerwowanym tabem.  
> HUD: [`18-information-architecture.md`](18-information-architecture.md) · Peek vs Hero: [`19-screen-inventory.md`](19-screen-inventory.md) · Soft gate: [`17-player-journey.md`](17-player-journey.md).

---

## Decision log

| Decyzja | Werdykt | Dlaczego |
|---------|---------|----------|
| Job taba | **Flex / tożsamość** — wygląd, itemki, lvl, tytuły, dom, **hex**. Nawyki i streaki **ukryte** nawet przed znajomymi | Habit-police = toksyczny FOMO (`02`). Hex na peek = kształt życia, nie lista tasków |
| Forma | **Hall of Heroes** — karty: Ty + koło + bohaterowie doliny. Tap = peek | Lista+ranking V1 = pusta drabinka wstydu. Mapa zamków = druga mapa obok królestwa. Tawerna-multiplayer gryzie się z Mentorem / Gutterjackiem |
| Warstwa produktu | **Later layer**, tab zarezerwowany w HUD | Akt 1 domyka mapę + loot + habit. Social nie jest dziennym domem |
| First ship | Friends + hall (kod + peek). **Ranking PARK** | `06` wcześniej pisało „friends/ranking” — nadpisane tu |
| Dodawanie | **Tylko friend code** + akceptacja. Dwa sheety: **Twój kod** (udostępnij + kopiuj) i **Podaj kod** (jawny tekst, nie hasło). Zero wyszukiwarki nicków | Kod nie jest sekretem; mieszanie share + add w jednym sheecie myli |
| Cold start | Dolina **zawsze 4–6 kart** (seed mock dreamers). Peek tak, friend request **nie** | Tab nie może być pusty na L4/D2 |
| Soft gate | Bez zmian: **L4 / D2** | Nie zaśmiecać Day 0 (`17`) |
| Gdzie edytujesz drip | **Tylko tab Hero**. Social = wystawa | Jeden flex surface |
| Peek | **A** — winieta domu jak Questy, **przed** drip. Pod Outfit/Relic karta **StatHex**. Inner scroll (nie wciskamy na 844). Ten sam ekran dla Ciebie, znajomego i doliny. A2/B/C PARK w look-dev | Dom = flex stolicy; hex = kształt życia, nie lista nawyków |
| Look-dev PNG przed kodem | **OVERRIDE founder 2026-09-25** — port Expo z HTML (`social-hall.html` / `hero.html`). Golden PNG są STALE; PNG re-render out of scope | Gate PNG-before-code z Otwarte nie blokuje tego shipu |
| Pin na mapie Crownhaven | **Nie** — to HUD jak Bohater, nie lokacja świata | Tawerna i pałac mają inne joby |

**Odrzucone (nie wracać bez nowego locka):** ranking global/friends, podgląd nawyków, search po nicku, mapa zamków znajomych jako tab, tawerna z avatarami graczy, DM/presence na M1, gildie na M1, feed / „boast of the day”.

---

## Z prototypu

- Kingdom: ranking + friendships (Supabase) + mock heroes.
- Wizja: izometryczna mapa prowincji ze zamkami znajomych.
- Backlog: DM, presence, guilds, leaderboard global/friends, world bosses.
- RLS profili bardzo otwarte pod search — MVP, nie model docelowy.
- Friend code już na karcie Hero (V1 i V2 shell).

---

## Cel (final)

Tab **Społeczność** = **Hall of Heroes**: galeria, do której wchodzisz — nie feed, nie drabinka, nie habit-police.

Codzienność zostaje na Questach / Świecie / Hero. Social tylko **wystawia tożsamość innym**. Cichy tab jest OK.

### Layout (archetyp B — stos kart)

Ten sam chrome co Hero: mgła, AccountBar, karty, `SectionHead`. Golden: [`reference/ui/golden/hero.png`](reference/ui/golden/hero.png). Tab HUD zostaje **Social / Społeczność**. Sekcja doliny w UI: **Heroes of the Valley** / **Bohaterowie doliny**.

1. **Calling card (góra)** — portret, nick, poziom, 2 sloty, tytuł, emotka. Podpis: „tak widzą Cię inni”. **Tap karty = peek** (dom + drip). „Zmień strój” → Hero.
2. **Twoje koło** — te same miniatury dla zaakceptowanych znajomych. Puste koło: jedna linia + **Enter a code** (primary) + **Your code** (soft). Badge na tabie **tylko** przy pending invite.
3. **Bohaterowie doliny** — zawsze 4–6 kart. Launch = seed mock dreamers (V1 już tak robiło, tu **bez** rankingu). Peek tak, dodawanie **nie**. Later: opt-in public profile wpada tu; mocki zostają jako wypełnienie, aż dolina żyje.

### Peek (A: dom najpierw, potem drip, potem hex)

Tap calling card / znajomego / doliny = **ten sam ekran**. Nie nowy profil.

Layout **A** (lock): góra = **winieta domu** (Questy / S04). Potem nick, poziom, Outfit + Relic, emotka, dni w królestwie. **Pod kartą EQ = StatHex** (6 osi z Hero). Całość **scrolluje** — hex nie ma się mieścić na pierwszym kadrze.

A2 (imię na stillu) / B (sandwich) / C (chata jako karta) = **PARK** w [`reference/ui/lookdev/proposals/social-hall.html`](reference/ui/lookdev/proposals/social-hall.html), nie kasować.

**Widać:** dom, nick, lvl, 2 sloty, emotka, tytuły gdy są, **hex**, dni w królestwie.

**Ukryte nawet przed znajomymi:** nawyki, streak, dzisiejsze questy, liczba odhaczonych zadań · gold, klucze, cały plecak · pasek XP do next level · mood · postęp mapy / nieodkryte piny · **ich** friend code.

### Friend flow

Dwa osobne sheety, nie jeden:

1. **Your code** — kod widoczny (nie maskowany). Przycisk kopiuj na końcu pola. Dajesz znajomemu.
2. **Enter a code** — wpisujesz **ich** kod jako zwykły tekst (nie hasło) → zaproszenie + akceptacja.

Kod zostaje też na Hero (copy). D2 teach: hall + „Your code”. D5: 1× dodaj / podejrzyj.

### PARK / KILL

| | |
|--|--|
| **KILL na M1** | Ranking global/friends · podgląd nawyków · search po nicku |
| **PARK** | Mapa zamków · DM / presence · gildie · aukcje (Akt 2, gdy Social żyje — `06`) · tawerna-multiplayer |

Aukcje nadal czekają na **żywą** Społeczność, nie na ranking.

---

## Otwarte

- Lore-copy nagłówka hallu (czy „Valley” zostaje na stałe, czy dostanie nazwę królestwa).
- Kiedy opt-in public profile zastępuje mocki jako główne wypełnienie.
- Peek still: **A lock** (house-first + scroll + hex pod EQ). A2/B/C PARK na dole look-dev, nie kasować.
- Dedykowany still domu per gracz (teraz wszyscy = `vignette-mage.jpg` z Questów).

**Zamknięte 2026-09-25 (ship Expo):** mocki doliny = **5** z hooków lookdev (Moth, Copper, Wren, Salt, Brin). Look-dev PNG-before-code **nadpisane** przez foundera — kod `SocialScreen` z HTML, nie ze STALE golden PNG.

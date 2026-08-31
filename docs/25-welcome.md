# 25 — Witaj w ekipie

> **Dla kogo:** nowa osoba w projekcie (teraz: programista, mocny backend).  
> **Po co:** jeden plik, żeby wejść w Habits & Dragons V2 bez czytania 25 dokumentów naraz.  
> **Co to nie jest:** specyfikacja do kodowania 1:1. To **aktualny obraz koncepcji** — dużo jest zamknięte kierunkowo, nic nie jest „w 100% zatwierdzone na produkcję”.

Jeśli po tym pliku zostaną pytania — super. Pytaj, dochodzimy do konsensusu. Jesteś tu jako **pełnoprawna osoba w ekipie**, nie jako wykonawca gotowego biletu.

---

## 1. Gdzie jesteś

Masz (albo dostaniesz) **dwie rzeczy**, które wyglądają jak „ta sama gra”, a nie są.

| Co | Gdzie | Co z tym robić |
|----|--------|----------------|
| **V1 — prototyp** | Osobne repo / folder aplikacji (Expo) | Uruchom, poklikaj. UX zadań, kalendarz, feel odhaczenia — **to zostaje jako lekcja**. Architektura świata (obóz, klasy, karty lochów, smoki) — **nie** jest celem V2. |
| **V2 — Concept Bible** | **To repo** (`habitsanddragons-v2`) | Markdown. Tu ustaliliśmy *jaką grę chcemy zrobić*. **Nie ma tu jeszcze aplikacji V2.** |

To repo to **nie kod**. Pracujemy tu tak: pomysł → plik filaru → gdy się ustabilizuje, ląduje w [`00-final-picture.md`](00-final-picture.md). Kod startujemy dopiero gdy świadomie wyjdziemy z trybu koncepcji.

**Twoja rola (szkic):** znasz backend najlepiej — przy stacku, modelu danych, syncu, anti-cheat ekonomii i AI przez serwer **będziesz współdecydować**, nie tylko implementować. Frontend / art / fabuła też możesz ruszać; backend to kij, na którym stoimy.

---

## 2. Gra w jednym akapicie

Budzisz się w **kolorowym królestwie RPG** (cartoon fantasy). Zaczynasz jako nikt w **stolicy Crownhaven**. Realne nawyki = zasługi (XP, złoto, iskra). Awansujesz od stodoły do wpływu. Świat odkrywasz na **mapie w mgle**: pierwsza wyprawa odblokowuje lokację na zawsze, potem wracasz bez czekania. Lochy, NPC i fabuła siedzą w lokacjach. Mentora pytasz o życie **w lore gry**, nie w ChatGPT.

**Obietnica vs konkurencja**

| | Oni | My |
|--|-----|-----|
| Finch | Ciepły rytuał, kurczak | Ten sam warm UX, ale **jesteś bohaterem królestwa** |
| Habitica | Sheet RPG, klasy, dużo systemów day 1 | Prościej: **mapa + podróż + immersja**, bez class lock |

Ton: cartoon fantasy — energia Rick & Morty × Vox Machina × Shakes & Fidget, **własna kreska**, nie kopia.

---

## 3. V1 vs V2 — żeby prototyp Cię nie zmylił

Prototyp **działa**. Jest też **inną grą**. Świadomie odchodzimy od „upgrade obozu / zamku”.

| Temat | V1 (prototyp) | V2 (kierunek) |
|-------|----------------|---------------|
| Hub | Obóz / zamek, lista zadań na „Castle” | **Stolica** + awans domu (stodoła → chata → murowany) |
| RPG świat | Karty lochów (tab D&D), smoki | **Jedna mapa królestwa** → close-up lokacji |
| Klasy | 4 klasy (warrior/hunter/mage/paladin) | **KILL** na MVP |
| Smoki | Unlock ze streaku | **PARK** |
| Walka | Energia / klucze, auto-resolve | **Darmowe CD per loch** + klucze; % wygranej widoczne |
| Tożsamość | Klasa + smoki + 2 sloty | Dom, **outfit + atrybut**, emotki, hex, affinity NPC |
| Mentor | Czat w tabie, klucz Groq **w kliencie** | Fullscreen z tawerny; **AI tylko przez backend** |
| Social | Ranking + friends (szkielet) | Tab jest; **launch może być cienki** — later |
| Store listing | Habit tracker w skórze fantasy | **Isekai wejście** — wypadasz do królestwa |

**KEEP z V1 (jako UX / feel, nie jako architektura):** lista nawyków, kalendarz, cadence dnia, haptics / satysfakcja odhaczenia, kierunek Supabase, Expo jako shell.

Szczegóły as-is prototypu: [`reference/prototype-v1.md`](reference/prototype-v1.md).

---

## 4. Zajawka fabularna (Akt 1)

**Bez spoilera dla gracza:** Crownhaven wygląda OK — targ, rasy, handel, pałac na wzniesieniu. Ale ludzie gasną. Tawerna, która była restauracją rodzin, jest **menelnią**. Mgła zostaje za długo. Mówią: pech. Klątwa snów. Zmęczenie świata. Nikt na starcie nie woła imienia sprawcy.

**Dla nas (design):** zaraza to **Dreamwake** — głód, który żywi się wolą, dyscypliną, pamięcią „kim chciałem być”. Realne nawyki gracza = **iskra woli**. Złe charaktery (żule, piraci, bandy) rosną w siłę, bo mają wyjebane — Dreamwake ich lubi. Finał Aktu 1: **Ananiel the Dream-Siphon** (Titan) — pije marzenia z wieży. Gracz dowiaduje się tego **późno**.

Wejście: cinematic zwykły świat (tłok, stacja) → mroczenie → oczy otwierasz na **targu Crownhaven**. NPC ze **straganu** pyta kim jesteś. Dostajesz nocleg w **stodole**. Mentor w menelni widzi iskrę i zrzuca pierwszą misję: odzyskaj tawernę (boss **Gutterjack** w piwnicy).

Motyw: *miasto umiera nie od miecza, tylko od braku chcenia — Ty jesteś dowodem, że wola da się wrócić.*

Pełna proza: [`22-universe-story-act1.md`](22-universe-story-act1.md) (uwaga: starsze nazwy beatów — kanon mapy jest w `23` / `17`). Biblia świata + log decyzji: [`21-world-bible-mvp.md`](21-world-bible-mvp.md).

---

## 5. Jak działa gra — mechaniki i logika

To jest **silnik produktowy**, nie kod. Liczby z kłódką = lock założyciela; reszta = kierunek albo seed.

### 5.1 Pętla dnia (2–10 min × 2–3 wejścia)

```text
RANO     hex reveal (wczorajszy batch) + ewentualny powrót wyprawy
DZIEŃ    odhacz nawyki → gold / XP (pasmami) → walka jeśli CD lub klucz
WIECZÓR  mapa: discover w toku? nowy pin? Champion? Mentor?
```

Nie siedzisz godzinę w apce. Wzorzec Finch: rano wyślij wyprawę, wieczór / następny ranek odbierz.

### 5.2 Nawyki → paliwo

Zwykła lista zadań (nie osobny „RPG quest log” na start).

| Pasmo dnia | Gold | XP | Drop klucza |
|------------|------|-----|-------------|
| Zadania **1–5** | **50** każde | 100% bazy | 1. drop dnia: **20%** |
| Zadania **6–10** | **10** (20%) | 20% | 2.: **5%** · 3.: **1%** |
| **11+** | **0** | **0** | brak |

- Max gold z listy / dzień = **300** (= 3 klucze po **100g**).
- Hook: **2 proste taski = 1 klucz = walka**.
- Morning gold: **KILL** (login i tak daje hex + streak).
- Spam 100 zadań **nie** przyspiesza Aktu. Feel Finch po 10. tasku = animacja / heatmapa / drobny affinity — **nie** XP/gold.

**Druga oś tempa:** **aktywne dni** (sumienność). Bramki mapy = **level + aktywne dni + poprzedni Main ★**. Złoto **nie** otwiera fabuły.

### 5.3 Mapa — Discover once, return forever

```text
STOLICA (hub, zawsze)
    → MAPA (mgła)
         → wybierasz pin → wyprawa (timer ~4–6 h, zawsze dochodzisz)
         → lokacja ODKRYTA
         → odtąd szybki dostęp: NPC / loch bez czekania
```

- Jedna aktywna wyprawa discover naraz.
- Fail odkrycia: **KILL**.
- Side = **pula** (gracz wybiera kolejność). Main ★ = **stała chronologia** dla wszystkich.
- Soft breadth: pierścień 2 (R2) po **≥2 odkrytych** lokacjach R1.
- Level daje **punkty odkrycia** (tylko na side) albo **prawo otworzyć następny Main ★** — nie „L9 = idź do Maga”.

### 5.4 Lochy i walka

Tiery (LOCK nazw): **Common → Elite → Champion → Titan**.

| Tier | Darmowe wejście | CD (seed) |
|------|-----------------|-----------|
| Common | tak | ~6–8 h |
| Elite | tak | ~10–12 h |
| Champion ★ | tak | ~24–48 h |
| Titan | tak | ~72 h |

Globalna energia walki: **KILL**. UI lochu: „darmowe” **albo** timer **albo** „wejdź za 1 klucz”.

Walka = auto-resolve z **widocznym %** przed tapem. Składniki (Akt 1):

```text
% ≈ Δ(level gracza − level bossa)
    + bonus first clear (już pokonany = łatwiej farmić)
    + afiksy z EQUIPPED itemów (nie cały plecak)
    + affinity NPC (progi 1/2/3, zwykle vs biom)
    + max 1 mikstura
    + clamp (seed 5%–95%)
```

**Hex nie wchodzi do walki w Akcie 1** (tożsamość / Mentor, nie „właściwa droga życia”).  
Pierwszy Gutterjack: **darmowy + 100% win** (tutorial).

### 5.5 Postać — bez klas

| Element | Rola |
|---------|------|
| Level / wpływ | XP z nawyków (krzywa seed w `17`; absolutne liczby TBD) |
| Dom | Stodoła (start) → **chata po clear ★1** (dar doradcy) → **murowany po ★3 Osiris** |
| Loadout | **2 sloty:** Outfit (flex) + Atrybut (tu moc). Emotka = kolekcja, 1 equipped, 0 power |
| Anti-swap | Zmiana **Atrybutu** lockuje slot **do resetu dnia**; Outfit/Emotka zawsze wolne |
| Hex | 6 osi, nocny batch → poranny reveal |
| Affinity NPC | 3 levele / sojusznik |

Rarity loot: **Zwykły → Unikat → Heroiczny → Artefakt (tylko Titan)**. 4 poziomy, bez „Legendary”.  
Aukcje gracze↔gracze: **PARK** na miesiąc 1.

### 5.6 HUD — 5 tabów (kierunek zamrożony)

**Questy** · **Świat** (mapa → lokacja) · **Bohater** · **Społeczność** · **Mentor**

Questy = czysta lista IRL + winieta **domu w stolicy**. Nie mieszamy nawyków z „jestem w lesie”. Świat = mapa wow, potem drill-in.

Społeczność: soft gate ~L4 / D2 (nie zaśmiecać Day 0).

### 5.7 Akt 1 — tempo (wzorowy sumienny)

Klimaks Titan ≈ **dzień 18–21** (nie „czekaj cały miesiąc na jednego bossa”). Reszta miesiąca = most Aktu 2.

| Tydzień | ~Dni | Beat |
|---------|------|------|
| 1 | 0–7 | Hub + 3 side do wyboru + Champion ★1 |
| 2 | 8–14 | Champion ★2 + ★3 Osiris + side z punktów |
| 3 | 15–~21 | Prep + **Ananiel** (discover = od razu walka) |
| 4 | ~22–30 | Most Aktu 2 |

**11 lokacji Akt 1:** 1 hub + 6 side + 4 Main (3 Champion + Titan).

| # | Miejsce | Co tam |
|---|---------|--------|
| Hub | **Crownhaven** | Stragan (sklep + stodoła), menelnia (koło / kubeczki), pałac po ★1 |
| Hub loch | **Gutterjack** | Common tutorial, piwnica |
| R1 | **Smuggler's Teeth** | Piraci; Common załoga → Elite Captain Marrow |
| R1 | **Crown Approaches** | Przedpola; NPC + loch rozbójników |
| R1 | **Anvil Glade** | Kowal Torrik + Common Stillgaze |
| ★1 | **The Closed Way** | Champion **Skarne** (mago-łowca) |
| R2 | **Pallglass Spire** | Mag Miro — sojusznik, mikstury, **bez lochu** |
| R2 | 2× TBD | Seed: katedra-wampir / wyspa; 6. side na L12 |
| ★2 | Nawiedzony zamek | Champion kruki |
| ★3 | Pustynia | Elite kult → Champion **Osiris** |
| Titan | Wieża | **Ananiel** |

Imiona wielu NPC / królestwa / pustyni = **jeszcze placeholder**.

Pełna ekonomia: [`06-economy-loot.md`](06-economy-loot.md). Journey dzień po dniu: [`17-player-journey.md`](17-player-journey.md). Karty lokacji: [`23-act1-location-brainstorm.md`](23-act1-location-brainstorm.md).

---

## 6. Dla Ciebie — backend i stack

Tu masz największy głos. Poniżej: **kierunek, nie dogmat**. Sesja tech: 2026-08-01. Plik: [`12-tech-stack.md`](12-tech-stack.md).

### 6.1 Werdykt roboczy (produkt × tech)

Produkt to **hybryda**: lekka apka nawyków codziennie **+** momenty immersji RPG. Dlatego **nie** Unity/Unreal na całość — zabiłoby cold start i Finch-feel.

| Warstwa | Kandydat | Status |
|---------|----------|--------|
| App shell | **Expo / React Native** | KEEP kierunku (V1 już tu) |
| Nawigacja | Expo Router, 5 tabów | kierunek |
| Stan klienta | Zustand **podzielony domenowo** (nie god-store V1) | do zaprojektowania |
| Backend | **Supabase** (Auth, Postgres, Storage) | KEEP kierunku — **Twoja decyzja czy zostaje** |
| AI Mentor | LLM **tylko przez backend** (Edge / własne API) | LOCK filozofii; vendor otwarty |
| Mapa zoom-out | Ilustracja + pan/zoom + mgła (Skia lub Image+gesty na MVP) | kierunek |
| Close-up / postacie | **Rive** | kierunek art |
| Cinematics | Pre-render video (batch + human gate), nie gen per user | kierunek |
| Offline | Odhacz nawyku działa bez siatki; świat się dogrywa | zasada niefunkcjonalna |

Świadomie odrzucone *na teraz:* Unity jako cała apka, realtime 3D mapa, klucz LLM w kliencie, generowanie filmików on-device.

### 6.2 Co serwer powinien trzymać jako prawdę

Habit RPG + mapa + loot = raj na cheat, jeśli gold/XP/lochy żyją tylko w AsyncStorage.

**Kandydaci na source of truth (do Twojego werdyktu):**

| Domena | Dlaczego serwer |
|--------|-----------------|
| Dzień gry / reset / timezone | Hex, lock atrybutu, pasma gold, CD lochów — jeden zegar |
| XP, level, aktywne dni, gold, klucze | Bramki fabuły i ekonomia |
| Wejścia lochów (CD + zużycie klucza) | Inaczej infinite farm |
| Roll walki i lootu | % i rarity muszą być powtarzalne / audytowalne |
| Odkrycia mapy, punkty, Main ★ | Progress Aktu |
| Loadout + lock Atrybutu do resetu | Anti-swap |
| Inventory / rarity | Sink straganu, później aukcje |
| Mentor: kontekst + rate limit + brak klucza w apce | Koszt + prywatność („karta gracza”) |
| Social (later) | Friends, ranking — V1 miał luźne RLS |

Klient może być **optymistyczny** na odhaczeniu (feel), z reconcile. Mapa pan/zoom, Rive, video = klient.

### 6.3 Szkic domen (nie schema — rozmowa)

To jest mapa systemów, których **produkt potrzebuje**. [`13-game-systems.md`](13-game-systems.md) jest jeszcze pusty po stronie „cel” — dobry plik, żebyś Ty dopisał kontrakt `input → reguły → output`.

```text
Identity        auth, profil, postać (imię, wygląd), soft gate (świat najpierw?)
Habits          CRUD, schedule, complete, trudność, heatmapa / streak / freeze
Day tick        pasma 1–5 / 6–10 / 11+, aktywny dzień, hex batch w nocy
Economy         gold, klucze, sinki (sklep, koło, kubeczki)
Combat          per-dungeon CD, klucz, win%, first-clear flag
Loot            pasma rarity (nie stack %), 4 wiadra: atrybut / outfit / emotka / pot
Loadout         2 sloty + lock atrybutu
World           fog, piny, expedition timer, soft breadth, Main chronologia
Hub             dom tier, 3 hotspoty Crownhaven (stragan / menelnia / pałac)
NPC             affinity 1/2/3, sklep, mikstury Maga
Mentor          living-memory card, chat, granice kryzysu
Content         lokacje, bossy, tabele dropu, beaty ★ — dane, nie hardcoded UI
Social          later: friends, ranking; aukcje PARK M1
```

Treść świata (boss, drop, dialog) chcemy trzymać jako **katalog**, nie rozsypkę w ekranach — łatwiej LiveOps i Akt 2.

### 6.4 V1 tech — co dziedziczymy ostrożnie

Prototyp: Expo 54, Zustand **god-store**, AsyncStorage, Supabase (Auth + jsonb profile + friendships), Groq **z klienta**, TanStack Query prawie nieużywane.

| KEEP jako lekcja | Wyrzucić / przepisać |
|------------------|----------------------|
| Expo, habit UX, haptics | God-store na prod |
| Kierunek Postgres / Auth | Client-side LLM key |
| Cloud snapshot profilu (idea) | Kotwica UI w obozie |

Rewrite **ekranów świata** = OK. Rewrite **całego frameworka** = nie, dopóki nie udowodnimy że RN nie dźwiga mapy.

### 6.5 Otwarte pytania — czekają na Ciebie

Nie musisz odpowiadać day 1. To lista, przy której chcielibyśmy Cię mieć w pokoju:

1. **Supabase zostaje** (Auth + RLS + Edge) czy własny API przed Postgresem?
2. **Event log vs snapshot** — dzienny tick ekonomii, CD, wyprawy: jak modelować, żeby dało się debugować „dlaczego nie dostał golda”?
3. **Offline-first** — jak głęboko? Tylko nawyki, czy też walka (ryzyko desync lootu)?
4. **Czas gracza** — dzień gry = lokalna północ? UTC? Streak przy zmianie strefy?
5. **Anti-cheat poziom 1** — świadomie „uczciwy gracz na telefonie”, nie MMO-grade; gdzie twarda walidacja, gdzie ufamy klientowi?
6. **Mentor** — jeden pipeline LLM vs osobno chat / oracle / karta; vendor; budżet tokenów / user / dzień.
7. **Content pipeline** — JSON w repo, CMS, czy coś innego, gdy designerzy dopisują dropy bez deployu apki?
8. **Analytics** — Day 1/7, odkrycia mapy, clear ★ — vendor TBD.
9. **Lock stacku na 6–12 mies.** — Expo + Skia/mapa + Rive + pre-render video: Twoje „tak / tak, ale / nie”.

Monetyzacja ([`14`](14-monetization-liveops.md)) jest **prawie pusta**. Fair-play (płatności nie kupują Aktu) musi być w ekonomii od początku, nawet jeśli IAP później.

---

## 7. Na czym stoimy — słownik i świeżość plików

### Jak czytamy status

| Słowo | Znaczy |
|-------|--------|
| **LOCK** | Założyciel zamknął kierunek lub liczbę — ruszamy tylko ze świadomą zmianą |
| **KEEP kierunku** | Działa jako default, można spiąć lepiej |
| **Seed** | Przykładowa liczba / imię, do kalibracji |
| **PARK** | Świadomie later, nie zabite |
| **KILL** | Nie robimy (klasy, energia globalna, morning gold, fail discover…) |
| **Otwarte / TBD** | Brak decyzji — tu właśnie dyskusja |

**Nic nie jest 100%.** Nawet LOCK-i to locki koncepcji, nie freeze kodu. Jak wejdziesz i powiesz „to się nie spina na serwerze” — słuchamy.

### Co jest względnie zwarte

- Obraz gry: [`00-final-picture.md`](00-final-picture.md)
- Psychologia + pętla: [`02`](02-psychology.md), [`03`](03-core-loop.md)
- Ekonomia / walka / loot: [`06`](06-economy-loot.md) (najgrubszy filar mechanik)
- Journey Akt 1: [`17`](17-player-journey.md)
- Lokacje Rev B: [`23`](23-act1-location-brainstorm.md)
- Locklista produktu: [`20`](20-pre-world-locklist.md)
- Tech szkic: [`12`](12-tech-stack.md)

### Co jest szkicem albo częściowo stare

| Plik | Uwaga |
|------|--------|
| [`07-ai-sage.md`](07-ai-sage.md) | Mentor = ambicja; kontrakt Living World nie domknięty |
| [`08-social.md`](08-social.md) | Pytania, mało decyzji |
| [`13-game-systems.md`](13-game-systems.md) | Lista systemów V1; **cel V2 pusty** — Twój teren |
| [`14-monetization-liveops.md`](14-monetization-liveops.md) | Otwarte |
| [`15-onboarding-arrival.md`](15-onboarding-arrival.md) | Wizja isekai OK; klasy w `15` jeszcze jako pytanie — w `05`/`20` już **KILL** |
| [`18-information-architecture.md`](18-information-architecture.md) | 5 tabów przyjęte w `00`/`20`; sam plik wciąż „propose” |
| [`19-screen-inventory.md`](19-screen-inventory.md) | Slice ekranów; koło menelni w `06` już unpark, tu może park — nie kanon |
| [`21`](21-world-bible-mvp.md) §L | Stary układ T1 — **nadpisany** przez `23` Rev B; decision log na górze = świeży |
| [`22`](22-universe-story-act1.md) | Ton i motyw KEEP; nazwy beatów (First Omen / Sandglass) = archiwum vs Rev B |

Art (kreska, prompty) jest w toku look-dev — nie blokuje zrozumienia mechanik. Wejście: [`09`](09-art-graphics.md), paste: [`reference/art/style-kit.md`](reference/art/style-kit.md).

---

## 8. Jak czytać resztę (żeby nie utonąć)

**30 minut** — ten plik + [`00`](00-final-picture.md) + odpal V1.

**Wieczór** — `03` (pętla) → `06` (ekonomia, skanuj tabele LOCK, nie każdy afiks) → `17` (D0–D4 wystarczy) → `23` §B + mapa w §C.

**Gdy wchodzisz w fabułę** — `21` od **decision logu** (nie kasujemy historii decyzji) + `22` prolog.

**Gdy wchodzisz w dane / API** — `13` (do wspólnego wypełnienia) + `12` + `06` jako reguły, które serwer musi umieć wykonać.

Surowy dump pomysłów: [`ideas-inbox.md`](ideas-inbox.md). Mapa wszystkich plików: [`README.md`](../README.md).

---

## 9. Jak pracujemy

1. Pomysł / wątpliwość → czat albo inbox.
2. Wpychamy do filaru (`01`–`24`), trzy warstwy: **z prototypu / cel / otwarte**.
3. Konsensus → update `00`.
4. Kod V2 — gdy świadomie wyjdziemy z concept mode (albo gdy wspólnie zdecydujemy, że czas na pionowy slice).

Pytania, które są **cenniejsze** niż „czy mogę zacząć pisać serwis”:

- Gdzie Twoim zdaniem prawda gry **musi** żyć na serwerze day 1?
- Co z V1 (nawyki, sync profilu) da się uratować, a co jest pułapką?
- Jaki najcieńszy backend pozwoli zagrać **Day 0 → Gutterjack → pierwszy pin mapy**?

---

## 10. Decyzje vs otwarte (skrót na start rozmowy)

**Kierunek, z którego wychodzimy (nie święte, ale nie „wszystko w powietrzu”):**

- Mapa królestwa + stolica + isekai, nie obóz V1
- 5 tabów, discover-once, klasy KILL, smoki PARK
- Sumienność > spam; fabuła ≠ gold; CD per loch
- Akt 1 ≈ 11 lokacji, Titan Ananiel, ~3 tygodnie sumiennego
- Expo shell; AI nie w kliencie
- Zero kary za miss (nie toksyczny FOMO)

**Jawne dziury:**

- Absolutne XP / dokładna krzywa leveli
- Exact godziny CD
- Side #6, imiona NPC, nazwa królestwa
- Kontrakt Mentora / karta gracza
- Social na launch
- Monetization
- Schema backendu, RLS, tick dnia, CMS treści
- Czy close-up lokacji = always bitmapa, czy Rive scene

Czytaj ten plik jako **mapę terenu**, nie jako umowę. Jak coś tu kłóci się z `06`/`17`/`23` — wygrywają te trzy plus `00`; ten welcome jest syntezą i może się spóźnić o jedną sesję.

Witaj. Pytaj ostro.

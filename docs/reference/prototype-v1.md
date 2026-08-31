# Referencja — Prototyp V1 (as-is)

> **Rola:** zamrożona referencja tego, co już zbudowaliśmy. **Nie** jest to cel finalnego produktu.  
> **Źródło:** repo `habitsanddragons` + readme + audyt mechanik.  
> Pomysły stąd bierzemy do plików tematycznych jako warstwę „Z prototypu”.

---

## 1. Elevator pitch (jak w readme prototypu)

Habit tracker, który używa psychologii gier, żeby uzależnić gracza od dbania o siebie. Zamiast listy TODO: bohater RPG; codzienne, realne zadania zasilają wirtualne królestwo.

**Obietnica emocjonalna:** „Czuję się jak w grze, a przy okazji robię życie”.

**Obietnica wizualna (readme):** komiksowe izometryczne 2D (styl Shakes & Fidget), „kanapka” tło + Lottie, mocne haptics — bez ciężkiego 3D.

---

## 2. Psychologia gry (intencja produktowa)

Z readme i zaimplementowanych mechanik wynika zestaw haczyków:

| Haczyk | Jak ma działać w prototypie |
|--------|-----------------------------|
| **Progression** | XP → poziom bohatera; złoto; tytuły |
| **Streak / Don't break the chain** | Globalny streak + ognisko/atmosfera (wizja); heatmapa aktywności |
| **Variable reward** | Drop kluczy z nawyków (5% → 1%); loot z lochów |
| **Gold sink** | Klucze za 150 złota; reroll epic questu; eliksir czasu |
| **Daily cadence** | Cap złota z nawyków, epic quest Mędrca, morning gold, Daily Flow |
| **Identity / fantasy** | Klasa, imię, płeć, smoki, kosmetyki, narracja Mędrca |
| **Social pressure** | Kingdom / friends / ranking (częściowo mock) |
| **AI companion** | Mędrzec (LLM) + Oracle (hex stats) |

---

## 3. Core loop (to, co ma kręcić codziennie)

```text
Otwórz apkę → (opcjonalnie) Daily Flow / nastrój / Mędrzec
     → odhacz nawyki na Zamku
     → XP + złoto (+ szansa na klucz)
     → utrzymuj streak
     → wydaj złoto / klucz w D&D (lochy, smoki, ekwipunek)
     → zobacz siebie na Hero (profil, heatmapa, rytuały)
     → (opcjonalnie) Kingdom / Sage
```

**Jednostka sukcesu dnia:** przynajmniej kilka odhaczonych questów + niezerwany streak + poczucie „bohater rósł”.

---

## 4. Powierzchnie UI (5 tabów + shell)

### 4.1 Shell (HUD)

- Avatar / poziom / pasek XP, złoto
- Skrzynka pocztowa (stub: jedna wiadomość beta + stała czerwona kropka)
- Ustawienia (m.in. haptics)
- Overlaye: Daily Flow, celebracje level-up / streak

### 4.2 Castle (`index`) — serce pętli

- Lista questów / nawyków na dziś
- Dodawanie / edycja / trudność (easy/medium/hard)
- Planowanie dat (`scheduledDate`) + kalendarz wypraw
- Sortowanie listy (domyślne / custom)
- Scena domu / obozu (wizualny kontekst streaku)

**Produktowo:** to główny ekran „pracy”.

### 4.3 D&D — Dragon Lair (`dragon-lair`)

- Sklep kluczy (gold sink)
- Lochy: auto-resolve walki, szansa vs boss, loot kosmetyczny / złoto
- Smoki odblokowywane streakiem (10 / 25 / 40 dni w configu)
- Ekwipunek / plecak (outfit + relic)
- Eliksir czasu (freeze streaku nawyku)

**Produktowo:** warstwa „kasyna / zabawy / sinków” po uczciwej pracy na Zamku.

### 4.4 Hero (`hero`)

- Profil: klasa, tytuł, friend code
- Hex radar (6 osi) — **w UI Hero często mock**; prawdziwe `heroHexStats` z Oracle w Daily Recap
- Heatmapa aktywności + kroniki dnia / refleksje
- Rytuały dzienne i milestone’y epickie (cross-tab questy)
- **Destiny / Paths / Locations** — katalog lore (Ronin itd.), głównie dekoracja; nie zapisuje ścieżek do Living World

**Produktowo:** lustro tożsamości + długoterminowa narracja (niedokończona).

### 4.5 Kingdom (`kingdom`)

- Ranking (mix prawdziwych znajomych + mockowi bohaterowie realm)
- Friends: tabela `friendships` w Supabase, search po profilach
- Wizja readme: izometryczna mapa prowincji ze zamkami znajomych — **nie jako pełny produkt w prototypie**

**Produktowo:** social accountability w wersji MVP/szkielet.

### 4.6 Sage / Mędrzec (`sage`)

- Czat z LLM (Groq), kontekst klasy / poziomu / streaku / fokusu / nastroju / Living World JSON
- Codzienny Epic Quest (+50 gold poza capem nawyków), reroll za złoto
- Fokus życiowy: body / mind / work
- Mood → `secretIdentity.moodHistory`

**Produktowo:** maskotka + coaching w lore + dzienny bonus quest.

---

## 5. Onboarding

Wizard Mędrca:

- Klasa (warrior / hunter / mage / paladin)
- Imię bohatera, płeć
- Fokus Sage
- Słabość + commitment (krótka ścieżka)
- Opcjonalny deep profile (energia, ekran, stres, ruch, planowanie)
- Starter habits z serwisu onboardingu
- Zapis do store + upsert profilu w chmurze
- `onboardingComplete` otwiera taby

**Auth:** email/hasło, OTP, Google/Apple (Supabase). W rozwoju bywał **force bypass auth** — sync chmury i DailyLoginSync zależą od sesji.

---

## 6. Postacie i progresja RPG

### 6.1 Klasy (mapowanie na życie)

| Klasa | Stat dominant (intencja) | Fokus życiowy (lore) |
|-------|--------------------------|----------------------|
| Wojownik | Siła | Siłownia, dieta, sylwetka |
| Łowca | Zwinność | Cardio, sen, waga |
| Mag | Inteligencja | Nauka, business, mental |
| Paladyn | Zrównoważony | Wszystko po równo |

Klasy **nie blokują** innych ścieżek — to personalizacja i bias, nie hard lock.

### 6.2 Statystyki „gameplayowe” (3 osie)

- `strengthXP` / `agilityXP` / `intelligenceXP`
- Poziom gracza z sumy XP
- Trudność zadania → baza XP i złota
- Fatigue: po wielu taskach w dniu mnożnik XP spada (1.0 → 0.5 → 0.1)

### 6.3 Hex / Oracle (6 osi)

Osobna warstwa: strength, agility, intelligence, vitality, spirit, discipline.

- Wagi na zadaniu (`oracleStatWeights`) przy tworzeniu (AI)
- Nocny batch: wczorajsze ukończone nazwy → `DailyOracleStatGains` → `heroHexStats`
- Cap dziennych gainów (w serwisie AI)

**Intencja:** bogatszy „charakter” bohatera niż 3 osie walki.  
**Reality check prototypu:** Hero radar bywa odłączony od prawdziwych hex stats.

### 6.4 Tytuły

Odblokowania za poziomy statów / liczbę ukończonych questów (`unlockedTitleIds`).  
Równolegle narracyjne `secretIdentity.titles` — **niesynchroniczne** z gameplayowymi.

---

## 7. Ekonomia (liczby z prototypu)

| Mechanika | Wartość / reguła |
|-----------|------------------|
| Easy / Medium / Hard | 15 XP / 5g · 25 XP / 10g · 40 XP / 20g |
| Cap złota z nawyków / dzień | 100 |
| Epic quest Sage | +50 gold (poza capem), raz dziennie |
| Morning streak gold | +20 |
| Teoretyczne max gold/dzień (nawyk+epic+morning) | 170 |
| Drop klucza | 5% pierwszy, potem 1% |
| Cena klucza | 150 gold |
| Reroll epic | 20 gold, max 1/dzień |
| Smoki (streak) | 10 / 25 / 40 dni |
| Lochy — wymagany poziom | od 1 do 30 w zależności od bossów |

**Filozofia loot:** kosmetyki (outfit/relic), nie power creep na staty walki (synergie bossów istnieją w configu jako % win chance — to już lekki power w combat, nie w nawykach).

---

## 8. Streak, smoki, ochrona

- Globalny `streak` + per-habit streaki dla daily
- Reset dnia: nieukończone daily zerują streak nawyku (chyba że frozen eliksirem)
- Smoki: companion z buffami (gold multi, key drop, boss win)
- Cooldown zmiany aktywnego smoka
- Wizja readme: ognisko jasne vs węgle + pogoda — **kierunek art/UX**, w kodzie streak jest przede wszystkim liczbą + overlaye celebracji

---

## 9. Living World / Destiny (warstwa narracyjna)

### Co istnieje w danych

`secretIdentity`: gender, class, onboarding traits, titles, **activePaths**, moodHistory, storyMilestones.

`generateLivingWorldContext` buduje JSON dla promptu Mędrca (hero stats + secretIdentity).

### Co istnieje w UI Hero

- Lokacje (Mroczny Las, Ruiny Shoguna, Lodowy Fjord…) — lore + opisane bonusy
- Drogi (Ronin itd.) — etapy i przykładowe taski
- Interakcja „+” na ścieżce: często tylko haptics — **nie podłącza** `activePaths` / nie tworzy nawyków

### Werdykt as-is

Living World jest **mostem do AI** (działa w Sage). Destiny UI to **makieta produktu narracyjnego**, nie domknięty system.

---

## 10. AI — dwa silniki produktowe

| Silnik | Rola | Trigger |
|--------|------|---------|
| **Sage chat** | Motywacja, coaching w lore, 2–4 zdania | User pisze na tabie Sage |
| **Oracle / AIStat** | Wagi zadań + nocne gainy hex | Tworzenie habitów; DailyLoginSync na wczoraj |

Zależność: klucz Groq po stronie klienta (ryzyko produktowo-bezpieczeństwowe na produkcję).

Premium AI Sage z backlogu readme = w praktyce **już częściowo zrobione** jako darmowy chat — backlog jest nieaktualny względem kodu.

---

## 11. Social i konto

- Supabase Auth + `profiles` (`game_state` jsonb + player_class + sage_focus + player_id)
- Cloud sync: debounce upsert, last-write-wins
- `daily_reflections` — osobna tabela + lokalny mirror
- Friendships: pending/accepted/rejected
- RLS social: bardzo otwarte czytanie profili (pod search) — decyzja MVP, nie docelowy model prywatności

**Mail / DM:** w backlogu; w UI skrzynka = placeholder.

---

## 12. Daily Flow i rytuały

- Witanie dnia / flow po otwarciu (gdy nowy dzień)
- Rytuały Hero: odwiedź Sage, zrób quest, dungeon, „save progress”, itd.
- Epic milestones (długie cele)
- Refleksje dzienne (Hero / kalendarz)
- Recap z gainami Oracle (radar prawdziwy w Recap)

---

## 13. Backlog V2 z readme prototypu (nazwane, nie jako pełny produkt)

Traktować jako **już wymyślone kierunki**, nie jako zobowiązanie:

| Pomysł | Tag |
|--------|-----|
| Friends + DM / obecność | `social` |
| Leaderboard Global vs Friends | `social` |
| Guilds / co-op weekly quests | `social` `liveops` |
| Global World Bosses (weekend) | `liveops` |
| Crafting duplikatów → wyższa rarity | `economy` `cosmetic` |
| Marketplace P2P | `economy` `social` |
| SFX / epic UI sounds | `feel` |
| Creator / Streamer widget (OBS) | `platform` |
| Web dashboard / public profiles | `platform` |
| Real-world check-ins (geo / QR) | `platform` `liveops` |
| Wheel of Fortune (gacha za gold) | `economy` |
| Sklep Mędrca (np. tarcze streaka) | `economy` |
| Premium AI Sage | `ai` `monetization` |
| Task archive + heatmap | `loop` — **heatmapa już jest w prototypie** |
| Healthy Bingo events | `liveops` |
| Achievements gablota | `rpg` `cosmetic` |
| Mapa prowincji (social isometric) | `social` |

---

## 14. Co w prototypie jest „domknięte produktowo” vs „szkic”

### Domknięte / grywalne

- Castle habits + ekonomia dnia + fatigue
- D&D keys / battle / inventory / dragons (podstawowy loop)
- Sage chat + epic quest
- Onboarding klasy / profilu
- Sync postępu do chmury (happy path)
- Heatmapa / część Hero quests
- Oracle batch (logika istnieje)

### Szkic / niespójne / dekoracja

- Destiny Paths / Locations → Living World
- Hero hex radar vs prawdziwe hex stats
- Kingdom mapa prowincji + ranking z mockami
- Mailbox
- Auth bypass w trybie deweloperskim
- Dual titles (gameplay vs narrative)
- Drift lokalnego persist vs cloud (część pól profilu)

---

## 15. Filary ukryte w prototypie (hipotezy do konfrontacji)

Nie werdykt — tylko jak **można** odczytać prototyp przed Fazą 4:

1. **Real life → fantasy fuel** (nawyki zasilają świat)
2. **Daily honest work + variable fun** (Castle vs D&D)
3. **Companion AI in lore** (Sage)
4. **Identity & cosmetics** (klasa, loot, smoki)
5. **Social accountability** (Kingdom — niedojrzałe)
6. **Narrative memory** (Living World — niedojrzałe)

---

## 16. Anty-cele (implikowane przez prototyp)

Z decyzji designu w kodzie/readme:

- Nie robimy ciężkiego 3D / MMO world
- Loot z lochów nie ma psuć balansu nawyków powerem (deklaracja; combat synergy to wyjątek)
- Limit dziennego gold z nawyków + fatigue XP — anty-grind nieskończony
- Lochy nie mają być farmione bez limitu ekonomicznego (klucze)

---

## 17. Jednozdaniowe podsumowanie Fazy 1

**Prototyp to działająca pętla „odhacz → nagródź → zabaw się w D&D → pogadaj z Mędrcem”, z niedokończoną warstwą tożsamości narracyjnej i socialu oraz backlogiem LiveOps/platform, który trzeba skonfrontować z nową wizją — nie wdrażać w ciemno.**

---

*Koniec referencji prototypu. Używaj jako warstwy „Z prototypu” w plikach 01–14; cel finalny budujemy w `00-final-picture.md`.*

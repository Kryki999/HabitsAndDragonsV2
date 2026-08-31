# 06 — Economy & Loot

> **Status:** model roboczy Akt 1 (aktualizacja 2026-08-01 wieczór). Sumienność > spam. Pace do Titana ≈ **30 dni** (sumienny).  
> Ton produktu: **przyjemna przygoda, łatwo wejść, zero kary** — radość z korzystania, nie grind-kara.  
> Sync: [`03`](03-core-loop.md) · [`05`](05-rpg-progression.md) · [`02`](02-psychology.md) · mapa Rev B [`23`](23-act1-location-brainstorm.md).

## Z prototypu

Gold cap, fatigue XP, klucze (drop + sklep 150g), lochy, hex nocny batch.  

**Duch KEEP:** diminishing / hard zero po limicie, klucze, nocny hex.  
**Liczby gold/kluczy:** lock założyciela poniżej (nie V1 1:1).

---

## Cel psychologiczny

| Zasada | Sens |
|--------|------|
| Przyjemność, nie kara | Łatwy start („woda + zęby = klucz = walka”); zero punish za miss |
| Sumienność | Codzienne logowanie + odhaczanie; spam 100 zadań = **0** gain po limicie |
| Lochy = dopamina | **Darmowe wejście per loch** (CD wg tieru) + klucze na ekstra; rano zawsze da się z kimś powalczyć |
| Akt 1 ≈ 30 dni | Potrójna bramka: level/wpływ + aktywne dni + poprzedni Main ★ |
| Fabuła ≠ gold | Piny Main/side i dom-tier **nie** za złoto |

---

## Waluty i metryki (Akt 1)

| Metryka | Rola | Gate fabuły? |
|---------|------|--------------|
| **XP → Level / wpływ** | Progres postaci i stolicy | Tak (progi) — **liczby XP TBD przy Day 0–7** |
| **Aktywne dni** | Licznik sumienności | Tak |
| **Złoto** | Sink: klucze (głównie), flex, skin domu | **Nie** |
| **Darmowe wejście (CD per loch)** | Walka bez klucza, gdy timer gotowy | Nie |
| **Klucze** | Wejście gdy CD niegotowe / burst | Nie |
| **Affinity NPC** | 3 levele, flex/lore | Nie |
| **Hex** | Poranny reveal; bez powera M1 | Nie |

```text
Nawyki (lista zwykła)
  ├── Gold: 5× pełne → 5× 20% → potem 0  →  max 300g/dzień = 3 klucze
  ├── XP:   te same pasma (wartości absolutne TBD Day 0–7)
  ├── Drop klucza: 20% → 5% → 1% (max 3 z farta)
  └── Affinity + nocny hex

Per loch: darmowe wejście gdy CD gotowe (Common częściej, Titan rzadko)
  + klucze (sklep/drop/ad?) na walkę poza CD
  → rano bez kluczy i tak możesz bić kogoś z gotowym CD
```

---

## 1. Złoto — LOCK (założyciel 2026-08-01)

Dotyczy **zwykłych zadań z listy** (nie osobnego Epic/Mędrzec — ten osobno, jeśli wróci).

| Pasmo dnia | Gold / zadanie | Max z pasma |
|------------|----------------|-------------|
| Zadania **1–5** | **50** | **250** |
| Zadania **6–10** | **10** (= 20% z 50) | **50** |
| Zadanie **11+** | **0** | 0 |

| | |
|--|--|
| **Max gold z listy / dzień** | **300** |
| **Cena klucza** | **100** |
| **Klucze ze sklepu przy max gold** | **3** / dzień |
| Hook | **2 zadania = 100g = 1 klucz** (woda + zęby → walka) |

**Morning gold:** **KILL na teraz** — login już daje hex reveal + streak; pierwsze zadanie i tak sypie gold. Nie komplikować.

**Epic / zadanie Mędrca (jeśli wróci w final):** seed **+100 gold** poza pasmami listy (1/dzień) — dograć przy Mentora; = ~1 klucz ekstra lub część flex.

**Sinki gold:** klucze + **sklep straganu** (sprzedaż loot / kupno itemów / mikstury) + flex/skin domu. Fabuła nadal nie. Zob. §7.

---

## 2. Klucze — LOCK drop + sklep

| Źródło | Reguła |
|--------|--------|
| Sklep | 100g = 1 klucz (do 3/dzień z samego gold listy) |
| Drop z nawyku (kolejne klucze **z dropu** danego dnia) | 1. drop dnia: **20%** · 2.: **5%** · 3.: **1%** · dalej brak |
| Max drop z farta | **3** klucze/dzień (mega RNG na trzecim) |
| Beat ★ / NPC affinity | Okazjonalnie (nie psuje daily) |

1 klucz = **1 wejście** gdy darmowe CD lochu **niegotowe** (albo chcesz burst / farmić tego samego wcześniej).

---

## 3. Wejścia do lochów — darmowe CD per loch (LOCK kierunku 2026-08-03)

**Globalna energia walki: KILL / zastąpione.**  
Zamiast tego: każdy loch/boss ma **własne darmowe wejście** + licznik odnowienia po użyciu.

| Tier | Darmowe wejście | CD seed (po darmowej walce) | Nota |
|------|-----------------|----------------------------|------|
| **Common** (np. Gutterjack) | Tak | **~6–8 h** | Rano + wieczór realne |
| **Elite** | Tak | **~10–12 h** | ~1–2×/dzień |
| **Champion ★** | Tak | **~24–48 h** | Rzadziej; klucze = farm |
| **Titan** | Tak | **~72 h** (ew. 96) | Weekendowy rytm |

**UI:** na lochu widać „Darmowe wejście” **albo** timer **albo** „Wejdź za klucz (100g / 1 klucz)”.

**Pierwszy Gutterjack (tutorial):** darmowy + **100% win** — potem normalny CD Common.

**Reklama (seed):** np. skróć CD wybranego lochu / +1 darmowe — dograć; nie globalna „energia”.

**Budżet dnia (intuicja):** bez kluczy i tak kilka Common/Elite z gotowym CD; klucze = fokus na ulubionym bossie / Champion poza oknem. Cel nadal ~kilka walk dziennie, nie nieskończony farm jednego titana.

**2 klucze na late lochy:** nadal **PARK**.

---

## 4. XP — kierunek (liczby przy Day 0–7)

**Pasma jak gold** (żeby gracz czuł jeden rytm):

| Pasmo | XP |
|-------|-----|
| Zadania 1–5 | **100%** pełnej nagrody zadania |
| Zadania 6–10 | **20%** |
| 11+ | **0** |

- Trudność easy/medium/hard lekko moduluje bazę **w obrębie** pasma, nie przebija hard zero po 10.
- **Absolutne XP / level curve / progi mapy** = **TBD** przy planowaniu **Day 0–7** (`17`) — wtedy spinamy matematycznie odblokowania pinów.
- Do tego czasu: bramki jakościowe (level + aktywne dni + ★) bez fałszywej precyzji liczb XP.

**Anti-exploit XP:** hard 0 po 10. zadaniach dnia → nie da się „przejść Aktu” spamem.

### Finch vs my — „zawsze coś” bez speedrunu (2026-08-03)

Finch **zawsze** daje coś (nawet przy 100 taskach), bo meta = przyspieszenie podróży o minuty — po chwili i tak się odechciewa klikać, a **nie** odblokowujesz całego aktu.

U nas meta = **level / mapa / 30 dni**. Gdyby XP/gold nigdy nie padały do zera → speedrun Aktu.

| Warstwa | Po tasku 11+ | Speedrun?
|---------|----------------|-----------|
| **XP / level / wpływ** | **0** | Chroni Akt |
| **Gold / drop klucza** | **0** | Chroni ekonomię |
| **Heatmapa / streak / haptics / animacja odhaczenia** | **zawsze** | Feel Finch |
| **Affinity NPC (mikro-drip)** | **tak, drobno** (nie przebija progów dnia) | Relacja, nie mapa |
| **Hex nocny batch** | Liczy się do wczorajszego dnia (z capem) | Tożsamość, nie loch |

**Werdykt:** model pasm **zostaje**. Martwienie „pusto po 10” leczymy **soczkiem nieprogresyjnym**, nie złotem/XP. Opcjonalny copy UI: „Dziś iskra woli już pełna — jutro znowu” (radość, nie kara).

---

## 5. Odblokowania mapy i domu

Bez zmian filozofii: **nie za gold**.

| Beat | Bramka |
|------|--------|
| Side R1 | Po Gutterjacku + min. level + **punkt odkrycia**; gracz wybiera pin |
| Main ★1 | ≥2 R1 **oraz** level **oraz** aktywne dni |
| Pool R2 (Mag / cmentarz / …) | Soft breadth ≥2 R1 + punkt odkrycia — **kolejność dowolna** |
| ★2 / ★3 Osiris / Titan | Poprzedni ★ + level + aktywne dni (chronologia Main) |

Discover-once = immersja, nie jedyny hamulec 30 dni.  
**Level nie przypina konkretnego side-pinu** — szczegóły [`17`](17-player-journey.md).

**Dom:** tier = level/wpływ; gold = skin.

### Szkic czasu (sumienny) — sync `17` / `23` §I (2026-08-04)

| Okno | Treść |
|------|--------|
| 0–7 W1 | Hub, R1 (wybór), ★1 |
| 8–14 W2 | ★2 + ★3 · R2 do wyboru · Dom Lv3 |
| 15–21 W3 | Prep · **Titan ~L13 / D18–19** (discover=walka) · L14 most |
| 22–30+ W4 | Most Aktu 2 |

> **Archiwum:** starsze okna (Osiris D19–25 / Titan D26–30 / L14 fight gate) — nadpisane; patrz `17` inventarz Akt 1.

→ [`23`](23-act1-location-brainstorm.md) §I · [`17`](17-player-journey.md).

---

## 6. Walka — % wygranej (model roboczy)

Hojność **darmowych okien** + kluczy jest OK, jeśli **wygrana nie jest pewna** i loot ma rarity.

### Filozofia trudności

| Moment | Odczucie |
|--------|----------|
| Pierwszy raz vs Champion / Titan | **Ciężko** (Titan najciężej) |
| Pierwszy raz vs Elite side | W miarę ciężej — nie free win |
| Po **first clear** tego samego bossa | Wyraźnie łatwiej farmić (bonus % — wielkość TBD) |
| Common po ogarnięciu | Często wygrywasz — radość |

**UI (LOCK kierunku):** przed walką **% wygranej**; tap → breakdown: level, first clear, itemy, affinity, pot.

### Formuła (składniki — M1)

```text
szansa ≈ f(level gracza − level bossa)
        + bonus first clear (jeśli już pokonany)
        + suma afiksów itemów (boss / biom / tier)   // NIE STR/AGI/INT
        + bonusy affinity NPC (progi 1/2/3)
        + mikstura (max 1 efekt walki)
→ clamp np. 5%–95% (liczby TBD)
```

| Składnik | Rola | Nota |
|----------|------|------|
| **Δ level** | Rdzeń | Lochy/bossy mają level; różnica → baza % |
| **First clear** | Duży boost po 1. wygranej | Seed „sporo” (np. okolice +15–25%) — **przeliczyć** z krzywą leveli |
| **Itemy (afiksy)** | Przewaga situational | +% vs **ten** boss / biom / tier — nie uniwersalne „+siła” |
| **Mikstura** | Jednorazowo | Max **1** na walkę (win **albo** loot — nie stack 3 potów w jedną walkę; więcej potów = więcej **osobnych** walk) |
| **Affinity NPC (3 levele)** | Stały mały bonus po wbiciu poziomu | Np. kowal/las → +% vs bossy **biomu las**; nie one-shot questa — **progi affinity** |
| **Hex** | **OUT z walki w Akcie 1** | Tożsamość / Mentor / poranny wow |

**Naturalny flow farmu:** przy 90–95% na starych bossach gracz **sam** woli nowszych (60–80%, lepszy loot). Wspieramy dropem i skupem:

| Zasada | Sens |
|--------|------|
| Loot z wyższego bossa / tieru | Lepszy expected value (rarity + afiksy) |
| Skup u straganu | Common/Unikat/Heroic z **niskiego levelu bossa** << te same rarity z **wyższego** |
| Best-in-slot z trash moba | Albo nie dropi „końcowego” afiksu, albo drop jest tak rzadki że EV i tak gorszy niż mid-boss |

First clear boost (seed ~+15–25%): **kalibracja z krzywą leveli** przy Day 0–7 / M1 — nie dogma.

**Świadomie nie robimy:** Habitica STR/AGI/INT; hex → win% w M1; stack potów w jednej walce.

### Dlaczego hex nie wchodzi do lochów (na razie)

Gracze budują sześcian z **różnych** żyć (nauka, siłka, rodzina, higiena…). Bonus hex↔boss = albo narzucamy „właściwą” drogę, albo bonus jest tak mały że zbędny.  
**Park** resonance. M1 walka = **level + afiksy + first clear + affinity NPC + pot**.

---

## 6b. Itemy — flex + afiksy (nie klasyczne staty RPG)

| Warstwa | Co robi |
|---------|---------|
| **Wszystkie** | Flex / wygląd (strój, artefakt) |
| **Common / Zwykły** | Głównie flex; słaby lub brak afiksu |
| **Unikat** | **1** afiks — symboliczny smaczek |
| **Heroiczny** | **1 mocniejszy** afiks (np. darmowe zamrożenie streaka / tydzień) |
| **Artefakt (Titan)** | Do **2** afiksów — nadal nie wywracają gry, ale czuć „Titan” |

**Freeze streak:** drogi w sklepie (seed **500–1000g**) → afiks „1 free freeze / tydzień” na Heroic+ ma realną wartość vs kupowanie potów.

**Przykłady afiksów (seed):**

| Typ | Przykład |
|-----|----------|
| Combat biom / boss | +% win vs piraci / las / pustynia / konkretny boss |
| Ekonomia | +% gold z nawyków; +szansa dropu klucza |
| QoL | +1 freeze / tydzień; zniżka u straganu |
| Loot | +szansa lepszego rarity na typ lochu |

**Affinity NPC → stały bonus walki (seed):** po wbiciu poziomu 1/2/3 u NPC (nie „jeden quest”) — mały permanent +% vs powiązany biom/treść (las, szlak, ekran≠walka…). Stack z itemami, widoczny w breakdown %.

---

## 6c. Afiksy — katalog, anti-swap, aukcje, levele (LOCK kierunku 2026-08-04)

> Senior GD pass: flex fantasy vs situational power vs ekonomia.  
> Problem założyciela jest prawdziwy: jeśli każdy Unikat/Heroic jest „pod jedną akcję”, gracz **swapuje loadout** i zabija flex.

### Filary (LOCK)

| # | Reguła |
|---|--------|
| 1 | **XP / level curve z itemów = KILL** — nie przyspieszamy Aktu 1 |
| 2 | Afiks działa **tylko gdy item jest equipped** (1 Outfit + 1 Atrybut) — **nie** stack z całego ekwipunku |
| 2b | **Anti-swap:** Atrybut lock do **resetu dnia** po zmianie; Outfit+Emotka zawsze wolne; afiksy głównie broad |
| 3 | Preferuj afiksy **całodniowe / lifestyle**, nie „+15% vs ten jeden boss na 30 s” |
| 4 | Situational combat = **słaby lub rzadki**; identity biomu OK jeśli gracz *chce* wyglądać jak pirat w Teeth |
| 5 | **Zużycie / durability itemów = KILL** (kara, anty-Finch) |
| 6 | **Poziom itemu jak w classic RPG = NIE** — obsolescencja przez **lepsze afiksy z wyższych bossów**, nie STR |
| 7 | **Aukcje gracze↔gracze = PARK M1** (zostaje); wracamy przy social / Akt 2 |
| 8 | Bind-on-equip + „bonus forever w plecaku” = **NIE w M1** bez twardego capu — rozwala win% i tempo |

### Dlaczego nie „ Margonem aukcja + bind = bonus zawsze”

Pomysł aukcji jest sexy (Heroic za dziesiątki kluczy). Ale w *tej* grze:

- M1 = habit + mapa + 30 dni — aukcja to osobny produkt (trust, fee, boty, UI, support).
- „Założysz raz → bonus forever w inventory” bez capu = gracze zbierają 15 afiksów → Akt 1 pęka matematycznie.
- Cap „max 3 aktywne z kolekcji” = **trzeci system loadoutu** obok 2 slotów — komplikacja day 1.

**Werdykt M1:** zostawiamy **2 sloty equipped = jedyne aktywne afiksy**. Flex = co nosisz. Duplikaty / słabe → skup straganu (świadomie tanio). Aukcja = later, gdy social żyje.

**Jeśli kiedyś aukcja:** wtedy dopiero BoE (unbound trade → equip binds → **equipped-only** bonus, nie forever-inventory). Nie odwrotnie.

### Anti-swap (LOCK 2026-08-05) — jak nie zabić flexu

**Problem:** gracz zmienia EQ pod każdą walkę / akcję → flex umiera, UX śmieciowy.

**Rozwiązanie (hybrid, nie sam timer):**

| Warstwa | Reguła |
|---------|--------|
| **1. Design afiksów** | Na **Atrybucie** preferuj bonusy **całodniowe** (gold, freeze, Second Tide, koło, sklep, reroll Mentora…). Situational biom = rzadsze i **słabsze** |
| **2. Lock slotu mocy** | **Atrybut:** po zmianie → **lock do resetu dnia** (ten sam moment co nowy dzień gry / hex). Do rana nosisz wybór |
| **3. Flex wolny** | **Outfit** + **Emotka:** zmiana **zawsze wolna** (M1: outfit ≈ wygląd; emotka = 0 power) |

```text
Zmieniasz Atrybut (np. Cork → Necklace)
  → bonus Necklace ON
  → slot Atrybut ZABLOKOWANY do resetu dnia
  → Outfit/Emotkę możesz zmieniać dalej pod flex
Reset dnia (rano)
  → znowu możesz zmienić Atrybut (i znowu lock do kolejnego resetu)
```

**Dlaczego nie lock na Outfit:** wtedy nowy strój „na pokaz” też czeka 24h — zabija social flex. Moc i tak siedzi w Atrybucie.

**Dlaczego reset dnia, nie sliding 24h:** jeden zegar co cała gra (jak nawyki / hex).

**Wyjątki UX:**
- Day 0 / teach Gutterjack: bez locka aż po pierwszym equipie tutorialowym.
- Opcjonalnie later: dropnięcie Unikat/Heroic → **1 free swap** Atrybutu tego dnia (żeby nowy jackpot nie czekał do rana) — seed, nie blokuje M1.

**PARK / nie robimy w M1:** lock po pierwszej walce dnia; forever-bag bonuses; swap fee w goldzie.

### Katalog afiksów (pula do projektowania itemów)

**A. Combat (ostrożnie)**

| Afiks | Nota |
|-------|------|
| +% win vs **biom** / typ lokacji (piraci, las…) | Unikat OK; trzymaj małe liczby |
| +% win vs **tier** (Common / Elite) | OK (Necklace-adjacent) |
| +% win vs **konkretny boss** | Rzadko — zachęta do flexu tożsamości, nie BiS uniwersalny |
| +% win vs bossy **już first-cleared** | Fajne early; nie zastępuje global first-clear bonusu z `06` §6 |
| **Second chance** (1 rematch bez klucza) | Heroic+; limity tierów (np. C/E only) — wzór: Still Tide |
| Szansa **nie zużyć klucza** przy wejściu (tier X) | Heroic; bardzo silne — małe % |
| +% win **global** vs wszyscy | **Prawie KILL** / tylko Artefakt mikro — psuje krzywą |

**B. Ekonomia (nie XP)**

| Afiks | Nota |
|-------|------|
| +% **gold z nawyków** (w ramach daily cap) | Unikat/Heroic — nie podnosi capu 300 bez decyzji |
| +% gold ze **skupu / drop gold** z lochów | OK |
| +szansa **dropu klucza** z nawyku | Heroic territory |
| Zniżka **stragan** / tańsze poty | QoL |
| +szansa pasma **Unikat/Heroic** z Elite | Artefakt / late Heroic — **bardzo** ostrożnie (inflacja) |

**C. QoL / rytuał**

| Afiks | Nota |
|-------|------|
| 1×/tydzień **freeze streak** | Heroic klasyka |
| Reroll zadania **Mentora** (1×/dzień lub tydzień) | Unikat/Heroic — zero XP bonus, tylko wybór |
| Lepsze szanse / 1 extra na **kole** menelni | Tematyczne |
| Skróć **timer discover** nowej lokacji | Unikat+ — immersja, nie level |
| +drip **affinity NPC** (nie XP postaci) | OK małe |
| Emotka / flex-only | Zwykły |

**D. Świadomie NIE (KILL / prawie)**

| Afiks | Dlaczego |
|-------|----------|
| +XP / +level / więcej XP z tasków | Rozwala 30 dni |
| Odblokuj pin / pomiń bramkę Main | Fabuła ≠ loot |
| +win% Champion/Titan duże early | Tempo Championów |
| Nieskończone retry | Ekonomiczny break |
| Stack 5× situational w bag | Anti-flex + power creep |

### Levele bossów vs levele itemów

- **Bossy mają level** — win% z Δ level (już w §6).  
- **Itemy nie mają „item level” do outgrow** jak miecz +10.  
- Wyższy boss → **lepsza jakość afiksu / rarity**, nie „+stat”.  
- Stary Heroic (Second Tide) może zostać w loadoucie **cały Akt 1** obok nowszego flexu — to OK (QoL nie umiera).  
- Combat-biom Unikat z R1 może być *słabszy EV* niż Champion Unique — gracz sam wybiera flex vs min-max.

### Co robimy teraz (werdykt)

| Temat | Decyzja |
|-------|---------|
| Katalog afiksów | **KEEP** rozszerzony (tabele wyżej) — dopinać per item |
| Equipped-only power | **LOCK M1** |
| Anti-swap | **LOCK:** Atrybut → reset dnia; Outfit/Emotka free; afiksy mainly broad |
| Forever-bag / bind stack | **KILL M1** |
| Aukcje | **PARK** (bez zmiany) |
| Durability | **KILL** |
| Item level RPG | **KILL** |
| Necklace Second Tide | **KEEP** jako wzór Heroic QoL-combat |

Otwarte na later: free swap przy nowym Unikat/Heroic dropie; **aukcje = model BoE poniżej, ship z social/Akt 2**; Artefakt mikro global +%.

### Aukcje — model docelowy (PARK M1, KEEP design)

> Bez „bonus forever w bagu”. Prosty **Bind on Equip**.

| Stan itemu | Co możesz |
|------------|-----------|
| **Unbound** (świeży drop, nigdy nie equipped) | Aukcja gracze↔gracze · albo skup NPC (tanio) |
| **Bound** (założyłeś ≥1 raz) | **Nie** na aukcję · skup NPC nadal (świadomie słaby gold) · afiks tylko gdy equipped |

**Po co:** Heroic/Unikat z farta = prawdziwy jackpot ekonomiczny (dziesiątki kluczy między graczami), duplikat = sell, flex/trade social.  
**Po co nie w Day 0–30:** osobny produkt (UI, fee, escrow, boty, support, podatki gold); Akt 1 ma domknąć mapę + loot + habit. Tab Społeczność najpierw friends/ranking.

**Spinanie z anti-swap:** zero konfliktu — Bound ≠ forever-power; nadal equipped-only + lock Atrybutu do resetu dnia.

**Kiedy UNPARK:** po żywej Społeczności / most Aktu 2 — nie zamiast domykania R1.

---

Drabinka rarity (LOCK 2026-08-04): **4 poziomy**, nie 5.

| EN (UI) | PL | Afiksy | Skąd głównie |
|---------|-----|--------|----------------|
| **Common** | Zwykły | 0 (flex) | Common lochy, farm |
| **Unique** | Unikat | **1** smaczek | Elite ~7% pasmo · Champion+; hub Common wyjątek |
| **Heroic** | Heroiczny | **1 mocniejszy** | **Elite+** rare · Champion · nie Common early |
| **Artifact** | Artefakt | do **2** | **Tylko Titan** (Akt 1 ≈ 1–2 szt.) |

**KILL:** osobny tier „Legendary” między Heroic a Artifact — rozwadnia Titanów i clutter UI.  
Akt 1 ma mało Titanów → Artefakt = święto aktu, nie kolejny kolor w dropdownie.

### Skąd rarity spada (filozofia per tier bossa)

| Boss tier | Typowy pool | Heroic? | Artifact? |
|-----------|-------------|---------|-----------|
| **Common hub** (Gutterjack) | Gold · Zwykłe · Unikat rare (~5–7%) · słaby pot — wyjątek tutorial/hub | **Nie** | Nie |
| **Common side** (np. Stillgaze) | Gold · Zwykłe · Unikat ~7%; **bez** Heroic | **Nie** | Nie |
| **Common trash** (załoga przy Elite-szefie) | Gold · Zwykłe; **bez Unikatu** jeśli lokacja ma Elite | **Nie** | Nie |
| **Elite** | Gold · Zwykłe · **Unikat ~7%** · **Heroic ~2%** | **Tak (bardzo rare)** | Nie |
| **Champion ★** | Unikaty / Heroic wyżej (TBD %) | Tak | Nie |
| **Titan** | Heroic · **Artifact** | Tak | **Tak** |

**Filozofia volume:** dużo walk/dzień (CD + klucze z pensji/kubeczków/skupu) → **niskie** % na Unikat/Heroic.  
**First clear Elite/Champion:** **bez** gwarancji Unikatu/Heroic — ten sam roll co farm. (Gutterjack first clear = Cork zostaje jako teach loadout.)

### Roll rarity — **nie stackuje się** (LOCK 2026-08-04)

```text
1) Rzuć PASMO rarity (jedna liczba, suma 100%):
     Pusto | Gold | Zwykły-item | Unikat | Heroic | (Artifact na Titanie)
2) Jeśli padło pasmo z pulą itemów → wylosuj 1 item
     równo z itemów w TYM paśmie (2 Unikaty ≠ 2× %)
```

**Źle:** 2 Unikaty × 7% = 14%.  
**Dobrze:** pasmo Unikat = **7%** → potem 50/50 między Unikat A i B.

To samo dla Heroic (pasmo **~2%**, potem wybór w puli Heroic).  
Dokładne % pasm = per boss w `23` §D.

### Loadout wizualny (prosty — nie Habitica)

| Slot / warstwa | Rola |
|----------------|------|
| **Outfit** | Strój postaci — **jak wyglądasz** (flex). Afiks rzadki / later; early głównie kosmetyka |
| **Atrybut** | Gadżet / broń-symbol / pierścień / kruk / dywan / klątwa / cokolwiek **trzymanego lub unoszącego się** przy postaci — flex + **tu siedzą afiksy** |
| **Emotka** | **Kolekcja** (nie 3. slot EQ): dab / taniec / gest. Jedna **equipped** (tap na postać, profil, level-up). **Zero** win% |

**Źródła emotek:** lochy, poziomy affinity NPC, beaty Main ★.  
Budżet Akt 1: mało, ale charakterystycznych (seed ~8–12), mix meme + lore Crownhaven. Rive na bohaterze.

### Taksonomia dropów (LOCK kierunku 2026-08-04)

> Pierwszy boss z tabelą = Gutterjack → reguła dla **wszystkich** lochów Aktu 1.

**Cztery wiadra (tylko te):**

| Wiadro | Co to jest | Gdzie ląduje |
|--------|------------|--------------|
| **Atrybut** | Permanent — slot EQ #2 | Bohater → wyposaż / sprzedaj |
| **Outfit** | Permanent — slot EQ #1 | Bohater → wyposaż / sprzedaj |
| **Emotka** | Permanent — kolekcja | Bohater → equip one |
| **Consumable** | Jednorazowe (mikstury walki / freeze / loot-luck) | Plecak zużywalny → użyj przed walką / na QoL |

**Świadomie NIE robimy:**
- czwartej kategorii „śmieć którego nie da się założyć” (dead inventory) — to Habitica clutter;
- Zwykły bez afiksu = i tak **atrybut/outfit** (flex + skup 10–15g), nie osobny trash-typ.

**Skąd co zwykle spada:**

| Źródło | Głównie | Czasem | Rzadko / later |
|--------|---------|--------|----------------|
| **Boss / loch** | Atrybuty (Zwykły→Unikat→…) | Emotka tematyczna | Outfit (tożsamość bossa / biomu); mała szansa **1 pot** |
| **Stragan** | Klucze, freeze, rotacja flex | — | — |
| **Mag / NPC** | Mikstury (główne źródło potów) | — | — |

**Reguła potów z bossów:** OK jako **bonus farmu** (mała szansa), nie jako główna nagroda first-clear. First-clear uczy **loadout** (atrybut/outfit/emotka), nie „wypij potkę”.  
Limit walki bez zmian: **max 1 efekt potu** na walkę (`06` §8).

**Outfit z żula / early Common:** **ostrożnie** — Gutterjack **nie** dropi outfitu (brzydki żul ≠ fantasy skin gracza). Outfity = czytelna tożsamość (pirat, las, pałac…), nie każdy Common.

---

## 7. Sklep straganu (główny sink gold) — KEEP kierunek

Pierwszy NPC rynku = też **kupiec**. Lore + ekonomia w jednym.

| Akcja | Sens |
|-------|------|
| **Sprzedaj loot** | **Kieszonkowe**, nie pensja. Seed skupu: Zwykły ~**10–15g**; Unikat ~**trochę > klucz** (np. ~120–200g); Heroiczny ~**kilka kluczy** (np. 300–600g). Lekki bump z levelem bossa, **bez** agresywnej inflacji. Pensja nawyków (300g) = kręgosłup |
| **Kup klucz** | 100g; 1 klucz = 1 wejście poza darmowym CD (**2 klucze later = PARK**) |
| **Mikstura zamrożenia streaka** | Drogo (seed 500–1000g) — joy, nie spam |
| **Rotujący stock** | 3–4 itemy; refresh ~co tydzień |
| **Skin / drobiazgi / emotki** | Opcja kosmetyczna |

Psychologia: gold pod refresh / outfit — „klucz teraz vs item za tydzień”. Sprzedaż loot = dopłata, nie zamiennik odhaczania.

**Ekran:** 9:16 babka + lady; **6 pustych gniazd** L/R (klucz, freeze, rotacja). SKU maluje UI, nie ilustracja. Skup loot = dolny pasek. Art: [`prompt-vendor-shop.md`](reference/art/prompt-vendor-shop.md).

**Twarda reguła:** normalny dzień sprzedaży trash **<<** 300g pensji; jackpot Unikat/Heroic = miły bonus.

**Dom aukcyjny (gracze↔gracze):** **PARK M1 / odblokować z social** — model docelowy poniżej (§6c aukcje). Skup NPC zostaje świadomie tani vs trade later.

---

## 8. Mikstury u innych NPC (seed)

| Pomysł | NPC | Efekt seed | Nota |
|--------|-----|------------|------|
| Mikstura wzmocnienia | Mag (Pallglass) po affinity / quest | +10–15% win jednorazowo | ~50g — wybór vs klucz |
| Mikstura szczęścia lootu | Mag lub stragan | +szansa lepszego rarity na 1 walkę | Nie stackować w nieskończoność |
| Freeze streak | Stragan | Zamroź serię | Już wyżej |

Limit: 1 pot walki naraz (albo win **albo** loot) — unikamy „potion tax” na każdą walkę.

---

## 9. NPC affinity — warianty bramek (nie tylko kategoria)

Większość NPC: **temat nawyków** (jak wcześniej).  
**1–2 specjalne** dla smaku:

| NPC | Alternatywna bramka (seed) |
|-----|----------------------------|
| Kowal | Level 1/2/3 affinity od **streak global** (np. 5 / 10 / raz 20) |
| Inny | N nawyków z rzędu po 7 dni (1→2→3) |
| Mag / stragan | Zostaje temat (ekran / codzienność) |

**Uwaga:** kowal-streak + mikstura freeze = pętla. Freeze drogi albo kowal liczy „naturalny” streak bez freeya — dograć.

---

## 10. Loot rarity — skrót

Pełna filozofia itemów / afiksów: **§6b**.  
Zwykły → Unikat → Heroiczny → Artefakt (Titan). **4 tiery** (nie Legendary). Częste walki = Zwykły; Unikat cieszy; Heroic z Elite+; Artifact = Titan.

---

## 11. Hex

- Nocny batch → poranny reveal; bez powera M1.  
- Cap dziennych gainów hex.

Smoki / crafting: **PARK**.

### 11b. Menelnia — koło + kubeczki (UNPARK 2026-08-04)

Po clear **Gutterjack** odblokowują się klimaty menelni ([`23`](23-act1-location-brainstorm.md) §B2). **Nie** fake RNG.

| System | Reguła |
|--------|--------|
| **Koło** | 1×/dzień darmowy · 2. = reklama · 3+ = gold; szanse **jawne** |
| **Kubeczki** | ~33% → np. ×3 stawki; max bet / cap dzienny TBD |
| EV | Poniżej pensji nawyków (300g) — sink + radość, nie druga pensja |

Liczby nagród koła / max bet = TBD przy LiveOps / monetization pass.

---

## Tabela liczb (status)

| Parametr | Wartość | Status |
|----------|---------|--------|
| Gold zadania 1–5 | 50 | **LOCK** |
| Gold zadania 6–10 | 10 (20%) | **LOCK** |
| Gold 11+ | 0 | **LOCK** |
| Max gold listy / dzień | 300 | **LOCK** |
| Cena klucza | 100 | **LOCK** |
| Drop klucz 1/2/3 dnia | 20% / 5% / 1% | **LOCK** |
| Morning gold | — | **KILL** |
| Sage epic gold | ~100 (1/dzień) | Seed, jeśli wróci |
| XP pasma | 100% / 20% / 0 (jak gold) | **LOCK kształt** |
| XP absolutne / levele | TBD | **Day 0–7** |
| CD Common / Elite / Champ / Titan | ~6–8 / 10–12 / 24–48 / 72 h | **LOCK kierunku** |
| Globalna energia | — | **KILL** |
| Ad vs CD | skróć CD / extra free | Seed |
| Gutterjack first | darmowy + 100% win | LOCK |

---

## Checklist locku

- [x] Skup: Zwykły ~10–15g; Unikat ≥ klucz; Heroic ~kilka kluczy; aukcje PARK  
- [x] Emotki: kolekcja + 1 equipped; nie 3. slot EQ  
- [x] 2 klucze na late lochy = PARK  
- [ ] Krzywa level + first-clear % liczby (w Day 0–7)  
- [ ] Konkretne % affinity per poziom NPC  
- [x] Wejścia = darmowe CD per tier (nie globalna energia)  
- [ ] Exact godziny CD (6 vs 8; 24 vs 48 Champ)  
- [ ] Sage epic: KEEP czy park  
- [ ] Kowal = streak affinity — KEEP czy park?  
- [ ] Reklama: skróć CD czy osobne free?

---

## Otwarte

- Matematyczny XP ↔ progi Day 0–7 / M1.  
- Klucz UX: tylko gdy CD niegotowe (jasny komunikat).  
- Soft nudge pustej gałęzi mapy.  
- % mikro-bonusów loot.

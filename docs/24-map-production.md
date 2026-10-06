# 24 — Produkcja mapy (art + runtime)

> **Status:** LOCK kamery + siatki pinów **2026-09-25**. Kwadrat ~4:5, hub w środku, pan X i pinch = **superseded**. Close-up 9:16 i „dwa kadry, jeden świat” (mapa ≠ zoom JPEG) zostają.  
> Art: [`09`](09-art-graphics.md) · Feel: [`10`](10-animation-feel.md) · Tech: [`12`](12-tech-stack.md) · Lokacje Akt 1: [`23`](23-act1-location-brainstorm.md) §C.  
> Makieta (kłódka kompozycji): [`reference/ui/lookdev/world-map-gray.html`](reference/ui/lookdev/world-map-gray.html) · golden [`reference/ui/golden/world-map-gray.png`](reference/ui/golden/world-map-gray.png).

**Pytanie założyciela (2026-08-15):** jak wygenerować dużą mapę pod telefon — czy 4K 16:9?  
**Odpowiedź 2026-09-25:** nie 16:9 i nie kwadrat. **Pionowy pasek** = szerokość telefonu, scroll tylko góra–dół.

---

## LOCK 2026-09-25 — kamera i siatka (zatwierdzone)

Produkt: **pielgrzymka w pionie**, nie orbita strategii. Crownhaven = próg domu na dole. Ananiel = czubek aktu, jedyny horyzont.

| Lock | Werdykt |
|------|---------|
| Szerokość | Fit-width: mapa = szerokość ekranu (lookdev 390). **Zero panu lewo–prawo.** |
| Wysokość | Graybox **390 × 1920** (~1:4.92). Spawn pokazuje dolny fold; reszta = scroll w górę. |
| Zoom | **Brak pinch** na MVP. Jedna skala produktowa. |
| Kąt | **Płytki wysoki kąt (~15–25°)**. Nie czysty top-down, nie obecne mocne izo rozciągnięte na 5 ekranów. Horyzont **tylko u góry** (pustynia / Ananiel). |
| Piny | Na danej wysokości: **albo jeden środek** (trakt), **albo para L/P** (środek pusty). Nigdy trzy, nigdy środek+skrzydło. |
| Odstęp | Jeden moduł **B = 200 px** na artboardzie 390 (środek–środek rzędów). Bez ciaśniejszego A przy stolicy i bez szerszego C na pustyni. |
| Vampire | Pobocze: **rząd skrzydeł**, pin **prawo**, lewo = rezerwa Akt 2 (blob terenu, **nie** pusty pin). |
| Spawn | Dolny ekran: Crownhaven + Approaches + Teeth / Anvil. Closed Way tuż nad ramką = hak do scrolla. |
| `MapPin.current` | Kursor wyboru (awatar skacze po tapie), nie „tu mieszkasz”. Chrome: [`design-bible.md`](reference/ui/design-bible.md). |
| Górna poświata | **KILL.** Ani `ScrimTop`, ani lawendowy `.fog` / `topFog`. Dolny `Seam.dock` zostaje. **Fog of war nie jest chrome** tego MVP (2026-10-06) — całe królestwo widać; kłódka pinu = za niski level. |

Nie stretchujemy obecnego `map_board.png`. Nie promptujemy „ta sama mapa, tylko wyższa”. **Nie** dociągamy dołu skryptem (kafel morza / pad). Generator dostaje **szary PNG jako composition lock**. Południe pod PeekCard = **namalowane** (port, woda, skały w tej samej kresce), albo zmiana kompozycji Crownhaven — nie pasek pikseli.

### Rzędy (z góry = północ)

```text
Ananiel                 środek
Pyramid                 środek
(rezerwa) · Vampire     skrzydło / pusto
Raven Castle            środek     ★2
Water Temple · Pallglass
Closed Way              środek     ★1
Teeth · Anvil           lewo / prawo     ← wybór R1
Approaches              środek     próg
Crownhaven              środek     spawn
```

Kotwica pina = czubek landmarku (jak `MapPin`). Na grayboxie `top` = ta kotwica.

Znormalizowane 0–1 na planszy 390×1920 (wpisać w `layout.ts` przy nowym masterze):

| Pin | x | y |
|-----|---|---|
| ananiel | 0.50 | 0.063 |
| pyramid | 0.50 | 0.167 |
| vampire-house | 0.78 | 0.271 |
| raven-castle | 0.50 | 0.375 |
| water-temple | 0.22 | 0.479 |
| pallglass | 0.78 | 0.479 |
| closed-way | 0.50 | 0.583 |
| smugglers-teeth | 0.22 | 0.688 |
| anvil-glade | 0.78 | 0.688 |
| crown-approaches | 0.50 | 0.792 |
| crownhaven | 0.50 | 0.896 |

`x` skrzydeł: **0.22 / 0.78** (86 / 304 px na 390). Nie przyklejać do ramy.

### Budżet pikseli (pasek, nie kwadrat)

Graybox 390×1920 × (1920/390) ≈ **4.92× szerokości**. Limit GPU ~8192 px na krawędź → **nie** 2048 szerokości (wyszłoby ~10k wysokości).

| Plik | Rozmiar | Po co |
|------|---------|--------|
| Graybox (LOCK) | **390×1920** | Siatka pinów 1:1 z telefonem |
| Layout / iteracja AI | **780×3840** | 2× graybox, tanie pętle |
| **MVP w apce** | **1536 × ~7550** WebP | Fit-width ostry na 3× retina, wysokość < 8192 |
| Źródło art (nie w apce) | ten sam aspect, lossless | Cleanup; close-upy **osobne** 9:16 |

**Eksport:** WebP. Nigdy surowy PNG 8K w bundle. Kafelki later, jeśli MVP jąka się na słabszych tel.

---

## Werdykt w 10 liniach

1. **Nie** 4K 16:9 (kadr filmu) i **nie** kwadrat 4:5 (wymaga panu X).
2. Mapa = **pionowy pasek**: szerokość telefonu, wysokość ~5× szerokości, scroll tylko w pionie.
3. **Nie** generuj giganta „całe królestwo” z prompta. Najpierw graybox 11 pinów, potem styl, potem pasy biomów.
4. **Podejście 1 (teraz):** jedna ilustracja + pan Y + piny. **Bez fog of war.** Unlock = level. Pinch PARK.
5. **Podejście 2 (potem, ten sam art):** subtelne życie na **pasku** + **Rive na close-up**.
6. Pasek **nie** animuje każdego liścia.
7. Look-dev close-upów (Crownhaven, woda, las) **przed** pełnym masterem paska — język kreski, nie geografia.

### Superseded (zostawiamy pamięć)

| Data | Było | Teraz |
|------|------|--------|
| 2026-08-15 | Kwadrat ~4:5, Crownhaven w środku, pan + pinch, MVP 4096² | Pasek 390×1920, hub na **dole**, lock X, B=200 |
| 2026-09-22 | Playground „korytarz” 941×1672 ~9:16, zoom 1.85×, pan X+Y | Fit-width zabił Y (mapa ≈ ekran). Stąd pasek wyższy, nie zoom z powrotem |
| 2026-08-15 | Pierścienie wokół stolicy na jednym kadrze | Rzędy na trakcie; R1 = **para** (wybór), nie kolejka |

Geografia biomów z `23` §C (woda L, las P, pustynia góra) **zostaje**. Zmienia się tylko **kamera i siatka na telefonie**.

---

## Dlaczego nie 4K 16:9 (to zostaje)

| Mit | Fakt |
|-----|------|
| „Duża mapa → 4K 16:9 i przybliżona” | 16:9 = szeroki pasek kina. Telefon + lock X chce **wysoki** pasek, nie szeroki. |
| Pinch uratuje gęstość | Founder 2026-09-25: fit-width jest czytelniejszy. Powietrze dajemy **płótnem**, nie zoomem. |
| Jeden wielki PNG | Limit tekstury często 4096 lub 8192. Pasek MVP 1536×~7550 musi się zmieścić; wyżej = kafelki. |

---

## Dwa kadry, jeden świat (LOCK kierunku 2026-08-15)

Założyciel: najpierw **osobne grafiki lokacji** (to, co po Enter); pasek królestwa **później**, luźno spójny, bez 1:1 detalu.

**Tak — o to chodzi.** Pinch / zoom na mapie **nie** ma stać się close-upem. To dwa ujęcia:

| Kadr | Co to jest | Ile detalu |
|------|------------|------------|
| **Pasek** (tab Świat) | Jedna diorama królestwa, piny, scroll Y. **Bez FoW overlay.** | Sylwetka biomu + 1 czytelny landmark na pin |
| **Close-up** (po Enter) | Osobny obraz / later Rive tej lokacji | Targ, hotspoty, NPC, wejście do lochu — tu żyje świat |

Close-up Crownhaven ≠ wycięty fragment mapy. Z paska miasto to **plama dachów + pałac**. Po wejściu: plac, stragan, menelnia (`23` §B0). Gracz ma poczuć „wszedłem bliżej”, nie „powiększyłem JPEG”.

**Kadr 3 (hotspot NPC):** tap straganu / later menelnia-parter ≠ zoom close-upu. Osobny kadr: postać + miejsce. Katalog, ceny i Buy / Sell = chrome, nie dziury w malunku. Stragan: [`prompt-vendor-shop.md`](reference/art/prompt-vendor-shop.md) (LOCK 2026-09-24; puste gniazda = superseded).

Spójność = **paleta, światło, architektura, kierunek biomu** — nie liczba straganów na obu kadrach.

### Kolejność art (doprecyzowanie)

Nie czekaj na **11 skończonych** close-upów, zanim ruszy pasek. Czekaj na **język** (3–4 kadry) + graybox.

```text
0. Graybox 390×1920 (zrobione 2026-09-25) — nie AI
1. Close-up Crownhaven = biblia stylu (must)
2. 2–3 close-upy biomy (np. Teeth = woda, Anvil = las)
3. Pasek: ten sam brush, landmarki w kółkach grayboxa
4. Reszta close-upów w miarę locku lokacji — nie blokuje mapy
```

**11 pinów ≠ 11 równorzędnych obrazów day 1.** Hub + Main ★ = unikalne. Side mogą być „biom + 1 landmark” (`09`).

---

## Podejście 1 — proste: ilustracja (START TUTAJ)

To nie jest „tymczasowa tandeta”. To **ten sam master**, na którym później siądzie życie. Mapa z paska = prawie still + piny (**bez FoW**).

### Co gracz widzi

```text
[ ilustracja paska ]
     + gest pan Y (lock X, bez pinch)
     + piny lokacji (UI) — kłódka = za niski level
     + tap → PeekCard → Enter → CLOSE-UP
```

### Pipeline AI (nie: jeden prompt „4K map”)

```text
1. LOOK-DEV (zanim mapa)
   4–6 cropów: targ Crownhaven, dachy terracotta, woda turkus,
   las, klify Teeth, pustynia. Gate: „jedna gra?” (`09`)

2. LAYOUT PASS
   Composition lock = graybox 390×1920 (albo 780×3840).
   Płytki kąt, nie papierowa mapa i nie stare mocne izo.
   Landmarki w kółkach. Wolno być brzydziej — siatka > paint.

3. REGION PASS (tu jest ostrość)
   Pasy: miasto, woda L, las P, zamek, pustynia.
   Inpaint na zablokowanym layoutcie. Ten sam light (golden hour).

4. STITCH + GRADE
   Szwy, rzeki, jeden LUT. Mgły NIE malować — odsłanianie = nagroda.

5. EKSPORT
   master-lossless (dysk art) — **nie** Lanczos z 576 px jako prod
   → 1536×~7550 WebP MVP (po prawdziwym upscalerze / nowym genie)
   → kafelki later jeśli jąka
   + pins 0–1 z tabeli LOCK (nie piksele ekranu)
```

**Narzędzia (kierunek, nie dogmat):** generator z **image-to-image + ref stylu**; upscale (Topaz / Magnific / wbudowany); generative fill na szwy. Każdy crop przez **human gate** — ładne ≠ nasze.

### Runtime (Expo, bez Skia na dzień 1 — OK)

`12`: MVP mapy = Image+Reanimated pan Y (**zrobione**). Skia = later.

| Wariant | Kiedy |
|---------|--------|
| **1a. Jeden Image + Reanimated pan Y** (fit-width, lock X) | **Jest w apce 2026-09-25.** Czeka na nowy master paska. |
| **1b. Kafelki + ta sama kamera** | Gdy pasek jąka się na słabszych tel. |

Piny w **normalizowanych współrzędnych mapy** (0–1), żeby zmiana rozdzielczości assetu nie rozjechała hotspotów. **Bez** maski fog of war. Szczegół: § Piny vs ekrany.

Close-up na start: **osobny still** per lokacja. Nie wycinaj z paska 100% — mapa nie ma detalu targu (`23` §B0). Close-up to **nowy kadr**, ten sam świat.

### Czego nie robić w P1

- Cała mapa jako jeden Rive.
- Lottie-dymki naklejone na PNG (`09` KILL).
- Wmalowana mgła-FoW w asset (lock 2026-10-06: FoW **nie** jest chrome).
- 16:9 „bo 4K”.

---

## AutoSprite / „zamiast Rive” na close-up (2026-08-15)

Założyciel: [AutoSprite.io](https://www.autosprite.io/) jako tania animacja lokacji, czy zje moc.

**AutoSprite to nie ten tool.** Robi **spritesheet postaci** (idle / walk / attack) z jednego sprite’a + atlas JSON. Pod Unity/Godot/Phaser. **Nie** ożywia painterly dioramy targu.

Gdyby wrzucić tam close-up Crownhaven i dostać 12 klatek całego kadru:

| Format | Werdykt na telefon |
|--------|-------------------|
| Spritesheet pełnej lokacji (12× ~2K) | **KILL** — RAM, nie „lekki Rive”. Jedna klatka 2048² RGBA ≈ 16 MB; tuzin = katastrofa |
| AutoSprite na **bohatera / NPC bust** | OK jako eksperyment look-dev; prod i tak celujemy w Rive (`09`, `10`) |
| 1 looping **wideo** aktualnego close-upu (720p, 3–5 s) | **OK jako most P1→P2** — dekoder sprzętowy, gra tylko **ten** ekran, reszta still |
| Rive living scene | Cel — mały plik, hotspoty jako listenery, 60 fps UI |

Most bez Rive, który **nie** zjada apki: still + *jedno* krótkie loop video **albo** 2–3 warstwy parallax. Nie 11 filmów naraz w pamięci. Pasek zostaje still.

---

## Piny vs ekrany (SE / Pro Max / fold)

**Tak — da się trzymać piny na landmarku na każdym telefonie.** Warunek: pozycja w **przestrzeni obrazu**, nie w pikselach ekranu.

```text
crownhaven: { x: 0.50, y: 0.896 }    // graybox 2026-09-25; hub na DOLE paska
stragan:    { x: 0.31, y: 0.62 }     // to samo na CLOSE-UPie
```

Runtime: `ekran = rysowanyObraz.xy + (x,y) × rysowanyObraz.rozmiar`.  
SE, Max i fold widzą **ten sam trakt na szerokość** (fit-width); wyższy telefon = odrobinę więcej **wysokości** — pin siedzi na dachach, nie „na 312 pikselu od lewej”.

| Zasada | Sens |
|--------|------|
| 0–1 względem **assetu**, nigdy `top: 120` / `% ekranu` | Inny telefon ≠ nowy layout |
| Mapa = kamera na **pasku** (pan Y, lock X) | Wyższy telefon = odrobinę więcej powietrza nad/pod; piny nie „uciekają” |
| Close-up: **9:16 action-safe** + opcjonalny bleed; scale **cover** w lukę tabów (albo contain, jeśli wolisz cały obraz) | Nigdy stretch. Hotspotów nie kłaść w skrajnych ~10–12% |
| Jeden `pins.json` / lokacja | Editor: klik na obrazie → zapis ułamka. Bez osobnych layoutów per device |

**„Idealnie”** = pin na tym samym kominie, nie identyczny margines HUD. HUD (taby, CTA) jest w bezpiecznym paddingu systemu; świat jest pod spodem. Fold: **ten sam pasek na środku** (filary po bokach) — nie druga mapa i nie pan X.

---

## Aspect ratio assetów (LOCK kierunku 2026-08-15)

Założyciel: czy 9:16 to **najlepszy wzorzec**, żeby close-up siadał idealnie na każdym telefonie?

**9:16 = format produkcji / action-safe. Nie magia „wypełni każdy ekran 1:1”.**  
Telefony to 16:9 (stare), 19.5:9 (iPhone), 20:9 / 21:9 (Android), fold ~kwadrat. Jednego kadru, który wypełnia piksel-w-piksel wszystkie, **nie ma** — albo przycinasz krawędzie, albo zostawiasz pasek. Tak robią gry i TikTok.

### Wzorzec branżowy (to bierzemy)

Trzy warstwy, nie jeden JPEG „pod iPhone 14”:

```text
1. BLEED (może zniknąć)     — niebo, grunt, drzewa po bokach
2. ACTION-SAFE ~9:16        — plac, pałac, hotspoty ZAWSZE w kadrze
3. HUD                      — taby / CTA przyklejone do EKRANU, nie do grafiki
```

| Zasada | Po co |
|--------|--------|
| **Nigdy stretch** (nie spłaszczaj 9:16 do 16:9 ani do folda) | To psuje świat i piny |
| **Jeden asset na wszystkie telefony** | Zero layoutów per SE / Max / Pixel |
| Hotspoty w **środkowych ~80%** | Safe zone — TV/gry od dekad |
| Close-up w luce tabów: **cover** (wypełnia, kroi bleed) | Wygląda „natively”, bez czarnych belk |
| Alternatywa: **contain** (widać 100% obrazu, możliwe belki) | Bezpieczniej na start look-dev |
| **Mapa paska** = fit-width + pan Y; close-up = 9:16 action-safe | Dwa formaty, dwa kadry |
| Gęstość close-upu: master **1440×2560** (9:16), nie 1080 na prod | 3× iPhone ~1170 px szer.; 1080 jest miękkie |

**Generator:** 9:16 (1080×1920 look-dev / 1440×2560 master).  
**Opcja „pewny cover”:** trochę wyższy master (np. 9:20) z 9:16 safe na środku — wtedy SE i wysoki Samsung kroją inny bleed, a stragan zostaje.

Fold otwarty (close-up): ten sam 9:16 **na środku** (filary po bokach) albo later szerszy kadr. Nie druga mapa day 1.

**„Idealnie”** = ten sam komin + ten sam stragan, pełna szerokość luki tabów, zero rozciągnięcia. Nie: identyczny crop nieba na SE i na S24 Ultra.

---

## Podejście 2 — zaawansowane: mapa żyje (nasz stack)

**Nie** = Unity / całe królestwo w Rive.  
**Tak** = warstwy na **tym samym masterze z P1** + immersja tam, gdzie widać detal.

```text
PASEK (P2: Skia na tym samym masterze)
  0. (opcjonalnie) dalekie góry — 1 warstwa parallax, bardzo delikatna
  1. baza: ilustracja paska (P1)
  2. życie authored, 3–5 pętli, przywiązane do współrzędnych:
        woda / piana
        dym kominów Crownhaven
        (later) flagi / ptaki — max 1–2, albo tandeta
  3. piny + marker gracza (Rive micro later; teraz pin-kursor)
  4. HUD RN (taby, PeekCard)

ENTER LOKACJI
  CLOSE-UP = Rive living scene  ← tu jest „pełna gra”
  hotspoty: stragan / menelnia / loch (`23` §E)
```

### Dlaczego życie jest na close-up, nie na całej mapie

| Pasek (tab Świat) | Close-up (stoisz na targu) |
|-------------------|----------------------------|
| Czytelność 11 pinów, wow dioramy, **bez FoW** | Woda, dym, ludzie, światło okien — **jedna scena** |
| Rive całego M1 = MB, pan, piekło authoringu | Sweet spot Rive (`09`, `12`) |
| Subtelne 3–5 pętli wystarczy, że „oddycha” | Tu gracz ma poczuć miasto |

To jest ten sam trik co gry, które *wydają się* żywe: z lotu ptaka still + 2 efekty; po wejściu w lokację — pełny motion.

### Warstwy życia na pasku — budżet (żeby nie zabić Finch)

| Warstwa | Tech | Priorytet |
|---------|------|-----------|
| Shimmer wody | Skia shader / mały looping WebM w AABB wody | P2-A |
| Dym / kominy tylko nad Crownhaven | Mały Rive lub sprite-sheet, **1–2 emitery** | P2-A |
| Mgła krawędzi (animowany noise na masce) | Skia | P2-A **art** (życie paska) — **nie** fog of war / odkrycia. FoW = OUT tego MVP |
| Parallax gór | 1 bitmapa, 5–8% przesunięcia | P2-B, łatwo przesadzić |
| Ptaki / pochodnie / okna | Tylko jeśli look-dev nie krzyczy „naklejka” | P2-C / park |

**Zakaz:** osobny Lottie na każdy komin. Albo authored w tej samej palecie/świetle, albo nic.

### Pinch-through — PARK

Enter z PeekCard **zostaje**. Pinch mapa→close-up nie wraca, żeby „zrobić powietrze” — powietrze jest wysokością paska. Crossfade pinch later tylko jeśli produkt zmieni lock kamery.

### Kiedy wracać do silnika gry

Tylko jeśli produkt zmieni się w real-time world / 3D kamerę (`12`). Przy mapie ilustracyjnej + scenach + lochach ekranowych — P2 w Expo jest sufitem, którego potrzebujemy.

---

## Kolejność roboty (żeby nie spalić generatorów)

| Krok | Deliverable | Podejście |
|------|-------------|-----------|
| 0 | Graybox 390×1920 + paleta | **zrobione 2026-09-25** |
| 1 | Close-up **Crownhaven** (look-dev = biblia) | kadr „po Enter” |
| 2 | 2–3 close-upy biomów (woda / las / …) | język świata |
| 3 | Pasek 780×3840 → stitch 1536×~7550, graybox jako ref | P1 mapa |
| 4 | `layout.ts` piny 0–1 (**bez** mgły pasami / FoW) | P1 |
| 5 | Reszta close-upów (Main ★ unikalne; side = biom + landmark) | nie blokuje (3) |
| 6 | Crownhaven close-up → Rive living | **P2 zaczyna się tu** |
| 7 | Pętle na pasku (woda, dym) — **nie** FoW | P2 |

Nie skakaj do paska zanim Crownhaven + 1–2 biomy nie przejdą gate’u „jedna gra”. Nie blokuj paska na pełnej jedenastce close-upów. **Nie ruszaj kółek grayboxa** przy generacji.

### Przebudowa paska (LOCK 2026-09-26) — trzy 9:16, stitch skryptem, miejscówka po miejscówce

Playground: 3 foldy zszyte skryptem (kamera + rytm **KEEP** — pierwszy stitch był „dość dobry”). Prod = **te same foldy**, nie nowa metoda składu. **Nie** GPT „combine into one map”. Nie fold −1. Nie chipy / nie jeden rząd = jeden obraz (odrzut founder 2026-09-26 wieczór — szkodzi, pali czas).

Kolejność:

1. **Fold 0 v1** (pierwszy kadr, wioska + most + chata + wrak + brama) = baza geografii.
2. **Tylko stolica** na tym kadrze: wioska rybacka → Crownhaven (sylwetka z close-upu, **kamera mapy**). Dolne **~130–140 px** (~14% kadru 9:16) = namalowane morze/skały/krótki pomost — PeekCard / pasek Enter zasłania ten pas; dachy **powyżej**. Reszta foldu (most, chata, wrak, droga, brama) bez ruszania.
3. Kolejne miejscówki na foldach: jeden landmark na strzał, „trochę wyżej / niżej” tylko gdy coś złamie rząd. Potem stitch 1:1 (agent).
4. **Fold 1** start: stary playground fold 1 = baza (woda / Pallglass / Raven). Dół = **ta sama** Closed Way co czubek świeżego foldu 0 (cierniowa paszcza, skala mapy — nie still z drogi). Reszta miejscówek foldu 1 = następne strzały.
5. Upscale raz (Topaz / Magnific) → WebP 1536×~7550. Lanczos = nie prod.

Close-up stolicy (`hub-crownhaven`) = **materiały** (kremowy pałac, terracotta, stragan, tawerna, lew, kaskada). **Nie** kamera close-upu na mapie.

Dwa kadry, które zjadły odstęp (szerokie miasto pod most) = nie baza. Baza = fold 0 v1.

---

## Otwarte

- [x] Lock siatki Akt 1 na telefonie (graybox 2026-09-25)
- [ ] Generator + upscaler, których faktycznie używasz (dopisać po 1 sesji z grayboxem jako ref)
- [ ] Master paska w apce (zastąpić `map_board.png` 941×1672)
- [ ] Mgła = pasy rzędów, nie kółka wokół pinów (przeliczyć `MAP_FOG_SEEDS`)
- [ ] Bohater na mapie = pin-kursor (jest) vs mini-sprite Rive later (`09`)
- [ ] Pinch-through mapa→close-up = **PARK** (Enter zostaje)

---

## Notatka dla agentów

Nie proponuj „zrób jedną 4K 16:9 i przesuwaj”. Nie proponuj kwadratu 4:5 z panem X. Nie proponuj pinch, żeby „zrobić powietrze”. Nie proponuj całego królestwa w Rive. Nie wycinaj close-upu z paska. Nie stretchuj obecnego korytarza 9:16. **Nie** proponuj chipów / składu rząd-po-rzędzie zamiast foldów — founder 2026-09-26: foldy się składają, prod = edycja miejscówek na foldzie. Pytanie nadrzędne: **czy ten asset siada w kółka grayboxa i da się dołożyć P2 bez przerysowywania świata?** Jeśli nowy pomysł psuje B=200 albo lock X — park.

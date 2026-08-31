# 24 — Produkcja mapy (art + runtime)

> **Status:** plan roboczy 2026-08-15. Nie lock produktu — lock **kolejności roboty**.  
> Art: [`09`](09-art-graphics.md) · Feel: [`10`](10-animation-feel.md) · Tech: [`12`](12-tech-stack.md) · Lokacje Akt 1: [`23`](23-act1-location-brainstorm.md) §C/§E.

**Pytanie założyciela:** jak wygenerować dużą mapę (AI) pod pan/zoom na telefonie — czy 4K 16:9? Dwa podejścia: proste (zdjęcie) i zaawansowane (żyje jak gra).

---

## Werdykt w 10 liniach

1. **Nie** rób mapy jako 4K 16:9. To kadr filmu, nie królestwa na pionowym telefonie.
2. Mapa ma być **kwadrat / ~4:5** (pierścienie wokół Crownhaven). „Duża” = **kamera** (pan + pinch), nie proporcje kina.
3. **Nie** generuj jednego giganta „całe królestwo 8K” z prompta. Najpierw **layout** (11 pinów Akt 1), potem **styl**, potem **składanie regionów**.
4. **Podejście 1 (teraz):** jedna ilustracja + pan/zoom + mgła + piny. W apce kafelki, nie jeden 8K texture.
5. **Podejście 2 (potem, ten sam art):** warstwy życia na zoom-out + **życie prawdziwe na close-up Rive**. To jest „jak pełna gra” w naszym stacku — nie całe królestwo w jednym `.riv`.
6. Zoom-out **nie** animuje każdego liścia (Tsushima z orbity też nie). Tandeta = PNG + naklejki dymu (`09`).
7. Look-dev **cropów** (Crownhaven, woda, las) **przed** pełną mapą.

---

## Dlaczego nie 4K 16:9

| Mit | Fakt |
|-----|------|
| „Mapa większa niż zdjęcie na tel → musi być 4K 16:9 i przybliżona” | 16:9 = szeroki pasek. Telefon = pion ~9:19.5. Królestwo z hubem w środku chce **kwadrat**. |
| 3840×2160 wystarczy na pinch | Na iPhonie (~1170 px szerokości ekranu) masz ~3× zoom zanim robi się miękko — **jeśli** pokazujesz całą szerokość. Domyślny widok mapy pokazuje **fragment** (jak Clash / Tsushima), więc 4K pada wcześniej. |
| Jeden wielki PNG w apce | GPU: limit tekstury często 4096 lub 8192. 8192² RGBA ≈ **256 MB** w RAM. Musi być **kompresja + kafelki**. |

### Budżet pikseli (Akt 1, jeden master)

Domyślny widok: widać Crownhaven + pierwszy pierścień (nie całe królestwo naraz). Pinch ~1.5–2.5× do landmarku.

| Plik | Rozmiar | Po co |
|------|---------|--------|
| Layout / iteracja AI | **2048×2048** | Tanie pętle promptu, skład geograficzny |
| **MVP w apce** | **4096×4096** (WebP) | Pan + zoom ~2×, ostro na telefonie, ~2–5 MB |
| Wow pinch / przyszłość | Master **6144 lub 8192**², w apce **kafelki 512/1024** | Nie ładujemy całego 8K naraz |
| Źródło art (nie w apce) | 8192² PNG/PS | Cleanup, reprint; close-upy = **osobne kadry**, nie crop z mapy |

**Eksport do gry:** WebP (lub ASTC later). Nigdy surowy PNG 8K w bundle.

---

## Zanim generator — 1 kartka layoutu

Akt 1 = **hub + 6 side + 4 Main = 11 pinów** (`23`). Mapa bez tej kartki = ładny chaos, piny nie siądą.

```text
        [las dalej / ★1 Tropiciel]
                 ★2 zamek
                    │
     Pallglass ─┐   │   ┌─ (R2 seed)
                │   │   │
   Anvil Glade ─┼─ CROWNSHAVEN ─┼─ Approaches
   (SE kowal)   │   (hub)       │   (S straż)
                │               │
         Smuggler's Teeth (SW) ─┘
                    │
              pustynia → ★3 Osiris → Titan
```

Narysuj to **ręcznie** (Figma / papier): blob biomy, rzeki, drogi, góry jako **ramy kadru**, nie detal. Landmarki czytelne w 0.5 s (`09`). Dopiero to idzie w AI jako **reference image / composition lock**.

---

## Dwa kadry, jeden świat (LOCK kierunku 2026-08-15)

Założyciel: najpierw **osobne grafiki lokacji** (to, co po tapnięciu pina); mapa z orbity **później**, luźno spójna, bez 1:1 detalu.

**Tak — o to chodzi.** Pinch na mapie **nie** ma stać się close-upem. To dwa ujęcia:

| Kadr | Co to jest | Ile detalu |
|------|------------|------------|
| **Orbita** (tab Świat) | Jedna diorama królestwa, piny, mgła | Sylwetka biomu + 1 czytelny landmark na pin (klify, dachy, kuźnia, pustynia) |
| **Close-up** (po tap) | Osobny obraz / later Rive tej lokacji | Targ, hotspoty, NPC, wejście do lochu — tu żyje świat |

Close-up Crownhaven ≠ wycięty fragment mapy. Z orbity miasto to **plama dachów + pałac**. Po wejściu: plac, stragan, menelnia (`23` §B0). Gracz ma poczuć „wszedłem bliżej”, nie „powiększyłem JPEG”.

**Kadr 3 (hotspot NPC):** tap straganu / later menelnia-parter ≠ zoom close-upu. Osobny 9:16: postać + miejsce + **puste gniazda** pod UI. Stragan: [`prompt-vendor-shop.md`](reference/art/prompt-vendor-shop.md).

Spójność = **paleta, światło, architektura, kierunek biomu** — nie liczba straganów na obu kadrach.

### Kolejność art (doprecyzowanie)

Nie czekaj na **11 skończonych** close-upów, zanim ruszy orbita. Czekaj na **język** (3–4 kadry) + kartkę geografii.

```text
0. Kartka blob (gdzie jest woda / las / miasto) — 30 min, nie AI
1. Close-up Crownhaven = biblia stylu (must)
2. 2–3 close-upy biomy (np. Teeth = woda, Anvil = las)
3. Orbita: ten sam brush, mniej detalu, landmarki z (1–2)
4. Reszta close-upów w miarę locku lokacji — nie blokuje mapy
```

**11 pinów ≠ 11 równorzędnych obrazów day 1.** Hub + Main ★ = unikalne. Side mogą być „biom + 1 landmark” (`09`).

---

## Podejście 1 — proste: ilustracja (START TUTAJ)

To nie jest „tymczasowa tandeta”. To **ten sam master**, na którym później siądzie życie. Tsushima-mapa z orbity = prawie still + mgła + piny.

### Co gracz widzi

```text
[ ilustracja królestwa ]
     + gesty pan / pinch
     + warstwa mgły (kod, nie wmalowana)
     + piny lokacji (UI)
     + tap → CLOSE-UP (osobny kadr, na start nawet still)
```

### Pipeline AI (nie: jeden prompt „4K map”)

```text
1. LOOK-DEV (zanim mapa)
   4–6 cropów: targ Crownhaven, dachy terracotta, woda turkus,
   las, klify Teeth, pustynia. Gate: „jedna gra?” (`09`)

2. LAYOUT PASS (2048²)
   Ten sam kąt co ref dioramy (wysoki, nie papierowa mapa).
   Czytelne silhouettes 11 miejsc. Wolno być brzydziej — geografia > paint.

3. REGION PASS (tu jest ostrość)
   Osobno: Crownhaven, Teeth, Anvil/las, Approaches, pustynia.
   Inpaint / outpaint na zablokowanym layoutcie.
   Ten sam light (golden hour) i paleta.

4. STITCH + GRADE
   Photoshop / Krita: szwy, rzeki łączą się, jeden LUT.
   Mgły NIE malować na stałe — odsłanianie = nagroda.

5. EKSPORT
   master-lossless (dysk art)
   → 4096² WebP MVP
   → (gdy 6K+) kafelki {z}/{x}/{y}
   + map-pins.json (pozycje 0–1, nie piksele ekranu)
```

**Narzędzia (kierunek, nie dogmat):** generator z **image-to-image + ref stylu**; upscale (Topaz / Magnific / wbudowany); generative fill na szwy. Każdy crop przez **human gate** — ładne ≠ nasze.

### Runtime (Expo, bez Skia na dzień 1 — OK)

`12` ma otwarte: Skia vs Image+GestureHandler na MVP.

| Wariant | Kiedy |
|---------|--------|
| **1a. Jeden Image + Reanimated pinch/pan** | Prototyp feelu, 4096², zero kafelkowania |
| **1b. Kafelki + ta sama kamera** | Gdy master > 4096 albo jąkanie na słabszych tel. **Lepszy default na prod.** |

Mgła = maska/overlay w kodzie (odkryte piny wycinają dziurę). Piny w **normalizowanych współrzędnych mapy** (0–1), żeby zmiana rozdzielczości assetu nie rozjechała hotspotów. Szczegół: § Piny vs ekrany.

Close-up na start: **osobny still** per lokacja (nawet 1 hotspot). Nie wycinaj z mapy 100% — mapa z orbity nie ma detalu targu (`23` §B0). Close-up to **nowy kadr**, ten sam świat.

### Czego nie robić w P1

- Cała mapa jako jeden Rive.
- Lottie-dymki naklejone na PNG (`09` KILL).
- Wmalowana mgła w asset.
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

Most bez Rive, który **nie** zjada apki: still + *jedno* krótkie loop video **albo** 2–3 warstwy parallax. Nie 11 filmów naraz w pamięci. Orbita zostaje still.

---

## Piny vs ekrany (SE / Pro Max / fold)

**Tak — da się trzymać piny na landmarku na każdym telefonie.** Warunek: pozycja w **przestrzeni obrazu**, nie w pikselach ekranu.

```text
crownhaven: { x: 0.48, y: 0.52 }     // 48% od lewej, 52% od góry MAPY
stragan:    { x: 0.31, y: 0.62 }     // to samo na CLOSE-UPie
```

Runtime: `ekran = rysowanyObraz.xy + (x,y) × rysowanyObraz.rozmiar`.  
SE, Max i fold widzą **inny wycinek** (więcej/mniej mapy) — pin siedzi na dachach, nie „na 312 pikselu od lewej”.

| Zasada | Sens |
|--------|------|
| 0–1 względem **assetu**, nigdy `top: 120` / `% ekranu` | Inny telefon ≠ nowy layout |
| Mapa = kamera na świecie (pan/zoom) | Fold otwarty pokazuje więcej królestwa; piny nie „uciekają” |
| Close-up: **9:16 action-safe** + opcjonalny bleed; scale **cover** w lukę tabów (albo contain, jeśli wolisz cały obraz) | Nigdy stretch. Hotspotów nie kłaść w skrajnych ~10–12% |
| Jeden `pins.json` / lokacja | Editor: klik na obrazie → zapis ułamka. Bez osobnych layoutów per device |

**„Idealnie”** = pin na tym samym kominie, nie identyczny margines HUD. HUD (taby, CTA) jest w bezpiecznym paddingu systemu; świat jest pod spodem. Fold: nie projektujemy osobnej mapy — projektujemy **kamerę**.

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
| Mapa orbity = **kamera**, nie plakat 9:16 | Większy ekran = więcej królestwa |
| Gęstość: master **1440×2560** (9:16), nie 1080 na prod | 3× iPhone ~1170 px szer.; 1080 jest miękkie |

**Generator:** 9:16 (1080×1920 look-dev / 1440×2560 master).  
**Opcja „pewny cover”:** trochę wyższy master (np. 9:20) z 9:16 safe na środku — wtedy SE i wysoki Samsung kroją inny bleed, a stragan zostaje.

Fold otwarty: ten sam 9:16 **na środku** (filary po bokach) albo later szerszy kadr. Nie druga mapa day 1.

**„Idealnie”** = ten sam komin + ten sam stragan, pełna szerokość luki tabów, zero rozciągnięcia. Nie: identyczny crop nieba na SE i na S24 Ultra.

---

## Podejście 2 — zaawansowane: mapa żyje (nasz stack)

**Nie** = Unity / całe królestwo w Rive.  
**Tak** = warstwy na **tym samym masterze z P1** + immersja tam, gdzie widać detal.

```text
ZOOM-OUT (Skia)
  0. (opcjonalnie) dalekie góry — 1 warstwa parallax, bardzo delikatna
  1. baza: kafelki ilustracji (P1)
  2. życie authored, 3–5 pętli, przywiązane do współrzędnych:
        woda / piana
        dym kominów Crownhaven
        dryf mgły na krawędzi nieodkrytego
        (later) flagi / ptaki — max 1–2, albo tandeta
  3. maska odkryć
  4. piny + marker gracza (Rive micro)
  5. HUD RN (taby, CTA)

TAP LOKACJI
  CLOSE-UP = Rive living scene  ← tu jest „pełna gra”
  hotspoty: stragan / menelnia / loch (`23` §E)
```

### Dlaczego życie jest na close-up, nie na całej mapie

| Zoom-out (orbita) | Close-up (stoisz na targu) |
|-------------------|----------------------------|
| Czytelność 11 pinów, mgła, wow dioramy | Woda, dym, ludzie, światło okien — **jedna scena** |
| Rive całego M1 = MB, pan/zoom, piekło authoringu | Sweet spot Rive (`09`, `12`) |
| Subtelne 3–5 pętli wystarczy, że „oddycha” | Tu gracz ma poczuć miasto |

To jest ten sam trik co gry, które *wydają się* żywe: z lotu ptaka still + 2 efekty; po wejściu w lokację — pełny motion.

### Warstwy życia na zoom-out — budżet (żeby nie zabić Finch)

| Warstwa | Tech | Priorytet |
|---------|------|-----------|
| Shimmer wody | Skia shader / mały looping WebM w AABB wody | P2-A |
| Dym / kominy tylko nad Crownhaven | Mały Rive lub sprite-sheet, **1–2 emitery** | P2-A |
| Mgła krawędzi (animowany noise na masce) | Skia | P2-A — spina produkt (odkrycia) |
| Parallax gór | 1 bitmapa, 5–8% przesunięcia | P2-B, łatwo przesadzić |
| Ptaki / pochodnie / okna | Tylko jeśli look-dev nie krzyczy „naklejka” | P2-C / park |

**Zakaz:** osobny Lottie na każdy komin. Albo authored w tej samej palecie/świetle, albo nic.

### Pinch-through (opcjonalny wow, later)

Gdy pinch nad Crownhaven przekroczy próg → crossfade **mapa → close-up Rive**. To jest moment „wszedłem do gry”. Nie blokuje P1.

### Kiedy wracać do silnika gry

Tylko jeśli produkt zmieni się w real-time world / 3D kamerę (`12`). Przy mapie ilustracyjnej + scenach + lochach ekranowych — P2 w Expo jest sufitem, którego potrzebujemy.

---

## Kolejność roboty (żeby nie spalić generatorów)

| Krok | Deliverable | Podejście |
|------|-------------|-----------|
| 0 | Kartka layoutu 11 pinów + paleta 1-pager | geografia, nie paint |
| 1 | Close-up **Crownhaven** (look-dev = biblia) | kadr „po pinie” |
| 2 | 2–3 close-upy biomów (woda / las / …) | język świata |
| 3 | Orbita 2048² → stitch 4096² z tych kadrów jako ref stylu | P1 mapa |
| 4 | `pins.json` + mgła | P1 |
| 5 | Reszta close-upów (Main ★ unikalne; side = biom + landmark) | nie blokuje (3) |
| 6 | Crownhaven close-up → Rive living | **P2 zaczyna się tu** |
| 7 | 3 pętle na zoom-out (woda, dym, krawędź mgły) | P2 |

Nie skakaj do orbity zanim Crownhaven + 1–2 biomy nie przejdą gate’u „jedna gra”. Nie blokuj orbity na pełnej jedenastce.

---

## Otwarte

- [ ] Lock layoutu geograficznego Akt 1 (kierunki z `23` §C — still robocze)
- [ ] Generator + upscaler, których faktycznie używasz (dopisać po 1 sesji look-dev)
- [ ] MVP runtime: Image+gesty (1a) vs od razu Skia (1b)
- [ ] Bohater na mapie = pin vs mini-sprite Rive (`09`)
- [ ] Czy pinch-through mapa→close-up jest w M1, czy tap wystarczy

---

## Notatka dla agentów

Nie proponuj „zrób jedną 4K 16:9 i przesuwaj”. Nie proponuj całego królestwa w Rive. Nie wycinaj close-upu z mapy orbity. Pytanie nadrzędne: **czy ten asset da się użyć w P1 i dołożyć P2 bez przerysowywania świata?** Jeśli nowy pomysł psuje layout pinów albo lekkość Finch — park.

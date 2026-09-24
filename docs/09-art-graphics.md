# 09 — Art & Graphics

> **Status:** szkic art direction + **spójność warstw** (mapa / postacie / Rive / filmiki).  
> Sesja: 2026-08-01.  
> Ref mapy (założyciel): zapisz jako `docs/reference/art/map-style-ref-crownhaven-vibe.png` — painterly diorama, turkus wody, terracotta dachy, golden hour (stock RPG map vibe z sesji).

## Z prototypu

Ciemny fantasy UI, izometria/obóz, assety bossów — reuse możliwy wybiórczo. **Nowy kierunek wizualny jest ważniejszy niż wierność V1.**

---

## Cel (final) — jedna marka, cztery warstwy

Nie robimy czterech osobnych estetyk. Robimy **jeden świat**, renderowany w czterech „soczewkach”:

| Warstwa | Co to w produkcie | Estetyka | Tool |
|---------|-------------------|----------|------|
| **A. Świat** | Mapa królestwa, close-up lokacji, tła | **Painterly cartoon fantasy** (ref poniżej) | Ilustracja 2D (AI draft → cleanup) |
| **B. Aktorzy / UI motion** | Bohater, NPC bust, itemy, dropy, HUD micro | **Graphic cartoon** — czytelny kształt, ten sam świat kolorów | **Rive** |
| **C. Beaty fabularne** | Onboarding, lampki Main ★, reveal | **Ten sam świat co A**, postacie jak B | Pre-render video (AI + gate) |
| **D. Chrome produktu** | Sheet Home/Hero + overlay World (pills, plakietki, CTA, tab bar) | Periwinkle mist + biel z wargą + złoto; **nie** malowane w stillu | RN kit — [`reference/ui/design-bible.md`](reference/ui/design-bible.md) |

**Inspiracje postaci / tonu (nie 1:1 art):** Rick & Morty × Vox Machina × Shakes & Fidget = *energia, ekspresja, humor, czytelność* — **nie** „płaski R&M lineart na całą mapę”.  
**Inspiracja mapy (lock kierunku):** ref w `reference/art/` — ciepła izometria/wysoki kąt, woda turkusu, dachy terracotta, gęsty las, mosty, żywe miasto.

### Uczciwy pushback (co-founder)

Czysty styl *Rick & Morty* (gruba kreska, flat color) **zderzy się** z tą mapą.  
Zamiast tego: **świat = painterly cartoon** (jak ref), **postacie = odrobinę bardziej graficzne/czytelne**, ale **ta sama paleta, to samo światło, ta sama architektura**. Tak robią gry, które wyglądają spójnie (świat bogatszy, postać czytelna na UI).

**Look-dev 2026-08-16:** Mag A3 = **ground truth kreski**. Stolica = udany outdoor w tym języku, nie druga biblia. Konflikt A/B/C → wygrywa mag.  
**Look-dev 2026-09-24:** warstwa D (chrome) ≠ A. Home/Hero ~90% sheet; World = still + kit. Chrome: [`reference/ui/design-bible.md`](reference/ui/design-bible.md) + [`reference/ui/golden/`](reference/ui/golden/).  
**Paste default kreski:** [`style-kit.md`](reference/art/style-kit.md) (krótki lock + SCENE). Pełny master / 20-rozdziałowa biblia = nie wklejać.  
Kadry w toku: sklep [`prompt-vendor-shop.md`](reference/art/prompt-vendor-shop.md) · Gutterjack [`prompt-gutterjack-dungeon.md`](reference/art/prompt-gutterjack-dungeon.md) · Teeth [`prompt-smugglers-teeth-closeup.md`](reference/art/prompt-smugglers-teeth-closeup.md) · Approaches [`prompt-crown-approaches-closeup.md`](reference/art/prompt-crown-approaches-closeup.md) · Anvil [`prompt-anvil-glade-closeup.md`](reference/art/prompt-anvil-glade-closeup.md) · Torrik [`prompt-torrik-smithy.md`](reference/art/prompt-torrik-smithy.md) · Stillgaze [`prompt-stillgaze-dungeon.md`](reference/art/prompt-stillgaze-dungeon.md) · Closed Way [`prompt-closed-way-closeup.md`](reference/art/prompt-closed-way-closeup.md) · Skarne [`prompt-closed-way-dungeons.md`](reference/art/prompt-closed-way-dungeons.md).

---

## Ref mapy — co bierzemy / czego nie

**Klimat refa (opis):** wysoki kąt, żywa diorama miasta na klifach/wyspach; turkusowa woda z pianą; mosty kamienne; strome dachy terracotta; gęsty szmaragd lasu; warm golden-hour światło. To jest **kierunek Crownhaven / mapa**, nie dosłowny layout do skopiowania.

| Bierzemy | Nie kopiujemy ślepo |
|----------|---------------------|
| Wysoki kąt / „żywa diorama” (nie płaska mapa papierowa) | Konkretny layout wysp z stocka |
| Turkus wody + piana, ciepłe dachy, szmaragd lasu | Realistyczny oil-painting AAA |
| Mosty, ścieżki, place = naturalne hotspoty | 1000 detali unreadable na telefonie |
| Golden-hour światło (ciepłe highlighty, miękkie cienie) | Ciemny grimdark V1 |
| Crownhaven *może* wyglądać tak na starcie (jasne, „OK”) | Mgła = osobna warstwa runtime, nie wbudowana w każdy asset |

**Crownhaven w grze:** close-up hubu / fragment mapy w tym klimacie. Soft-zgrzyt (menelnia, zamknięte sklepy) = **detale narracyjne na close-up**, nie zmiana całego stylu na brud.

---

## Bible spójności (minimum, które spina wszystko)

Zanim generujemy setki assetów — **jedna strona look-dev** (do zrobienia):

### 1. Paleta (propozycja z refa)

| Rola | Kierunek |
|------|----------|
| Woda | Turkus / teal |
| Roślinność | Szmaragd / deep green |
| Architektura | Terracotta dachy, kamień ciepły, drewno |
| Światło | Golden hour — warm key light |
| Akcent UI / nagrody | 1–2 kolory „Finch-czytelne” (np. złoto nagród, jasny CTA) — nie fiolet-default AI |
| Dreamwake / zagrożenie | Osobny akcent (np. chłodniejszy fiolet-mgła / desat) — **rzadko**, żeby bolało |

Ta sama paleta w: mapie, close-up, Rive fillach, grade’zie filmików.

### 2. Linia i kształt — most VM / S&F ↔ mapa

Ref z netu = **inspiracja**, nie final. Lekka modyfikacja pod nasz cartoon:

| Z refa mapy (zostaje) | Dokładka VM / S&F (dograć) |
|-----------------------|----------------------------|
| Głębia, woda, golden hour, diorama | Odrobina **mocniejszego silhouette** budynków/landmarków |
| Painterly tekstura z dystansu | Czytelniejsze „ikoniczne” kształty mostów, wież, pinów |
| Ciepła paleta | Punchier lokalne akcenty (sztandar, światło okna, dym) — humor bez chaosu |
| Wysoki kąt | Landmarki muszą dać się rozpoznać jako hotspot w 0.5 s na telefonie |

Nie robimy pełnego flat R&M. Robimy: **painterly baza + graphic readable landmarks** (VM energia, S&F czytelność).

### 3. Mapa żyje — gdzie Rive, a gdzie nie

**Feedback założyciela:** boi się tandety (PNG + naklejki) **oraz** tego, że Rive to głównie HUD/menu/postacie — czy mapa w Rive w ogóle ma sens?

**Uczciwy werdykt:**

| Powierzchnia | Narzędzie | Dlaczego |
|--------------|-----------|----------|
| **Mapa królestwa (zoom-out)** | Ilustracja + runtime mapy (Skia/gesty, mgła, piny) | Duży kadr, pan/zoom, wiele lokacji — **nie** sweet spot Rive. Rive = UI/aktorzy/interaktywne sceny, nie „silnik mapy świata” |
| **Close-up lokacji** (targ, menelnia, kryjówka, las) | **Rive living scene** — tu się opłaca | Mniejszy kadr = jedna całość art+ruch (woda/dym/liście w tym samym pliku). Wow immersji bez gigantycznego `.riv` |
| Bohater, itemy, loot, HUD micro | **Rive** — KEEP | Dokładnie to, do czego Rive jest stworzony |
| Filmiki fabularne | Pre-render video | Poza Rive |

```text
Zoom-out mapa  →  piękna diorama (ref), lekkość Finch, odkrycia
Tap lokacji    →  CLOSE-UP living (Rive)  = „świat oddycha”
Powrót         →  mapa
```

To spina Twoje „jedna całość” **tam, gdzie widać detal**, i nie wciska całego M1 w tool do HUD-ów.

| Podejście | Werdykt |
|-----------|---------|
| Całe królestwo jako jeden wielki Rive | **PARK / raczej NIE** — koszt authoringu, MB, pan/zoom; Rive nie jest do tego pozycjonowany |
| PNG mapy + obce Lottie dymy | **KILL** — tandeta |
| Close-up = living Rive (ten sam brush/światło) | **KEEP** — tu opłacalność jest realna |
| Zoom-out: prawie still + ewentualnie *bardzo* subtelne życie później | **OK na MVP** — Tsushima-mapa też nie animuje każdego liścia z orbity |
| Full-map video | **PARK** jako default mapy |

**AI Agent Rive:** sensowny przy close-upach / postaciach / HUD — nie jako „zrób mi mapę królestwa z Pinteresta”.

**Przykład z marketplace (jak ludzie robią „mapy” w Rive):**  
[Desu map](https://rive.app/marketplace/23473-44024-desu-map/) — flat **vector** wyspy, klik sekcji → highlight (state machine). To jest mapa-*UI* w natywnym języku Rive, **nie** painterly diorama typu nasz ref Crownhaven. Dowód: Rive ogarnia interaktywne mapki *w swoim stylu*; nie dowód, że cały nasz zoom-out królestwa trzeba pakować w `.riv`.

### 4. Architektura Crownhaven (motyw przewodni)

Powtarzaj we **wszystkich** warstwach: strome dachy terracotta, kamień+drewno, place, mosty nad wodą, wieże.  
Wtedy filmik isekai i mapa to **to samo miasto**, nie „inne IP”.

### 5. Mgła (produkt × art)

- Na mapie runtime: warstwa odkryć (Ghost of Tsushima vibe) — maska / overlay, nie nowy styl.  
- W filmikach: mgła = motyw fabularny, ten sam kolor/akcent Dreamwake.  
- Nie maluj całej mapy na stale „w mgle” — odsłanianie ma być nagrodą.

---

## Jak spiąć 4 rzeczy w praktyce (pipeline)

```text
LOOK-DEV (1 lokacja = Crownhaven)
  ├─ 1× fragment mapy w stylu ref
  ├─ 1× close-up (targ + menelnia)
  ├─ 1× bohater Rive w TEJ SAMEJ palecie / świetle
  └─ 1× klip 10–15 s (przybycie na targ)
         │
         ▼
  Human gate: „czy to wygląda jak jedna gra?”
         │
    TAK → skala (R1 lokacje, ★, itemy)
    NIE → popraw bible, nie generuj dalej
```

| Asset | Zasada |
|-------|--------|
| **Mapa** | Jedna (lub strefowa) ilustracja; piny/hotspoty UI osobno; mgła = kod. Produkcja / rozdzielczości / P1 vs P2: [`24`](24-map-production.md) |
| **Close-up lokacji** | Ten sam world-style co mapa; hotspoty (domek / jaskinia) jak w `23` |
| **Rive** | Postać i item **nie** próbują malować painterly brush stroke — uproszczone, ale kolory + proporcje świata |
| **Filmiki** | Grade i tła = świat A; aktorzy ≈ B; **zakaz** losowego stylu modelu AI per klip |
| **UI Finch** | Lekki HUD na wierzchu — nie walczy z mapą o detal; dużo oddechu. Lock chrome: [`reference/ui/design-bible.md`](reference/ui/design-bible.md) — **warstwa D**: ten sam kit tokenów na Home/Hero (sheet) i World (still + overlay), połączone szwem mgły. HUD **nigdy** w JPEG. |

### AI video — twarda reguła

Nie „wygeneruj ładny fantasy clip”.  
Prompt / brief zawsze: **palette + Crownhaven roofs + lighting + character sheet**.  
Każdy klip przechodzi **human gate** (`10`, `12`). Odrzut > „wystarczy że ładne”.

---

## Mapa vs cartoon — decyzja robocza

| Pytanie | Werdykt roboczy |
|---------|-----------------|
| Styl mapy | **Painterly cartoon diorama** (ref) — KEEP kierunek |
| „Cartoon” postaci | Graphic / expressive **w tym samym świecie**, nie osobne IP R&M |
| Kolor produktu | Jasny pop-fantasy z ciepłym światłem (ref), nie ciemny comic V1 |
| Ile unikalnych close-up na M1 | Dążyć do **unikalnych landmarków** na Main ★ + hub; side mogą dzielić biom + 1 landmark |
| Mapa vs close-up | **Dwa kadry, jeden świat** — orbita ≠ zoom JPEG; pin → osobny obraz lokacji ([`24`](24-map-production.md)) |

---

## Otwarte

- [ ] Zrobić oficjalną **1-pager look-dev** (palette swatch + 3 przykłady: mapa / Rive / klatka video)
- [ ] Czy bohater na mapie = kropka/pin, czy mini-sprite w stylu Rive?
- [ ] Budżet: ile unikalnych close-up vs „biom + landmark” na launch
- [ ] Kontraktor art vs AI+cleanup — kto trzyma gate
- [ ] Wersja Crownhaven „gasnąca” (detale menelni) vs mapa „ładna z daleka”
- [ ] Pipeline mapy (AI → stitch → kafelki vs jeden WebP) — plan w [`24`](24-map-production.md)
- [ ] Look-dev Crownhaven: prompt w [`reference/art/prompt-crownhaven-closeup.md`](reference/art/prompt-crownhaven-closeup.md)
- [x] UI Bible v2 + goldeny (Home, mapa, Crownhaven, Gutterjack, kit sheet) — [`reference/ui/design-bible.md`](reference/ui/design-bible.md) (2026-09-24)
- [ ] Styl postaci w winietach: kreska świata (`mage.png`) vs miękki Wayfarer z mocków — rekomendacja: kreska świata

---

## Notatka dla agentów

Przy konflikcie „bardziej R&M” vs „bardziej jak ref mapy” → **wygrywa spójność ze światem mapy**; R&M/VM/S&F zostają jako **energia postaci i humor**, nie jako dosłowny line style całej gry. Tech: `12`. Motion: `10`. Lokacje: `23`.

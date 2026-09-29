# Prompt — winieta straganu (portret babki)

> **LOCK 2026-09-24 (UI Bible v2.3).** Sklep = archetyp A: winieta + dymek, pod spodem katalog chrome. Golden: [`../ui/golden/shop.png`](../ui/golden/shop.png) — **na razie wycinek Crownhaven**, founder: babkę dorabiamy później. Ten prompt czeka na ten kadr i nie blokuje portu UI. Reguły: [`../ui/design-bible.md`](../ui/design-bible.md) sekcja 7.  
> **Malunek = tylko header.** Buy / Sell, ceny i karty itemów są w kodzie. Nie malować gniazd pod SKU.  
> Układ z 2026-08-16 (6 pustych skrzynek L/R + „sprzedaj” na bruku) = **archiwum na dole**. Nie wklejać go w generator.

**Ustawienia generatora:** **9:16** · 1080×1920 look-dev / 1440×2560 master · **nowy obraz** (nie „edytuj to zdjęcie”).

**Paste:** [`style-kit.md`](style-kit.md) STYLE LOCK + SCENE niżej. Załącz **maga**, nie stolicę. Twarz babki = 2–3 cechy w SCENE.

---

## Layout (LOCK 2026-09-24)

Winieta zajmuje górne ~40–45% telefonu i rozpuszcza się w mgłę UI. Katalog (max 6 SKU, zakładki Buy / Sell) stoi pod spodem — [`06`](../../06-economy-loot.md) §7.

```text
9:16  (winieta = górne ~42% kadru; reszta telefonu = chrome, nie malować jako SKU)

┌─────────────────────────────────┐
│  [back + pills — LUZ]           │  ← górne ~12%, spokojne
│                                 │
│  BABKA          [LUZ NA DYMEK]  │  lewa połowa: ona, pas w górę
│  (patrzy w kamerę)   ściana /   │  prawa góra: spokojna, ~50% × 35%
│                      półka      │
│                                 │
│     lada / warzywa / bruk       │  ← dolne ~30% winiety, zniknie w mgle
│░░░░░░░░ szew ░░░░░░░░░░░░░░░░░░│
│  [Buy | Sell]   katalog 3×2     │  chrome — NIE w JPEG
└─────────────────────────────────┘
```

| Strefa | Co malujesz | Czego NIE |
|--------|-------------|-----------|
| **Lewa połowa** | Ona, pas w górę, patrzy w kamerę. Twarz między 15% a 30% wysokości winiety | Tłum, elf, krasnal, goblin, kenku, druga postać |
| **Prawa góra** | Spokojna ściana, niebo albo półka — miejsce na dymek | Twarz, kluczowy rekwizyt, cennik |
| **Góra ~12%** | Spokojne powietrze (back i pills wejdą w kodzie) | Pałac na 1/3 kadru, schody, fontanna |
| **Dół ~30% winiety** | Lada, trochę warzyw, bruk. Prosty dół, który zniknie w mgle | HUD, złoto, napis „sprzedaj”, karty itemów, puste skrzynki pod UI |

**Ona = ta sama co na placu:** ciepła, ziemska, guide #1, lekki uśmiech. **Nie** nowa ładniejsza NPC. **Nie** papieros.

---

## SCENE / CONTENT — wklej w master (nie zamiast mastera)

```text
NEW 9:16 mobile RPG vignette, the TOP HALF of a shop screen. Not a crop of the attached plaza. Not a restyle of that city layout. The item catalog is added later in UI — do not paint slots, crates for cards, prices, or a sell bar.

The attached image is STYLE + this woman's identity only. Copy her exactly: plump warm middle-aged vegetable vendor, tanned skin, brown hair in a red bandana, gold hoop earrings, white peasant blouse, deep red bodice, friendly face looking AT THE CAMERA, holding a big carrot. Same red-and-white striped awning, same dark wood stall. She is guide energy, warm, not pretty-generic, not half-lidded like a bored wizard. Graphic cartoon eyes, simple lids, slight smile.

CAMERA: standing close at her stall. She is the only character, waist-up behind the counter, on the LEFT half. Humble barn wall behind her. Outdoor daylight / golden hour (not tavern candles).

UI SAFE ZONES (do not paint UI, keep these calm):
- Character on the LEFT half, waist-up, looking at camera. Face between 15% and 30% of vignette height.
- RIGHT half upper area calm (wall, sky, shelf) about 50% width x 35% height: a speech bubble will sit here.
- Top 12%: calm sky or plain wall. A back button and currency pills will sit here.
- Bottom 30% of the vignette: counter and a few vegetables only (carrot bunch, cabbage). It fades into UI mist. No crates, no empty shelves waiting for item cards.

Do NOT show the tavern, dwarf, elf, goblin, crow-person, lion fountain, or the hill city. No UI, no prices, no readable text, no gold coins, no "sell loot" bar.
```

---

## Fallback — krótki prompt (tylko gdy master nie wchodzi)

Załącz **stolicę**. Wklej:

```text
The attached picture is a STYLE + CHARACTER reference ONLY. Copy the drawing language (bold black comic outlines, cel-shade, graphic wood) and copy THIS exact vegetable vendor: plump warm woman, red bandana, gold hoop earrings, white blouse, deep red bodice, holding a carrot, friendly, looking at camera. Copy her red-and-white striped awning and dark wood stall.

Do NOT copy the city layout. This is a NEW 9:16 shot, not a crop and not a redraw of the plaza. No tavern, no palace as a landmark, no fountain, no dwarf, no elf, no goblin, no crow-person. She is the only character.

NEW SCENE — top vignette of a mobile shop (the catalog is UI, not part of this picture):
- She is large, waist-up, on the LEFT half, behind the counter, looking at camera.
- RIGHT half upper area: calm wall or sky, empty enough for a speech bubble.
- TOP ~12%: calm air for a back button and currency.
- BOTTOM ~30%: counter with a few vegetables (carrots, cabbage), simple cobbles that can fade out. No crates.
- Humble barn wall behind her. Daylight.

No UI, no text, no prices, no empty crates meant for item cards.
```

**Negative:**

```text
photoreal, UI, HUD, readable text, prices, gold coins as UI, inventory grid, empty wooden crates, item card slots, 6 side shelves, 12 tiny slots, filled side crates, vegetables in the side shelves, potions, keys, bottles as stock, sell bar, extra NPCs, tavern, fountain, palace filling the frame, crowd, Disney eyes, kids book, grimdark, cigarette, watermark, 16:9, character select poster, crop of a city square
```

---

## Gate (odrzuć, jeśli)

- [ ] Inna kobieta niż na placu (inna twarz / strój / markiza)
- [ ] Skrzynki lub puste półki czekające na karty itemów
- [ ] Tłum / tawerna / fontanna kradną kadr
- [ ] Inna kreska niż A3 + stolica
- [ ] Napisy, cennik, narysowane klucze/poty jako SKU, pasek „sprzedaj”
- [ ] Ona nie patrzy w kamerę albo stoi na środku zamiast na lewej połowie
- [ ] Prawa góra zapchana (brak miejsca na dymek)

**Pass =** poznajesz *tę* babkę z rynku; stoi po lewej; po prawej u góry da się położyć dymek; dół jest prosty i może zniknąć w mgle.

---

## UI na wierzchu (nie malować)

| Element | Gdzie |
|---------|--------|
| Back + pills | Górny luz winiety |
| Dymek (`SpeechBubble`) | Prawa góra, ogonek w jej stronę |
| Buy / Sell + katalog 3×2 | Pod szwem, chrome (golden `shop`) |
| Taby | Pod ekranem, jak na Home |

Day 0: ten sam kadr, najpierw dialog („kim jesteś?”), sklep jako chrome. Nie drugi obraz.

---

## Archiwum — układ 2026-08-16 (nie wklejać)

Starszy lock: babka na środku, 3 puste skrzynki L + 3 R jako gniazda kart, „sprzedaj loot” namalowane na dolnym bruku. Zastąpione lookdevem: katalog i sprzedaż są zakładkami pod winietą. Zostawione tylko po to, żeby nie wrócić do gniazd przy kolejnym prompcie.

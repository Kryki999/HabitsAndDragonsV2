# Prompt — ekran straganu (shop / guide #1)

> **Kadr 3.** Nie crop stolicy. Hub = plac z 3 hotspotami. Tap w stragan → **osobny 9:16**: babka + lady + puste gniazda na itemy.  
> Kreska: [`style-kit.md`](style-kit.md) + mag A3.  
> Produkt: [`23`](../../23-act1-location-brainstorm.md) §B1 · [`06`](../../06-economy-loot.md) §7 · [`24`](../../24-map-production.md).

**Ustawienia generatora:** **9:16** · 1080×1920 look-dev / 1440×2560 master · **nowy obraz** (nie „edytuj to zdjęcie”).

**Paste:** [`style-kit.md`](style-kit.md) STYLE LOCK + SCENE niżej. Załącz **maga**, nie stolicę. Twarz babki = 2–3 cechy w SCENE.

---

## Layout (LOCK kierunku 2026-08-16)

Telefon, luka tabów. „Itemy po bokach” = **3 grube gniazda L + 3 R**, nie siatka 12 ikon.

Ekonomia sklepu (`06` §7) to max ~6 kupna: klucz, freeze, 3–4 rotacja. Skup loot = **dolny pasek UI**, nie gniazdo z boku.

```text
9:16  (action-safe ~środkowe 80%)

┌─────────────────────────────────┐
│ BLEED: niebo / dachy / pałac    │  ← może zniknąć na wysokim tel
│   TINY, out of focus            │
│                                 │
│  [dialog / imię — LUZ UI]       │  ← górne ~12%, puste powietrze
│                                 │
│     ████ MARKIZA ████████       │  czerwono-białe pasy, bez liter
│                                 │
│ [gniazdo]   BABKA     [gniazdo] │
│ [gniazdo]   (centrum) [gniazdo] │  ona patrzy W KAMERĘ
│ [gniazdo]   lady      [gniazdo] │  gniazda = puste skrzynki
│                                 │
│     warzywa TYLKO na lady       │  set dressing, nie SKU sklepu
│                                 │
│ BLEED: bruk                     │  złoto + „sprzedaj loot” = UI
└─────────────────────────────────┘
         taby (nie malować)
```

| Strefa | Co malujesz | Czego NIE |
|--------|-------------|-----------|
| **Środek** | Ona (pas w górę / 3/4), lady, markiza, trochę warzyw na lady | Tłum, elf, krasnal, goblin, kenku |
| **Boki** | 3 puste drewniane skrzynki / półki na stronę — **ciche**, równo, czytelne prostokąty | Warzywa, mikstury, klucze, cenniki w gniazdach |
| **Góra** | Mało: skrawek nieba, dach stodoły za nią (Dom Lv1) | Pałac na 1/3 kadru, schody, fontanna |
| **Dół** | Bruk + krawędź lady | HUD, złoto, napisy |

**Gniazda:** puste wnętrze (cień), gruba belka, miejsce na kartę itemu ~jak kufel Mentora wielkością. 6 gniazd. Nie 12.

**Ona = ta sama co na placu:** ciepła, ziemska, guide #1, lekki uśmiech. **Nie** nowa ładniejsza NPC. **Nie** papieros.

---

## SCENE / CONTENT — wklej w master (nie zamiast mastera)

```text
NEW 9:16 mobile RPG SHOP SCREEN. Not a crop of the attached plaza. Not a restyle of that city layout.

The attached image is STYLE + this woman's identity only. Copy her exactly: plump warm middle-aged vegetable vendor, tanned skin, brown hair in a red bandana, gold hoop earrings, white peasant blouse, deep red bodice, friendly face looking AT THE CAMERA, holding a big carrot. Same red-and-white striped awning, same dark wood stall. She is guide energy, warm, not pretty-generic, not half-lidded like a bored wizard. Graphic cartoon eyes, simple lids, slight smile.

CAMERA: standing close at her stall. She is the only character, large, centered, waist-up behind the counter. Humble barn wall behind her. Outdoor daylight / golden hour (not tavern candles).

COMPOSITION:
- TOP ~12%: empty sky / air for a dialogue bubble. No palace landmark, no stairs, no fountain.
- AWNING across the stall, no letters.
- LEFT third: THREE empty wooden crates stacked. Quiet empty insides for UI item cards. NO food, potions, or keys in them.
- RIGHT third: THREE matching empty wooden crates. Empty.
- COUNTER center only: a few simple vegetables (carrot bunch, cabbage) as set dressing.
- BOTTOM ~12%: empty cobbles.

Do NOT show the tavern, dwarf, elf, goblin, crow-person, lion fountain, or the hill city. No UI, no prices, no readable text. The 6 empty side crates are the gameplay point of this image.
```

---

## Fallback — krótki prompt (tylko gdy master nie wchodzi)

Załącz **stolicę**. Wklej:

```text
The attached picture is a STYLE + CHARACTER reference ONLY. Copy the drawing language (bold black comic outlines, cel-shade, graphic wood) and copy THIS exact vegetable vendor: plump warm woman, red bandana, gold hoop earrings, white blouse, deep red bodice, holding a carrot, friendly, looking at camera. Copy her red-and-white striped awning and dark wood stall.

Do NOT copy the city layout. This is a NEW 9:16 shot, not a crop and not a redraw of the plaza. No tavern, no palace as a landmark, no fountain, no dwarf, no elf, no goblin, no crow-person. She is the only character.

NEW SCENE — mobile game shop screen:
- We stand close at her stall. She is large, centered, waist-up behind the counter.
- TOP ~12%: empty sky / air for a dialogue bubble.
- LEFT third: THREE empty wooden crates stacked, quiet empty insides, ready for item cards. NO food in them.
- RIGHT third: THREE matching empty wooden crates. NO food in them.
- Counter center only: a few vegetables as decoration (carrots, cabbage).
- BOTTOM ~12%: empty cobbles.
- Humble barn wall behind her. Daylight.

No UI, no text, no prices. The 6 empty side crates are the point of the picture.
```

**Negative:**

```text
photoreal, UI, HUD, readable text, prices, gold coins as UI, inventory grid, 12 tiny slots, filled side crates, vegetables in the side shelves, potions, keys, bottles as stock, extra NPCs, tavern, fountain, palace filling the frame, crowd, Disney eyes, kids book, grimdark, cigarette, watermark, 16:9, character select poster, crop of a city square
```

---

## Gate (odrzuć, jeśli)

- [ ] Inna kobieta niż na placu (inna twarz / strój / markiza)
- [ ] Gniazda pełne towaru albo niewidoczne
- [ ] Tłum / tawerna / fontanna kradną kadr
- [ ] Inna kreska niż A3 + stolica
- [ ] Napisy, cennik, narysowane klucze/poty jako SKU
- [ ] Ona nie patrzy w kamerę
- [ ] Góra zapchana (brak miejsca na dialog)

**Pass =** poznajesz *tę* babkę z rynku; po bokach da się położyć 6 kart itemów; góra pusta na kwestię.

---

## UI na wierzchu (nie malować)

| Element | Gdzie (kod) |
|---------|-------------|
| Imię + kwestia | Górny luz |
| 6 kart kupna | Gniazda L/R |
| Złoto + sprzedaj loot | Dolny pasek |
| Taby | Pod grafiką, jak na close-upie lokacji |

Day 0: ten sam kadr, najpierw dialog („kim jesteś?”), sklep jako chrome. Nie drugi obraz.

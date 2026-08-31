# Prompt — Torrik, środek kuźni (okno NPC)

> **Kadr 3.** Tap chaty z Anvil Glade → 9:16 wnętrze. On na środku. Nie sklep (brak gniazd itemów).  
> Kit: [`style-kit.md`](style-kit.md) — mag + STYLE LOCK + SCENE.  
> Lokacja: [`prompt-anvil-glade-closeup.md`](prompt-anvil-glade-closeup.md) · produkt: [`23`](../../23-act1-location-brainstorm.md) §D3.

Chata z zewnątrz wyszła **niska / hobbit-hole**. Wnętrze: niskie belki, okrągłe okienko — spójność, nie obsesja. Ważniejsze: **inny krasnolud niż extras** (tawerna / stolica = rudzi z kuflami).

---

## Design Torrika (LOCK kierunku)

Nie rudy. Nie Gimli. Nie krasnal z kufla na rynku.

| | Tak | Nie |
|--|-----|-----|
| Broda / włos | Sadza-brąz / prawie czarny, **jeden cienki srebrny pas** (gwiazdy) | Rudy, kufel, hełm z rogami |
| Twarz | Ciepły ziomek, lekki wry — „jeszcze nie” | Smutny extra, deadpan maga, Disney |
| Strój | Fartuch okopcony + **dawniej dobry** kaftan (zaszewek, kurz) | Łachman albo parade armor |
| Tell czekania | **Puste ręce.** Młot **leży na kowadle**. Żadnego miecza przy nim / na kowadle. Gogle na czole nieużywane. Pierścień-gwiazda. Wzrok **do gościa** (lekki wry „jeszcze nie”) | Trzyma młot/klingę, kuje, **patrzy w sufit / belkę / okno** (w domu to nie „gwiazdy”) |
| Wzrost | Krasnolud, krępy, duże dłonie | Human-tall, mięśniak-boss |

Między zaniedbaniem a gitem: fartuch brudny od sadzy, kaftan zapięty, jeden warkocz brody lekko luźny. Problem = **nie zaczyna**, nie to że śpi w popiele.

---

## Layout

```text
9:16

┌─────────────────────────────────┐
│  [dialog / imię — LUZ]          │  ~12%
│  niskie belki, okrągłe okno     │
│                                 │
│            TORRIK               │  centrum, duży
│         (okno NPC)              │
│                                 │
│  zimna kuźnia, kowadło,         │
│  młot LEŻY, bez klingi na nim   │
│ BLEED: deski / kamień           │  ~10%
└─────────────────────────────────┘
```

Nie malować UI. Nie gniazda sklepu.

**Look-dev:** twarz + domek KEEP. **Narzędzie w dłoni = fail UX** (wygląda jak praca). Wzrok w górę w domu = sufit, nie gwiazdy.

## REPAIR — puste ręce, bez miecza, nie w sufit (wklej w całości)

Załącz **ten** kadr kuźni. Nie maga.

```text
Use the attached image as the BASE. KEEP this exact dwarf, face, beard with the silver streak, goggles, apron, vest, earring, ring, the low hobbit-hole smithy, beams, round window, anvil, shelves, constellation marks on the beam, lighting, cartoon line. Do NOT restyle. Do NOT change his looks. Do NOT make him sad.

ONLY change pose and props at the anvil.

EMPTY HANDS. He holds NOTHING — no hammer, no sword, no tongs. Hands at his sides, or one palm resting on the wooden stump / anvil rim. Ban: any tool in a fist.

The hammer LIES on the anvil, unused. DELETE the sword from his hands AND from the anvil. No blade on the anvil at all. Background rack swords on the wall may stay.

He is INDOORS. Do NOT tilt his head up at the ceiling, the beam constellation, or the sky window — that just looks like he is staring at the roof. Head level. Eyes toward the visitor / camera. Same wry warm "not yet" face.

He is waiting, not working. Same room. Same man.
```

---

## SCENE — wklej pod STYLE LOCK

```text
SCENE:
- Format: vertical 9:16 mobile RPG NPC interior still. New drawing. No UI, no HUD, no readable letters.
- Camera: inside a LOW dwarf / hobbit-hole smithy that matches a mossy forest cottage — thick low beams, a small ROUND window showing sky, snug not a high hall. Cozy, a bit dusty. Daylight from the round window.
- Bottom ~10%: empty wooden floor / stone only.
- Top ~12%: empty air for a dialogue nameplate.
- Center hotspot: TORRIK, large, the only character. A dwarf NPC, short and compact, big craftsman's hands. He is a unique full NPC, NOT a clone of any background redhead tavern dwarf.

LOOK (must be distinct):
- Hair and beard: soot-dark brown, almost black — NOT red, NOT ginger, NOT Gimli. One thin silver streak in the beard (he waits for stars).
- Warm buddy face, slight wry "not yet" — NOT depressed, NOT wizard deadpan, NOT Disney cute.
- Soot-smudged leather apron over a once-fine dark vest that is still buttoned (respected smith who stopped). Between neglected and tidy: dirty apron, decent clothes, one braid of the beard slightly loose.
- Unused smithing goggles pushed up on his forehead. EMPTY HANDS — holds nothing. The hammer LIES unused on the anvil. NO sword in his hands and NO sword on the anvil (rack swords on the wall only). A simple silver star-punch ring on one finger.
- Head level, looking toward the visitor / camera — wry warm "not yet". Ban: head tilted up at ceiling, beam, or window (indoors that reads as staring at the roof, not at stars). Warm ally. Not a catalog pose, not a heroic flex.

SET: COLD forge (no roaring fire), anvil with the idle hammer on it, bellows idle, a wall rack of "almost finished" sword shapes (not the hero prop), a chalk constellation-scribble on a beam (marks, not readable letters — set dressing, he is NOT gazing at it). Moss at the window frame. No crowd.

Lighting: warm daylight from the round window, cool dead forge. Indoor, not tavern candles, not magic teal/red boss glow.

Ban: red-bearded generic dwarf, Gimli, Disney dwarf, beer-stein dwarf from the capital, wizard, vendor, pirates, basilisk, roaring fire, high cathedral hall, shop item crates, UI, readable text, sad lifeless NPC, muscle boss.
```

---

## Gate

- [ ] To **inny** krasnolud niż extras (nie rudy kufel)
- [ ] Centrum, duży, okno NPC
- [ ] **Puste ręce** + młot leży na kowadle + **brak miecza na kowadle**
- [ ] Wzrok do gościa, nie w sufit / belkę / okno
- [ ] Ciepły ziomek, lekki problem — nie stypa, nie plakat
- [ ] Kreska maga

# Style Kit — kreska H&D (to wklejasz)

> **Default dla nowego agenta i generatora.** Pełne teksty v1.1 = archiwum, nie paste.  
> Źródło ludzkie (długie): [`rpg-visual-style-bible-v1.1.md`](rpg-visual-style-bible-v1.1.md) · stary silnik: [`rpg-art-master-prompt-v1.1.md`](rpg-art-master-prompt-v1.1.md)

**Jedno zdjęcie, zawsze to samo:** czarodziej przy stole w tawernie (Mentor A3). To jest ground truth.  
Nie dokładaj stolicy, starych city JPEG-ów, layoutów do restylu — chyba że *świadomie* przerabiasz konkretny kadr (wtedy dopisek RESTYLE na końcu).

**„Zdjęcie poglądowe” zatoki / piratów / innego miejsca — NIE.** Tool bierze jeden obraz. Drugi ref zjada kreskę (albo skopiuje cudzy layout). Pogląd treści = blok SCENE, nie JPEG z Pinteresta.

Tekst **nie zastąpi** zdjęcia maga. Bez niego model zgaduje „cartoon fantasy” i wraca drift. Biblia jest krótka, bo **obraz niesie mikro**; tekst trzyma twarde zakazy.

---

## Co robi agent (nowa grafika)

1. Załącz **tylko** maga-tawernę.  
2. Wklej **STYLE LOCK** (blok niżej) + **SCENE** (nowa, konkretna).  
3. Format: 9:16, nowy obraz, nie „edytuj stolicę”.  
4. Gate: miniatura = ta sama gra co mag. Jeśli tylko „podobne fantasy” → kolejna iteracja, nie akceptuj.

Konflikt z jakimkolwiek starym assetem / promptem → **wygrywa mag**.

---

## STYLE LOCK — wklej (EN)

```text
STYLE LOCK — attached image is the ONLY drawing language. Same artist, same RPG, new scene. Copy how it is drawn, not what it depicts. Do not copy the wizard, the tavern, or that composition.

GOAL: another location/screenshot from the exact same game. Not "similar cartoon fantasy."

LINE: bold clean black/near-black comic outlines. Exterior outlines thicker than inner lines. Outline stays visible when small. No brown edges, no painterly/soft/thin/sketch lines.

SHAPES: rounded, chunky, slightly exaggerated handmade game shapes. Oversized readable props. Not photoreal, not perfect geometry.

CHARACTERS: characterful not pretty. Bigger heads, graphic faces, few face lines, readable in thumbnail. Exaggerated noses/ears/hands OK.
EYES: simple graphic cartoon eyes, restrained pupils, simple lids. NOT Disney/sparkle/kawaii.
ACTING (critical): people are IN A SITUATION, not posing for a group photo.
- ALLIES (guards, vendors, smiths): warm and human even when tired or lazy. A wry smirk, a shrug, a hello. They are the player's people. Deadpan half-lids are for the WIZARD ONLY — do not paint every good NPC as sad/bored/depressed.
- VILLAINS: mean toward the world, not toward their own crew. Greedy, contempt for victims/crown/player. A functioning gang sharing loot — NOT buddy toasts, NOT about to punch each other, NOT a wholesome melanż, NOT sad grimdark.
- BOSSES: differ by seat, curse, and weapon — NOT by bigger muscles. (Gutterjack = barrel-throne in the cellar + smashed "tulip" bottle, not a toasting extra. Rook = living office + red thought-arrow. Marrow = drowned captain in a chair + teal necklace, more bone, not a bulked-up Rook. Stillgaze = sitting on dumped unfinished blades + pale still gaze — not a roaring dragon, not a giant HP snake. Skarne = waiting guide on a root + green bow-staff, people grown into trees — not Legolas, not a full wizard.)

RENDER: cel-shade. Base + one shadow shape + one small highlight max. No airbrush, no painterly blend, no realistic skin, no PBR.

SHAPE OVER TEXTURE: silhouette, color, outline, big shadow — then almost no grain.
- Wood: 2–4 grain ticks per board, not a texture.
- Stone: a few blocks/cracks.
- Cobbles: large simple stones.
- Cloth: big folds, not wrinkle maps.
- Metal/glass/food: 1–2 graphic highlights. Vegetables are shapes, not glossy produce.
- Water: teal/blue shapes, few reflections, not a water shader.

DETAIL: many objects OK; each object stays simple. When unsure, delete micro-detail.

COLOR: warm saturated browns, amber, ochre, cream, terracotta, natural green, controlled red, gold. Fantasy accents (teal/cyan/violet) sparingly. Not neon.

LIGHT: indoor = candle/fire amber. Outdoor = daylight or golden hour, clear shadow groups. Magic glow = controlled cyan/blue/violet. Not cinematic HDR.

LOCATION LOGIC: premium 2D mobile RPG screen. Clear focal hotspot, foreground/mid/background, bottom ~10% quieter for UI. Depth: less detail and contrast in the distance. Game art, not a storybook illustration.

MOOD: colorful, inviting, slightly comedic, characterful medieval fantasy. Not grimdark, not children's book, not Disney, not glossy ad art.

DO NOT: photoreal, painterly fantasy, concept art, 3D render, anime, Pixar, thin brown outlines, dense textures, AI-polished storybook look.

If extra polish fights the line/shapes/cel-shade, remove the polish.
```

---

## SCENE — szablon (zawsze nowy, zawsze konkret)

Nie wkładaj tu maga ani „jak w poprzednim mieście”. Tylko **ta** scena.

```text
SCENE:
- Format: vertical 9:16 mobile RPG location still. New drawing. No UI, no HUD, no readable letters.
- Camera: [gdzie stoimy, dokąd patrzymy].
- Bottom ~10%: [pusty grunt — bruk / piasek / trawa].
- Hotspot(s) that must read in 0.5s: [co jest tappable].
- Foreground / mid / background: [3 linie].
- Characters: [sojusznicy ciepli; złych = chciwi/pchanie/łup, NIE ziomale na melanżu]. Unique NPC: [2–3 cechy].
- Lighting: indoor amber / outdoor sun.
- Ban: [czego z innych lokacji tu nie ma].
```

**Wyjątek — konkretna znana postać** (babka ze straganu itd.): dopisz 2–3 cechy w SCENE. Nadal **nie** załączaj starego miasta. Mag zostaje jedynym refem kreski.

### Przykład SCENE — Smuggler's Teeth (pirackie wybrzeże)

Wklej **pod** STYLE LOCK. Załącz tylko maga.

```text
SCENE:
- Format: vertical 9:16 mobile RPG location still. New drawing. No UI, no HUD, no readable letters.
- Camera: standing on wet sand, looking INTO a cove between jagged cliff-teeth. Vertical depth, not a map, not a poster.
- Bottom ~10%: empty wet sand and a few simple pebbles only.
- Hotspot that must read in 0.5s: a large cave mouth in the cliff wall, bigger than any pirate, tappable-looking, lanterns burning inside even in daylight (curse).
- Foreground: one rope, one crate, maybe one lantern — set dressing, no character lineup.
- Mid: teal cartoon sea, simple foam; a wrecked smuggler ship / ship skeleton in the cove — readable silhouette, always in frame, NOT the tap target.
- Background/upper: tooth-like cliffs, ropes, ONE empty hanging noose (no gore). Tiny fog on the far sea horizon only. Bright daylight / golden hour sky — not night, not storm.
- Characters: 4–6 HUMAN-SIZED cursed pirates SMALLER than the cave, midground fauna. Pirates of the Caribbean cursed-crew look: half living sailor, half skeleton (skull under the hat, ribs in the coat, one bony arm) — NOT goblins, NOT small green creatures, NOT full horror skeletons. LOUD and ALIVE: crooked bone-grins, toasting rum, roaring, swagger. Unique NPC: fauna only.
- Lighting: outdoor sun / golden hour. Curse tell = lanterns still lit in daylight. Not tavern candles. Not a mournful mood.
- Ban: wizard, tavern, palace, market, cobblestone square, vendor woman, night scene, grimdark, gore, sad lifeless pirates, depressed faces, funeral vibe, Jack Sparrow, One Piece stretch, cute kids pirates, horror skeletons, flags with letters.
```

---

## RESTYLE (opcjonalnie, rzadko)

Tylko gdy przerabiasz **ten sam kadr**. Załącz wtedy **layout** zamiast maga? Nie — tool bierze jedno zdjęcie.

Praktyka: albo (A) nowa scena + mag jako styl, albo (B) img2img starego kadru **bez** maga — wtedy kreska często spada. **Preferuj A.** Restyle zostaw na cleanup kompozycji w już dobrej kresce.

Jeśli musisz B, dopisz jedną linijkę: `Keep camera and layout. Redraw every line, face, material, and shadow in the Style Lock language.`

---

## Gate (mikro, nie makro)

Odrzuć, jeśli:

- [ ] Na miniaturce to nie jest ta sama gra co mag
- [ ] Kontur miękki / brązowy / cienki
- [ ] Painterly / photoreal / 3D
- [ ] Oczy Disney / too pretty
- [ ] Drewno/kamień/bruk pełne ziarna
- [ ] Brak czytelnego hotspotu albo zapchany dół pod taby
- [ ] Skopiowany mag albo skopiowane miasto

**Pass =** „kolejna lokacja z tej gry”, nie „fajne fantasy w podobnym klimacie”.

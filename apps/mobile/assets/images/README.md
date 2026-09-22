# Image assets

V1 kept `assets/` gitignored, so raster art did not travel with the repo.

**Hero tab (this slice)** does not need those files: radar, rarity slots, and backpack use Lucide glyphs + emoji avatar.

When you have real art, drop it here:

| File (suggested) | Use |
|------------------|-----|
| `hero_portrait.png` | Circular avatar in the character sheet (replaces 🧙‍♂️) |
| `item_*.png` | Optional per-item icons in `RarityItemSlot` (today: `LootGlyph`) |

Camp / castle stills already in this folder are for **Questy** (`HomeScenePanel`), not Hero.

**World tab** stills (owner art):

| File | Use |
|------|-----|
| `map_board.png` | Kingdom corridor travel map (pan + pins + fog) |
| `world/map-kingdom.jpg` | Unused legacy square orbit still (not live UI) |
| `world/hub-crownhaven.jpg` | Crownhaven close-up hub + stall/palace NPC stand-in |
| `world/dungeon-gutterjack.jpg` | Unused cellar still (fight uses `mietek.png`) |
| `mietek.png` | Gutterjack fight approach still |
| `tavernsage.png` | Tavern Ground stand-in (Mentor hall; cover-crops on phone) |
| `piraci.png` | Smuggler's Teeth location still |
| `pirates.png` | Saltbone Crew (Common) fight |
| `marrow.png` | Captain Marrow (Elite) fight |
| `przedmiescia.png` | Crown Approaches location still + Pell NPC stand-in |
| `rozbojnicy.png` | Inkless Hands (Common) fight |
| `herszt.png` | Boss Rook (Elite) fight |
| `las.png` | Anvil Glade location still |
| `krasnolud.png` | Torrik smithy NPC |
| `armory1.png` / `armory2.png` | Unused this slice (V1 armory) |
| `bazyliszek.png` | Stillgaze Basilisk (Common) fight |
| `zakazanylas.png` | The Closed Way location still + Thornpack (Elite) stand-in |
| `przewodniklas.png` | Skarne (Champion) fight |
| `ravencastle.png` | Raven Castle location still |
| `elitamnich.png` | Wax Acolyte (Elite) fight |
| `mnich.png` | Wax Abbot (Champion) fight |
| `palantirtower.png` | Pallglass Spire location still |
| `mage.png` | Miro NPC still (no fight) |
| `wampirhouse.png` | Vampire House location still |
| `vampire.png` | Pale Cleric (Elite) fight |
| `watertemple.png` | Tideglass Isle location still |
| `waterboss.png` | Tide Spirit (Elite) fight |
| `piramid.png` | Osiris' Pyramid location still |
| `pyramid_elite.png` | Embalmed Devotee (Elite) fight |
| `oziris.png` | Osiris (Champion) fight |
| `ananieltower.png` | Ananiel's Spire location still |
| `ananiel.png` | Ananiel (Titan) fight |
| `eliteananiel.png` | Unused — no Bible Elite floor before Titan |

Pin / hotspot / fog fractions: `apps/mobile/world/layout.ts`. Location catalog: `apps/mobile/world/content.ts`. Hub interiors: `apps/mobile/world/interiors.ts`.

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
| `world/hub-crownhaven.jpg` | Crownhaven close-up hub |
| `world/dungeon-gutterjack.jpg` | Unused cellar still (fight uses `mietek.png`) |
| `mietek.png` | Gutterjack fight approach still |
| `tavernsage.png` | Tavern Ground stand-in (Mentor hall; cover-crops on phone) |
| `piraci.png` | Smuggler's Teeth location still (`pirates.png` = crew staging, unused) |
| `marrow.png` | Captain Marrow boss approach |
| `przedmiescia.png` | Crown Approaches location still (`rozbojnicy.png` = camp staging, unused) |
| `herszt.png` | Rook boss approach |
| `las.png` | Anvil Glade location still (`armory*` unused this slice) |
| `bazyliszek.png` | Stillgaze boss approach |
| `zakazanylas.png` | The Closed Way location still |
| `przewodniklas.png` | Skarne boss approach |
| `ravencastle.png` | Raven Castle location still |
| `mnich.png` | Wax Abbot boss approach (`elitamnich.png` unused this slice) |
| `palantirtower.png` | Pallglass Spire location still |
| `mage.png` | Miro NPC still (no fight) |
| `wampirhouse.png` | Vampire House location still |
| `vampire.png` | Pale Host boss approach |
| `watertemple.png` | Water Temple location still |
| `waterboss.png` | Tide Spirit boss approach |
| `piramid.png` | Osiris' Pyramid location still |
| `oziris.png` | Osiris boss approach (`pyramid_elite.png` unused this slice) |
| `ananieltower.png` | Ananiel's Spire location still |
| `ananiel.png` | Ananiel boss approach (`eliteananiel.png` unused this slice) |

Pin / hotspot / fog fractions: `apps/mobile/world/layout.ts`. Location catalog: `apps/mobile/world/locations.ts`. Tavern floors: `apps/mobile/world/interiors.ts`.

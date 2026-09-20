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
| `world/map-kingdom.jpg` | Kingdom orbit map (pan/zoom + pins) |
| `world/hub-crownhaven.jpg` | Crownhaven close-up hub |
| `world/dungeon-gutterjack.jpg` | Unused cellar still (fight uses `mietek.png`) |
| `mietek.png` | Gutterjack fight approach still |

Pin / hotspot fractions: `apps/mobile/world/layout.ts`.

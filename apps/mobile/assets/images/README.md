# Image assets

V1 kept `assets/` gitignored, so raster art did not travel with the repo.

**Hero tab (this slice)** does not need those files: radar, rarity slots, and backpack use Lucide glyphs + emoji avatar.

When you have real art, drop it here:

| File (suggested) | Use |
|------------------|-----|
| `hero_portrait.png` | Circular avatar in the character sheet (replaces 🧙‍♂️) |
| `item_*.png` | Optional per-item icons in `RarityItemSlot` (today: `LootGlyph`) |

Camp / castle stills already in this folder are for **Questy** (`HomeScenePanel`), not Hero.

**World tab** stills live in the Act 1 content table: `apps/mobile/world/content.ts`.

| File | Use |
|------|-----|
| `world-map.png` | Kingdom orbit map (pan/zoom + fog + pins) |
| `crownhaven.png` | Crownhaven close-up hub |
| `tavernsage.png` | Tavern ground floor (Parter) |
| `mietek.png` | Gutterjack cellar |
| Other Act 1 PNGs | Close-ups / encounter stills on location rows |

Older JPEGs in `world/` are unused fallbacks. Pin / hotspot fractions and unlock stubs: `world/content.ts`.

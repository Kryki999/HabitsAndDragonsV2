# Image assets

V1 kept `assets/` gitignored, so raster art did not travel with the repo.

**Hero tab** does not need those files: radar, rarity slots, and backpack use Lucide glyphs + emoji avatar.

Camp / castle stills in this folder (`camp_lvl*`, `armory*`) are for **Questy** (`HomeScenePanel`), not World.

**World tab** stills (owner dump — files stay flat; do not nest yet):

| File | Use |
|------|-----|
| `world map.png` | Kingdom orbit map (space in filename — Metro `require` string is exact) |
| `crawnhaven.png` | Crownhaven hub (filename typo kept) |
| `tavernsage.png` | Tavern interior window |
| `mietek.png` | Gutterjack fight |
| `piraci.png` / `pirates.png` / `marrow.png` | Smuggler's Teeth |
| `przedmiescia.png` / `rozbojnicy.png` / `herszt.png` | Crown Approaches |
| `las.png` / `krasnolud.png` / `bazyliszek.png` | Anvil Glade |
| `zakazanylas.png` / `przewodniklas.png` | Closed Way ★1 |
| `palantirtower.png` / `mage.png` | Pallglass |
| `watertemple.png` / `waterboss.png` | Still-Tide Isle |
| `wampirhouse.png` / `vampire.png` | Crimson Press |
| `ravencastle.png` / `mnich.png` / `elitamnich.png` | Raven Keep ★2 |
| `piramid.png` / `pyramid_elite.png` / `oziris.png` | Osiris ★3 |
| `ananieltower.png` / `eliteananiel.png` / `ananiel.png` | Ananiel Titan |

Superseded (kept on disk): `world/map-kingdom.jpg`, `world/hub-crownhaven.jpg`, `world/dungeon-gutterjack.jpg`.

Pin / hotspot fractions: `apps/mobile/world/catalog.ts` + `layout.ts`.

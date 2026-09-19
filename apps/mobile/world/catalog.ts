import {
  Anchor,
  Bird,
  Castle,
  Droplets,
  Hammer,
  Landmark,
  Skull,
  Sparkles,
  Swords,
  Trees,
  User,
  Wine,
  type LucideIcon,
} from 'lucide-react-native';
import type { ImageSourcePropType } from 'react-native';

import { STILL_9_16, TAVERN_INTRINSIC, WORLD_ART } from './art';
import type { LocationWindowId, WorldLocationId } from './types';

/**
 * Filename → playground mapping (owner dump, names as-shipped):
 *
 * | File                    | Use                                      |
 * |-------------------------|------------------------------------------|
 * | world map.png           | Kingdom orbit map (space in name)        |
 * | crawnhaven.png          | Crownhaven hub (typo in filename)        |
 * | tavernsage.png          | Tavern interior (Mentor at the tap)      |
 * | mietek.png              | Gutterjack fight still                   |
 * | piraci.png              | Smuggler's Teeth approach                |
 * | pirates.png             | Saltbone Crew (common fight)             |
 * | marrow.png              | Captain Marrow (elite)                   |
 * | przedmiescia.png        | Crown Approaches                         |
 * | rozbojnicy.png          | Inkless Hands (common)                   |
 * | herszt.png              | Rook (elite)                             |
 * | las.png                 | Anvil Glade                              |
 * | krasnolud.png           | Torrik (NPC)                             |
 * | bazyliszek.png          | Stillgaze basilisk (fight)               |
 * | zakazanylas.png         | Closed Way ★1                            |
 * | przewodniklas.png       | Skarne (champion still)                  |
 * | palantirtower.png       | Pallglass Spire                          |
 * | mage.png                | Miro (NPC, no dungeon)                   |
 * | watertemple.png         | Still-Tide isle                          |
 * | waterboss.png           | Water spirit (fight stub)                |
 * | wampirhouse.png         | Crimson Press (wine chapel)              |
 * | vampire.png             | Wine-priest (fight stub)                 |
 * | ravencastle.png         | Raven Keep ★2                            |
 * | mnich.png               | Pitch-monk (common)                      |
 * | elitamnich.png          | Pitch-monk (elite)                       |
 * | piramid.png             | Osiris pyramid ★3                        |
 * | pyramid_elite.png       | Mummy elite                              |
 * | oziris.png              | Osiris champion                          |
 * | ananieltower.png        | Ananiel tower                            |
 * | eliteananiel.png        | Tower acolyte (elite)                    |
 * | ananiel.png             | Ananiel titan still                      |
 *
 * Unused this PR: camp_lvl*, armory*, char_mage.png, world/*.jpg (superseded).
 */

export type LocationWindowDef = {
  id: LocationWindowId;
  /** Tiny dock caption + a11y. */
  label: string;
  icon: LucideIcon;
  source: ImageSourcePropType;
  intrinsicWidth: number;
  intrinsicHeight: number;
  blurb: string;
};

export type MapLocationDef = {
  id: WorldLocationId;
  name: string;
  kicker: string;
  unlockLevel: number;
  /** Spoken fog hint. */
  fogHint: string;
  /** Pin on the orbit map. Gutterjack has none. */
  pin?: {
    x: number;
    y: number;
    icon: LucideIcon;
  };
  windows: LocationWindowDef[];
};

const still = (
  id: LocationWindowId,
  label: string,
  icon: LucideIcon,
  source: ImageSourcePropType,
  blurb: string,
  intrinsic: { width: number; height: number } = STILL_9_16,
): LocationWindowDef => ({
  id,
  label,
  icon,
  source,
  intrinsicWidth: intrinsic.width,
  intrinsicHeight: intrinsic.height,
  blurb,
});

export const ALWAYS_UNLOCKED: WorldLocationId[] = ['crownhaven'];

export const MAP_LOCATIONS: MapLocationDef[] = [
  {
    id: 'crownhaven',
    name: 'Crownhaven',
    kicker: 'Capital',
    unlockLevel: 1,
    fogHint: 'Home.',
    pin: { x: 0.5, y: 0.38, icon: Castle },
    windows: [
      still(
        'approach',
        'Square',
        Landmark,
        WORLD_ART.crownhaven,
        'Market square. Stall, tap, palace on the hill.',
      ),
      still(
        'tavern',
        'Tap',
        Wine,
        WORLD_ART.tavernSage,
        'The tap after the cellar is quiet. Mentor keeps a table.',
        TAVERN_INTRINSIC,
      ),
    ],
  },
  {
    id: 'gutterjack',
    name: 'Gutterjack',
    kicker: 'Common · Tutorial',
    unlockLevel: 1,
    fogHint: 'Hub cellar — not a map pin.',
    windows: [
      still(
        'fight',
        'Fight',
        Swords,
        WORLD_ART.gutterjack,
        'The sot who took the wine vault. Barrel-throne, smashed-bottle tulip.',
      ),
    ],
  },
  {
    id: 'smugglers-teeth',
    name: "Smuggler's Teeth",
    kicker: 'Ring 1 · Coast',
    unlockLevel: 3,
    fogHint: "Smuggler's Teeth unlocks at level 3.",
    pin: { x: 0.2, y: 0.72, icon: Anchor },
    windows: [
      still('approach', 'Cove', Landmark, WORLD_ART.piraci, 'Cliff-teeth cove. Wreck in the water. Cave is the door.'),
      still('fight', 'Crew', Swords, WORLD_ART.pirates, 'Saltbone Crew — common farm. Combat engine later.'),
      still('fightElite', 'Marrow', Skull, WORLD_ART.marrow, 'Captain Marrow. Necklace of the Still Tide. Stub only.'),
    ],
  },
  {
    id: 'crown-approaches',
    name: 'Crown Approaches',
    kicker: 'Ring 1 · South',
    unlockLevel: 3,
    fogHint: 'Crown Approaches unlocks at level 3.',
    pin: { x: 0.42, y: 0.64, icon: Landmark },
    windows: [
      still(
        'approach',
        'Watch',
        Landmark,
        WORLD_ART.przedmiescia,
        'Watchtower and the Inkless camp under the walls.',
      ),
      still('fight', 'Camp', Swords, WORLD_ART.rozbojnicy, 'Inkless Hands — living bandits, not ghosts.'),
      still('fightElite', 'Rook', Skull, WORLD_ART.herszt, 'Rook. Warrant, red ring, no combat yet.'),
    ],
  },
  {
    id: 'anvil-glade',
    name: 'Anvil Glade',
    kicker: 'Ring 1 · Forest',
    unlockLevel: 3,
    fogHint: 'Anvil Glade unlocks at level 3.',
    pin: { x: 0.7, y: 0.57, icon: Hammer },
    windows: [
      still('approach', 'Glade', Trees, WORLD_ART.las, "Torrik's mossy smithy. The mossy gate is Stillgaze."),
      still('npc', 'Torrik', User, WORLD_ART.krasnolud, 'Dwarf smith. Hammer idle on the anvil. Ally NPC later.'),
      still('fight', 'Gaze', Swords, WORLD_ART.bazyliszek, 'Stillgaze — basilisk on a pile of unfinished swords.'),
    ],
  },
  {
    id: 'closed-way',
    name: 'Closed Way',
    kicker: 'Main ★1',
    unlockLevel: 5,
    fogHint: 'Closed Way (★1) unlocks at level 5.',
    pin: { x: 0.6, y: 0.22, icon: Trees },
    windows: [
      still('approach', 'Gate', Trees, WORLD_ART.zakazanylas, 'Sealed forest road. Wax seal. Do not take the same pin as the smith.'),
      still('fightChampion', 'Skarne', Sparkles, WORLD_ART.przewodniklas, 'Skarne the pathfinder. Champion still — no fight engine.'),
    ],
  },
  {
    id: 'pallglass',
    name: 'Pallglass Spire',
    kicker: 'Ring 2 · Ally',
    unlockLevel: 6,
    fogHint: 'Pallglass Spire unlocks at level 6.',
    pin: { x: 0.84, y: 0.38, icon: Sparkles },
    windows: [
      still('approach', 'Spire', Landmark, WORLD_ART.palantirtower, 'Glass tower. Palantir burns upstairs. No dungeon here.'),
      still('npc', 'Miro', User, WORLD_ART.mage, 'Miro at the palantir. Doomscroll, not a boss.'),
    ],
  },
  {
    id: 'still-tide',
    name: 'Still-Tide Isle',
    kicker: 'Ring 2 · Water',
    unlockLevel: 7,
    fogHint: 'Still-Tide Isle unlocks at level 7.',
    pin: { x: 0.18, y: 0.42, icon: Droplets },
    windows: [
      still('approach', 'Isle', Droplets, WORLD_ART.watertemple, 'Lake shrine. Boat on the shore. Step-stones to the door.'),
      still('fight', 'Spirit', Swords, WORLD_ART.waterboss, 'Water spirit. Fight stub — loot later.'),
    ],
  },
  {
    id: 'raven-keep',
    name: 'Raven Keep',
    kicker: 'Main ★2',
    unlockLevel: 8,
    fogHint: 'Raven Keep (★2) unlocks at level 8.',
    pin: { x: 0.78, y: 0.11, icon: Bird },
    windows: [
      still('approach', 'Keep', Castle, WORLD_ART.ravencastle, 'Pitch-banner keep. Crows on the battlements.'),
      still('fight', 'Monk', Swords, WORLD_ART.mnich, 'Pitch-monk on the tar throne.'),
      still('fightElite', 'Elite', Skull, WORLD_ART.elitamnich, 'Elite pitch-monk. Same house, heavier tar.'),
    ],
  },
  {
    id: 'crimson-press',
    name: 'Crimson Press',
    kicker: 'Ring 2 · Vine',
    unlockLevel: 9,
    fogHint: 'Crimson Press unlocks at level 9.',
    pin: { x: 0.64, y: 0.86, icon: Wine },
    windows: [
      still('approach', 'Press', Wine, WORLD_ART.wampirhouse, 'Wine chapel in the vines. Red door, not a castle.'),
      still('fight', 'Priest', Swords, WORLD_ART.vampire, 'Smiling wine-priest. Fight stub.'),
    ],
  },
  {
    id: 'osiris',
    name: 'Osiris',
    kicker: 'Main ★3',
    unlockLevel: 11,
    fogHint: 'Osiris (★3) unlocks at level 11.',
    pin: { x: 0.3, y: 0.13, icon: Landmark },
    windows: [
      still('approach', 'Pyramid', Landmark, WORLD_ART.piramid, 'Sun-disk pyramid. Jackals at the door.'),
      still('fightElite', 'Mummy', Skull, WORLD_ART.pyramidElite, 'Bandaged elite in the corridor.'),
      still('fightChampion', 'Osiris', Sparkles, WORLD_ART.oziris, 'Osiris. Champion still — no combat yet.'),
    ],
  },
  {
    id: 'ananiel',
    name: 'Ananiel',
    kicker: 'Titan',
    unlockLevel: 13,
    fogHint: 'Ananiel (Titan) unlocks at level 13.',
    pin: { x: 0.1, y: 0.12, icon: Sparkles },
    windows: [
      still('approach', 'Tower', Landmark, WORLD_ART.ananieltower, 'Dream-Siphon tower. Purple glass, sun-disk doors.'),
      still('fightElite', 'Acolyte', Skull, WORLD_ART.eliteananiel, 'Tower acolyte on the stairs. Not the Titan.'),
      still('fightChampion', 'Titan', Sparkles, WORLD_ART.ananiel, 'Ananiel the Dream-Siphon. Still only.'),
    ],
  },
];

export const LOCATION_BY_ID: Record<WorldLocationId, MapLocationDef> = MAP_LOCATIONS.reduce(
  (acc, loc) => {
    acc[loc.id] = loc;
    return acc;
  },
  {} as Record<WorldLocationId, MapLocationDef>,
);

export const MAP_PIN_LOCATIONS = MAP_LOCATIONS.filter((loc) => loc.pin);

export function windowById(loc: MapLocationDef, id: LocationWindowId): LocationWindowDef | undefined {
  return loc.windows.find((w) => w.id === id);
}

export const GUTTERJACK_COPY = {
  kicker: 'Common · Tutorial',
  title: 'Gutterjack',
  blurb:
    'The sot who took the wine vault. Once a family restaurant. Now he sits a barrel-throne with a smashed-bottle tulip and will not give the cellar back.',
  enter: 'Enter',
  fightKicker: 'Tutorial fight · 100% win',
  fightBlurb: 'No combat engine in this playground. Tap victory — Gutterjack always falls the first time.',
  victory: 'Victory (tutorial)',
  clearedKicker: 'Cleared',
  clearedBlurb: 'The cellar is yours. The tavern can breathe again — for now. Common farm comes later.',
  backToHub: 'Back to Crownhaven',
} as const;

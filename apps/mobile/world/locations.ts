import type { ImageSourcePropType } from 'react-native';

import type { CombatChallenge } from '@/combat/types';
import type { CombatSynergyTier } from '@/types/dungeonLoot';

import type { MapLocationId } from './types';

/** Every Act 1 still in the V1 dump is 941×1672 (9:16). */
export const LOCATION_STILL_INTRINSIC = { width: 941, height: 1672 } as const;

export type LocationHotspotDef = {
  x: number;
  y: number;
  label: string;
  hint: string;
};

export type BossEncounterDef = {
  kind: 'boss';
  id: string;
  name: string;
  dungeonName: string;
  still: ImageSourcePropType;
  accentColor: string;
  tier: CombatSynergyTier;
  bossLevel: number;
  baseWinChance: number;
  failureConsolationGoldRange: readonly [number, number];
};

export type NpcEncounterDef = {
  kind: 'npc';
  id: string;
  name: string;
  still: ImageSourcePropType;
  flavor: string;
};

export type MapLocationDef = {
  id: MapLocationId;
  name: string;
  kicker: string;
  still: ImageSourcePropType;
  hotspot: LocationHotspotDef;
  encounter: BossEncounterDef | NpcEncounterDef;
};

/**
 * Act 1 map locations — existing stills only (no new art).
 * Pin id == location id == fog region id. Tune hotspot xy here.
 *
 * Art picks (two files for the same beat → better 9:16 still / named boss):
 * Teeth cove = piraci (pirates.png is crew staging). Approaches road = przedmiescia
 * (rozbojnicy.png is the camp). Anvil = las (armory* is interior). Castle boss = mnich
 * on the throne. Pyramid boss = oziris. Titan = ananiel.
 */
/** Discover seed order: Approaches first; Teeth/Anvil optional sides; Main ★ separate. */
export const MAP_LOCATION_IDS: readonly MapLocationId[] = [
  'crown-approaches',
  'smugglers-teeth',
  'anvil-glade',
  'closed-way',
  'water-temple',
  'pallglass',
  'raven-castle',
  'vampire-house',
  'pyramid',
  'ananiel',
] as const;

export const MAP_LOCATIONS: Record<MapLocationId, MapLocationDef> = {
  'smugglers-teeth': {
    id: 'smugglers-teeth',
    name: "Smuggler's Teeth",
    kicker: 'Coast',
    still: require('@/assets/images/piraci.png') as ImageSourcePropType,
    hotspot: { x: 0.62, y: 0.5, label: 'Cave', hint: 'Marrow' },
    encounter: {
      kind: 'boss',
      id: 'marrow',
      name: 'Captain Marrow',
      dungeonName: 'Saltbone den',
      still: require('@/assets/images/marrow.png') as ImageSourcePropType,
      accentColor: '#6ec8c4',
      tier: 'common',
      bossLevel: 4,
      baseWinChance: 0.62,
      failureConsolationGoldRange: [12, 22],
    },
  },
  'crown-approaches': {
    id: 'crown-approaches',
    name: 'Crown Approaches',
    kicker: 'South road',
    still: require('@/assets/images/przedmiescia.png') as ImageSourcePropType,
    hotspot: { x: 0.72, y: 0.5, label: 'Camp', hint: 'Rook' },
    encounter: {
      kind: 'boss',
      id: 'rook',
      name: 'Rook',
      dungeonName: 'Inkless camp',
      still: require('@/assets/images/herszt.png') as ImageSourcePropType,
      accentColor: '#c4a35a',
      tier: 'common',
      bossLevel: 3,
      baseWinChance: 0.68,
      failureConsolationGoldRange: [10, 20],
    },
  },
  'anvil-glade': {
    id: 'anvil-glade',
    name: 'Anvil Glade',
    kicker: 'Forest',
    still: require('@/assets/images/las.png') as ImageSourcePropType,
    hotspot: { x: 0.7, y: 0.48, label: 'Gate', hint: 'Stillgaze' },
    encounter: {
      kind: 'boss',
      id: 'stillgaze',
      name: 'Stillgaze',
      dungeonName: 'Moss gate',
      still: require('@/assets/images/bazyliszek.png') as ImageSourcePropType,
      accentColor: '#7bc47a',
      tier: 'common',
      bossLevel: 2,
      baseWinChance: 0.7,
      failureConsolationGoldRange: [8, 16],
    },
  },
  'closed-way': {
    id: 'closed-way',
    name: 'The Closed Way',
    kicker: 'Forbidden path',
    still: require('@/assets/images/zakazanylas.png') as ImageSourcePropType,
    hotspot: { x: 0.5, y: 0.58, label: 'Seal', hint: 'Skarne' },
    encounter: {
      kind: 'boss',
      id: 'skarne',
      name: 'Skarne',
      dungeonName: 'Closed Way',
      still: require('@/assets/images/przewodniklas.png') as ImageSourcePropType,
      accentColor: '#6a9a5a',
      tier: 'common',
      bossLevel: 7,
      baseWinChance: 0.48,
      failureConsolationGoldRange: [16, 28],
    },
  },
  'raven-castle': {
    id: 'raven-castle',
    name: 'Raven Castle',
    kicker: 'Main',
    still: require('@/assets/images/ravencastle.png') as ImageSourcePropType,
    hotspot: { x: 0.58, y: 0.52, label: 'Doors', hint: 'Abbot' },
    encounter: {
      kind: 'boss',
      id: 'wax-abbot',
      name: 'Wax Abbot',
      dungeonName: 'Raven nave',
      still: require('@/assets/images/mnich.png') as ImageSourcePropType,
      accentColor: '#8b6bb0',
      tier: 'common',
      bossLevel: 8,
      baseWinChance: 0.45,
      failureConsolationGoldRange: [18, 30],
    },
  },
  pallglass: {
    id: 'pallglass',
    name: 'Pallglass Spire',
    kicker: 'Ally',
    still: require('@/assets/images/palantirtower.png') as ImageSourcePropType,
    hotspot: { x: 0.5, y: 0.78, label: 'Door', hint: 'Miro' },
    encounter: {
      kind: 'npc',
      id: 'miro',
      name: 'Miro',
      still: require('@/assets/images/mage.png') as ImageSourcePropType,
      flavor: 'The glass turns. Miro does not fight — he watches, and sometimes he helps.',
    },
  },
  'vampire-house': {
    id: 'vampire-house',
    name: 'Vampire House',
    kicker: 'Side',
    still: require('@/assets/images/wampirhouse.png') as ImageSourcePropType,
    hotspot: { x: 0.5, y: 0.7, label: 'Threshold', hint: 'Host' },
    encounter: {
      kind: 'boss',
      id: 'vampire',
      name: 'The Pale Host',
      dungeonName: 'Pale house',
      still: require('@/assets/images/vampire.png') as ImageSourcePropType,
      accentColor: '#b05070',
      tier: 'common',
      bossLevel: 6,
      baseWinChance: 0.52,
      failureConsolationGoldRange: [14, 24],
    },
  },
  'water-temple': {
    id: 'water-temple',
    name: 'Water Temple',
    kicker: 'Isle',
    still: require('@/assets/images/watertemple.png') as ImageSourcePropType,
    hotspot: { x: 0.5, y: 0.62, label: 'Shrine', hint: 'Tide' },
    encounter: {
      kind: 'boss',
      id: 'tide-spirit',
      name: 'Tide Spirit',
      dungeonName: 'Lake shrine',
      still: require('@/assets/images/waterboss.png') as ImageSourcePropType,
      accentColor: '#4aa3c8',
      tier: 'common',
      bossLevel: 5,
      baseWinChance: 0.58,
      failureConsolationGoldRange: [12, 22],
    },
  },
  pyramid: {
    id: 'pyramid',
    name: "Osiris' Pyramid",
    kicker: 'Desert',
    still: require('@/assets/images/piramid.png') as ImageSourcePropType,
    hotspot: { x: 0.5, y: 0.66, label: 'Tomb', hint: 'Osiris' },
    encounter: {
      kind: 'boss',
      id: 'osiris',
      name: 'Osiris',
      dungeonName: 'Sandglass tomb',
      still: require('@/assets/images/oziris.png') as ImageSourcePropType,
      accentColor: '#d4a84a',
      tier: 'common',
      bossLevel: 11,
      baseWinChance: 0.38,
      failureConsolationGoldRange: [22, 36],
    },
  },
  ananiel: {
    id: 'ananiel',
    name: "Ananiel's Spire",
    kicker: 'Titan',
    still: require('@/assets/images/ananieltower.png') as ImageSourcePropType,
    hotspot: { x: 0.5, y: 0.72, label: 'Spire', hint: 'Ananiel' },
    encounter: {
      kind: 'boss',
      id: 'ananiel',
      name: 'Ananiel',
      dungeonName: 'Dream-Siphon',
      still: require('@/assets/images/ananiel.png') as ImageSourcePropType,
      accentColor: '#9b6cff',
      tier: 'common',
      bossLevel: 13,
      baseWinChance: 0.28,
      failureConsolationGoldRange: [28, 44],
    },
  },
};

export function isMapLocationId(id: string): id is MapLocationId {
  return id in MAP_LOCATIONS;
}

export function challengeFor(encounter: BossEncounterDef): CombatChallenge {
  return {
    id: encounter.id,
    dungeonName: encounter.dungeonName,
    bossId: encounter.id,
    bossName: encounter.name,
    accentColor: encounter.accentColor,
    tier: encounter.tier,
    bossLevel: encounter.bossLevel,
    baseWinChance: encounter.baseWinChance,
    failureConsolationGoldRange: encounter.failureConsolationGoldRange,
  };
}

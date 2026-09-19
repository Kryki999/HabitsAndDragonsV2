import type { ImageSourcePropType } from 'react-native';

/**
 * World stills — files stay flat under `assets/images/` (owner dump).
 * Metro: `world map.png` has a space; keep the string exact.
 *
 * Filename map (readable name → file): see `catalog.ts` header.
 */
export const STILL_9_16 = { width: 941, height: 1672 } as const;
export const MAP_INTRINSIC = { width: 1254, height: 1254 } as const;
export const TAVERN_INTRINSIC = { width: 1678, height: 937 } as const;

export const WORLD_ART = {
  map: require('@/assets/images/world map.png') as ImageSourcePropType,
  crownhaven: require('@/assets/images/crawnhaven.png') as ImageSourcePropType,
  tavernSage: require('@/assets/images/tavernsage.png') as ImageSourcePropType,
  gutterjack: require('@/assets/images/mietek.png') as ImageSourcePropType,
  piraci: require('@/assets/images/piraci.png') as ImageSourcePropType,
  pirates: require('@/assets/images/pirates.png') as ImageSourcePropType,
  marrow: require('@/assets/images/marrow.png') as ImageSourcePropType,
  przedmiescia: require('@/assets/images/przedmiescia.png') as ImageSourcePropType,
  rozbojnicy: require('@/assets/images/rozbojnicy.png') as ImageSourcePropType,
  herszt: require('@/assets/images/herszt.png') as ImageSourcePropType,
  las: require('@/assets/images/las.png') as ImageSourcePropType,
  krasnolud: require('@/assets/images/krasnolud.png') as ImageSourcePropType,
  bazyliszek: require('@/assets/images/bazyliszek.png') as ImageSourcePropType,
  zakazanylas: require('@/assets/images/zakazanylas.png') as ImageSourcePropType,
  przewodniklas: require('@/assets/images/przewodniklas.png') as ImageSourcePropType,
  palantirtower: require('@/assets/images/palantirtower.png') as ImageSourcePropType,
  mage: require('@/assets/images/mage.png') as ImageSourcePropType,
  watertemple: require('@/assets/images/watertemple.png') as ImageSourcePropType,
  waterboss: require('@/assets/images/waterboss.png') as ImageSourcePropType,
  wampirhouse: require('@/assets/images/wampirhouse.png') as ImageSourcePropType,
  vampire: require('@/assets/images/vampire.png') as ImageSourcePropType,
  ravencastle: require('@/assets/images/ravencastle.png') as ImageSourcePropType,
  mnich: require('@/assets/images/mnich.png') as ImageSourcePropType,
  elitamnich: require('@/assets/images/elitamnich.png') as ImageSourcePropType,
  piramid: require('@/assets/images/piramid.png') as ImageSourcePropType,
  pyramidElite: require('@/assets/images/pyramid_elite.png') as ImageSourcePropType,
  oziris: require('@/assets/images/oziris.png') as ImageSourcePropType,
  ananieltower: require('@/assets/images/ananieltower.png') as ImageSourcePropType,
  eliteananiel: require('@/assets/images/eliteananiel.png') as ImageSourcePropType,
  ananiel: require('@/assets/images/ananiel.png') as ImageSourcePropType,
};

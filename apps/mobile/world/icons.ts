import {
  Anchor,
  ArrowLeft,
  Bird,
  Castle,
  ChevronsDown,
  ChevronsUp,
  Church,
  Hammer,
  Landmark,
  Lock,
  Map,
  Mountain,
  Shield,
  Sparkles,
  Store,
  Trees,
  Waves,
  Wine,
  X,
} from 'lucide-react-native';

export const PIN_ICONS = {
  castle: Castle,
  lock: Lock,
  anchor: Anchor,
  shield: Shield,
  hammer: Hammer,
  trees: Trees,
  sparkles: Sparkles,
  church: Church,
  waves: Waves,
  bird: Bird,
  mountain: Mountain,
  landmark: Landmark,
} as const;

export type PinIconName = keyof typeof PIN_ICONS;

export const HOTSPOT_ICONS = {
  wine: Wine,
  store: Store,
  castle: Castle,
  stairsDown: ChevronsDown,
  stairsUp: ChevronsUp,
} as const;

export type HotspotIconName = keyof typeof HOTSPOT_ICONS;

export const NAV_ICONS = {
  map: Map,
  back: ArrowLeft,
  stairsDown: ChevronsDown,
  stairsUp: ChevronsUp,
  close: X,
} as const;

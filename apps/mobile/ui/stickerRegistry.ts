import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

import Bat from '../lookdev/assets/fe-bat.svg';
import Beer from '../lookdev/assets/fe-beer-mug.svg';
import Biceps from '../lookdev/assets/fe-flexed-biceps.svg';
import Blackbird from '../lookdev/assets/fe-blackbird.svg';
import Bolt from '../lookdev/assets/fe-high-voltage.svg';
import Book from '../lookdev/assets/fe-open-book.svg';
import Brain from '../lookdev/assets/fe-brain.svg';
import Bread from '../lookdev/assets/fe-bread.svg';
import Bullseye from '../lookdev/assets/fe-bullseye.svg';
import Carrot from '../lookdev/assets/fe-carrot.svg';
import Castle from '../lookdev/assets/fe-castle.svg';
import Clover from '../lookdev/assets/fe-four-leaf-clover.svg';
import Coat from '../lookdev/assets/fe-coat.svg';
import Coin from '../lookdev/assets/hd-coin.svg';
import Crown from '../lookdev/assets/fe-crown.svg';
import CrystalBall from '../lookdev/assets/fe-crystal-ball.svg';
import Dagger from '../lookdev/assets/fe-dagger.svg';
import Desert from '../lookdev/assets/fe-desert.svg';
import Droplet from '../lookdev/assets/fe-droplet.svg';
import Gem from '../lookdev/assets/fe-gem-stone.svg';
import Gift from '../lookdev/assets/fe-wrapped-gift.svg';
import Hammer from '../lookdev/assets/fe-hammer-and-wrench.svg';
import Handshake from '../lookdev/assets/fe-handshake.svg';
import Heart from '../lookdev/assets/fe-red-heart.svg';
import Helmet from '../lookdev/assets/fe-military-helmet.svg';
import Ice from '../lookdev/assets/fe-ice.svg';
import Key from '../lookdev/assets/fe-old-key.svg';
import Leaf from '../lookdev/assets/fe-leaf-fluttering-in-wind.svg';
import Mage from '../lookdev/assets/fe-man-mage.svg';
import Nazar from '../lookdev/assets/fe-nazar-amulet.svg';
import Running from '../lookdev/assets/fe-person-running.svg';
import Scroll from '../lookdev/assets/fe-scroll.svg';
import Soap from '../lookdev/assets/fe-soap.svg';
import Sparkles from '../lookdev/assets/fe-sparkles.svg';
import Sunrise from '../lookdev/assets/fe-sunrise.svg';
import Swords from '../lookdev/assets/fe-crossed-swords.svg';
import Tube from '../lookdev/assets/fe-test-tube.svg';
import Wine from '../lookdev/assets/fe-wine-glass.svg';
import WorldMap from '../lookdev/assets/fe-world-map.svg';

export const stickers = {
  bat: Bat,
  beer: Beer,
  biceps: Biceps,
  blackbird: Blackbird,
  bolt: Bolt,
  book: Book,
  brain: Brain,
  bread: Bread,
  bullseye: Bullseye,
  carrot: Carrot,
  castle: Castle,
  clover: Clover,
  coat: Coat,
  coin: Coin,
  crown: Crown,
  crystalBall: CrystalBall,
  dagger: Dagger,
  desert: Desert,
  droplet: Droplet,
  gem: Gem,
  gift: Gift,
  hammer: Hammer,
  handshake: Handshake,
  heart: Heart,
  helmet: Helmet,
  ice: Ice,
  key: Key,
  leaf: Leaf,
  mage: Mage,
  nazar: Nazar,
  running: Running,
  scroll: Scroll,
  soap: Soap,
  sparkles: Sparkles,
  sunrise: Sunrise,
  swords: Swords,
  tube: Tube,
  wine: Wine,
  worldMap: WorldMap,
} as const satisfies Record<string, FC<SvgProps>>;

export type StickerName = keyof typeof stickers;

const EMOJI_STICKER: Record<string, StickerName> = {
  '💪': 'biceps',
  '🏋️': 'biceps',
  '🧊': 'ice',
  '🏃': 'running',
  '🚶': 'running',
  '🧘': 'leaf',
  '🧘‍♂️': 'leaf',
  '🧘‍♀️': 'leaf',
  '📖': 'book',
  '🎓': 'book',
  '📝': 'scroll',
  '🧠': 'brain',
  '🌙': 'sparkles',
  '⭐': 'sparkles',
  '🌟': 'sparkles',
  '✨': 'sparkles',
  '📵': 'nazar',
  '🍲': 'carrot',
  '🥕': 'carrot',
  '⚔️': 'swords',
  '🛡️': 'helmet',
  '🎯': 'bullseye',
  '🔥': 'bolt',
  '💎': 'gem',
  '🏆': 'crown',
  '👑': 'crown',
  '💧': 'droplet',
  '🧼': 'soap',
  '🍃': 'leaf',
  '❤️': 'heart',
  '⚡': 'bolt',
  '🍀': 'clover',
  '🍞': 'bread',
  '🧥': 'coat',
  '🪖': 'helmet',
  '🍺': 'beer',
  '🏰': 'castle',
  '🔨': 'hammer',
  '🧪': 'tube',
  '🗡️': 'dagger',
  '🌅': 'sunrise',
  '💬': 'handshake',
  '💰': 'coin',
  '🎒': 'gift',
  '🏯': 'castle',
  '👹': 'nazar',
  '👥': 'handshake',
  '😊': 'heart',
  '📅': 'sunrise',
  '💾': 'scroll',
  '🎭': 'sparkles',
  '🔄': 'scroll',
  '🔔': 'scroll',
};

export function stickerForHabitIcon(icon: string | undefined): StickerName {
  if (!icon) return 'scroll';
  return EMOJI_STICKER[icon] ?? 'scroll';
}

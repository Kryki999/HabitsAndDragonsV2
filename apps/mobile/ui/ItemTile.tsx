import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Sticker } from '@/ui/Sticker';
import type { StickerName } from '@/ui/stickerRegistry';
import { tokens } from '@/ui/tokens';
import type { LootIconId, LootRarity } from '@/types/dungeonLoot';

type Props = {
  rarity?: LootRarity;
  sticker?: StickerName;
  qty?: string;
  size?: number;
  radius?: number;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
};

/** Bible names for the four rarity frames (06 §10). */
export function bibleRarityName(rarity: LootRarity): string {
  if (rarity === 'legendary') return 'Artifact';
  if (rarity === 'epic') return 'Heroic';
  if (rarity === 'rare' || rarity === 'uncommon') return 'Unique';
  return 'Common';
}

const FRAME: Record<LootRarity, string> = {
  common: tokens.rCommon,
  uncommon: tokens.rUnique,
  rare: tokens.rUnique,
  epic: tokens.rHeroic,
  legendary: tokens.rArtifact,
};

const LOOT_STICKER: Record<LootIconId, StickerName> = {
  gem: 'gem',
  crown: 'crown',
  shield: 'helmet',
  sparkles: 'sparkles',
  skull: 'nazar',
  flame: 'bolt',
  snowflake: 'ice',
  key: 'key',
  scroll: 'scroll',
  star: 'sparkles',
  coins: 'coin',
  sword: 'swords',
  orb: 'gem',
  anchor: 'nazar',
  moon: 'nazar',
  wine: 'wine',
};

export function stickerForLootIcon(icon: LootIconId): StickerName {
  return LOOT_STICKER[icon];
}

export function ItemTile({
  rarity = 'common',
  sticker,
  qty,
  size = 46,
  radius,
  onPress,
  testID,
  accessibilityLabel,
}: Props) {
  const frame = FRAME[rarity];
  const body = (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: radius ?? Math.round(size * 0.28),
          borderColor: frame,
          backgroundColor: mixOnWhite(frame),
          boxShadow: [{ offsetX: 0, offsetY: 3, blurRadius: 0, color: frame }],
        },
      ]}
    >
      {sticker ? <Sticker name={sticker} size={Math.round(size * 0.7)} bare /> : null}
      {qty ? <Text style={styles.qty}>{qty}</Text> : null}
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} testID={testID} onPress={onPress}>
      {body}
    </Pressable>
  );
}

/** Rarity at 16% over white, matching `.item.light`. */
function mixOnWhite(hex: string): string {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (channel: number) => Math.round(channel * 0.16 + 255 * 0.84);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

const styles = StyleSheet.create({
  tile: {
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    position: 'absolute',
    right: 3,
    bottom: 2,
    fontFamily: tokens.font900,
    fontSize: 10,
    color: tokens.ink,
  },
});

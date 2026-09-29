import { Pressable, StyleSheet, Text } from 'react-native';

import { bibleRarityName, ItemTile } from '@/ui/ItemTile';
import { Slot } from '@/ui/Slot';
import type { StickerName } from '@/ui/stickerRegistry';
import { tokens } from '@/ui/tokens';
import type { LootRarity } from '@/types/dungeonLoot';

type Kind = 'outfit' | 'relic';

type Filled = {
  name: string;
  rarity: LootRarity;
  sticker: StickerName;
};

type Props = {
  kind: Kind;
  filled?: Filled | null;
  onPress?: () => void;
  /** Default 112 (Hero). Peek lookdev uses ~72. */
  tileSize?: number;
  /** Empty-slot plus. Off on Social peek (drip is edited on Hero). */
  add?: boolean;
};

const KIND_LABEL: Record<Kind, string> = {
  outfit: 'Outfit',
  relic: 'Relic',
};

const GHOST: Record<Kind, StickerName> = {
  outfit: 'coat',
  relic: 'nazar',
};

export function EquipSlot({ kind, filled, onPress, tileSize = 112, add = true }: Props) {
  const empty = !filled;
  const title = empty ? KIND_LABEL[kind] : filled.name;
  const caption = empty ? 'Empty slot' : `${KIND_LABEL[kind]} · ${bibleRarityName(filled.rarity)}`;
  const radius = tileSize >= 100 ? 18 : 16;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${caption}`}
      style={styles.wrap}
    >
      {filled ? (
        <ItemTile rarity={filled.rarity} sticker={filled.sticker} size={tileSize} radius={radius} />
      ) : (
        <Slot size={tileSize} radius={16} ghost={GHOST[kind]} add={add} />
      )}
      <Text style={styles.name} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.caption}>{caption}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontFamily: tokens.font900,
    fontSize: 15,
    lineHeight: 18,
    color: tokens.ink,
    textAlign: 'center',
  },
  caption: {
    marginTop: -4,
    fontFamily: tokens.font800,
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: tokens.ink2,
    textAlign: 'center',
  },
});

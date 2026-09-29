import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ItemTile } from '@/ui/ItemTile';
import { Sticker } from '@/ui/Sticker';
import type { StickerName } from '@/ui/stickerRegistry';
import { shadow, tokens } from '@/ui/tokens';
import type { LootRarity } from '@/types/dungeonLoot';

export function formatShopGold(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

type PriceProps = {
  gold?: number;
  soldOut?: boolean;
  short?: boolean;
  compact?: boolean;
};

export function Price({ gold, soldOut = false, short = false, compact = false }: PriceProps) {
  if (soldOut) {
    return (
      <View style={[styles.price, compact && styles.priceCompact, styles.priceSold]}>
        <Text style={[styles.priceSoldText, compact && styles.priceValueCompact]}>Sold out</Text>
      </View>
    );
  }
  return (
    <View style={[styles.price, compact && styles.priceCompact]}>
      <Sticker name="coin" size={compact ? 16 : 20} bare />
      <Text style={[styles.priceValue, compact && styles.priceValueCompact, short && styles.priceShort]}>
        {formatShopGold(gold ?? 0)}
      </Text>
    </View>
  );
}

type ShopTileProps = {
  name: string;
  sticker: StickerName;
  rarity?: LootRarity;
  gold?: number;
  soldOut?: boolean;
  featured?: boolean;
  short?: boolean;
  qty?: string;
  itemSize?: number;
  compact?: boolean;
  onPress?: () => void;
  testID?: string;
};

export function ShopTile({
  name,
  sticker,
  rarity = 'common',
  gold,
  soldOut = false,
  featured = false,
  short = false,
  qty,
  itemSize,
  compact = false,
  onPress,
  testID,
}: ShopTileProps) {
  const art = itemSize ?? (compact ? 50 : 88);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={soldOut ? `${name}, sold out` : `${name}, ${gold} gold`}
      testID={testID}
      onPress={onPress}
      style={[styles.tile, compact && styles.tileCompact, featured && styles.featured]}
    >
      {featured ? (
        <View style={styles.cornerWrap}>
          <View style={styles.corner}>
            <Text style={styles.cornerText}>This week</Text>
          </View>
        </View>
      ) : null}
      <View style={soldOut ? styles.soldArt : undefined}>
        <ItemTile rarity={rarity} sticker={sticker} qty={qty} size={art} radius={compact ? 12 : 14} />
      </View>
      <Text style={[styles.name, compact && styles.nameCompact]} numberOfLines={1}>
        {name}
      </Text>
      <Price gold={gold} soldOut={soldOut} short={short} compact={compact} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '100%',
    alignItems: 'center',
    gap: 7,
    paddingTop: 8,
    paddingHorizontal: 8,
    paddingBottom: 10,
    borderRadius: tokens.rMd,
    backgroundColor: tokens.surface,
    boxShadow: [shadow.cardLip, shadow.dropSm],
  },
  tileCompact: {
    gap: 5,
    paddingTop: 6,
    paddingHorizontal: 6,
    paddingBottom: 7,
    borderRadius: 16,
  },
  featured: {
    boxShadow: [
      { offsetX: 0, offsetY: 0, blurRadius: 0, color: tokens.gold, spreadDistance: 3 },
      { offsetX: 0, offsetY: 4, blurRadius: 0, color: tokens.goldDeep, spreadDistance: 3 },
      shadow.dropSm,
    ],
  },
  cornerWrap: {
    position: 'absolute',
    top: -9,
    left: 0,
    right: 0,
    zIndex: 2,
    alignItems: 'center',
  },
  corner: {
    height: 20,
    paddingHorizontal: 9,
    borderRadius: tokens.rPill,
    backgroundColor: tokens.gold,
    overflow: 'hidden',
    boxShadow: [{ offsetX: 0, offsetY: 2, blurRadius: 0, color: tokens.goldDeep }],
    justifyContent: 'center',
  },
  cornerText: {
    fontFamily: tokens.font900,
    fontSize: 10,
    lineHeight: 20,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: tokens.onCanvas,
  },
  soldArt: {
    opacity: 0.45,
    filter: [{ grayscale: 1 }],
  },
  name: {
    fontFamily: tokens.font800,
    fontSize: 13,
    lineHeight: 15,
    height: 15,
    color: tokens.ink,
    textAlign: 'center',
    width: '100%',
  },
  nameCompact: {
    fontSize: 12,
    lineHeight: 14,
    height: 14,
  },
  price: {
    height: 28,
    paddingLeft: 5,
    paddingRight: 11,
    borderRadius: tokens.rPill,
    backgroundColor: tokens.goldSoft,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  priceCompact: {
    height: 24,
    paddingLeft: 4,
    paddingRight: 8,
    gap: 3,
  },
  priceValue: {
    fontFamily: tokens.font900,
    fontSize: 15,
    color: tokens.ink,
  },
  priceValueCompact: {
    fontSize: 13,
  },
  priceShort: {
    color: tokens.danger,
  },
  priceSold: {
    backgroundColor: tokens.surface2,
  },
  priceSoldText: {
    fontFamily: tokens.font900,
    fontSize: 15,
    color: tokens.ink3,
  },
});

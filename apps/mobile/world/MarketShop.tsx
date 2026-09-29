import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHeroStore } from '@/hero/store';
import { notificationAsync, NotificationFeedbackType, impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { resolveLootItemById } from '@/lib/itemCatalog';
import { stallSellGold } from '@/lib/stallSell';
import { BottomSheet } from '@/ui/BottomSheet';
import { ButtonPrimary } from '@/ui/Button';
import { Chip } from '@/ui/Chip';
import { CurrencyPill } from '@/ui/CurrencyPill';
import { IconButton } from '@/ui/IconButton';
import { ItemTile, stickerForLootIcon } from '@/ui/ItemTile';
import { ScrimTop, Seam } from '@/ui/Seam';
import { SegmentedControl } from '@/ui/SegmentedControl';
import { ShopTile, Price, formatShopGold } from '@/ui/ShopTile';
import { SpeechBubble } from '@/ui/SpeechBubble';
import { tokens } from '@/ui/tokens';
import type { LootItemEntry } from '@/types/dungeonLoot';

import {
  STALL_BUY_SCROLL_FIXTURES,
  STALL_BUY_STOCK,
  STALL_LINE,
  STALL_RESTOCK_LABEL,
  STALL_RESTOCK_VALUE,
  type ShopSku,
} from './shopStock';

const VIGNETTE = require('../lookdev/assets/vignette-stall.jpg');
const TABS = ['Buy', 'Sell loot'] as const;
/** Source pixels of vignette-stall.jpg — RN-web has no Image.resolveAssetSource. */
const STALL_ART = { width: 780, height: 600 };
/** Lookdev `object-position: 18% 40%` — keep the keeper left, stall in frame. */
const STALL_FOCAL = { x: 0.18, y: 0.4 };
/** Sheet head + two compact rows; extra SKUs scroll underneath. */
const SHEET_BUDGET = 248;
const BUY_STOCK = [...STALL_BUY_STOCK, ...STALL_BUY_SCROLL_FIXTURES];

type SellRow = {
  itemId: string;
  item: LootItemEntry;
  qty: number;
  gold: number;
};

type SheetState =
  | { kind: 'buy'; sku: ShopSku }
  | { kind: 'sell'; row: SellRow }
  | null;

type ArtBox = { width: number; height: number; left: number; top: number };

/**
 * Cover the stage like lookdev (`object-position: 18% 40%`).
 * Never size against the full browser window — World stage is max 430.
 */
function stallArtFrame(boxW: number, boxH: number): ArtBox {
  if (boxW <= 0 || boxH <= 0) return { width: 0, height: 0, left: 0, top: 0 };
  const imgW = STALL_ART.width;
  const imgH = STALL_ART.height;
  const scale = Math.max(boxW / imgW, boxH / imgH);
  const width = imgW * scale;
  const height = imgH * scale;
  return {
    width,
    height,
    left: STALL_FOCAL.x * (boxW - width),
    top: STALL_FOCAL.y * (boxH - height),
  };
}

export default function MarketShop({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const [shopH, setShopH] = useState(0);
  const [vignetteBox, setVignetteBox] = useState({ width: 0, height: 0 });
  const gold = useHeroStore((s) => s.gold);
  const dungeonKeys = useHeroStore((s) => s.dungeonKeys ?? 0);
  const ownedItemIds = useHeroStore((s) => s.ownedItemIds);
  const buyDungeonKey = useHeroStore((s) => s.buyDungeonKey);
  const sellOwnedItemForGold = useHeroStore((s) => s.sellOwnedItemForGold);
  const grantInventoryItem = useHeroStore((s) => s.grantInventoryItem);
  const spendGold = useHeroStore((s) => s.spendGold);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Buy');
  const [sheet, setSheet] = useState<SheetState>(null);

  const inner = Math.min(windowWidth, 430) - tokens.screenX * 2;
  const tileW = Math.floor((inner - 16) / 3);
  const itemSize = Math.min(52, Math.max(44, tileW - 28));
  const stageW = Math.min(windowWidth, 430);
  const vH = shopH > 0 ? Math.max(400, shopH - SHEET_BUDGET) : 440;
  const art = stallArtFrame(vignetteBox.width || stageW, vignetteBox.height || vH);

  const sellRows = useMemo(() => {
    const counts = new Map<string, number>();
    for (const id of ownedItemIds) counts.set(id, (counts.get(id) ?? 0) + 1);
    const rows: SellRow[] = [];
    for (const [itemId, qty] of counts) {
      const item = resolveLootItemById(itemId);
      if (!item) continue;
      const price = stallSellGold(item.rarity);
      if (price == null) continue;
      rows.push({ itemId, item, qty, gold: price });
    }
    return rows;
  }, [ownedItemIds]);

  const onBuySku = (sku: ShopSku) => {
    if (sku.soldOut || !sku.grant) return;
    if (gold < sku.gold) {
      notificationAsync(NotificationFeedbackType.Warning);
      return;
    }
    impactAsync(ImpactFeedbackStyle.Medium);
    if (sku.grant.kind === 'key') {
      const ok = buyDungeonKey();
      if (ok) notificationAsync(NotificationFeedbackType.Success);
      else notificationAsync(NotificationFeedbackType.Warning);
      setSheet(null);
      return;
    }
    const ok = spendGold(sku.gold);
    if (!ok) {
      notificationAsync(NotificationFeedbackType.Warning);
      return;
    }
    grantInventoryItem(sku.grant.itemId);
    notificationAsync(NotificationFeedbackType.Success);
    setSheet(null);
  };

  const onSellRow = (row: SellRow) => {
    impactAsync(ImpactFeedbackStyle.Medium);
    const ok = sellOwnedItemForGold(row.itemId, row.gold);
    if (ok) notificationAsync(NotificationFeedbackType.Success);
    setSheet(null);
  };

  const buySku = sheet?.kind === 'buy' ? sheet.sku : null;
  const sellRow = sheet?.kind === 'sell' ? sheet.row : null;
  const canBuy = buySku && !buySku.soldOut && buySku.grant && gold >= buySku.gold;

  const onShopLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.height;
    setShopH((prev) => (prev === next ? prev : next));
  };

  const onVignetteLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setVignetteBox((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  };

  const renderTile = (sku: ShopSku) => (
    <View key={sku.id} style={[styles.cell, { width: tileW }]}>
      <ShopTile
        compact
        name={sku.name}
        sticker={sku.sticker}
        rarity={sku.rarity}
        gold={sku.gold}
        soldOut={sku.soldOut}
        featured={sku.featured}
        short={!sku.soldOut && gold < sku.gold}
        itemSize={itemSize}
        testID={`shop-tile-${sku.id}`}
        onPress={() => {
          impactAsync(ImpactFeedbackStyle.Light);
          setSheet({ kind: 'buy', sku });
        }}
      />
    </View>
  );

  return (
    <View style={styles.root} testID="market-shop" onLayout={onShopLayout}>
      <View style={[styles.vignette, { height: vH }]} onLayout={onVignetteLayout}>
        {art.width > 0 ? (
          <View
            pointerEvents="none"
            style={[
              styles.vignetteImage,
              { width: art.width, height: art.height, left: art.left, top: art.top },
            ]}
          >
            <Image
              source={VIGNETTE}
              accessibilityIgnoresInvertColors
              resizeMode="stretch"
              style={styles.vignetteBitmap}
            />
          </View>
        ) : null}
        <ScrimTop height={120} />
        <Seam height={130} />
        <View style={[styles.topRow, { top: insets.top + 8 }]}>
          <IconButton glyph="back" accessibilityLabel="Back" onPress={onBack} testID="shop-back" />
          <View style={styles.spacer} />
          <CurrencyPill
            sticker="coin"
            value={gold}
            text={formatShopGold(gold)}
            testID="shop-gold"
            accessibilityLabel={`${gold} gold`}
          />
          <CurrencyPill
            sticker="key"
            value={dungeonKeys}
            testID="shop-keys"
            accessibilityLabel={`${dungeonKeys} keys`}
          />
        </View>
        <View style={styles.say}>
          <SpeechBubble caption="Stall keeper">{STALL_LINE}</SpeechBubble>
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.sheetHead}>
          <View style={styles.seg}>
            <SegmentedControl options={TABS} value={tab} onChange={(next) => setTab(next as (typeof TABS)[number])} onCanvas />
          </View>
          <View style={styles.spacer} />
          <Chip glyph="refresh" label={STALL_RESTOCK_LABEL} value={STALL_RESTOCK_VALUE} />
        </View>

        {tab === 'Buy' ? (
          <ScrollView
            style={styles.catalog}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {BUY_STOCK.map(renderTile)}
          </ScrollView>
        ) : sellRows.length === 0 ? (
          <View style={styles.empty} testID="shop-sell-empty">
            <Text style={styles.emptyTitle}>No loot to sell</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.catalog}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {sellRows.map((row) => (
              <View key={row.itemId} style={[styles.cell, { width: tileW }]}>
                <ShopTile
                  compact
                  name={row.item.name}
                  sticker={stickerForLootIcon(row.item.icon)}
                  rarity={row.item.rarity}
                  gold={row.gold}
                  qty={row.qty > 1 ? `×${row.qty}` : undefined}
                  itemSize={itemSize}
                  testID={`shop-sell-${row.itemId}`}
                  onPress={() => {
                    impactAsync(ImpactFeedbackStyle.Light);
                    setSheet({ kind: 'sell', row });
                  }}
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <BottomSheet visible={sheet != null} onClose={() => setSheet(null)}>
        {buySku ? (
          <View style={styles.detail}>
            <View style={styles.sheetArt}>
              <ItemTile rarity={buySku.rarity} sticker={buySku.sticker} size={84} />
            </View>
            <Text style={styles.sheetTitle}>{buySku.name}</Text>
            {buySku.soldOut ? <Text style={styles.sheetSub}>Sold out</Text> : null}
            {buySku.grant?.kind === 'key' ? (
              <Text style={styles.sheetSub}>100 gold = 1 key. One extra fight when a dungeon’s free entry is cooling down.</Text>
            ) : null}
            <View style={styles.priceRow}>
              <Price gold={buySku.gold} soldOut={buySku.soldOut} short={!buySku.soldOut && gold < buySku.gold} />
            </View>
            {!buySku.soldOut ? (
              <ButtonPrimary
                label="Buy"
                onPress={() => onBuySku(buySku)}
                disabled={!canBuy}
                testID="shop-buy"
                block
              />
            ) : null}
          </View>
        ) : null}
        {sellRow ? (
          <View style={styles.detail}>
            <View style={styles.sheetArt}>
              <ItemTile rarity={sellRow.item.rarity} sticker={stickerForLootIcon(sellRow.item.icon)} size={84} />
            </View>
            <Text style={styles.sheetTitle}>{sellRow.item.name}</Text>
            <View style={styles.priceRow}>
              <Price gold={sellRow.gold} />
            </View>
            <ButtonPrimary label="Sell" onPress={() => onSellRow(sellRow)} testID="shop-sell" block />
          </View>
        ) : null}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.canvas,
  },
  vignette: {
    overflow: 'hidden',
    backgroundColor: tokens.canvas,
    zIndex: 1,
  },
  vignetteImage: {
    position: 'absolute',
    zIndex: 1,
    overflow: 'hidden',
  },
  vignetteBitmap: {
    width: '100%',
    height: '100%',
  },
  topRow: {
    position: 'absolute',
    left: tokens.screenX,
    right: tokens.screenX,
    zIndex: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spacer: {
    flex: 1,
  },
  say: {
    position: 'absolute',
    left: '46%',
    right: tokens.screenX,
    top: '28%',
    zIndex: 20,
    maxWidth: 210,
  },
  sheet: {
    flex: 1,
    marginTop: -36,
    paddingHorizontal: tokens.screenX,
    zIndex: 20,
    minHeight: 0,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  seg: {
    width: 176,
  },
  catalog: {
    flex: 1,
    minHeight: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 10,
    paddingBottom: 16,
  },
  cell: {},
  empty: {
    paddingVertical: 28,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontFamily: tokens.font900,
    fontSize: 20,
    color: tokens.onCanvas,
  },
  detail: {
    paddingBottom: 8,
  },
  sheetArt: {
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontFamily: tokens.font900,
    fontSize: 22,
    color: tokens.ink,
    textAlign: 'center',
    marginBottom: 6,
  },
  sheetSub: {
    fontFamily: tokens.font800,
    fontSize: 14,
    color: tokens.ink2,
    textAlign: 'center',
    marginBottom: 14,
  },
  priceRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
});

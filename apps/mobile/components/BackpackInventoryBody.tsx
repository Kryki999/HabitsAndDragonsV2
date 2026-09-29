import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import LootDetailModal, { type LootModalPayload } from '@/components/LootDetailModal';
import { impactAsync, ImpactFeedbackStyle, notificationAsync, NotificationFeedbackType } from '@/lib/hapticsGate';
import { resolveLootItemById } from '@/lib/itemCatalog';
import { useHeroStore } from '@/hero/store';
import { EquipSlot } from '@/ui/EquipSlot';
import { ItemTile, stickerForLootIcon } from '@/ui/ItemTile';
import { Slot } from '@/ui/Slot';
import { tokens } from '@/ui/tokens';
import type { LootItemEntry, LootRarity } from '@/types/dungeonLoot';
import type { StickerName } from '@/ui/stickerRegistry';

export const BACKPACK_SLOT_COUNT = 16;
export const BACKPACK_COLUMNS = 4;
const SLOT_GAP = 10;

type Props = {
  scrollable?: boolean;
  contentWidth?: number;
  fillAvailableHeight?: boolean;
};

type Cell =
  | { kind: 'empty' }
  | {
      kind: 'item';
      inventoryIndex: number;
      itemId: string;
      entry: LootItemEntry | null;
    };

function tileOf(entry: LootItemEntry | null): { rarity: LootRarity; sticker: StickerName; name: string } {
  if (!entry) return { rarity: 'common', sticker: 'scroll', name: 'Unknown' };
  return {
    rarity: entry.rarity,
    sticker: stickerForLootIcon(entry.icon),
    name: entry.name,
  };
}

export default function BackpackInventoryBody({ contentWidth: contentWidthProp }: Props) {
  const { width } = useWindowDimensions();
  const ownedItemIds = useHeroStore((s) => s.ownedItemIds ?? []);
  const equippedOutfitId = useHeroStore((s) => s.equippedOutfitId);
  const equippedRelicId = useHeroStore((s) => s.equippedRelicId);

  const [detailPayload, setDetailPayload] = useState<LootModalPayload | null>(null);
  const [detailInventoryIndex, setDetailInventoryIndex] = useState<number | null>(null);

  const contentWidth = contentWidthProp ?? Math.min(width - 64, 400);

  const slots = useMemo(() => {
    const shown = ownedItemIds.slice(0, BACKPACK_SLOT_COUNT);
    const cells: Cell[] = [];
    for (let i = 0; i < BACKPACK_SLOT_COUNT; i++) {
      const id = shown[i];
      if (!id) {
        cells.push({ kind: 'empty' });
        continue;
      }
      cells.push({ kind: 'item', inventoryIndex: i, itemId: id, entry: resolveLootItemById(id) });
    }
    return cells;
  }, [ownedItemIds]);

  const filledCount = slots.filter((s) => s.kind === 'item').length;
  const overflow = ownedItemIds.length > BACKPACK_SLOT_COUNT ? ownedItemIds.length - BACKPACK_SLOT_COUNT : 0;

  const outfitEntry = equippedOutfitId ? resolveLootItemById(equippedOutfitId) : null;
  const relicEntry = equippedRelicId ? resolveLootItemById(equippedRelicId) : null;

  const openItem = useCallback((entry: LootItemEntry, inventoryIndex: number) => {
    impactAsync(ImpactFeedbackStyle.Light);
    setDetailInventoryIndex(inventoryIndex);
    setDetailPayload({ type: 'item', entry });
  }, []);

  const openEquipped = useCallback(
    (slot: 'outfit' | 'relic') => {
      const id = slot === 'outfit' ? equippedOutfitId : equippedRelicId;
      if (!id) {
        notificationAsync(NotificationFeedbackType.Warning);
        return;
      }
      const entry = resolveLootItemById(id);
      if (!entry) return;
      const idx = ownedItemIds.indexOf(id);
      impactAsync(ImpactFeedbackStyle.Light);
      setDetailInventoryIndex(idx >= 0 ? idx : 0);
      setDetailPayload({ type: 'item', entry });
    },
    [equippedOutfitId, equippedRelicId, ownedItemIds],
  );

  const closeDetail = useCallback(() => {
    setDetailPayload(null);
    setDetailInventoryIndex(null);
  }, []);

  const cellPx = useMemo(() => {
    const g = SLOT_GAP * (BACKPACK_COLUMNS - 1);
    return (contentWidth - g) / BACKPACK_COLUMNS;
  }, [contentWidth]);

  return (
    <View>
      <View style={styles.equip}>
        <EquipSlot
          kind="outfit"
          filled={equippedOutfitId ? tileOf(outfitEntry) : null}
          onPress={() => openEquipped('outfit')}
        />
        <EquipSlot
          kind="relic"
          filled={equippedRelicId ? tileOf(relicEntry) : null}
          onPress={() => openEquipped('relic')}
        />
      </View>
      <View style={styles.divider} />
      <View style={styles.invHead}>
        <Text style={styles.caption}>Inventory</Text>
        <Text style={styles.caption}>
          {filledCount} / {BACKPACK_SLOT_COUNT}
        </Text>
      </View>
      <View style={styles.grid}>
        {Array.from({ length: BACKPACK_SLOT_COUNT / BACKPACK_COLUMNS }, (_, row) => (
          <View key={`row-${row}`} style={styles.gridRow}>
            {slots.slice(row * BACKPACK_COLUMNS, (row + 1) * BACKPACK_COLUMNS).map((slot, ci) => {
              const i = row * BACKPACK_COLUMNS + ci;
              if (slot.kind === 'empty') {
                return (
                  <View key={`empty-${i}`} style={styles.cell}>
                    <Slot radius={16} />
                  </View>
                );
              }
              const art = tileOf(slot.entry);
              return (
                <View key={`item-${slot.inventoryIndex}`} style={styles.cell}>
                  <ItemTile
                    rarity={art.rarity}
                    sticker={art.sticker}
                    size={Math.floor(cellPx)}
                    radius={16}
                    onPress={
                      slot.entry
                        ? () => openItem(slot.entry!, slot.inventoryIndex)
                        : undefined
                    }
                    accessibilityLabel={art.name}
                  />
                </View>
              );
            })}
          </View>
        ))}
      </View>
      {overflow > 0 ? (
        <Text style={styles.overflow}>
          +{overflow} more in your stash (first {BACKPACK_SLOT_COUNT} shown)
        </Text>
      ) : null}
      <LootDetailModal
        visible={detailPayload !== null}
        onClose={closeDetail}
        payload={detailPayload}
        itemInventoryIndex={detailInventoryIndex ?? undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  equip: {
    flexDirection: 'row',
    gap: 14,
  },
  divider: {
    height: 2,
    backgroundColor: tokens.surface2,
    borderRadius: 1,
    marginVertical: 16,
  },
  invHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  caption: {
    fontFamily: tokens.font800,
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: tokens.ink3,
  },
  grid: {
    gap: SLOT_GAP,
  },
  gridRow: {
    flexDirection: 'row',
    gap: SLOT_GAP,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overflow: {
    marginTop: 12,
    fontFamily: tokens.font700,
    fontSize: 12,
    color: tokens.ink3,
    textAlign: 'center',
  },
});

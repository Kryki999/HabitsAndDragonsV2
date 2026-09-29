import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ButtonPrimary } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { ItemTile, stickerForLootIcon } from '@/ui/ItemTile';
import type { StickerName } from '@/ui/stickerRegistry';
import { tokens } from '@/ui/tokens';
import { selectionAsync } from '@/lib/hapticsGate';
import type { DungeonLootEntry } from '@/types/dungeonLoot';

type Props = {
  name: string;
  winPct: number;
  onWinPress: () => void;
  entryHint?: string;
  loot: readonly DungeonLootEntry[];
  onInspect: (entry: DungeonLootEntry) => void;
  fightLabel: string;
  fightSticker?: StickerName;
  onFight: () => void;
};

export function EncounterCard({
  name,
  winPct,
  onWinPress,
  entryHint,
  loot,
  onInspect,
  fightLabel,
  fightSticker = 'swords',
  onFight,
}: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.row1}>
        <Text
          style={styles.name}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
        >
          {name}
        </Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Boss</Text>
        </View>
        <Pressable testID="win-chance" accessibilityRole="button" accessibilityLabel={`${winPct}% win`} onPress={onWinPress} style={styles.win}>
          <Text style={styles.winPct}>{winPct}%</Text>
          <Text style={styles.winWord}>win</Text>
        </Pressable>
      </View>
      {entryHint ? (
        <Text style={styles.hint} numberOfLines={1}>
          {entryHint}
        </Text>
      ) : null}
      <View style={styles.row2}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.loot}>
          {loot.map((entry) => (
            <ItemTile
              key={entry.id}
              rarity={entry.rarity}
              sticker={stickerFor(entry)}
              qty={qtyFor(entry)}
              accessibilityLabel={entry.name}
              testID={`loot-tray-${entry.id}`}
              onPress={() => {
                selectionAsync();
                onInspect(entry);
              }}
            />
          ))}
        </ScrollView>
        <ButtonPrimary
          label={fightLabel}
          sticker={fightSticker}
          onPress={onFight}
          testID="fight-button"
          style={styles.fight}
        />
      </View>
    </Card>
  );
}

function stickerFor(entry: DungeonLootEntry): StickerName | undefined {
  if (entry.kind === 'gold') return 'coin';
  if (entry.kind === 'item') return stickerForLootIcon(entry.icon);
  return undefined;
}

function qtyFor(entry: DungeonLootEntry): string | undefined {
  if (entry.kind !== 'gold') return undefined;
  if (entry.goldMin === entry.goldMax) return `×${entry.goldMin}`;
  return `${entry.goldMin}–${entry.goldMax}`;
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: tokens.screenX,
    right: tokens.screenX,
    bottom: 12,
    zIndex: 30,
    paddingTop: 12,
    paddingRight: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    boxShadow: [
      { offsetX: 0, offsetY: 4, blurRadius: 0, color: tokens.lipSurface },
      { offsetX: 0, offsetY: 8, blurRadius: 18, color: 'rgba(12, 10, 30, 0.45)' },
    ],
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 30,
  },
  name: {
    flexShrink: 1,
    minWidth: 0,
    fontFamily: tokens.font900,
    fontSize: 20,
    lineHeight: 24,
    color: tokens.ink,
  },
  tag: {
    flexShrink: 0,
    height: 22,
    paddingHorizontal: 9,
    borderRadius: tokens.rPill,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontFamily: tokens.font900,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: tokens.danger,
  },
  win: {
    flexShrink: 0,
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    height: 30,
    paddingHorizontal: 12,
    borderRadius: tokens.rPill,
    backgroundColor: tokens.surface2,
  },
  winPct: {
    fontFamily: tokens.font900,
    fontSize: 17,
    lineHeight: 30,
    color: tokens.successDeep,
  },
  winWord: {
    fontFamily: tokens.font800,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: tokens.successDeep,
  },
  hint: {
    marginTop: 4,
    fontFamily: tokens.font800,
    fontSize: 12,
    color: tokens.ink2,
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  loot: {
    flexDirection: 'row',
    gap: 6,
    paddingRight: 4,
  },
  fight: {
    flex: 1,
    height: 52,
    paddingHorizontal: 12,
  },
});

import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ban } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { LOOT_ITEM_SLOT_BORDER_WIDTH, LOOT_RARITY_COLOR } from '@/constants/lootRarity';
import { LootGlyph } from '@/lib/lootGlyph';
import { selectionAsync } from '@/lib/hapticsGate';
import type { DungeonLootEntry } from '@/types/dungeonLoot';

const ICON_SIZE = 32;
const ROW_HEIGHT = 48;

type Props = {
  table: readonly DungeonLootEntry[];
  onInspect: (entry: DungeonLootEntry) => void;
};

export default function FightLootTray({ table, onInspect }: Props) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['rgba(42,36,56,0.42)', 'rgba(26,21,36,0.36)', 'rgba(16,12,22,0.34)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          {table.map((entry) => (
            <Pressable
              key={entry.id}
              testID={`loot-tray-${entry.id}`}
              onPress={() => {
                selectionAsync();
                onInspect(entry);
              }}
              style={styles.press}
            >
              <TraySlot entry={entry} />
            </Pressable>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

function TraySlot({ entry }: { entry: DungeonLootEntry }) {
  const rc = LOOT_RARITY_COLOR[entry.rarity];
  const size = ICON_SIZE + 8;

  return (
    <View
      style={[
        styles.outer,
        {
          width: size,
          height: size,
          borderRadius: size * 0.2,
          borderColor: rc + 'ee',
          borderWidth: LOOT_ITEM_SLOT_BORDER_WIDTH,
        },
      ]}
    >
      <LinearGradient
        colors={[rc + '35', Colors.dark.background + 'f0']}
        style={[styles.inner, { borderRadius: size * 0.16 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {entry.kind === 'empty' ? (
          <Ban size={Math.round(size * 0.42)} color={Colors.dark.textMuted} strokeWidth={2.2} />
        ) : (
          <LootGlyph
            icon={entry.kind === 'gold' ? 'coins' : entry.icon}
            size={Math.round(size * 0.42)}
            color={entry.kind === 'gold' ? Colors.dark.gold : rc}
          />
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'hidden',
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: Colors.dark.gold + '36',
  },
  gradient: {
    height: ROW_HEIGHT,
    justifyContent: 'center',
  },
  scroll: {
    height: ROW_HEIGHT,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    minHeight: ROW_HEIGHT,
    flexGrow: 1,
  },
  press: {
    marginRight: 8,
  },
  outer: {
    overflow: 'hidden',
    backgroundColor: Colors.dark.background,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
});

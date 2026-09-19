import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bug, Lock, Minus, Plus, Unlock } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

import { MAP_PIN_LOCATIONS } from './catalog';
import { registerDevOpener } from './devUi';
import { useWorldStore } from './store';
import type { WorldLocationId } from './types';
import { isLocationUnlocked } from './unlock';

/** __DEV__ only. FAB + long-press the HUD title. */
export default function DevPanel() {
  const [open, setOpen] = useState(false);
  const playerLevel = useWorldStore((s) => s.playerLevel);
  const unlockedLocationIds = useWorldStore((s) => s.unlockedLocationIds);
  const setPlayerLevel = useWorldStore((s) => s.setPlayerLevel);
  const unlockLocation = useWorldStore((s) => s.unlockLocation);
  const lockLocation = useWorldStore((s) => s.lockLocation);
  const unlockAllLocations = useWorldStore((s) => s.unlockAllLocations);
  const resetFog = useWorldStore((s) => s.resetFog);

  useEffect(() => {
    if (!__DEV__) return;
    registerDevOpener(() => setOpen(true));
    return () => registerDevOpener(null);
  }, []);

  if (!__DEV__) return null;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open world dev tools"
        onPress={() => {
          impactAsync(ImpactFeedbackStyle.Light);
          setOpen(true);
        }}
        style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
      >
        <Bug size={18} color={Colors.dark.gold} strokeWidth={2.4} />
      </Pressable>

      {open ? (
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHead}>
              <Text style={styles.kicker}>DEV</Text>
              <Text style={styles.title}>Fog tools</Text>
              <Pressable
                onPress={() => setOpen(false)}
                hitSlop={8}
                style={({ pressed }) => [styles.close, pressed && styles.pressed]}
              >
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </View>

            <Text style={styles.hint}>World level gates map pins. Manual unlocks ignore the level.</Text>

            <View style={styles.levelRow}>
              <Pressable
                accessibilityLabel="Lower world level"
                onPress={() => setPlayerLevel(playerLevel - 1)}
                style={({ pressed }) => [styles.step, pressed && styles.pressed]}
              >
                <Minus size={18} color={Colors.dark.gold} strokeWidth={2.4} />
              </Pressable>
              <Text style={styles.levelValue}>Lv {playerLevel}</Text>
              <Pressable
                accessibilityLabel="Raise world level"
                onPress={() => setPlayerLevel(playerLevel + 1)}
                style={({ pressed }) => [styles.step, pressed && styles.pressed]}
              >
                <Plus size={18} color={Colors.dark.gold} strokeWidth={2.4} />
              </Pressable>
            </View>

            <View style={styles.actions}>
              <Pressable
                onPress={() => {
                  impactAsync(ImpactFeedbackStyle.Medium);
                  unlockAllLocations();
                }}
                style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
              >
                <Unlock size={14} color={Colors.dark.gold} strokeWidth={2.4} />
                <Text style={styles.pillText}>Unlock all</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  impactAsync(ImpactFeedbackStyle.Medium);
                  resetFog();
                  setOpen(false);
                }}
                style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
              >
                <Lock size={14} color={Colors.dark.gold} strokeWidth={2.4} />
                <Text style={styles.pillText}>Reset fog</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.list} contentContainerStyle={styles.listInner}>
              {MAP_PIN_LOCATIONS.map((loc) => {
                const openPin = isLocationUnlocked(loc.id, playerLevel, unlockedLocationIds);
                const forced = unlockedLocationIds.includes(loc.id);
                return (
                  <Pressable
                    key={loc.id}
                    onPress={() => {
                      if (loc.id === 'crownhaven') return;
                      impactAsync(ImpactFeedbackStyle.Light);
                      if (!openPin) unlockLocation(loc.id as WorldLocationId);
                      else if (forced) lockLocation(loc.id as WorldLocationId);
                    }}
                    style={styles.row}
                  >
                    <View style={styles.rowText}>
                      <Text style={styles.rowName}>{loc.name}</Text>
                      <Text style={styles.rowMeta}>
                        L{loc.unlockLevel}
                        {forced ? ' · forced' : ''}
                        {openPin ? ' · open' : ' · fog'}
                      </Text>
                    </View>
                    <Text style={[styles.rowState, openPin ? styles.open : styles.fogged]}>
                      {openPin ? 'Open' : 'Fog'}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    left: 10,
    bottom: 12,
    zIndex: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.dark.gold + '88',
    backgroundColor: 'rgba(13, 10, 20, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 30,
    backgroundColor: 'rgba(7, 5, 16, 0.72)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '78%',
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    backgroundColor: 'rgba(18, 12, 28, 0.97)',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  kicker: {
    color: Colors.dark.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  title: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '800',
  },
  close: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  closeText: {
    color: Colors.dark.gold,
    fontSize: 13,
    fontWeight: '800',
  },
  hint: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 12,
  },
  step: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.dark.gold + '66',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelValue: {
    minWidth: 72,
    textAlign: 'center',
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: '900',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.gold + '55',
  },
  pillText: {
    color: Colors.dark.gold,
    fontSize: 12,
    fontWeight: '800',
  },
  list: {
    maxHeight: 280,
  },
  listInner: {
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.dark.border,
  },
  rowText: {
    flex: 1,
  },
  rowName: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '800',
  },
  rowMeta: {
    marginTop: 2,
    color: Colors.dark.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  rowState: {
    fontSize: 12,
    fontWeight: '800',
  },
  open: {
    color: Colors.dark.emerald,
  },
  fogged: {
    color: Colors.dark.textMuted,
  },
  pressed: {
    opacity: 0.82,
  },
});

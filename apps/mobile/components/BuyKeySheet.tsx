import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Coins, KeyRound, X } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useHeroStore } from '@/hero/store';
import { KEY_PRICE_GOLD } from '@/lib/economy';
import { impactAsync, notificationAsync, ImpactFeedbackStyle, NotificationFeedbackType } from '@/lib/hapticsGate';

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Extra line when opened from a dungeon that needs a key. */
  dungeonHint?: string | null;
};

export default function BuyKeySheet({ visible, onClose, dungeonHint }: Props) {
  const insets = useSafeAreaInsets();
  const gold = useHeroStore((s) => s.gold);
  const dungeonKeys = useHeroStore((s) => s.dungeonKeys ?? 0);
  const buyDungeonKey = useHeroStore((s) => s.buyDungeonKey);
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(slide, { toValue: 0, friction: 9, tension: 65, useNativeDriver: true }),
      ]).start();
    } else {
      fade.setValue(0);
      slide.setValue(24);
    }
  }, [fade, slide, visible]);

  const canBuy = gold >= KEY_PRICE_GOLD;

  const onBuy = () => {
    impactAsync(ImpactFeedbackStyle.Medium);
    const ok = buyDungeonKey();
    if (ok) {
      notificationAsync(NotificationFeedbackType.Success);
      onClose();
      return;
    }
    notificationAsync(NotificationFeedbackType.Warning);
  };

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <Animated.View style={[styles.backdrop, { opacity: fade }]} />
        </Pressable>
        <Animated.View
          style={[
            styles.sheetWrap,
            { paddingBottom: Math.max(insets.bottom, 16) + 12, opacity: fade, transform: [{ translateY: slide }] },
          ]}
        >
          <LinearGradient colors={['#1e1830', '#120e1c']} style={styles.sheet} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Dungeon keys</Text>
              <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn} accessibilityLabel="Close">
                <X size={22} color={Colors.dark.textMuted} />
              </Pressable>
            </View>

            {dungeonHint ? <Text style={styles.hint}>{dungeonHint}</Text> : null}

            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <KeyRound size={20} color={Colors.dark.cyan} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{dungeonKeys} keys</Text>
                <Text style={styles.rowSub}>1 key = 1 fight when free entry is on cooldown</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <Coins size={20} color={Colors.dark.gold} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{gold} gold</Text>
                <Text style={styles.rowSub}>
                  {KEY_PRICE_GOLD} gold = 1 key · two habits cover it
                </Text>
              </View>
            </View>

            <Pressable
              testID="buy-key-button"
              onPress={onBuy}
              disabled={!canBuy}
              accessibilityLabel={`Buy 1 key for ${KEY_PRICE_GOLD} gold`}
              style={[styles.doneOuter, !canBuy && styles.doneDisabled]}
            >
              <LinearGradient colors={[...Colors.gradients.gold]} style={styles.doneBtn}>
                <Text style={styles.doneText}>
                  {canBuy ? `Buy 1 key · ${KEY_PRICE_GOLD}g` : `Need ${KEY_PRICE_GOLD} gold`}
                </Text>
              </LinearGradient>
            </Pressable>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  sheetWrap: {
    paddingHorizontal: 16,
  },
  sheet: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.dark.text,
  },
  closeBtn: {
    padding: 4,
  },
  hint: {
    color: Colors.dark.gold,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border + '55',
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  rowSub: {
    fontSize: 12,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  doneOuter: {
    marginTop: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },
  doneDisabled: {
    opacity: 0.55,
  },
  doneBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1228',
  },
});

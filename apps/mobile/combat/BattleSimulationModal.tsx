import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HelpCircle, ShieldOff, Sparkles, Sword } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

import { BATTLE_CLASH_MS } from './engine';
import type { FightResolution } from './types';

type Phase = 'idle' | 'tension' | 'result';

type Props = {
  visible: boolean;
  dungeonName: string;
  bossName: string;
  resolution: FightResolution | null;
  onOpenChest: () => void;
  onRematch: () => void;
};

export default function BattleSimulationModal({
  visible,
  dungeonName,
  bossName,
  resolution,
  onOpenChest,
  onRematch,
}: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const swordL = useRef(new Animated.Value(0)).current;
  const swordR = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const goldBurst = useRef(new Animated.Value(0)).current;
  const hapticRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopHeartbeat = useCallback(() => {
    if (hapticRef.current) {
      clearInterval(hapticRef.current);
      hapticRef.current = null;
    }
  }, []);

  const resetAnimations = useCallback(() => {
    swordL.setValue(0);
    swordR.setValue(0);
    pulse.setValue(1);
    goldBurst.setValue(0);
  }, [goldBurst, pulse, swordL, swordR]);

  useEffect(() => {
    if (!visible || !resolution) {
      setPhase('idle');
      stopHeartbeat();
      resetAnimations();
      return;
    }

    setPhase('tension');
    resetAnimations();

    const clash = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(swordL, {
            toValue: 1,
            duration: 420,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(swordL, {
            toValue: 0,
            duration: 420,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(swordR, {
            toValue: 1,
            duration: 420,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(swordR, {
            toValue: 0,
            duration: 420,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    clash.start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.12,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoop.start();

    let tick = 0;
    hapticRef.current = setInterval(() => {
      tick += 1;
      const style =
        tick % 3 === 0
          ? ImpactFeedbackStyle.Medium
          : tick % 3 === 1
            ? ImpactFeedbackStyle.Light
            : ImpactFeedbackStyle.Heavy;
      impactAsync(style);
    }, 320);

    const hold = setTimeout(() => {
      stopHeartbeat();
      clash.stop();
      pulseLoop.stop();
      setPhase('result');
      if (resolution.won) {
        impactAsync(ImpactFeedbackStyle.Heavy);
        goldBurst.setValue(0);
        Animated.spring(goldBurst, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }).start();
      } else {
        impactAsync(ImpactFeedbackStyle.Medium);
      }
    }, BATTLE_CLASH_MS);

    return () => {
      clearTimeout(hold);
      stopHeartbeat();
      clash.stop();
      pulseLoop.stop();
    };
  }, [visible, resolution, goldBurst, pulse, resetAnimations, stopHeartbeat, swordL, swordR]);

  const rotL = swordL.interpolate({
    inputRange: [0, 1],
    outputRange: ['-28deg', '12deg'],
  });
  const rotR = swordR.interpolate({
    inputRange: [0, 1],
    outputRange: ['28deg', '-12deg'],
  });
  const translateXL = swordL.interpolate({
    inputRange: [0, 1],
    outputRange: [-18, 8],
  });
  const translateXR = swordR.interpolate({
    inputRange: [0, 1],
    outputRange: [18, -8],
  });

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.root}>
        <View style={[StyleSheet.absoluteFill, styles.webBackdrop]} />

        <View style={styles.sheet} pointerEvents="box-none">
          {phase === 'tension' && (
            <LinearGradient colors={['#1a1028ee', '#0a0612f2']} style={styles.card}>
              <Text style={styles.versusLabel}>{dungeonName}</Text>
              <Text style={styles.bossHuge}>{bossName}</Text>
              <Text style={styles.tensionHint}>Clash in progress…</Text>
              <View style={styles.clashRow}>
                <Animated.View style={{ transform: [{ translateX: translateXL }, { rotate: rotL }] }}>
                  <Sword size={56} color="#c9b8e8" strokeWidth={2.2} />
                </Animated.View>
                <Animated.View style={{ transform: [{ scale: pulse }] }}>
                  <HelpCircle size={44} color={Colors.dark.gold} />
                </Animated.View>
                <Animated.View style={{ transform: [{ translateX: translateXR }, { rotate: rotR }] }}>
                  <View style={{ transform: [{ scaleX: -1 }] }}>
                    <Sword size={56} color="#9aa0ff" strokeWidth={2.2} />
                  </View>
                </Animated.View>
              </View>
            </LinearGradient>
          )}

          {phase === 'result' && resolution?.won && (
            <Animated.View
              style={{
                transform: [
                  {
                    scale: goldBurst.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.92, 1],
                    }),
                  },
                ],
                opacity: goldBurst.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1],
                }),
              }}
            >
              <LinearGradient colors={['#3d2e10f2', '#1a1228fa', '#0d0814ff']} style={[styles.card, styles.winCard]}>
                <LinearGradient
                  colors={[Colors.dark.gold + '55', 'transparent']}
                  style={styles.winGlow}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                />
                <Sparkles size={28} color={Colors.dark.gold} />
                <Text style={styles.winTitle}>Victory</Text>
                <Text style={styles.winSub}>{dungeonName}</Text>
                <Pressable
                  testID="open-chest"
                  onPress={() => {
                    impactAsync(ImpactFeedbackStyle.Medium);
                    onOpenChest();
                  }}
                  style={styles.collectBtn}
                >
                  <LinearGradient
                    colors={[...Colors.gradients.gold]}
                    style={styles.collectGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.collectText}>Open Chest</Text>
                  </LinearGradient>
                </Pressable>
              </LinearGradient>
            </Animated.View>
          )}

          {phase === 'result' && resolution && !resolution.won && (
            <LinearGradient colors={['#2a2428f5', '#141016ff']} style={styles.card}>
              <ShieldOff size={58} color="#6a5a62" />
              <Text style={styles.failTitle}>Defeat</Text>
              <Text style={styles.failBoss}>{bossName}</Text>
              <Text style={styles.sageQuote}>Too strong this round. Take the coins and try again.</Text>
              <Text style={styles.consolationGold}>
                +{resolution.consolationGold} <Text style={styles.coinEmoji}>🪙</Text>
              </Text>
              <Pressable
                testID="fight-again"
                onPress={() => {
                  impactAsync(ImpactFeedbackStyle.Medium);
                  onRematch();
                }}
                style={styles.retreatBtn}
              >
                <Text style={styles.retreatBtnText}>Fight again</Text>
              </Pressable>
            </LinearGradient>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webBackdrop: {
    backgroundColor: 'rgba(6,4,10,0.92)',
  },
  sheet: {
    width: '100%',
    maxWidth: 360,
  },
  card: {
    borderRadius: 22,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.borderGlow + '44',
    overflow: 'hidden',
  },
  winCard: {
    position: 'relative',
  },
  winGlow: {
    ...StyleSheet.absoluteFill,
    opacity: 0.9,
  },
  versusLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: Colors.dark.textMuted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  bossHuge: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  tensionHint: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginBottom: 22,
  },
  clashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  failTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#a898a0',
    marginTop: 12,
    marginBottom: 8,
  },
  failBoss: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 14,
    textAlign: 'center',
  },
  sageQuote: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 14,
  },
  consolationGold: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.dark.gold,
    marginBottom: 20,
  },
  coinEmoji: {
    fontSize: 18,
  },
  retreatBtn: {
    alignSelf: 'stretch',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#2a2428',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  retreatBtnText: {
    textAlign: 'center',
    fontWeight: '800',
    color: Colors.dark.text,
    fontSize: 16,
  },
  winTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.dark.gold,
    marginTop: 8,
    marginBottom: 4,
  },
  winSub: {
    fontSize: 13,
    color: Colors.dark.textMuted,
    marginBottom: 18,
  },
  collectBtn: {
    alignSelf: 'stretch',
    borderRadius: 14,
    overflow: 'hidden',
  },
  collectGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  collectText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1a1228',
  },
});

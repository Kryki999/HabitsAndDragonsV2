import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { ButtonFlow, ButtonPrimary } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Sticker } from '@/ui/Sticker';
import { tokens } from '@/ui/tokens';

import { FightKicker, FightNote, FightSparks, FightTitle, FightWash } from './FightChrome';
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
  const insets = useSafeAreaInsets();
  const clashBottom = 66 + Math.max(insets.bottom, 30) + 16;
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

  const won = phase === 'result' && resolution?.won === true;
  const lost = phase === 'result' && resolution != null && !resolution.won;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.root} pointerEvents="box-none">
        {phase === 'tension' ? (
          <>
            <LinearGradient
              pointerEvents="none"
              colors={['rgba(145,162,242,0)', 'rgba(145,162,242,0.55)', tokens.canvas]}
              locations={[0.38, 0.62, 0.82]}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.clash, { bottom: clashBottom }]}>
              <FightKicker>{dungeonName}</FightKicker>
              <FightTitle>Clash</FightTitle>
              <View style={styles.swords}>
                <Animated.View style={{ transform: [{ rotate: '-26deg' }, { translateY: 6 }, { translateX: translateXL }, { rotate: rotL }] }}>
                  <Sticker name="dagger" size={92} />
                </Animated.View>
                <Animated.View style={{ transform: [{ scale: pulse }] }}>
                  <View style={styles.spark} />
                </Animated.View>
                <Animated.View
                  style={{
                    transform: [{ scaleX: -1 }, { rotate: '-26deg' }, { translateY: 6 }, { translateX: translateXR }, { rotate: rotR }],
                  }}
                >
                  <Sticker name="dagger" size={92} />
                </Animated.View>
              </View>
              <FightNote>{bossName}</FightNote>
            </View>
          </>
        ) : null}

        {won ? (
          <Animated.View
            style={[
              styles.fill,
              {
                opacity: goldBurst.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }),
                transform: [{ scale: goldBurst.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }],
              },
            ]}
          >
            <FightWash gold />
            <FightSparks />
            <View style={styles.hero}>
              <View style={styles.chest}>
                <Sticker name="gift" size={96} bare />
              </View>
            </View>
            <View style={styles.copy}>
              <FightTitle>Victory</FightTitle>
              <FightNote>{`${bossName} goes down`}</FightNote>
            </View>
            <View style={styles.foot}>
              <ButtonFlow
                label="Open chest"
                sticker="gift"
                block
                testID="open-chest"
                onPress={() => {
                  impactAsync(ImpactFeedbackStyle.Medium);
                  onOpenChest();
                }}
              />
            </View>
          </Animated.View>
        ) : null}

        {lost && resolution && !resolution.won ? (
          <View style={styles.fill}>
            <FightWash />
            <View style={styles.markWrap}>
              <View style={styles.mark}>
                <View style={styles.markSticker}>
                  <Sticker name="dagger" size={78} bare />
                </View>
              </View>
            </View>
            <View style={styles.copy}>
              <FightKicker>{dungeonName}</FightKicker>
              <FightTitle>Defeat</FightTitle>
              <FightNote>{`${bossName} is still standing`}</FightNote>
            </View>
            <Card style={styles.pay}>
              <Text style={styles.payCopy}>Too strong this round. Take the coins and try again.</Text>
              <View style={styles.payRow}>
                <Sticker name="coin" size={28} bare />
                <Text style={styles.payGold}>+{resolution.consolationGold}</Text>
              </View>
            </Card>
            <View style={styles.foot}>
              <ButtonPrimary
                label="Fight again"
                sticker="swords"
                block
                testID="fight-again"
                onPress={() => {
                  impactAsync(ImpactFeedbackStyle.Medium);
                  onRematch();
                }}
              />
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
  clash: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 6,
  },
  swords: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 120,
    marginVertical: 4,
  },
  spark: {
    width: 22,
    height: 22,
    marginHorizontal: -8,
    borderRadius: 4,
    backgroundColor: tokens.onCanvas,
    transform: [{ rotate: '45deg' }],
  },
  hero: {
    alignItems: 'center',
    marginTop: 148,
  },
  chest: {
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: tokens.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: tokens.gold,
    boxShadow: [
      { offsetX: 0, offsetY: 7, blurRadius: 0, color: tokens.goldDeep },
      { offsetX: 0, offsetY: 20, blurRadius: 50, color: 'rgba(40,50,140,0.35)' },
    ],
  },
  markWrap: {
    alignItems: 'center',
    marginTop: 128,
  },
  mark: {
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: tokens.surface,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: [
      { offsetX: 0, offsetY: 4, blurRadius: 0, color: tokens.lipSurface },
      { offsetX: 0, offsetY: 10, blurRadius: 28, color: 'rgba(40, 50, 140, 0.18)' },
    ],
  },
  markSticker: {
    opacity: 0.72,
  },
  copy: {
    alignItems: 'center',
    gap: 8,
    marginTop: 28,
    paddingHorizontal: 24,
  },
  pay: {
    marginTop: 22,
    marginHorizontal: 24,
    paddingHorizontal: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  payCopy: {
    fontFamily: tokens.font800,
    fontSize: 16,
    lineHeight: 22,
    color: tokens.ink2,
    textAlign: 'center',
  },
  payGold: {
    fontFamily: tokens.font900,
    fontSize: 22,
    color: tokens.ink,
  },
  payRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingLeft: 8,
    paddingRight: 16,
    borderRadius: tokens.rPill,
    backgroundColor: tokens.goldSoft,
  },
  foot: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 40,
  },
});

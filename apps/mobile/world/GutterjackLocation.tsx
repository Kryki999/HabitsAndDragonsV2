import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle, notificationAsync, NotificationFeedbackType } from '@/lib/hapticsGate';

import OverlayHud from './OverlayHud';
import StillFrame from './StillFrame';
import { GUTTERJACK_COPY, GUTTERJACK_INTRINSIC, WORLD_ART } from './layout';
import { useWorldStore } from './store';

type Phase = 'brief' | 'fight' | 'victory';

export default function GutterjackLocation() {
  const insets = useSafeAreaInsets();
  const openHub = useWorldStore((s) => s.openHub);
  const markGutterjackCleared = useWorldStore((s) => s.markGutterjackCleared);
  const alreadyCleared = useWorldStore((s) => s.gutterjackCleared);
  const [phase, setPhase] = useState<Phase>(alreadyCleared ? 'victory' : 'brief');

  const onEnter = () => {
    impactAsync(ImpactFeedbackStyle.Medium);
    setPhase('fight');
  };

  const onVictory = () => {
    notificationAsync(NotificationFeedbackType.Success);
    markGutterjackCleared();
    setPhase('victory');
  };

  const panel =
    phase === 'brief'
      ? {
          kicker: alreadyCleared ? GUTTERJACK_COPY.clearedKicker : GUTTERJACK_COPY.kicker,
          title: GUTTERJACK_COPY.title,
          body: GUTTERJACK_COPY.blurb,
          primary: GUTTERJACK_COPY.enter,
          onPrimary: onEnter,
        }
      : phase === 'fight'
        ? {
            kicker: GUTTERJACK_COPY.fightKicker,
            title: GUTTERJACK_COPY.title,
            body: GUTTERJACK_COPY.fightBlurb,
            primary: GUTTERJACK_COPY.victory,
            onPrimary: onVictory,
          }
        : {
            kicker: GUTTERJACK_COPY.clearedKicker,
            title: GUTTERJACK_COPY.title,
            body: GUTTERJACK_COPY.clearedBlurb,
            primary: GUTTERJACK_COPY.backToHub,
            onPrimary: openHub,
          };

  return (
    <View style={styles.root}>
      <StillFrame
        source={WORLD_ART.gutterjack}
        intrinsicWidth={GUTTERJACK_INTRINSIC.width}
        intrinsicHeight={GUTTERJACK_INTRINSIC.height}
      />

      <OverlayHud
        insets={insets}
        kicker="Dungeon"
        title="Gutterjack"
        left={{ label: GUTTERJACK_COPY.back, onPress: openHub }}
      />

      <View pointerEvents="box-none" style={[styles.sheetWrap, { paddingBottom: 12 + insets.bottom }]}>
        <LinearGradient colors={['transparent', 'rgba(7,5,16,0.72)', 'rgba(7,5,16,0.94)']} style={styles.fade} />
        <View style={styles.sheet}>
          <Text style={styles.kicker}>{panel.kicker}</Text>
          <Text style={styles.title}>{panel.title}</Text>
          <Text style={styles.body}>{panel.body}</Text>
          <View style={styles.actions}>
            {phase !== 'victory' ? (
              <Pressable
                onPress={() => {
                  impactAsync(ImpactFeedbackStyle.Light);
                  openHub();
                }}
                style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
              >
                <Text style={styles.secondaryText}>{GUTTERJACK_COPY.back}</Text>
              </Pressable>
            ) : null}
            <Pressable
              onPress={panel.onPrimary}
              style={({ pressed }) => [
                styles.primary,
                phase === 'fight' && styles.primaryFight,
                phase === 'victory' && styles.primaryWon,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryText}>{panel.primary}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070510',
  },
  sheetWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  fade: {
    height: 48,
  },
  sheet: {
    marginHorizontal: 14,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border + 'cc',
    backgroundColor: 'rgba(18, 12, 28, 0.94)',
  },
  kicker: {
    color: Colors.dark.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: '800',
  },
  body: {
    marginTop: 8,
    color: Colors.dark.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
  },
  secondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
  },
  secondaryText: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    fontWeight: '800',
  },
  primary: {
    flex: 1.4,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.dark.gold,
    alignItems: 'center',
  },
  primaryFight: {
    backgroundColor: Colors.dark.emerald,
  },
  primaryWon: {
    backgroundColor: Colors.dark.gold,
  },
  primaryText: {
    color: '#1a1220',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  pressed: {
    opacity: 0.86,
  },
});

import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle, notificationAsync, NotificationFeedbackType } from '@/lib/hapticsGate';

import { LocationNav } from './IconRail';
import OverlayHud from './OverlayHud';
import StillFrame from './StillFrame';
import WorldHotspot from './WorldHotspot';
import { getLocation } from './content';
import { useWorldStore } from './store';

const COPY = {
  kicker: 'Common · Tutorial',
  blurb:
    'The sot who took the wine vault. Once a family restaurant. Now he sits a barrel-throne with a smashed-bottle tulip and will not give the cellar back.',
  enter: 'Enter',
  fightKicker: 'Tutorial fight · 100% win',
  fightBlurb: 'No combat engine yet. Tap victory — Gutterjack always falls the first time.',
  victory: 'Victory (tutorial)',
  clearedKicker: 'Cleared',
  clearedBlurb: 'The cellar is yours. The tavern can breathe again — for now. Common farm comes later.',
} as const;

type Phase = 'brief' | 'fight' | 'victory';

export default function GutterjackLocation() {
  const insets = useSafeAreaInsets();
  const openLocation = useWorldStore((s) => s.openLocation);
  const markGutterjackCleared = useWorldStore((s) => s.markGutterjackCleared);
  const alreadyCleared = useWorldStore((s) => s.flags.gutterjackCleared);
  const loc = getLocation('gutterjack');
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
          kicker: alreadyCleared ? COPY.clearedKicker : COPY.kicker,
          body: COPY.blurb,
          primary: COPY.enter,
          onPrimary: onEnter,
        }
      : phase === 'fight'
        ? {
            kicker: COPY.fightKicker,
            body: COPY.fightBlurb,
            primary: COPY.victory,
            onPrimary: onVictory,
          }
        : {
            kicker: COPY.clearedKicker,
            body: COPY.clearedBlurb,
            primary: null,
            onPrimary: undefined,
          };

  return (
    <View style={styles.root}>
      <StillFrame
        source={loc.asset}
        intrinsicWidth={loc.intrinsic.width}
        intrinsicHeight={loc.intrinsic.height}
      >
        {(box) => (
          <>
            {(loc.hotspots ?? []).map((spot) =>
              spot.targetId ? (
                <WorldHotspot
                  key={spot.id}
                  x={spot.x}
                  y={spot.y}
                  width={box.width}
                  height={box.height}
                  icon={spot.icon}
                  accessibilityLabel={spot.label}
                  accent="emerald"
                  onPress={() => openLocation(spot.targetId!)}
                />
              ) : null,
            )}
          </>
        )}
      </StillFrame>

      <OverlayHud insets={insets} kicker={loc.kicker} title={loc.displayName} />
      <LocationNav locationId="gutterjack" />

      <View pointerEvents="box-none" style={[styles.sheetWrap, { paddingBottom: 12 + insets.bottom }]}>
        <LinearGradient colors={['transparent', 'rgba(7,5,16,0.72)', 'rgba(7,5,16,0.94)']} style={styles.fade} />
        <View style={styles.sheet}>
          <Text style={styles.kicker}>{panel.kicker}</Text>
          <Text style={styles.title}>{loc.displayName}</Text>
          <Text style={styles.body}>{panel.body}</Text>
          {panel.primary && panel.onPrimary ? (
            <Pressable
              onPress={panel.onPrimary}
              style={({ pressed }) => [
                styles.primary,
                phase === 'fight' && styles.primaryFight,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryText}>{panel.primary}</Text>
            </Pressable>
          ) : null}
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
  primary: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.dark.gold,
    alignItems: 'center',
  },
  primaryFight: {
    backgroundColor: Colors.dark.emerald,
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

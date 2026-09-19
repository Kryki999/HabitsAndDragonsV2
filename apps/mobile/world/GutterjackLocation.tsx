import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Castle, Map as MapIcon, Swords } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle, notificationAsync, NotificationFeedbackType } from '@/lib/hapticsGate';

import OverlayHud from './OverlayHud';
import StillFrame from './StillFrame';
import WindowDock from './WindowDock';
import { LOCATION_BY_ID } from './catalog';
import { GUTTERJACK_COPY } from './layout';
import { useWorldStore } from './store';

type Phase = 'brief' | 'fight' | 'victory';

export default function GutterjackLocation() {
  const insets = useSafeAreaInsets();
  const openHub = useWorldStore((s) => s.openHub);
  const openMap = useWorldStore((s) => s.openMap);
  const markGutterjackCleared = useWorldStore((s) => s.markGutterjackCleared);
  const alreadyCleared = useWorldStore((s) => s.gutterjackCleared);
  const [phase, setPhase] = useState<Phase>(alreadyCleared ? 'victory' : 'brief');

  const loc = LOCATION_BY_ID.gutterjack;
  const window = loc.windows[0]!;

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
            onPrimary: () => openHub('tavern'),
          };

  return (
    <View style={styles.root}>
      <StillFrame
        source={window.source}
        intrinsicWidth={window.intrinsicWidth}
        intrinsicHeight={window.intrinsicHeight}
      />

      <OverlayHud
        insets={insets}
        kicker="Dungeon"
        title="Gutterjack"
        left={{ icon: Castle, accessibilityLabel: 'Crownhaven', onPress: () => openHub() }}
        right={{ icon: MapIcon, accessibilityLabel: 'Kingdom map', onPress: openMap }}
      />

      <WindowDock
        windows={loc.windows}
        currentWindowId="fight"
        onSelectWindow={() => undefined}
        onMap={openMap}
        extra={[
          {
            id: 'hub',
            label: 'Square',
            icon: Castle,
            onPress: () => openHub(),
          },
        ]}
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
                style={({ pressed }) => [styles.iconAction, pressed && styles.pressed]}
                accessibilityLabel="Back to Crownhaven"
              >
                <Castle size={18} color={Colors.dark.textSecondary} strokeWidth={2.4} />
              </Pressable>
            ) : null}
            <Pressable
              onPress={panel.onPrimary}
              accessibilityLabel={panel.primary}
              style={({ pressed }) => [
                styles.primary,
                phase === 'fight' && styles.primaryFight,
                phase === 'victory' && styles.primaryWon,
                pressed && styles.pressed,
              ]}
            >
              {phase === 'fight' ? (
                <Swords size={18} color="#1a1220" strokeWidth={2.4} />
              ) : phase === 'victory' ? (
                <Castle size={18} color="#1a1220" strokeWidth={2.4} />
              ) : (
                <Swords size={18} color="#1a1220" strokeWidth={2.4} />
              )}
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
    right: 64,
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
  iconAction: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.dark.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryFight: {
    backgroundColor: Colors.dark.emerald,
  },
  primaryWon: {
    backgroundColor: Colors.dark.gold,
  },
  pressed: {
    opacity: 0.86,
  },
});

import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowDown } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

import FloorLift from './FloorLift';
import OverlayHud from './OverlayHud';
import StillFrame from './StillFrame';
import { TAVERN_INTERIOR } from './interiors';
import { useTavernLift } from './useTavernLift';
import { useWorldStore } from './store';

export default function TavernGround() {
  const insets = useSafeAreaInsets();
  const openHub = useWorldStore((s) => s.openHub);
  const { floorId, onPickFloor, whisper } = useTavernLift();

  const floor = TAVERN_INTERIOR.floors.find((entry) => entry.id === floorId);
  const still = floor?.still ?? TAVERN_INTERIOR.floors.find((entry) => entry.id === 'ground')?.still;

  const stairTo = floor?.stairTo;
  const onStairs = useCallback(() => {
    if (!stairTo) return;
    const target = TAVERN_INTERIOR.floors.find((entry) => entry.id === stairTo.to);
    if (!target) return;
    impactAsync(ImpactFeedbackStyle.Medium);
    onPickFloor(target);
  }, [onPickFloor, stairTo]);

  if (!still) return null;

  return (
    <View style={styles.root}>
      <StillFrame source={still.source} intrinsicWidth={still.width} intrinsicHeight={still.height}>
        {(box) =>
          stairTo ? (
            <Pressable
              testID="tavern-stairs"
              accessibilityLabel={`Stairs to ${stairTo.to}`}
              onPress={onStairs}
              hitSlop={12}
              style={({ pressed }) => [
                styles.stairHotspot,
                {
                  left: stairTo.x * box.width - 18,
                  top: stairTo.y * box.height - 18,
                },
                pressed && styles.pressed,
              ]}
            >
              <ArrowDown size={16} color={Colors.dark.gold} strokeWidth={2.4} />
            </Pressable>
          ) : null
        }
      </StillFrame>

      <OverlayHud
        insets={insets}
        kicker={TAVERN_INTERIOR.hubKicker}
        title={TAVERN_INTERIOR.name}
        left={{ icon: 'back', onPress: openHub, accessibilityLabel: 'Back' }}
        right={
          <FloorLift floors={TAVERN_INTERIOR.floors} currentId={floorId} onSelect={onPickFloor} />
        }
      />

      {whisper ? (
        <View pointerEvents="none" style={[styles.whisperWrap, { paddingBottom: 16 + insets.bottom }]}>
          <Text style={styles.whisper}>{whisper}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070510',
  },
  stairHotspot: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.dark.gold + 'aa',
    backgroundColor: 'rgba(13, 10, 20, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  pressed: {
    opacity: 0.82,
  },
  whisperWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    alignItems: 'center',
  },
  whisper: {
    color: Colors.dark.gold,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowRadius: 6,
  },
});

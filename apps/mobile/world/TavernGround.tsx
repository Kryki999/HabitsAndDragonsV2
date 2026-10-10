import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { LevelNav, type LevelFloor } from '@/ui/LevelNav';
import { Nameplate } from '@/ui/Nameplate';
import { SceneHead } from '@/ui/SceneHead';
import { ScrimTop, SeamDock } from '@/ui/Seam';
import { tokens } from '@/ui/tokens';

import LivingScene from './living/LivingScene';
import { TAVERN_FEEL } from './living/feel';
import { isFloorOpen, TAVERN_INTERIOR } from './interiors';
import { useTavernLift } from './useTavernLift';
import { useWorldStore } from './store';
import { WorldNotice } from './WorldNotice';

export default function TavernGround() {
  const insets = useSafeAreaInsets();
  const openHub = useWorldStore((s) => s.openHub);
  const { floorId, onPickFloor, whisper } = useTavernLift();

  const floor = TAVERN_INTERIOR.floors.find((entry) => entry.id === floorId);
  const still = floor?.still ?? TAVERN_INTERIOR.floors.find((entry) => entry.id === 'ground')?.still;
  const levels = toLevels(TAVERN_INTERIOR.floors);

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
      <LivingScene
        layers={[{ id: 'mid', source: still.source }]}
        feel={TAVERN_FEEL}
        intrinsicWidth={still.width}
        intrinsicHeight={still.height}
      >
        {(box) => {
          if (!stairTo) return null;
          const target = TAVERN_INTERIOR.floors.find((entry) => entry.id === stairTo.to);
          if (!target) return null;
          return (
            <Nameplate
              testID="tavern-stairs"
              accessibilityLabel={`Stairs to ${stairTo.to}`}
              label={target.label}
              sticker="swords"
              featured={isFloorOpen(target)}
              locked={!isFloorOpen(target)}
              frameWidth={box.width}
              left={stairTo.x * box.width}
              top={stairTo.y * box.height}
              onPress={onStairs}
            />
          );
        }}
      </LivingScene>
      <ScrimTop />
      <SeamDock fade={90} />
      <SceneHead kicker={TAVERN_INTERIOR.name} name={floor?.label ?? TAVERN_INTERIOR.name} onBack={openHub} />
      <View pointerEvents="box-none" style={[styles.nav, { top: insets.top + 8 }]}>
        <LevelNav
          floors={levels}
          currentId={floorId}
          onSelect={(next) => {
            const target = TAVERN_INTERIOR.floors.find((entry) => entry.id === next.id);
            if (target) onPickFloor(target);
          }}
        />
      </View>
      {whisper ? <WorldNotice message={whisper} /> : null}
    </View>
  );
}

function toLevels(floors: typeof TAVERN_INTERIOR.floors): LevelFloor[] {
  return floors.map((floor) => ({
    id: floor.id,
    label: floor.label,
    locked: !isFloorOpen(floor),
  }));
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.canvas,
  },
  nav: {
    position: 'absolute',
    top: 8,
    right: tokens.screenX,
    zIndex: 30,
  },
});

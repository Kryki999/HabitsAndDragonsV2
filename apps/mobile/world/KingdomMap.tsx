import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';

import MapPinMarker from './MapPinMarker';
import OverlayHud from './OverlayHud';
import { KINGDOM_PINS, WORLD_ART } from './layout';
import { useWorldStore } from './store';

/** Cover scale: square of max(viewport) fills the long side. No empty bands. */
const MIN_SCALE = 1;
const MAX_SCALE = 2.8;
/** Closer than cover so Crownhaven fills the phone; pan to the rest. */
const START_SCALE = 1.85;

function clamp(n: number, min: number, max: number): number {
  'worklet';
  return Math.min(max, Math.max(min, n));
}

function clampOffsets(
  nextScale: number,
  nextTx: number,
  nextTy: number,
  mapSize: number,
  viewW: number,
  viewH: number,
): { scale: number; tx: number; ty: number } {
  'worklet';
  const s = clamp(nextScale, MIN_SCALE, MAX_SCALE);
  const scaled = mapSize * s;
  const minX = viewW - scaled;
  const maxX = 0;
  const minY = viewH - scaled;
  const maxY = 0;
  return { scale: s, tx: clamp(nextTx, minX, maxX), ty: clamp(nextTy, minY, maxY) };
}

type Viewport = { width: number; height: number };

export default function KingdomMap() {
  const insets = useSafeAreaInsets();
  const openHub = useWorldStore((s) => s.openHub);

  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });
  const [fogHint, setFogHint] = useState<string | null>(null);

  const mapSize = viewport.width > 0 ? Math.max(viewport.width, viewport.height) : 0;

  const scale = useSharedValue(START_SCALE);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const savedScale = useSharedValue(START_SCALE);
  const savedTx = useSharedValue(0);
  const savedTy = useSharedValue(0);
  const vw = useSharedValue(0);
  const vh = useSharedValue(0);
  const content = useSharedValue(0);

  const focusCrownhaven = useCallback(
    (size: number, view: Viewport) => {
      const home = KINGDOM_PINS.find((p) => p.id === 'crownhaven');
      const next = clampOffsets(
        START_SCALE,
        view.width / 2 - (home?.x ?? 0.52) * size * START_SCALE,
        view.height / 2 - (home?.y ?? 0.35) * size * START_SCALE,
        size,
        view.width,
        view.height,
      );
      vw.value = view.width;
      vh.value = view.height;
      content.value = size;
      scale.value = next.scale;
      tx.value = next.tx;
      ty.value = next.ty;
      savedScale.value = next.scale;
      savedTx.value = next.tx;
      savedTy.value = next.ty;
    },
    [content, savedScale, savedTx, savedTy, scale, tx, ty, vh, vw],
  );

  useEffect(() => {
    if (mapSize <= 0 || viewport.width <= 0) return;
    focusCrownhaven(mapSize, viewport);
  }, [focusCrownhaven, mapSize, viewport]);

  const pan = Gesture.Pan()
    .minDistance(10)
    .onStart(() => {
      savedTx.value = tx.value;
      savedTy.value = ty.value;
    })
    .onUpdate((e) => {
      tx.value = savedTx.value + e.translationX;
      ty.value = savedTy.value + e.translationY;
    })
    .onEnd(() => {
      const next = clampOffsets(scale.value, tx.value, ty.value, content.value, vw.value, vh.value);
      scale.value = next.scale;
      tx.value = next.tx;
      ty.value = next.ty;
      savedScale.value = next.scale;
      savedTx.value = next.tx;
      savedTy.value = next.ty;
    });

  const pinch = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
      savedTx.value = tx.value;
      savedTy.value = ty.value;
    })
    .onUpdate((e) => {
      const nextScale = clamp(savedScale.value * e.scale, MIN_SCALE, MAX_SCALE);
      const contentX = (e.focalX - savedTx.value) / savedScale.value;
      const contentY = (e.focalY - savedTy.value) / savedScale.value;
      scale.value = nextScale;
      tx.value = e.focalX - contentX * nextScale;
      ty.value = e.focalY - contentY * nextScale;
    })
    .onEnd(() => {
      const next = clampOffsets(scale.value, tx.value, ty.value, content.value, vw.value, vh.value);
      scale.value = next.scale;
      tx.value = next.tx;
      ty.value = next.ty;
      savedScale.value = next.scale;
      savedTx.value = next.tx;
      savedTy.value = next.ty;
    });

  const composed = Gesture.Simultaneous(pan, pinch);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setViewport((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  };

  const onPin = (id: string) => {
    const pin = KINGDOM_PINS.find((p) => p.id === id);
    if (!pin) return;
    if (pin.kind === 'locked') {
      setFogHint(`${pin.label} is still in the fog.`);
      return;
    }
    setFogHint(null);
    if (pin.opens === 'hub') openHub();
  };

  return (
    <View style={styles.root}>
      <GestureDetector gesture={composed}>
        <Animated.View style={styles.stage} onLayout={onLayout}>
          {mapSize > 0 ? (
            <Animated.View
              style={[styles.mapLayer, { width: mapSize, height: mapSize }, animatedStyle]}
              pointerEvents="box-none"
            >
              <Image source={WORLD_ART.map} style={{ width: mapSize, height: mapSize }} resizeMode="stretch" />
              {KINGDOM_PINS.map((pin) => (
                <MapPinMarker
                  key={pin.id}
                  label={pin.label}
                  chip={pin.chip}
                  kind={pin.kind}
                  left={pin.x * mapSize}
                  top={pin.y * mapSize}
                  onPress={() => onPin(pin.id)}
                />
              ))}
            </Animated.View>
          ) : null}
        </Animated.View>
      </GestureDetector>

      <OverlayHud insets={insets} kicker="Kingdom" title="Map" />

      {fogHint ? (
        <View pointerEvents="none" style={styles.fogWrap}>
          <Text style={styles.fogHint}>{fogHint}</Text>
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
  stage: {
    flex: 1,
    overflow: 'hidden',
  },
  mapLayer: {
    transformOrigin: 'top left',
  },
  fogWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    alignItems: 'center',
  },
  fogHint: {
    color: Colors.dark.gold,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowRadius: 6,
  },
});

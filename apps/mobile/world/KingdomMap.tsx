import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

import MapPinMarker from './MapPinMarker';
import OverlayHud from './OverlayHud';
import { KINGDOM_PINS, WORLD_ART } from './layout';
import { useWorldStore } from './store';

const MIN_SCALE = 1;
const MAX_SCALE = 3.4;
const START_SCALE = 1.55;
const ZOOM_STEP = 1.22;

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
  const minX = scaled <= viewW ? (viewW - scaled) / 2 : viewW - scaled;
  const maxX = scaled <= viewW ? (viewW - scaled) / 2 : 0;
  const minY = scaled <= viewH ? (viewH - scaled) / 2 : viewH - scaled;
  const maxY = scaled <= viewH ? (viewH - scaled) / 2 : 0;
  return { scale: s, tx: clamp(nextTx, minX, maxX), ty: clamp(nextTy, minY, maxY) };
}

type Viewport = { width: number; height: number };

export default function KingdomMap() {
  const insets = useSafeAreaInsets();
  const openHub = useWorldStore((s) => s.openHub);
  const openLocation = useWorldStore((s) => s.openLocation);
  const gutterjackCleared = useWorldStore((s) => s.gutterjackCleared);

  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });
  const [fogHint, setFogHint] = useState<string | null>(null);
  const [probe, setProbe] = useState<string | null>(null);

  const mapSize = viewport.width > 0 ? Math.min(viewport.width, viewport.height) : 0;

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
    (size: number, view: Viewport, animated: boolean) => {
      const home = KINGDOM_PINS.find((p) => p.id === 'crownhaven');
      const nextScale = START_SCALE;
      const nextTx = view.width / 2 - (home?.x ?? 0.5) * size * nextScale;
      const nextTy = view.height / 2 - (home?.y ?? 0.46) * size * nextScale;
      vw.value = view.width;
      vh.value = view.height;
      content.value = size;
      if (animated) {
        scale.value = withTiming(nextScale, { duration: 280 });
        tx.value = withTiming(nextTx, { duration: 280 });
        ty.value = withTiming(nextTy, { duration: 280 });
      } else {
        scale.value = nextScale;
        tx.value = nextTx;
        ty.value = nextTy;
      }
      savedScale.value = nextScale;
      savedTx.value = nextTx;
      savedTy.value = nextTy;
    },
    [content, savedScale, savedTx, savedTy, scale, tx, ty, vh, vw],
  );

  useEffect(() => {
    if (mapSize <= 0 || viewport.width <= 0) return;
    focusCrownhaven(mapSize, viewport, false);
  }, [focusCrownhaven, mapSize, viewport]);

  const reportProbe = useCallback((label: string) => {
    setProbe(label);
    impactAsync(ImpactFeedbackStyle.Light);
  }, []);

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

  const longPress = Gesture.LongPress()
    .minDuration(420)
    .maxDistance(24)
    .onEnd((e, success) => {
      if (!success || content.value === 0) return;
      const nx = (e.x - tx.value) / (content.value * scale.value);
      const ny = (e.y - ty.value) / (content.value * scale.value);
      runOnJS(reportProbe)(`x: ${nx.toFixed(2)}   y: ${ny.toFixed(2)}`);
    });

  const composed = Gesture.Simultaneous(pan, pinch, longPress);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  const bumpZoom = (dir: 1 | -1) => {
    impactAsync(ImpactFeedbackStyle.Light);
    const factor = dir === 1 ? ZOOM_STEP : 1 / ZOOM_STEP;
    const nextScale = clamp(scale.value * factor, MIN_SCALE, MAX_SCALE);
    const cx = viewport.width / 2;
    const cy = viewport.height / 2;
    const contentX = (cx - tx.value) / scale.value;
    const contentY = (cy - ty.value) / scale.value;
    const nextTx = cx - contentX * nextScale;
    const nextTy = cy - contentY * nextScale;
    const next = clampOffsets(nextScale, nextTx, nextTy, mapSize, viewport.width, viewport.height);
    scale.value = withTiming(next.scale, { duration: 180 });
    tx.value = withTiming(next.tx, { duration: 180 });
    ty.value = withTiming(next.ty, { duration: 180 });
    savedScale.value = next.scale;
    savedTx.value = next.tx;
    savedTy.value = next.ty;
  };

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
    if (pin.opens === 'gutterjack') openLocation('gutterjack');
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
                  cleared={pin.id === 'gutterjack' && gutterjackCleared}
                  onPress={() => onPin(pin.id)}
                />
              ))}
            </Animated.View>
          ) : null}
        </Animated.View>
      </GestureDetector>

      <OverlayHud
        insets={insets}
        kicker="Kingdom"
        title="Map"
        left={{ label: 'Hub', onPress: openHub }}
      />

      <View style={[styles.zoomCol, { top: insets.top + 64 }]} pointerEvents="box-none">
        <Pressable
          onPress={() => bumpZoom(1)}
          style={({ pressed }) => [styles.zoomBtn, pressed && styles.zoomPressed]}
        >
          <Text style={styles.zoomGlyph}>+</Text>
        </Pressable>
        <Pressable
          onPress={() => bumpZoom(-1)}
          style={({ pressed }) => [styles.zoomBtn, pressed && styles.zoomPressed]}
        >
          <Text style={styles.zoomGlyph}>−</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            impactAsync(ImpactFeedbackStyle.Light);
            if (mapSize > 0) focusCrownhaven(mapSize, viewport, true);
          }}
          style={({ pressed }) => [styles.zoomBtn, pressed && styles.zoomPressed]}
        >
          <Text style={styles.zoomHome}>⌂</Text>
        </Pressable>
      </View>

      <View style={[styles.footer, { paddingBottom: 12 + insets.bottom }]} pointerEvents="none">
        <Text style={styles.footerHint}>Pinch or use + / − · long-press for pin coordinates</Text>
        {fogHint ? <Text style={styles.fogHint}>{fogHint}</Text> : null}
        {probe ? <Text style={styles.probe}>{probe}</Text> : null}
      </View>
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
  zoomCol: {
    position: 'absolute',
    right: 12,
    gap: 8,
  },
  zoomBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.gold + '55',
    backgroundColor: 'rgba(13, 10, 20, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomPressed: {
    opacity: 0.8,
  },
  zoomGlyph: {
    color: Colors.dark.gold,
    fontSize: 22,
    fontWeight: '700',
    marginTop: -1,
  },
  zoomHome: {
    color: Colors.dark.gold,
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    position: 'absolute',
    left: 16,
    right: 64,
    bottom: 0,
  },
  footerHint: {
    color: 'rgba(240, 230, 211, 0.62)',
    fontSize: 11,
    fontWeight: '600',
  },
  fogHint: {
    marginTop: 4,
    color: Colors.dark.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  probe: {
    marginTop: 4,
    color: Colors.dark.cyan,
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});

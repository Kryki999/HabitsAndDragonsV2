import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle, notificationAsync, NotificationFeedbackType } from '@/lib/hapticsGate';

import FogOverlay from './FogOverlay';
import MapPinMarker from './MapPinMarker';
import OverlayHud from './OverlayHud';
import { isFogRegionRevealed, KINGDOM_PINS, MAP_INTRINSIC, WORLD_ART, type MapPinKind } from './layout';
import { isMapLocationId } from './locations';
import { useFogReveal } from './useFogReveal';
import { useWorldStore } from './store';

/** Cover scale: board fills viewport; tall art pans mostly up. */
const MIN_SCALE = 1;
const MAX_SCALE = 2.8;
/** Closer than cover so Crownhaven fills the phone; pan up the corridor. */
const START_SCALE = 1.85;

const MAP_ASPECT = MAP_INTRINSIC.width / MAP_INTRINSIC.height;

function clamp(n: number, min: number, max: number): number {
  'worklet';
  return Math.min(max, Math.max(min, n));
}

function clampOffsets(
  nextScale: number,
  nextTx: number,
  nextTy: number,
  mapW: number,
  mapH: number,
  viewW: number,
  viewH: number,
): { scale: number; tx: number; ty: number } {
  'worklet';
  const s = clamp(nextScale, MIN_SCALE, MAX_SCALE);
  if (mapW <= 0 || mapH <= 0 || viewW <= 0 || viewH <= 0) {
    return { scale: s, tx: 0, ty: 0 };
  }
  const scaledW = mapW * s;
  const scaledH = mapH * s;
  const minX = viewW - scaledW;
  const maxX = 0;
  const minY = viewH - scaledH;
  const maxY = 0;
  return { scale: s, tx: clamp(nextTx, minX, maxX), ty: clamp(nextTy, minY, maxY) };
}

/** Cover layout: both axes ≥ viewport at scale 1 (no letterbox). */
function mapContentSize(viewW: number, viewH: number): { mapW: number; mapH: number } {
  if (viewW <= 0 || viewH <= 0) return { mapW: 0, mapH: 0 };
  const mapW = Math.max(viewW, viewH * MAP_ASPECT);
  const mapH = mapW / MAP_ASPECT;
  return { mapW, mapH };
}

type Viewport = { width: number; height: number };

function pinKindFor(id: string, designKind: MapPinKind, discoveredRegionIds: string[]): MapPinKind {
  if (designKind === 'home') return 'home';
  return isFogRegionRevealed(id, discoveredRegionIds) ? 'landmark' : 'locked';
}

export default function KingdomMap() {
  const insets = useSafeAreaInsets();
  const openHub = useWorldStore((s) => s.openHub);
  const openLocation = useWorldStore((s) => s.openLocation);
  const { progress, discoveredRegionIds, discoverRegion, unveilNextRegion } = useFogReveal();

  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });
  const [placeHint, setPlaceHint] = useState<string | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { mapW, mapH } = useMemo(
    () => mapContentSize(viewport.width, viewport.height),
    [viewport.height, viewport.width],
  );

  const scale = useSharedValue(START_SCALE);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const savedScale = useSharedValue(START_SCALE);
  const savedTx = useSharedValue(0);
  const savedTy = useSharedValue(0);
  const vw = useSharedValue(0);
  const vh = useSharedValue(0);
  const contentW = useSharedValue(0);
  const contentH = useSharedValue(0);

  const whisper = useCallback((message: string | null) => {
    if (hintTimer.current) clearTimeout(hintTimer.current);
    setPlaceHint(message);
    if (message) {
      hintTimer.current = setTimeout(() => setPlaceHint(null), 2200);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (hintTimer.current) clearTimeout(hintTimer.current);
    };
  }, []);

  const focusCrownhaven = useCallback(
    (width: number, height: number, view: Viewport) => {
      const home = KINGDOM_PINS.find((p) => p.id === 'crownhaven');
      const next = clampOffsets(
        START_SCALE,
        view.width / 2 - (home?.x ?? 0.5) * width * START_SCALE,
        view.height / 2 - (home?.y ?? 0.86) * height * START_SCALE,
        width,
        height,
        view.width,
        view.height,
      );
      vw.value = view.width;
      vh.value = view.height;
      contentW.value = width;
      contentH.value = height;
      scale.value = next.scale;
      tx.value = next.tx;
      ty.value = next.ty;
      savedScale.value = next.scale;
      savedTx.value = next.tx;
      savedTy.value = next.ty;
    },
    [contentH, contentW, savedScale, savedTx, savedTy, scale, tx, ty, vh, vw],
  );

  useEffect(() => {
    if (mapW <= 0 || mapH <= 0 || viewport.width <= 0) return;
    focusCrownhaven(mapW, mapH, viewport);
  }, [focusCrownhaven, mapH, mapW, viewport]);

  const pan = Gesture.Pan()
    .minDistance(10)
    .onStart(() => {
      savedTx.value = tx.value;
      savedTy.value = ty.value;
    })
    .onUpdate((e) => {
      const next = clampOffsets(
        scale.value,
        savedTx.value + e.translationX,
        savedTy.value + e.translationY,
        contentW.value,
        contentH.value,
        vw.value,
        vh.value,
      );
      tx.value = next.tx;
      ty.value = next.ty;
    })
    .onEnd(() => {
      savedTx.value = tx.value;
      savedTy.value = ty.value;
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
      const next = clampOffsets(
        nextScale,
        e.focalX - contentX * nextScale,
        e.focalY - contentY * nextScale,
        contentW.value,
        contentH.value,
        vw.value,
        vh.value,
      );
      scale.value = next.scale;
      tx.value = next.tx;
      ty.value = next.ty;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      savedTx.value = tx.value;
      savedTy.value = ty.value;
    });

  const composed = Gesture.Simultaneous(pan, pinch);

  const animatedStyle = useAnimatedStyle(() => {
    const next = clampOffsets(
      scale.value,
      tx.value,
      ty.value,
      contentW.value,
      contentH.value,
      vw.value,
      vh.value,
    );
    return {
      transformOrigin: 'top left',
      transform: [{ translateX: next.tx }, { translateY: next.ty }, { scale: next.scale }],
    };
  });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setViewport((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  };

  const unveil = useCallback(
    (id: string) => {
      if (isFogRegionRevealed(id, useWorldStore.getState().discoveredRegionIds)) return;
      discoverRegion(id);
      notificationAsync(NotificationFeedbackType.Success);
      const pin = KINGDOM_PINS.find((entry) => entry.id === id);
      whisper(pin?.label ?? null);
    },
    [discoverRegion, whisper],
  );

  const onPin = (id: string) => {
    const pin = KINGDOM_PINS.find((p) => p.id === id);
    if (!pin) return;
    const kind = pinKindFor(id, pin.kind, discoveredRegionIds);
    if (kind === 'locked') return;
    if (pin.opens === 'hub') {
      whisper(null);
      openHub();
      return;
    }
    if (pin.opens === 'location' && isMapLocationId(pin.id)) {
      whisper(null);
      openLocation(pin.id);
      return;
    }
    whisper(pin.label);
  };

  const onDevUnveilNext = () => {
    const id = unveilNextRegion();
    if (!id) return;
    notificationAsync(NotificationFeedbackType.Success);
    const pin = KINGDOM_PINS.find((entry) => entry.id === id);
    whisper(pin?.label ?? null);
  };

  return (
    <View style={styles.root}>
      <GestureDetector gesture={composed}>
        <Animated.View style={styles.stage} onLayout={onLayout}>
          {mapW > 0 && mapH > 0 ? (
            <Animated.View
              collapsable={false}
              style={[styles.mapLayer, { width: mapW, height: mapH }, animatedStyle]}
              pointerEvents="box-none"
            >
              <Image source={WORLD_ART.map} style={{ width: mapW, height: mapH }} resizeMode="stretch" />
              <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                <FogOverlay
                  mapWidth={mapW}
                  mapHeight={mapH}
                  progress={progress}
                  discoveredRegionIds={discoveredRegionIds}
                />
              </View>
              {KINGDOM_PINS.map((pin) => {
                const kind = pinKindFor(pin.id, pin.kind, discoveredRegionIds);
                if (kind === 'locked') {
                  if (!__DEV__) return null;
                  return (
                    <DevFogMote
                      key={pin.id}
                      accessibilityLabel={pin.label}
                      left={pin.x * mapW}
                      top={pin.y * mapH}
                      onLongPress={() => unveil(pin.id)}
                    />
                  );
                }
                return (
                  <MapPinMarker
                    key={pin.id}
                    accessibilityLabel={pin.label}
                    kind={kind}
                    left={pin.x * mapW}
                    top={pin.y * mapH}
                    onPress={() => onPin(pin.id)}
                  />
                );
              })}
            </Animated.View>
          ) : null}
        </Animated.View>
      </GestureDetector>

      <OverlayHud
        insets={insets}
        kicker="Kingdom"
        title="Map"
        onTitleLongPress={__DEV__ ? onDevUnveilNext : undefined}
      />

      {placeHint ? (
        <View pointerEvents="none" style={styles.fogWrap}>
          <Text style={styles.fogHint}>{placeHint}</Text>
        </View>
      ) : null}
    </View>
  );
}

function DevFogMote({
  accessibilityLabel,
  left,
  top,
  onLongPress,
}: {
  accessibilityLabel: string;
  left: number;
  top: number;
  onLongPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${accessibilityLabel}, hidden in fog`}
      onLongPress={() => {
        impactAsync(ImpactFeedbackStyle.Medium);
        onLongPress();
      }}
      delayLongPress={480}
      hitSlop={14}
      style={[styles.mote, { left: left - 6, top: top - 6 }]}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070510',
    overflow: 'hidden',
  },
  stage: {
    flex: 1,
    overflow: 'hidden',
  },
  mapLayer: {
    transformOrigin: 'top left',
  },
  mote: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(236, 240, 246, 0.32)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    zIndex: 2,
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

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Platform, StyleSheet, View, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { useHeroStore } from '@/hero/store';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { MapPin } from '@/ui/MapPin';
import { PeekCard } from '@/ui/PeekCard';
import { SceneHead } from '@/ui/SceneHead';
import { SeamDock } from '@/ui/Seam';
import { tokens } from '@/ui/tokens';

import { HUB_HOTSPOTS, isMapPinUnlocked, KINGDOM_PINS, MAP_INTRINSIC, WORLD_ART, type MapPinKind } from './layout';
import { MAP_LOCATIONS, isMapLocationId } from './locations';
import { useWorldStore } from './store';

/**
 * Product camera: the board is the screen width. Pan only up the corridor.
 * No pinch, no zoom controls, no horizontal drag.
 */
const MAP_ASPECT = MAP_INTRINSIC.width / MAP_INTRINSIC.height;

function clamp(n: number, min: number, max: number): number {
  'worklet';
  return Math.min(max, Math.max(min, n));
}

function clampOffsets(
  nextTy: number,
  mapW: number,
  mapH: number,
  viewW: number,
  viewH: number,
): { tx: number; ty: number } {
  'worklet';
  if (mapW <= 0 || mapH <= 0 || viewW <= 0 || viewH <= 0) {
    return { tx: 0, ty: 0 };
  }
  if (mapH <= viewH) {
    return { tx: 0, ty: 0 };
  }
  const minY = viewH - mapH;
  return { tx: 0, ty: clamp(nextTy, minY, 0) };
}

/** Fit-width: the board is exactly the viewport wide. Height follows the art. */
function mapContentSize(viewW: number): { mapW: number; mapH: number } {
  if (viewW <= 0) return { mapW: 0, mapH: 0 };
  return { mapW: viewW, mapH: viewW / MAP_ASPECT };
}

type Viewport = { width: number; height: number };

function pinKindFor(designKind: MapPinKind, unlocked: boolean): MapPinKind {
  if (designKind === 'home') return 'home';
  return unlocked ? 'landmark' : 'locked';
}

export default function KingdomMap() {
  const openHub = useWorldStore((s) => s.openHub);
  const openLocation = useWorldStore((s) => s.openLocation);
  const heroLevel = useHeroStore((s) => s.playerLevel);

  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });
  const [selectedId, setSelectedId] = useState('crownhaven');
  const [cameraReady, setCameraReady] = useState(false);
  const focusedSize = useRef({ w: 0, h: 0 });

  const { mapW, mapH } = useMemo(() => mapContentSize(viewport.width), [viewport.width]);

  const ty = useSharedValue(0);
  const savedTy = useSharedValue(0);
  const vw = useSharedValue(0);
  const vh = useSharedValue(0);
  const contentW = useSharedValue(0);
  const contentH = useSharedValue(0);

  const focusCrownhaven = useCallback(
    (width: number, height: number, view: Viewport) => {
      const home = KINGDOM_PINS.find((p) => p.id === 'crownhaven');
      const next = clampOffsets(
        view.height / 2 - (home?.y ?? 0.91) * height,
        width,
        height,
        view.width,
        view.height,
      );
      vw.value = view.width;
      vh.value = view.height;
      contentW.value = width;
      contentH.value = height;
      ty.value = next.ty;
      savedTy.value = next.ty;
    },
    [contentH, contentW, savedTy, ty, vh, vw],
  );

  useEffect(() => {
    if (mapW <= 0 || mapH <= 0 || viewport.width <= 0 || viewport.height <= 0) return;
    const sizeChanged = focusedSize.current.w !== mapW || focusedSize.current.h !== mapH;
    vw.value = viewport.width;
    vh.value = viewport.height;
    contentW.value = mapW;
    contentH.value = mapH;
    if (sizeChanged) {
      focusCrownhaven(mapW, mapH, viewport);
      focusedSize.current = { w: mapW, h: mapH };
    } else {
      const next = clampOffsets(ty.value, mapW, mapH, viewport.width, viewport.height);
      ty.value = next.ty;
    }
    setCameraReady(true);
  }, [contentH, contentW, focusCrownhaven, mapH, mapW, ty, viewport, vh, vw]);

  const pan = Gesture.Pan()
    .minDistance(10)
    .onStart(() => {
      savedTy.value = ty.value;
    })
    .onUpdate((e) => {
      const next = clampOffsets(
        savedTy.value + e.translationY,
        contentW.value,
        contentH.value,
        vw.value,
        vh.value,
      );
      ty.value = next.ty;
    })
    .onEnd(() => {
      savedTy.value = ty.value;
    });

  const animatedStyle = useAnimatedStyle(() => {
    const next = clampOffsets(
      ty.value,
      contentW.value,
      contentH.value,
      vw.value,
      vh.value,
    );
    return {
      transformOrigin: 'top left',
      transform: [{ translateX: 0 }, { translateY: next.ty }],
    };
  });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setViewport((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  };

  const onPin = (id: string) => {
    const pin = KINGDOM_PINS.find((p) => p.id === id);
    if (!pin) return;
    impactAsync(ImpactFeedbackStyle.Medium);
    setSelectedId(id);
  };

  const onEnter = () => {
    const pin = KINGDOM_PINS.find((p) => p.id === selectedId);
    if (!pin) return;
    if (pin.opens === 'hub') {
      impactAsync(ImpactFeedbackStyle.Medium);
      openHub();
      return;
    }
    if (!isMapPinUnlocked(pin, heroLevel)) return;
    impactAsync(ImpactFeedbackStyle.Medium);
    if (pin.opens === 'location' && isMapLocationId(pin.id)) {
      openLocation(pin.id);
    }
  };

  const peek = peekFor(selectedId, heroLevel);

  return (
    <View style={styles.root}>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.stage, Platform.OS === 'web' ? webPanLock : null]}
          onLayout={onLayout}
        >
          {cameraReady && mapW > 0 && mapH > 0 ? (
            <Animated.View
              collapsable={false}
              style={[styles.mapLayer, { width: mapW, height: mapH }, animatedStyle]}
              pointerEvents="box-none"
            >
              <View pointerEvents="none" style={{ width: mapW, height: mapH }}>
                <Image source={WORLD_ART.map} style={{ width: mapW, height: mapH }} resizeMode="stretch" />
              </View>
              {KINGDOM_PINS.map((pin) => {
                const unlocked = isMapPinUnlocked(pin, heroLevel);
                const kind = pinKindFor(pin.kind, unlocked);
                const selected = pin.id === selectedId;
                return (
                  <MapPin
                    key={pin.id}
                    accessibilityLabel={
                      kind === 'locked'
                        ? `${pin.label}, locked, from level ${pin.unlockLevel}`
                        : pin.label
                    }
                    kind={selected ? 'current' : kind === 'locked' ? 'locked' : 'landmark'}
                    sticker={pin.sticker}
                    lockLevel={kind === 'locked' && !selected ? pin.unlockLevel : undefined}
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

      <SeamDock fade={90} />
      <SceneHead kicker="Kingdom" name="Map" />
      {peek ? (
        <PeekCard
          still={peek.still}
          kicker={peek.kicker}
          name={peek.name}
          meta={peek.meta}
          onEnter={peek.enter ? onEnter : undefined}
        />
      ) : null}
    </View>
  );
}

function peekFor(id: string, heroLevel: number) {
  const pin = KINGDOM_PINS.find((entry) => entry.id === id) ?? KINGDOM_PINS[0];
  if (!pin) return null;
  if (pin.opens === 'hub') {
    return {
      still: WORLD_ART.hub,
      kicker: 'You are here',
      name: pin.label,
      meta: `Capital · ${HUB_HOTSPOTS.length} places`,
      enter: true,
    };
  }
  const location = isMapLocationId(pin.id) ? MAP_LOCATIONS[pin.id] : undefined;
  const locked = !isMapPinUnlocked(pin, heroLevel);
  const count = location?.hotspots.length ?? 0;
  return {
    still: location?.still,
    kicker: locked ? 'Locked' : (location?.kicker ?? 'Kingdom'),
    name: pin.label,
    meta: locked ? `from level ${pin.unlockLevel}` : count === 1 ? '1 place' : `${count} places`,
    enter: !locked && pin.opens === 'location',
  };
}

/** Stops the browser from turning a pan into a page scroll or image drag. */
const webPanLock = { touchAction: 'none' } as ViewStyle;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.canvas,
    overflow: 'hidden',
  },
  stage: {
    flex: 1,
    overflow: 'hidden',
    userSelect: 'none',
  },
  mapLayer: {
    transformOrigin: 'top left',
  },
});

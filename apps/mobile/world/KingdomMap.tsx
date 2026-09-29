import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Platform, StyleSheet, View, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { impactAsync, notificationAsync, ImpactFeedbackStyle, NotificationFeedbackType } from '@/lib/hapticsGate';
import { MapPin } from '@/ui/MapPin';
import { PeekCard } from '@/ui/PeekCard';
import { SceneHead } from '@/ui/SceneHead';
import { SeamDock } from '@/ui/Seam';
import { tokens } from '@/ui/tokens';

import FogOverlay from './FogOverlay';
import { HUB_HOTSPOTS, isFogRegionRevealed, KINGDOM_PINS, MAP_INTRINSIC, WORLD_ART, type MapPinKind } from './layout';
import { MAP_LOCATIONS, isMapLocationId } from './locations';
import { useFogReveal } from './useFogReveal';
import { useWorldStore } from './store';
import { WorldNotice } from './WorldNotice';

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

function pinKindFor(id: string, designKind: MapPinKind, discoveredRegionIds: string[]): MapPinKind {
  if (designKind === 'home') return 'home';
  return isFogRegionRevealed(id, discoveredRegionIds) ? 'landmark' : 'locked';
}

export default function KingdomMap() {
  const openHub = useWorldStore((s) => s.openHub);
  const openLocation = useWorldStore((s) => s.openLocation);
  const { progress, discoveredRegionIds, discoverRegion, unveilNextRegion } = useFogReveal();

  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });
  const [selectedId, setSelectedId] = useState('crownhaven');
  const [cameraReady, setCameraReady] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleTaps = useRef(0);
  const focusedSize = useRef({ w: 0, h: 0 });

  const { mapW, mapH } = useMemo(() => mapContentSize(viewport.width), [viewport.width]);

  const ty = useSharedValue(0);
  const savedTy = useSharedValue(0);
  const vw = useSharedValue(0);
  const vh = useSharedValue(0);
  const contentW = useSharedValue(0);
  const contentH = useSharedValue(0);

  const whisper = useCallback((message: string | null) => {
    if (hintTimer.current) clearTimeout(hintTimer.current);
    setNotice(message);
    if (message) {
      hintTimer.current = setTimeout(() => setNotice(null), 2200);
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
    impactAsync(ImpactFeedbackStyle.Medium);
    setSelectedId(id);
  };

  const onEnter = () => {
    const pin = KINGDOM_PINS.find((p) => p.id === selectedId);
    if (!pin) return;
    const kind = pinKindFor(pin.id, pin.kind, discoveredRegionIds);
    if (kind === 'locked') return;
    impactAsync(ImpactFeedbackStyle.Medium);
    if (pin.opens === 'hub') {
      openHub();
      return;
    }
    if (pin.opens === 'location' && isMapLocationId(pin.id)) {
      openLocation(pin.id);
    }
  };

  const onTitlePress = () => {
    if (!__DEV__) return;
    titleTaps.current += 1;
    if (hintTimer.current) clearTimeout(hintTimer.current);
    if (titleTaps.current >= 3) {
      titleTaps.current = 0;
      onDevUnveilNext();
      return;
    }
    hintTimer.current = setTimeout(() => {
      titleTaps.current = 0;
    }, 420);
  };

  const onDevUnveilNext = () => {
    const id = unveilNextRegion();
    if (!id) return;
    notificationAsync(NotificationFeedbackType.Success);
    const pin = KINGDOM_PINS.find((entry) => entry.id === id);
    whisper(pin?.label ?? null);
  };

  const peek = peekFor(selectedId, discoveredRegionIds);

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
                const selected = pin.id === selectedId;
                return (
                  <MapPin
                    key={pin.id}
                    accessibilityLabel={pin.label}
                    kind={selected ? 'current' : kind === 'locked' ? 'locked' : 'landmark'}
                    sticker={pin.sticker}
                    left={pin.x * mapW}
                    top={pin.y * mapH}
                    onPress={() => onPin(pin.id)}
                    onLongPress={__DEV__ && kind === 'locked' ? () => unveil(pin.id) : undefined}
                  />
                );
              })}
            </Animated.View>
          ) : null}
        </Animated.View>
      </GestureDetector>

      <SeamDock fade={90} />
      <SceneHead
        kicker="Kingdom"
        name="Map"
        onTitlePress={__DEV__ ? onTitlePress : undefined}
        onTitleLongPress={__DEV__ ? onDevUnveilNext : undefined}
      />
      {peek ? (
        <PeekCard
          still={peek.still}
          kicker={peek.kicker}
          name={peek.name}
          meta={peek.meta}
          onEnter={peek.enter ? onEnter : undefined}
        />
      ) : null}
      {notice ? <WorldNotice message={notice} /> : null}
    </View>
  );
}

function peekFor(id: string, discoveredRegionIds: string[]) {
  const pin = KINGDOM_PINS.find((entry) => entry.id === id) ?? KINGDOM_PINS[0];
  if (!pin) return null;
  const kind = pinKindFor(pin.id, pin.kind, discoveredRegionIds);
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
  const locked = kind === 'locked';
  const count = location?.hotspots.length ?? 0;
  return {
    still: locked ? undefined : location?.still,
    kicker: locked ? 'Locked' : (location?.kicker ?? 'Kingdom'),
    name: pin.label,
    meta: locked ? 'Locked' : count === 1 ? '1 place' : `${count} places`,
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

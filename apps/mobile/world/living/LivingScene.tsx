import React, { useMemo, useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { fitCover, type CoverAnchor, type FittedBox } from '../StillFrame';
import { TavernEffects } from './effects';
import { TAVERN_FEEL, type LivingFeel, type LivingLayer, type LivingLayerId } from './feel';
import { useAppActive, useLivingClock, usePrefersReducedMotion, useTiltParallax } from './motion';

const LAYER_RANK: Record<LivingLayerId, number> = {
  background: 0,
  mid: 1,
  character: 2,
  foreground: 3,
};

type Props = {
  layers: LivingLayer[];
  feel?: LivingFeel;
  intrinsicWidth: number;
  intrinsicHeight: number;
  anchor?: CoverAnchor;
  children?: (box: FittedBox) => React.ReactNode;
};

/**
 * Cover-fit layered still + code-drawn atmosphere.
 * Bitmaps stay on RN Image (same decode path as StillFrame). Skia paints
 * fire / dust / sparks on top of mid-ground, under a foreground cut-out.
 */
export default function LivingScene({
  layers,
  feel = TAVERN_FEEL,
  intrinsicWidth,
  intrinsicHeight,
  anchor = 'center',
  children,
}: Props) {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const reduceMotion = usePrefersReducedMotion();
  const appActive = useAppActive();
  const running = appActive && !reduceMotion;

  const fitted = useMemo(
    () => fitCover(intrinsicWidth, intrinsicHeight, viewport.width, viewport.height, anchor),
    [anchor, intrinsicHeight, intrinsicWidth, viewport.height, viewport.width],
  );

  const ordered = useMemo(
    () => [...layers].sort((a, b) => LAYER_RANK[a.id] - LAYER_RANK[b.id]),
    [layers],
  );
  const back = ordered.filter((layer) => layer.id !== 'foreground');
  const front = ordered.filter((layer) => layer.id === 'foreground');
  const parallaxActive = ordered.length > 1;
  const clock = useLivingClock(running);
  const { tiltX, tiltY } = useTiltParallax(parallaxActive && running);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setViewport((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  };

  return (
    <View style={styles.root} onLayout={onLayout} testID="living-scene">
      {fitted.width > 0 ? (
        <View
          style={[
            styles.frame,
            {
              width: fitted.width,
              height: fitted.height,
              left: fitted.left,
              top: fitted.top,
            },
          ]}
        >
          {back.map((layer, index) => (
            <SceneBitmap
              key={`${layer.id}-${index}`}
              layer={layer}
              feel={feel}
              clock={clock}
              tiltX={tiltX}
              tiltY={tiltY}
              parallaxActive={parallaxActive}
              reduceMotion={reduceMotion}
            />
          ))}
          <Canvas pointerEvents="none" style={styles.canvas} androidWarmup>
            <TavernEffects
              clock={clock}
              size={{ width: fitted.width, height: fitted.height }}
              feel={feel}
              particles={running}
            />
          </Canvas>
          {front.map((layer, index) => (
            <SceneBitmap
              key={`${layer.id}-${index}`}
              layer={layer}
              feel={feel}
              clock={clock}
              tiltX={tiltX}
              tiltY={tiltY}
              parallaxActive={parallaxActive}
              reduceMotion={reduceMotion}
            />
          ))}
          {children?.(fitted)}
        </View>
      ) : null}
    </View>
  );
}

function SceneBitmap({
  layer,
  feel,
  clock,
  tiltX,
  tiltY,
  parallaxActive,
  reduceMotion,
}: {
  layer: LivingLayer;
  feel: LivingFeel;
  clock: SharedValue<number>;
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
  parallaxActive: boolean;
  reduceMotion: boolean;
}) {
  const live = layer.breathe === true || (parallaxActive && (layer.parallax ?? 0) !== 0);
  if (!live) {
    return <Image source={layer.source} style={styles.image} resizeMode="stretch" />;
  }
  return (
    <LiveBitmap
      layer={layer}
      feel={feel}
      clock={clock}
      tiltX={tiltX}
      tiltY={tiltY}
      parallaxActive={parallaxActive}
      reduceMotion={reduceMotion}
    />
  );
}

function LiveBitmap({
  layer,
  feel,
  clock,
  tiltX,
  tiltY,
  parallaxActive,
  reduceMotion,
}: {
  layer: LivingLayer;
  feel: LivingFeel;
  clock: SharedValue<number>;
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
  parallaxActive: boolean;
  reduceMotion: boolean;
}) {
  const depth = layer.parallax ?? 0;
  const breathe = layer.breathe === true && !reduceMotion;
  const style = useAnimatedStyle(() => {
    const px = parallaxActive ? tiltX.value * feel.parallax.maxPx * depth : 0;
    const py = parallaxActive ? tiltY.value * feel.parallax.maxPx * depth : 0;
    let scaleX = 1;
    let scaleY = 1;
    if (breathe) {
      const wave = 0.5 + 0.5 * Math.sin((clock.value / feel.breathe.periodMs) * Math.PI * 2);
      scaleX = 1 + feel.breathe.scaleX * wave;
      scaleY = 1 + feel.breathe.scaleY * wave;
    }
    return {
      transform: [{ translateX: px }, { translateY: py }, { scaleX }, { scaleY }],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.image, style, breathe && { transformOrigin: [`${feel.breathe.pivotX * 100}%`, `${feel.breathe.pivotY * 100}%`] }]}
    >
      <Image source={layer.source} style={styles.image} resizeMode="stretch" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  frame: {
    position: 'absolute',
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  canvas: {
    ...StyleSheet.absoluteFill,
  },
});

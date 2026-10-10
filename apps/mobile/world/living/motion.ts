import { useEffect, useState } from 'react';
import { AccessibilityInfo, AppState } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import {
  useFrameCallback,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

import { TAVERN_FEEL } from './feel';

export function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (live) setReduce(value);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => {
      live = false;
      sub.remove();
    };
  }, []);
  return reduce;
}

export function useAppActive(): boolean {
  const [active, setActive] = useState(AppState.currentState === 'active');
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      setActive(next === 'active');
    });
    return () => sub.remove();
  }, []);
  return active;
}

/** Paused clock freezes in place — no jump when the screen comes back. */
export function useLivingClock(running: boolean): SharedValue<number> {
  const clock = useSharedValue(0);
  const frame = useFrameCallback((info) => {
    clock.value += info.timeSincePreviousFrame ?? 16.67;
  }, running);

  useEffect(() => {
    frame.setActive(running);
  }, [frame, running]);

  return clock;
}

/**
 * Smoothed device lean in −1…1. No-ops (stays at 0) unless `enabled`.
 * Only LivingScene turns this on when there are 2+ image layers.
 */
export function useTiltParallax(enabled: boolean): {
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
} {
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const targetX = useSharedValue(0);
  const targetY = useSharedValue(0);
  useEffect(() => {
    if (!enabled) {
      targetX.value = 0;
      targetY.value = 0;
      tiltX.value = 0;
      tiltY.value = 0;
      return;
    }

    let sub: { remove: () => void } | undefined;
    let cancelled = false;
    const invertX = TAVERN_FEEL.parallax.invertX ? -1 : 1;
    const invertY = TAVERN_FEEL.parallax.invertY ? -1 : 1;

    Accelerometer.isAvailableAsync()
      .then((ok) => {
        if (!ok || cancelled) return;
        Accelerometer.setUpdateInterval(80);
        sub = Accelerometer.addListener(({ x, y }) => {
          targetX.value = clamp1(x * invertX);
          targetY.value = clamp1(y * invertY);
        });
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      sub?.remove();
      targetX.value = 0;
      targetY.value = 0;
    };
  }, [enabled, targetX, targetY, tiltX, tiltY]);

  const frame = useFrameCallback(() => {
    tiltX.value += (targetX.value - tiltX.value) * 0.08;
    tiltY.value += (targetY.value - tiltY.value) * 0.08;
  }, enabled);

  useEffect(() => {
    frame.setActive(enabled);
  }, [enabled, frame]);

  return { tiltX, tiltY };
}

function clamp1(n: number): number {
  return Math.max(-1, Math.min(1, n));
}

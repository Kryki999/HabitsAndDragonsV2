/**
 * Tavern living-scene knobs. Tune this file — LivingScene reads it as-is.
 *
 * Coords are normalized 0–1 over the still (x left→right, y top→bottom).
 * The current Ground still is landscape and cover-crops on a phone, so the
 * hearth sits near the right edge of the bitmap; the wash still reaches the
 * wizard. When the still is split into 9:16 layers, these points stay correct.
 */

import type { ImageSourcePropType } from 'react-native';

export type LivingLayerId = 'background' | 'mid' | 'character' | 'foreground';

export type LivingLayer = {
  id: LivingLayerId;
  source: ImageSourcePropType;
  /**
   * Parallax depth. 0 = locked to the camera.
   * Positive = farther (drifts with tilt). Negative = nearer (opposite).
   * Applied only when two or more layers are present.
   */
  parallax?: number;
  /** Idle chest/shoulder breathe. Off until this layer is a cut-out. */
  breathe?: boolean;
};

export type LivingFeel = {
  light: {
    intensity: number;
    flickerAmp: number;
    ambient: number;
    coreRadius: number;
    midRadius: number;
    washRadius: number;
    pulseScale: number;
    edgePad: number;
  };
  fire: { x: number; y: number };
  candles: { x: number; y: number }[];
  candleIntensity: number;
  dust: { count: number; opacity: number; riseSeconds: number };
  sparks: { count: number; opacity: number; riseSeconds: number };
  breathe: {
    periodMs: number;
    scaleY: number;
    scaleX: number;
    pivotX: number;
    pivotY: number;
  };
  parallax: { maxPx: number; invertX: boolean; invertY: boolean };
  shafts: { x: number; y0: number; y1: number; width: number; weight: number }[];
  colors: {
    amber: string;
    ochre: string;
    gold: string;
    ember: string;
    dust: string;
    spark: string;
  };
};

export const TAVERN_FEEL: LivingFeel = {
  light: {
    /** Master strength of the hearth wash (0 = off, 1 = loud). */
    intensity: 0.82,
    /** How much the flame wanders. 0.15–0.25 = calm hearth. */
    flickerAmp: 0.24,
    /** Whole-scene amber pulse, on top of the local fire. */
    ambient: 0.07,
    /** Radii as a fraction of min(frame w, h). */
    coreRadius: 0.16,
    midRadius: 0.34,
    washRadius: 0.92,
    /** Extra scale on the glow blob while it pulses. */
    pulseScale: 0.1,
    edgePad: 0.07,
  },
  /** Hearth mouth on tavernsage.png / mentor-pass-A3. */
  fire: { x: 0.868, y: 0.575 },
  /** Chandelier candles — weaker, slower cousins of the fire. */
  candles: [
    { x: 0.445, y: 0.078 },
    { x: 0.5, y: 0.052 },
    { x: 0.555, y: 0.078 },
    { x: 0.47, y: 0.108 },
    { x: 0.53, y: 0.108 },
  ],
  candleIntensity: 0.28,
  dust: {
    count: 22,
    /** Peak mote alpha before shaft fade. */
    opacity: 0.42,
    /** Seconds to drift through a shaft. */
    riseSeconds: 16,
  },
  sparks: {
    count: 7,
    opacity: 0.72,
    /** Seconds for one ember to rise and die. */
    riseSeconds: 2.6,
  },
  breathe: {
    periodMs: 4400,
    scaleY: 0.011,
    scaleX: 0.0035,
    /** Origin in the character layer. Chest, not the feet. */
    pivotX: 0.5,
    pivotY: 0.4,
  },
  parallax: {
    /** Max layer shift in px at full lean. */
    maxPx: 12,
    invertX: false,
    invertY: true,
  },
  /**
   * Dust spawn volumes (normalized). Shaft 0 = chandelier (visible on phone).
   * Shaft 1 = hearth. Shaft 2 = quiet room air.
   */
  shafts: [
    { x: 0.5, y0: 0.14, y1: 0.7, width: 0.11, weight: 0.5 },
    { x: 0.84, y0: 0.4, y1: 0.78, width: 0.1, weight: 0.28 },
    { x: 0.52, y0: 0.22, y1: 0.82, width: 0.28, weight: 0.22 },
  ],
  colors: {
    amber: 'rgba(240, 179, 90, 1)',
    ochre: 'rgba(212, 137, 58, 1)',
    gold: 'rgba(255, 228, 163, 1)',
    ember: 'rgba(232, 120, 40, 1)',
    dust: 'rgba(255, 232, 190, 1)',
    spark: 'rgba(255, 210, 122, 1)',
  },
};

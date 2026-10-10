import { useMemo } from 'react';
import {
  Circle,
  Fill,
  Group,
  RadialGradient,
  vec,
} from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { type LivingFeel } from './feel';

type Size = { width: number; height: number };

function fract(n: number): number {
  'worklet';
  return n - Math.floor(n);
}

/** Calm hearth pulse in 0–1. Two slow sines + a tiny crackle. Never drops to black. */
export function hearthPulse(tSec: number, amp: number): number {
  'worklet';
  const wander =
    0.55 * Math.sin(tSec * 2.05) + 0.3 * Math.sin(tSec * 4.7 + 1.15) + 0.15 * Math.sin(tSec * 9.1 + 0.4);
  return 0.5 + amp * wander;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function TavernEffects({
  clock,
  size,
  feel,
  particles,
}: {
  clock: SharedValue<number>;
  size: Size;
  feel: LivingFeel;
  particles: boolean;
}) {
  const { width, height } = size;
  if (width <= 0 || height <= 0) return null;

  return (
    <Group>
      <AmbientWash clock={clock} feel={feel} />
      <FireGlow clock={clock} size={size} feel={feel} />
      <CandleGlows clock={clock} size={size} feel={feel} />
      {particles ? <DustField clock={clock} size={size} feel={feel} /> : null}
      {particles ? <SparkField clock={clock} size={size} feel={feel} /> : null}
    </Group>
  );
}

function AmbientWash({ clock, feel }: { clock: SharedValue<number>; feel: LivingFeel }) {
  const opacity = useDerivedValue(() => {
    const pulse = hearthPulse(clock.value / 1000, feel.light.flickerAmp * 0.45);
    return feel.light.ambient * feel.light.intensity * (0.75 + 0.25 * pulse);
  });
  return <Fill opacity={opacity} color={feel.colors.ochre} blendMode="softLight" />;
}

function FireGlow({
  clock,
  size,
  feel,
}: {
  clock: SharedValue<number>;
  size: Size;
  feel: LivingFeel;
}) {
  const fx = feel.fire.x * size.width;
  const fy = feel.fire.y * size.height;
  const unit = Math.min(size.width, size.height);
  const origin = vec(fx, fy);

  const opacity = useDerivedValue(() => {
    const pulse = hearthPulse(clock.value / 1000, feel.light.flickerAmp);
    return feel.light.intensity * (0.62 + 0.38 * pulse);
  });

  const transform = useDerivedValue(() => {
    const pulse = hearthPulse(clock.value / 1000, feel.light.flickerAmp);
    const s = 1 + feel.light.pulseScale * (pulse - 0.5) * 2;
    return [{ scale: s }];
  });

  return (
    <Group origin={origin} transform={transform} opacity={opacity} blendMode="softLight">
      <Group origin={origin} transform={[{ scaleX: 1.35 }, { scaleY: 0.72 }]}>
        <Circle c={origin} r={feel.light.washRadius * unit}>
          <RadialGradient
            c={origin}
            r={feel.light.washRadius * unit}
            colors={[
              'rgba(232, 150, 60, 0.34)',
              'rgba(212, 130, 48, 0.16)',
              'rgba(196, 110, 40, 0.05)',
              'rgba(196, 110, 40, 0)',
            ]}
            positions={[0, 0.28, 0.58, 1]}
          />
        </Circle>
        <Circle c={origin} r={feel.light.midRadius * unit}>
          <RadialGradient
            c={origin}
            r={feel.light.midRadius * unit}
            colors={['rgba(255, 196, 110, 0.42)', 'rgba(232, 140, 50, 0.16)', 'rgba(232, 140, 50, 0)']}
            positions={[0, 0.4, 1]}
          />
        </Circle>
        <Circle c={origin} r={feel.light.coreRadius * unit} blendMode="plus">
          <RadialGradient
            c={origin}
            r={feel.light.coreRadius * unit}
            colors={['rgba(255, 214, 140, 0.28)', 'rgba(255, 170, 70, 0.08)', 'rgba(255, 170, 70, 0)']}
            positions={[0, 0.45, 1]}
          />
        </Circle>
      </Group>
    </Group>
  );
}

function CandleGlows({
  clock,
  size,
  feel,
}: {
  clock: SharedValue<number>;
  size: Size;
  feel: LivingFeel;
}) {
  const r = Math.min(size.width, size.height) * 0.045;
  const opacity = useDerivedValue(() => {
    const t = clock.value / 1000;
    const pulse = hearthPulse(t * 0.72 + 0.8, feel.light.flickerAmp * 0.7);
    return feel.candleIntensity * feel.light.intensity * (0.7 + 0.3 * pulse);
  });

  return (
    <Group opacity={opacity} blendMode="softLight">
      {feel.candles.map((c, i) => {
        const origin = vec(c.x * size.width, c.y * size.height);
        return (
          <Circle key={i} c={origin} r={r}>
            <RadialGradient
              c={origin}
              r={r}
              colors={['rgba(255, 220, 140, 0.5)', 'rgba(255, 180, 80, 0.12)', 'rgba(255, 180, 80, 0)']}
              positions={[0, 0.4, 1]}
            />
          </Circle>
        );
      })}
    </Group>
  );
}

type MoteSpec = {
  x: number;
  y0: number;
  y1: number;
  sway: number;
  swayHz: number;
  period: number;
  phase: number;
  size: number;
  opacity: number;
};

function DustField({
  clock,
  size,
  feel,
}: {
  clock: SharedValue<number>;
  size: Size;
  feel: LivingFeel;
}) {
  const motes = useMemo(() => seedMotes(feel), [feel]);
  return (
    <>
      {motes.map((mote, i) => (
        <DustMote key={i} spec={mote} clock={clock} width={size.width} height={size.height} color={feel.colors.dust} />
      ))}
    </>
  );
}

function DustMote({
  spec,
  clock,
  width,
  height,
  color,
}: {
  spec: MoteSpec;
  clock: SharedValue<number>;
  width: number;
  height: number;
  color: string;
}) {
  const cx = useDerivedValue(() => {
    const t = clock.value / 1000;
    const life = fract(t / spec.period + spec.phase);
    const sway = Math.sin(t * spec.swayHz + spec.phase * 6.2) * spec.sway * width;
    const drift = (life - 0.5) * spec.sway * 0.35 * width;
    return spec.x * width + sway + drift;
  });
  const cy = useDerivedValue(() => {
    const t = clock.value / 1000;
    const life = fract(t / spec.period + spec.phase);
    return (spec.y0 + (spec.y1 - spec.y0) * life) * height;
  });
  const opacity = useDerivedValue(() => {
    const t = clock.value / 1000;
    const life = fract(t / spec.period + spec.phase);
    return spec.opacity * Math.sin(life * Math.PI);
  });
  return <Circle cx={cx} cy={cy} r={spec.size} opacity={opacity} color={color} />;
}

function seedMotes(feel: LivingFeel): MoteSpec[] {
  const rand = mulberry32(0xa3e1);
  const shafts = feel.shafts;
  const totalWeight = shafts.reduce((sum, s) => sum + s.weight, 0);
  const motes: MoteSpec[] = [];
  for (let i = 0; i < feel.dust.count; i++) {
    let pick = rand() * totalWeight;
    let shaft = shafts[0]!;
    for (const s of shafts) {
      pick -= s.weight;
      if (pick <= 0) {
        shaft = s;
        break;
      }
    }
    motes.push({
      x: shaft.x + (rand() - 0.5) * shaft.width,
      y0: shaft.y0,
      y1: shaft.y1,
      sway: 0.008 + rand() * 0.016,
      swayHz: 0.18 + rand() * 0.28,
      period: feel.dust.riseSeconds * (0.75 + rand() * 0.55),
      phase: rand(),
      size: 0.7 + rand() * 1.3,
      opacity: feel.dust.opacity * (0.45 + rand() * 0.55),
    });
  }
  return motes;
}

type SparkSpec = {
  phase: number;
  period: number;
  rise: number;
  wobble: number;
  wobbleHz: number;
  size: number;
  opacity: number;
};

function SparkField({
  clock,
  size,
  feel,
}: {
  clock: SharedValue<number>;
  size: Size;
  feel: LivingFeel;
}) {
  const sparks = useMemo(() => seedSparks(feel), [feel]);
  return (
    <>
      {sparks.map((spark, i) => (
        <Spark
          key={i}
          spec={spark}
          clock={clock}
          originX={feel.fire.x * size.width}
          originY={feel.fire.y * size.height}
          height={size.height}
          color={i % 2 === 0 ? feel.colors.spark : feel.colors.gold}
        />
      ))}
    </>
  );
}

function Spark({
  spec,
  clock,
  originX,
  originY,
  height,
  color,
}: {
  spec: SparkSpec;
  clock: SharedValue<number>;
  originX: number;
  originY: number;
  height: number;
  color: string;
}) {
  const cx = useDerivedValue(() => {
    const t = clock.value / 1000;
    const life = fract(t / spec.period + spec.phase);
    return originX + Math.sin(t * spec.wobbleHz + spec.phase * 8) * spec.wobble * (0.4 + life);
  });
  const cy = useDerivedValue(() => {
    const t = clock.value / 1000;
    const life = fract(t / spec.period + spec.phase);
    return originY - life * spec.rise * height;
  });
  const opacity = useDerivedValue(() => {
    const t = clock.value / 1000;
    const life = fract(t / spec.period + spec.phase);
    const fade = life < 0.15 ? life / 0.15 : 1 - (life - 0.15) / 0.85;
    return spec.opacity * Math.max(0, fade);
  });
  return <Circle cx={cx} cy={cy} r={spec.size} opacity={opacity} color={color} />;
}

function seedSparks(feel: LivingFeel): SparkSpec[] {
  const rand = mulberry32(0xc0ff);
  const sparks: SparkSpec[] = [];
  for (let i = 0; i < feel.sparks.count; i++) {
    sparks.push({
      phase: rand(),
      period: feel.sparks.riseSeconds * (0.7 + rand() * 0.7),
      rise: 0.08 + rand() * 0.1,
      wobble: 6 + rand() * 10,
      wobbleHz: 1.1 + rand() * 1.4,
      size: 0.9 + rand() * 1.1,
      opacity: feel.sparks.opacity * (0.55 + rand() * 0.45),
    });
  }
  return sparks;
}

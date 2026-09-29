import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Polygon } from 'react-native-svg';

import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { Sticker } from '@/ui/Sticker';
import type { StickerName } from '@/ui/stickerRegistry';
import { shadow, tokens } from '@/ui/tokens';
import {
  formatStatValue,
  HERO_HEX_LABELS,
  HERO_HEX_STAT_AXIS_ORDER,
  radarDynamicMax,
  type HeroHexStatId,
  type HeroHexStats,
} from '@/constants/heroHexStats';

const STAT_STICKER: Record<HeroHexStatId, StickerName> = {
  strength: 'biceps',
  agility: 'bolt',
  intelligence: 'brain',
  vitality: 'heart',
  spirit: 'sparkles',
  discipline: 'bullseye',
};

const CX = 100;
const CY = 100;
const R = 70;
const ICON = 28;
const HIT = 40;
/** Clearance from hex vertex to sticker inner edge. 0 sat the icon on the radar. */
const ICON_GAP = 8;
const ICON_R = R + ICON / 2 + ICON_GAP;
const SVG = 200;
const CHART_H = 228;
const TIP_H = 48;
const WRAP_H = CHART_H + TIP_H;
const SVG_TOP = (CHART_H - SVG) / 2;

function hexPoints(radius: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
    return `${(CX + radius * Math.cos(a)).toFixed(1)},${(CY + radius * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
}

function dataPoints(stats: HeroHexStats, max: number): string {
  return HERO_HEX_STAT_AXIS_ORDER.map((id, i) => {
    const t = Math.max(0, Math.min(1, stats[id] / max));
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
    const r = R * t;
    return `${(CX + r * Math.cos(a)).toFixed(1)},${(CY + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
}

function vertex(radius: number, i: number) {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
  return { x: CX + radius * Math.cos(a), y: CY + radius * Math.sin(a) };
}

type Props = {
  stats: HeroHexStats;
};

export function StatHex({ stats }: Props) {
  const max = radarDynamicMax(stats);
  const data = dataPoints(stats, max);
  const [openId, setOpenId] = useState<HeroHexStatId | null>(null);

  const dismiss = useCallback(() => setOpenId(null), []);

  const onStat = useCallback((id: HeroHexStatId) => {
    setOpenId((prev) => {
      if (prev === id) return null;
      impactAsync(ImpactFeedbackStyle.Light);
      return id;
    });
  }, []);

  return (
    <View style={styles.wrap}>
      <Pressable style={styles.svgBox} onPress={dismiss} accessibilityLabel="Dismiss stat">
        <Svg width={SVG} height={SVG} viewBox="0 0 200 200">
          <G fill="none" stroke={tokens.surface3} strokeWidth={2}>
            <Polygon points={hexPoints(R)} fill={tokens.surface} />
            <Polygon points={hexPoints((R * 2) / 3)} />
            <Polygon points={hexPoints(R / 3)} />
            {Array.from({ length: 6 }, (_, i) => {
              const p = vertex(R, i);
              return <Line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} />;
            })}
          </G>
          <Polygon
            points={data}
            fill={tokens.brand}
            fillOpacity={0.28}
            stroke={tokens.brand}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <G fill={tokens.surface} stroke={tokens.brand} strokeWidth={2.5}>
            {HERO_HEX_STAT_AXIS_ORDER.map((id, i) => {
              const t = Math.max(0, Math.min(1, stats[id] / max));
              const p = vertex(R * t, i);
              return <Circle key={id} cx={p.x} cy={p.y} r={4} />;
            })}
          </G>
        </Svg>
      </Pressable>
      {HERO_HEX_STAT_AXIS_ORDER.map((id, i) => {
        const p = vertex(ICON_R, i);
        const on = openId === id;
        return (
          <Pressable
            key={id}
            onPress={() => onStat(id)}
            accessibilityRole="button"
            accessibilityLabel={`${HERO_HEX_LABELS[id]} ${formatStatValue(stats[id])}`}
            style={[
              styles.stat,
              on && styles.statOn,
              {
                marginLeft: p.x - CX - HIT / 2,
                top: SVG_TOP + p.y - HIT / 2,
              },
            ]}
          >
            <Sticker name={STAT_STICKER[id]} size={ICON} />
          </Pressable>
        );
      })}
      {openId ? (
        <View style={styles.tip} pointerEvents="none">
          <Sticker name={STAT_STICKER[openId]} size={26} />
          <Text style={styles.tipName}>{HERO_HEX_LABELS[openId]}</Text>
          <Text style={styles.tipValue}>{formatStatValue(stats[openId])}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: WRAP_H,
    width: '100%',
    maxWidth: 358,
    alignSelf: 'center',
    position: 'relative',
  },
  svgBox: {
    position: 'absolute',
    left: '50%',
    top: CHART_H / 2,
    width: SVG,
    height: SVG,
    marginLeft: -SVG / 2,
    marginTop: -SVG / 2,
  },
  stat: {
    position: 'absolute',
    left: '50%',
    width: HIT,
    height: HIT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  statOn: {
    transform: [{ scale: 1.08 }],
  },
  tip: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 2,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 10,
    paddingRight: 14,
    backgroundColor: tokens.surface,
    borderRadius: tokens.rPill,
    boxShadow: [shadow.lipSurface, shadow.dropSm],
  },
  tipName: {
    fontFamily: tokens.font800,
    fontSize: 14,
    lineHeight: 16,
    color: tokens.ink2,
  },
  tipValue: {
    fontFamily: tokens.font900,
    fontSize: 16,
    lineHeight: 18,
    color: tokens.ink,
  },
});

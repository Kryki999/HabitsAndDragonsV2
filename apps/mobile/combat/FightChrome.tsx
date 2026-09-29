import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { shadowOnCanvas, tokens } from '@/ui/tokens';

const GOLD_SPARKS = [
  { left: '15%', top: '15%', size: 24, gold: true },
  { left: '82%', top: '13%', size: 16, gold: false },
  { left: '9%', top: '38%', size: 16, gold: true },
  { left: '84%', top: '34%', size: 28, gold: true },
  { left: '76%', top: '24%', size: 10, gold: false },
  { left: '22%', top: '27%', size: 12, gold: false },
] as const;

/** Celebration wash from the fight proposals. Defeat stays on the plain mist. */
export function FightWash({ gold = false }: { gold?: boolean }) {
  return (
    <LinearGradient
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      colors={
        gold
          ? ['#fff1d6', '#c9d3ff', tokens.canvasHi, tokens.canvas, tokens.canvasDeep]
          : ['#c9d3ff', tokens.canvasHi, tokens.canvas, tokens.canvasDeep]
      }
      locations={gold ? [0, 0.22, 0.36, 0.64, 1] : [0, 0.28, 0.62, 1]}
      start={{ x: 0.5, y: 0.2 }}
      end={{ x: 0.5, y: 1 }}
    />
  );
}

export function FightSparks() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {GOLD_SPARKS.map((spark) => (
        <View
          key={`${spark.left}-${spark.top}`}
          style={[
            styles.spark,
            {
              left: spark.left,
              top: spark.top,
              width: spark.size,
              height: spark.size,
              backgroundColor: spark.gold ? '#ffd36e' : '#fff',
            },
          ]}
        />
      ))}
    </View>
  );
}

export function FightKicker({ children, gold = false }: { children: string; gold?: boolean }) {
  return <Text style={[styles.kicker, gold && styles.kickerGold]}>{children}</Text>;
}

export function FightTitle({ children }: { children: string }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function FightNote({ children }: { children: string }) {
  return <Text style={styles.note}>{children}</Text>;
}

const styles = StyleSheet.create({
  spark: {
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },
  kicker: {
    fontFamily: tokens.font800,
    fontSize: 11,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: tokens.onCanvas,
    ...shadowOnCanvas,
  },
  kickerGold: {
    color: tokens.goldSoft,
  },
  title: {
    fontFamily: tokens.font900,
    fontSize: 44,
    lineHeight: 46,
    color: tokens.onCanvas,
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadowColor: tokens.canvasInk,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 0,
  },
  note: {
    fontFamily: tokens.font800,
    fontSize: 17,
    lineHeight: 23,
    color: tokens.onCanvas,
    textAlign: 'center',
    ...shadowOnCanvas,
  },
});

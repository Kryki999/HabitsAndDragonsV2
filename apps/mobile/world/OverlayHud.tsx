import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { EdgeInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';

type Props = {
  insets: EdgeInsets;
  kicker?: string;
  title: string;
};

/** Place-name HUD only. Navigation lives on `IconRail` — no text nav links. */
export default function OverlayHud({ insets, kicker, title }: Props) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['rgba(7,5,16,0.82)', 'rgba(7,5,16,0.28)', 'transparent']}
        style={[styles.topFade, { paddingTop: Math.max(insets.top, 10) + 4 }]}
      >
        <View style={styles.center}>
          {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  topFade: {
    paddingHorizontal: 64,
    paddingBottom: 16,
  },
  center: {
    alignItems: 'center',
  },
  kicker: {
    color: Colors.dark.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

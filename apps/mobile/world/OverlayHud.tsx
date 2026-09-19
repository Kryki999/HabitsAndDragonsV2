import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

import { requestOpenDevTools } from './devUi';

type HudAction = {
  accessibilityLabel: string;
  icon: LucideIcon;
  onPress: () => void;
};

type Props = {
  insets: EdgeInsets;
  kicker?: string;
  title: string;
  left?: HudAction;
  right?: HudAction;
};

export default function OverlayHud({ insets, kicker, title, left, right }: Props) {
  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['rgba(7,5,16,0.82)', 'rgba(7,5,16,0.28)', 'transparent']}
        style={[styles.topFade, { paddingTop: Math.max(insets.top, 10) + 4 }]}
        pointerEvents="box-none"
      >
        <View style={styles.row}>
          <View style={styles.side}>{left ? <HudIconButton {...left} /> : null}</View>
          <Pressable
            style={styles.center}
            onLongPress={__DEV__ ? requestOpenDevTools : undefined}
            delayLongPress={450}
            accessibilityRole="text"
            accessibilityLabel={`${kicker ?? ''} ${title}`.trim()}
          >
            {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </Pressable>
          <View style={[styles.side, styles.sideRight]}>{right ? <HudIconButton {...right} /> : null}</View>
        </View>
      </LinearGradient>
    </View>
  );
}

function HudIconButton({ icon: Icon, accessibilityLabel, onPress }: HudAction) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        impactAsync(ImpactFeedbackStyle.Light);
        onPress();
      }}
      hitSlop={8}
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
    >
      <Icon size={20} color={Colors.dark.gold} strokeWidth={2.4} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topFade: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  side: {
    width: 52,
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
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
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.dark.gold + '66',
    backgroundColor: 'rgba(13, 10, 20, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.8,
  },
});

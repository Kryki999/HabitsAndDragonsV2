import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { shadow, tokens } from '@/ui/tokens';

type Props = {
  caption?: string;
  children: ReactNode;
  tail?: 'left' | 'down-left';
  style?: StyleProp<ViewStyle>;
};

export function SpeechBubble({ caption, children, tail = 'left', style }: Props) {
  return (
    <View style={[styles.bubble, style]}>
      {tail === 'left' ? <View style={styles.tailLeft} /> : <View style={styles.tailDown} />}
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
      <Text style={styles.body}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'relative',
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 13,
    borderRadius: 22,
    backgroundColor: tokens.surface,
    boxShadow: [shadow.lipSurface, shadow.dropOnArt],
  },
  caption: {
    fontFamily: tokens.font800,
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: tokens.brand,
    marginBottom: 4,
  },
  body: {
    fontFamily: tokens.font800,
    fontSize: 15,
    lineHeight: 19.5,
    color: tokens.ink,
  },
  tailLeft: {
    position: 'absolute',
    left: -12,
    top: 26,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: tokens.surface,
  },
  tailDown: {
    position: 'absolute',
    left: 26,
    bottom: -13,
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderTopWidth: 13,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: tokens.surface,
  },
});

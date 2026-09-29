import { StyleSheet, Text, View } from 'react-native';

import { shadow, tokens } from '@/ui/tokens';

/** Locked-floor and dev-unveil line. Same words the lift already used. */
export function WorldNotice({ message, top }: { message: string; top?: number }) {
  return (
    <View pointerEvents="none" style={[styles.wrap, top != null ? { top } : styles.bottom]}>
      <View style={styles.pill}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 40,
    alignItems: 'center',
  },
  bottom: {
    bottom: 24,
  },
  pill: {
    maxWidth: 320,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: tokens.rPill,
    backgroundColor: tokens.surface,
    boxShadow: [shadow.lipSurface, shadow.dropOnArt],
  },
  text: {
    fontFamily: tokens.font800,
    fontSize: 13,
    color: tokens.ink,
    textAlign: 'center',
  },
});

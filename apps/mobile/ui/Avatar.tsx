import { Image, StyleSheet, View } from 'react-native';

import { shadow, tokens } from '@/ui/tokens';

const FACE = require('../lookdev/assets/avatar-hero.jpg');

type Props = {
  size?: number;
  borderWidth?: number;
  /** Lookdev valley mocks tint the same portrait (hue-rotate). */
  hueRotate?: number;
};

export function Avatar({ size = 44, borderWidth = 3, hueRotate }: Props) {
  return (
    <View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth,
          boxShadow: borderWidth >= 3 ? [shadow.dropSm] : undefined,
        },
        hueRotate != null ? { filter: [{ hueRotate: `${hueRotate}deg` }] } : null,
      ]}
    >
      <Image source={FACE} style={styles.face} />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderColor: tokens.surface,
    overflow: 'hidden',
    backgroundColor: tokens.surface2,
  },
  face: {
    width: '100%',
    height: '100%',
  },
});

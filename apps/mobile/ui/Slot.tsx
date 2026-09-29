import { StyleSheet, View } from 'react-native';

import { Glyph } from '@/ui/Glyph';
import { Sticker } from '@/ui/Sticker';
import type { StickerName } from '@/ui/stickerRegistry';
import { tokens } from '@/ui/tokens';

type Props = {
  size?: number;
  radius?: number;
  ghost?: StickerName;
  add?: boolean;
};

export function Slot({ size, radius = 16, ghost, add = false }: Props) {
  return (
    <View
      style={[
        styles.slot,
        size ? { width: size, height: size } : styles.flexSquare,
        { borderRadius: radius },
      ]}
    >
      {ghost ? (
        <View style={styles.ghost}>
          <Sticker name={ghost} size={size ? Math.round(size * 0.46) : 28} bare />
        </View>
      ) : null}
      {add ? (
        <View style={styles.add}>
          <Glyph name="add" size={16} color={tokens.onCanvas} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    backgroundColor: tokens.surface2,
    borderWidth: 2,
    borderColor: tokens.surface3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  flexSquare: {
    aspectRatio: 1,
    width: '100%',
  },
  ghost: {
    opacity: 0.35,
  },
  add: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: tokens.brand,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: [
      { offsetX: 0, offsetY: 0, blurRadius: 0, spreadDistance: 3, color: tokens.surface },
      { offsetX: 0, offsetY: 3, blurRadius: 0, spreadDistance: 3, color: tokens.brandDeep },
    ],
  },
});

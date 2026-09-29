import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { stickers, type StickerName } from '@/ui/stickerRegistry';

const dieCut: StyleProp<ViewStyle> =
  Platform.OS === 'web'
    ? {
        filter:
          'drop-shadow(1.6px 0 0 #fff) drop-shadow(-1.6px 0 0 #fff) drop-shadow(0 1.6px 0 #fff) drop-shadow(0 -1.6px 0 #fff) drop-shadow(0 3px 3px rgba(40, 50, 140, 0.28))',
      }
    : {
        filter: [
          { dropShadow: { offsetX: 1.6, offsetY: 0, standardDeviation: 0, color: '#fff' } },
          { dropShadow: { offsetX: -1.6, offsetY: 0, standardDeviation: 0, color: '#fff' } },
          { dropShadow: { offsetX: 0, offsetY: 1.6, standardDeviation: 0, color: '#fff' } },
          { dropShadow: { offsetX: 0, offsetY: -1.6, standardDeviation: 0, color: '#fff' } },
          { dropShadow: { offsetX: 0, offsetY: 3, standardDeviation: 3, color: 'rgba(40, 50, 140, 0.28)' } },
        ],
      };

type Props = {
  name: StickerName;
  size?: number;
  /** Currency art inside a pill skips the die-cut (components.css `.pill-currency .sticker`). */
  bare?: boolean;
};

export function Sticker({ name, size = 28, bare = false }: Props) {
  const Icon = stickers[name];
  return (
    <View style={[styles.box, { width: size, height: size }, bare ? null : dieCut]}>
      <Icon width={size} height={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

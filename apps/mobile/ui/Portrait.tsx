import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Glyph } from '@/ui/Glyph';
import { shadow, tokens } from '@/ui/tokens';

const FACE = require('../lookdev/assets/avatar-hero.jpg');

type Props = {
  size?: number;
  xl?: boolean;
  edit?: boolean;
  onEdit?: () => void;
};

export function Portrait({ size, xl = false, edit = false, onEdit }: Props) {
  const dim = size ?? (xl ? 196 : 84);
  const border = xl ? 7 : 4;
  const gold = xl ? 6 : 3;
  const lip = xl ? 7 : 4;
  const inner = dim - gold * 2;

  return (
    <View
      style={[
        styles.ring,
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          padding: gold,
          boxShadow: [
            { offsetX: 0, offsetY: lip, blurRadius: 0, spreadDistance: gold, color: tokens.goldDeep },
            shadow.dropSm,
            ...(xl ? [{ offsetX: 0, offsetY: 20, blurRadius: 50, color: 'rgba(40,50,140,0.35)' }] : []),
          ],
        },
      ]}
    >
      <View
        style={[
          styles.faceClip,
          {
            width: inner,
            height: inner,
            borderRadius: inner / 2,
            borderWidth: border,
          },
        ]}
      >
        <Image source={FACE} style={styles.face} />
      </View>
      {edit ? (
        <Pressable
          accessibilityRole={onEdit ? 'button' : 'none'}
          accessibilityLabel="Edit portrait"
          onPress={onEdit}
          disabled={!onEdit}
          style={styles.edit}
        >
          <Glyph name="edit" size={15} color={tokens.onCanvas} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    backgroundColor: tokens.gold,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  faceClip: {
    overflow: 'hidden',
    borderColor: tokens.surface,
    backgroundColor: tokens.surface2,
  },
  face: {
    width: '100%',
    height: '100%',
  },
  edit: {
    position: 'absolute',
    right: -6,
    bottom: -4,
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

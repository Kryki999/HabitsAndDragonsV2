import { StyleSheet, Text, View } from 'react-native';

import { Glyph, type GlyphName } from '@/ui/Glyph';
import { Sticker } from '@/ui/Sticker';
import type { StickerName } from '@/ui/stickerRegistry';
import { shadow, tokens } from '@/ui/tokens';

type Props = {
  glyph?: GlyphName;
  sticker?: StickerName;
  label: string;
  value?: string;
};

/** Information chip (restock, active filter). Not an action. */
export function Chip({ glyph, sticker, label, value }: Props) {
  return (
    <View style={styles.chip}>
      {sticker ? <Sticker name={sticker} size={18} /> : null}
      {glyph ? <Glyph name={glyph} size={18} color={tokens.brand} /> : null}
      <Text style={styles.label}>
        {label}
        {value ? (
          <>
            {' '}
            <Text style={styles.value}>{value}</Text>
          </>
        ) : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 34,
    paddingLeft: 9,
    paddingRight: 13,
    borderRadius: tokens.rPill,
    backgroundColor: tokens.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    boxShadow: [shadow.dropSm],
  },
  label: {
    fontFamily: tokens.font800,
    fontSize: 13,
    color: tokens.ink2,
  },
  value: {
    fontFamily: tokens.font900,
    color: tokens.ink,
  },
});

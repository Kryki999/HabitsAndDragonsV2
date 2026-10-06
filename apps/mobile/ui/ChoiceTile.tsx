import { StyleSheet, Text, View } from 'react-native';

import { Glyph } from '@/ui/Glyph';
import { PressableLip } from '@/ui/PressableLip';
import { Sticker } from '@/ui/Sticker';
import type { StickerName } from '@/ui/stickerRegistry';
import { shadow, tokens } from '@/ui/tokens';

type Props = {
  label: string;
  hint?: string;
  sticker: StickerName;
  selected?: boolean;
  onPress?: () => void;
  testID?: string;
};

/** C2 multi-pick tile. 2-up grid. */
export function ChoiceTile({ label, hint, sticker, selected = false, onPress, testID }: Props) {
  return (
    <PressableLip
      onPress={onPress}
      face={selected ? tokens.brandSoft : tokens.surface}
      lip={selected ? shadow.lipBrand : shadow.lipSurface}
      extraShadow={selected ? undefined : shadow.dropSm}
      radius={22}
      style={[styles.tile, selected && styles.tileOn]}
      accessibilityLabel={label}
      accessibilityRole="button"
      testID={testID}
      block
    >
      <View style={[styles.well, selected && styles.wellOn]}>
        <Sticker name={sticker} size={32} />
      </View>
      <Text style={styles.label}>{label}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <View style={[styles.mark, selected && styles.markOn]}>
        {selected ? <Glyph name="check" size={15} color={tokens.onCanvas} /> : null}
      </View>
    </PressableLip>
  );
}

const styles = StyleSheet.create({
  tile: {
    position: 'relative',
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 13,
    gap: 8,
    minHeight: 118,
  },
  tileOn: {
    boxShadow: [{ offsetX: 0, offsetY: 0, blurRadius: 0, spreadDistance: 3, color: tokens.brand }, shadow.lipBrand],
  },
  well: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wellOn: {
    backgroundColor: tokens.surface,
  },
  label: {
    fontFamily: tokens.font900,
    fontSize: 16,
    lineHeight: 18,
    color: tokens.ink,
  },
  hint: {
    fontFamily: tokens.font800,
    fontSize: 12,
    lineHeight: 14,
    color: tokens.ink3,
    marginTop: -4,
  },
  mark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 26,
    height: 26,
    borderRadius: 13,
    boxShadow: [{ offsetX: 0, offsetY: 0, blurRadius: 0, spreadDistance: 2.5, color: tokens.surface3, inset: true }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  markOn: {
    backgroundColor: tokens.brand,
    boxShadow: undefined,
  },
});

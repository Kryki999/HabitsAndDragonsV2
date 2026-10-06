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

/** C2 single-choice row. Selected = brand-soft + brand ring. */
export function ChoiceRow({ label, hint, sticker, selected = false, onPress, testID }: Props) {
  if (selected) {
    return (
      <PressableLip
        onPress={onPress}
        face={tokens.brandSoft}
        lip={shadow.lipBrand}
        radius={22}
        style={styles.rowOn}
        accessibilityLabel={label}
        accessibilityRole="button"
        testID={testID}
        block
      >
        <View style={styles.wellOn}>
          <Sticker name={sticker} size={30} />
        </View>
        <View style={styles.txt}>
          <Text style={styles.label}>{label}</Text>
          {hint ? <Text style={styles.hint}>{hint}</Text> : null}
        </View>
        <View style={styles.markOn}>
          <Glyph name="check" size={16} color={tokens.onCanvas} />
        </View>
      </PressableLip>
    );
  }

  return (
    <PressableLip
      onPress={onPress}
      face={tokens.surface}
      lip={shadow.lipSurface}
      extraShadow={shadow.dropSm}
      radius={22}
      style={styles.row}
      accessibilityLabel={label}
      accessibilityRole="button"
      testID={testID}
      block
    >
      <View style={styles.well}>
        <Sticker name={sticker} size={30} />
      </View>
      <View style={styles.txt}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      <View style={styles.mark} />
    </PressableLip>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 68,
    paddingLeft: 10,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  rowOn: {
    minHeight: 68,
    paddingLeft: 10,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    boxShadow: [{ offsetX: 0, offsetY: 0, blurRadius: 0, spreadDistance: 3, color: tokens.brand }, shadow.lipBrand],
  },
  well: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wellOn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: tokens.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontFamily: tokens.font800,
    fontSize: 17,
    lineHeight: 20,
    color: tokens.ink,
  },
  hint: {
    fontFamily: tokens.font800,
    fontSize: 12,
    lineHeight: 14,
    color: tokens.ink3,
    marginTop: 2,
  },
  mark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    boxShadow: [{ offsetX: 0, offsetY: 0, blurRadius: 0, spreadDistance: 2.5, color: tokens.surface3, inset: true }],
  },
  markOn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: tokens.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

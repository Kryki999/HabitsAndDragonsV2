import { StyleSheet, View } from 'react-native';

import { Glyph, type GlyphName } from '@/ui/Glyph';
import { PressableLip } from '@/ui/PressableLip';
import { shadow, tokens } from '@/ui/tokens';

type Props = {
  glyph: GlyphName;
  onPress?: () => void;
  disabled?: boolean;
  size?: number;
  glyphColor?: string;
  accessibilityLabel: string;
  testID?: string;
  ghost?: boolean;
};

export function IconButton({
  glyph,
  onPress,
  disabled,
  size = 44,
  glyphColor = tokens.brand,
  accessibilityLabel,
  testID,
  ghost = false,
}: Props) {
  if (ghost) {
    return (
      <PressableLip
        onPress={onPress}
        disabled={disabled}
        face="transparent"
        lip={shadow.lipSurface}
        radius={size / 2}
        style={[styles.hit, { width: size, height: size, boxShadow: 'none' }]}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
      >
        <View style={styles.ghostGlyph}>
          <Glyph name={glyph} size={Math.round(size * 0.64)} color={tokens.onCanvas} />
        </View>
      </PressableLip>
    );
  }

  return (
    <PressableLip
      onPress={onPress}
      disabled={disabled}
      face={tokens.surface}
      lip={shadow.lipSurface}
      extraShadow={shadow.dropSm}
      radius={size / 2}
      style={[styles.hit, { width: size, height: size }]}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <Glyph name={glyph} size={Math.round(size * 0.5)} color={glyphColor} />
    </PressableLip>
  );
}

const styles = StyleSheet.create({
  hit: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostGlyph: {
    filter: [{ dropShadow: { offsetX: 0, offsetY: 2, standardDeviation: 0, color: 'rgba(59,71,158,0.3)' } }],
  },
});

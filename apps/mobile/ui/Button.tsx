import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Glyph, type GlyphName } from '@/ui/Glyph';
import { PressableLip } from '@/ui/PressableLip';
import { Sticker } from '@/ui/Sticker';
import type { StickerName } from '@/ui/stickerRegistry';
import { shadow, tokens } from '@/ui/tokens';

type Common = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  sticker?: StickerName;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  block?: boolean;
  /** PeekCard Enter — lookdev 17 / 48, so the name column keeps width. */
  compact?: boolean;
};

export function ButtonPrimary({ label, onPress, disabled, sticker, style, testID, block, compact }: Common) {
  return (
    <PressableLip
      onPress={onPress}
      disabled={disabled}
      face={disabled ? tokens.surface3 : tokens.brand}
      lip={shadow.lipBrand}
      extraShadow={shadow.brandGlow}
      radius={tokens.rPill}
      block={block}
      style={[styles.primary, compact && styles.primaryCompact, block && styles.block, style]}
      accessibilityLabel={label}
      testID={testID}
    >
      {sticker ? <Sticker name={sticker} size={compact ? 26 : 30} /> : null}
      <Text style={[styles.primaryLabel, compact && styles.primaryLabelCompact, disabled && { color: tokens.ink3 }]}>
        {label}
      </Text>
    </PressableLip>
  );
}

export function ButtonFlow({ label, onPress, disabled, sticker, style, testID, block }: Common) {
  return (
    <PressableLip
      onPress={onPress}
      disabled={disabled}
      face={tokens.surface}
      lip={shadow.lipSurface}
      extraShadow={shadow.dropMd}
      radius={tokens.rPill}
      block={block}
      style={[styles.primary, block && styles.block, style]}
      accessibilityLabel={label}
      testID={testID}
    >
      {sticker ? <Sticker name={sticker} size={30} /> : null}
      <Text style={styles.flowLabel}>{label}</Text>
    </PressableLip>
  );
}

export function ButtonSoft({
  label,
  onPress,
  disabled,
  glyph,
  style,
  testID,
  block,
}: Omit<Common, 'sticker'> & { glyph?: GlyphName }) {
  return (
    <PressableLip
      onPress={onPress}
      disabled={disabled}
      face={tokens.brandSoft}
      lip={shadow.lipSoft}
      radius={tokens.rPill}
      block={block}
      style={[styles.soft, block && styles.block, style]}
      accessibilityLabel={label}
      testID={testID}
    >
      {glyph ? <Glyph name={glyph} size={22} color={tokens.brandDeep} /> : null}
      <Text style={styles.softLabel}>{label}</Text>
    </PressableLip>
  );
}

const styles = StyleSheet.create({
  primary: {
    height: 58,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  block: {
    alignSelf: 'stretch',
  },
  primaryCompact: {
    height: 48,
    paddingHorizontal: 16,
    gap: 6,
  },
  primaryLabel: {
    fontFamily: tokens.font900,
    fontSize: 19,
    color: tokens.onCanvas,
  },
  primaryLabelCompact: {
    fontSize: 17,
  },
  flowLabel: {
    fontFamily: tokens.font900,
    fontSize: 19,
    color: tokens.ink,
  },
  soft: {
    height: 50,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  softLabel: {
    fontFamily: tokens.font900,
    fontSize: 17,
    color: tokens.brandDeep,
  },
});

export function ButtonRow({ children }: { children: ReactNode }) {
  return <View>{children}</View>;
}

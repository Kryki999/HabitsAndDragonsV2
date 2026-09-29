import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import { glyphs, type GlyphName } from '@/ui/glyphRegistry';
import { tokens } from '@/ui/tokens';

type Props = {
  name: GlyphName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function Glyph({ name, size = 22, color = tokens.ink, style }: Props) {
  const Icon = glyphs[name];
  return (
    <View style={style}>
      <Icon width={size} height={size} color={color} fill={color} />
    </View>
  );
}

export type { GlyphName };

import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { tokens } from '@/ui/tokens';

type Props = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** canvas-deep panel on the mist (Crown Day). Not a card. */
export function PanelInset({ children, style }: Props) {
  return (
    <View style={[styles.panel, style]}>
      <View style={styles.highlight} pointerEvents="none" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: tokens.canvasDeep,
    borderRadius: tokens.rLg,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
});

import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import { tokens } from '@/ui/tokens';

/** Vignette dissolves into canvas. */
export function Seam({ height = 140 }: { height?: number }) {
  return (
    <LinearGradient
      pointerEvents="none"
      colors={['rgba(145,162,242,0)', 'rgba(145,162,242,0.55)', tokens.canvas]}
      locations={[0, 0.45, 1]}
      style={[styles.seam, { height }]}
    />
  );
}

/** Mist ends on the top edge of the tab bar. The bar itself sits below this view. */
export function SeamDock({ fade = 90 }: { fade?: number }) {
  return (
    <LinearGradient
      pointerEvents="none"
      colors={['rgba(145,162,242,0)', 'rgba(145,162,242,0.55)', tokens.canvas]}
      locations={[0, 0.45, 1]}
      style={[styles.dock, { height: fade }]}
    />
  );
}

/** Dark stills only. The map uses mist instead. */
export function ScrimTop({ height = 150 }: { height?: number }) {
  return (
    <LinearGradient
      pointerEvents="none"
      colors={['rgba(14, 14, 40, 0.55)', 'rgba(14, 14, 40, 0)']}
      style={[styles.scrim, { height }]}
    />
  );
}

const styles = StyleSheet.create({
  seam: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 6,
  },
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 6,
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 5,
  },
});

export function vignetteHeight(windowHeight: number) {
  return Math.round(windowHeight * (410 / 844));
}

import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  left: number;
  top: number;
  /** Diameter in unscaled map pixels. */
  size: number;
};

/** Soft fog blot on a locked landmark. Sits under the pin. */
export default function FogPatch({ left, top, size }: Props) {
  const outer = size;
  const mid = size * 0.72;
  const inner = size * 0.42;

  return (
    <View pointerEvents="none" style={[styles.anchor, { left, top, zIndex: 2 }]}>
      <View
        style={[
          styles.blot,
          {
            width: outer,
            height: outer,
            borderRadius: outer / 2,
            marginLeft: -outer / 2,
            marginTop: -outer / 2,
            backgroundColor: 'rgba(18, 22, 38, 0.5)',
          },
        ]}
      />
      <View
        style={[
          styles.blot,
          {
            width: mid,
            height: mid,
            borderRadius: mid / 2,
            marginLeft: -mid / 2,
            marginTop: -mid / 2,
            backgroundColor: 'rgba(168, 182, 204, 0.4)',
          },
        ]}
      />
      <View
        style={[
          styles.blot,
          {
            width: inner,
            height: inner,
            borderRadius: inner / 2,
            marginLeft: -inner / 2,
            marginTop: -inner / 2,
            backgroundColor: 'rgba(226, 232, 242, 0.32)',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  blot: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

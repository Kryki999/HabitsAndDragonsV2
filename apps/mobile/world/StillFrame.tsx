import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType, type LayoutChangeEvent } from 'react-native';

export type FittedBox = {
  width: number;
  height: number;
  left: number;
  top: number;
};

export function fitContain(
  imageWidth: number,
  imageHeight: number,
  boxWidth: number,
  boxHeight: number,
): FittedBox {
  if (boxWidth <= 0 || boxHeight <= 0 || imageWidth <= 0 || imageHeight <= 0) {
    return { width: 0, height: 0, left: 0, top: 0 };
  }
  const scale = Math.min(boxWidth / imageWidth, boxHeight / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return {
    width,
    height,
    left: (boxWidth - width) / 2,
    top: (boxHeight - height) / 2,
  };
}

type Props = {
  source: ImageSourcePropType;
  intrinsicWidth: number;
  intrinsicHeight: number;
  children?: (box: FittedBox) => React.ReactNode;
};

/** Letterboxed still — never crops the owner's art. Children layout in image space. */
export default function StillFrame({ source, intrinsicWidth, intrinsicHeight, children }: Props) {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const fitted = useMemo(
    () => fitContain(intrinsicWidth, intrinsicHeight, viewport.width, viewport.height),
    [intrinsicWidth, intrinsicHeight, viewport.height, viewport.width],
  );

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setViewport((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  };

  return (
    <View style={styles.root} onLayout={onLayout}>
      {fitted.width > 0 ? (
        <View
          style={[
            styles.frame,
            {
              width: fitted.width,
              height: fitted.height,
              left: fitted.left,
              top: fitted.top,
            },
          ]}
        >
          <Image source={source} style={styles.image} resizeMode="stretch" />
          {children?.(fitted)}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  frame: {
    position: 'absolute',
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
});

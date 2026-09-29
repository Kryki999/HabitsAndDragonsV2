import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { ButtonPrimary } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { tokens } from '@/ui/tokens';

type Props = {
  still?: ImageSourcePropType;
  kicker: string;
  name: string;
  meta: string;
  onEnter?: () => void;
};

export function PeekCard({ still, kicker, name, meta, onEnter }: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.thumb}>{still ? <Image source={still} style={styles.thumbImage} /> : null}</View>
      <View style={styles.col}>
        <Text style={styles.kicker}>{kicker}</Text>
        <Text
          style={styles.name}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
        >
          {name}
        </Text>
        <Text style={styles.meta} numberOfLines={2}>
          {meta}
        </Text>
      </View>
      {onEnter ? (
        <ButtonPrimary label="Enter" onPress={onEnter} compact style={styles.enter} testID="map-peek-enter" />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: tokens.screenX,
    right: tokens.screenX,
    bottom: 12,
    zIndex: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  thumb: {
    flexShrink: 0,
    width: 64,
    height: 64,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: tokens.surface2,
    boxShadow: [{ offsetX: 0, offsetY: 3, blurRadius: 0, color: tokens.surface3 }],
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  col: {
    flex: 1,
    minWidth: 0,
  },
  kicker: {
    fontFamily: tokens.font800,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: tokens.brand,
  },
  name: {
    fontFamily: tokens.font900,
    fontSize: 18,
    lineHeight: 21,
    color: tokens.ink,
  },
  meta: {
    marginTop: 4,
    fontFamily: tokens.font800,
    fontSize: 13,
    color: tokens.ink2,
  },
  enter: {
    flexShrink: 0,
    height: 48,
    paddingHorizontal: 16,
  },
});

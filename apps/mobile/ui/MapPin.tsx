import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Glyph } from '@/ui/Glyph';
import { Sticker } from '@/ui/Sticker';
import type { StickerName } from '@/ui/stickerRegistry';
import { shadow, tokens } from '@/ui/tokens';

const FACE = require('../lookdev/assets/avatar-hero.jpg');

type Kind = 'current' | 'landmark' | 'locked';

type Props = {
  kind: Kind;
  sticker?: StickerName;
  /** Tip of the pin, in the same space as the map image. */
  left: number;
  top: number;
  /** Map camera scale. The pin stays a screen-sized object. */
  scale?: number;
  onPress: () => void;
  onLongPress?: () => void;
  accessibilityLabel: string;
  /** Required hero level, drawn on locked pins only. */
  lockLevel?: number;
};

export function MapPin({
  kind,
  sticker = 'swords',
  left,
  top,
  scale = 1,
  onPress,
  onLongPress,
  accessibilityLabel,
  lockLevel,
}: Props) {
  const head = (kind === 'current' ? 56 : kind === 'locked' ? 36 : 46) * scale;
  const tip = 10 * scale;
  const locked = kind === 'locked';

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        {
          width: head,
          left: left - head / 2,
          top: top - (head + tip),
          zIndex: kind === 'current' ? 5 : locked ? 2 : 3,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={480}
        hitSlop={12}
        style={styles.hit}
      >
        <View
          key={kind}
          style={[
            styles.head,
            {
              width: head,
              height: head,
              borderRadius: head / 2,
            },
            kind === 'current' && styles.current,
            locked && styles.locked,
          ]}
        >
          {kind === 'current' ? (
            <Image source={FACE} style={styles.face} />
          ) : locked ? (
            <View style={styles.lockStack}>
              <Glyph name="lock" size={14 * scale} color={tokens.ink3} />
              {lockLevel != null ? (
                <Text style={[styles.lockLevel, { fontSize: 11 * scale, lineHeight: 12 * scale }]}>
                  {lockLevel}
                </Text>
              ) : null}
            </View>
          ) : (
            <Sticker name={sticker} size={30 * scale} />
          )}
        </View>
        <View
          style={[
            styles.tip,
            {
              borderLeftWidth: 7 * scale,
              borderRightWidth: 7 * scale,
              borderTopWidth: tip,
            },
            kind === 'current' && styles.tipCurrent,
            locked && styles.tipLocked,
          ]}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  hit: {
    alignItems: 'center',
  },
  head: {
    backgroundColor: tokens.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    boxShadow: [shadow.lipSurface, shadow.dropOnArt],
  },
  current: {
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: tokens.gold,
    boxShadow: [
      shadow.lipGold,
      { offsetX: 0, offsetY: 0, blurRadius: 0, color: 'rgba(253,180,60,0.35)', spreadDistance: 7 },
      shadow.dropOnArt,
    ],
  },
  locked: {
    backgroundColor: tokens.surface3,
    boxShadow: [shadow.dropOnArt],
  },
  face: {
    width: '100%',
    height: '100%',
  },
  tip: {
    width: 0,
    height: 0,
    marginTop: 2,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: tokens.surface,
  },
  tipCurrent: {
    borderTopColor: tokens.gold,
  },
  tipLocked: {
    borderTopColor: tokens.surface3,
  },
  lockStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockLevel: {
    fontFamily: tokens.font800,
    color: tokens.ink2,
    marginTop: -1,
  },
});

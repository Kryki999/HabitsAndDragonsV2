import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glyph } from '@/ui/Glyph';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { shadow, tokens } from '@/ui/tokens';

type Props = {
  kicker: string;
  name: string;
  onBack?: () => void;
  /** Dev-only. Production titles stay inert. */
  onTitlePress?: () => void;
  onTitleLongPress?: () => void;
};

export function SceneHead({ kicker, name, onBack, onTitlePress, onTitleLongPress }: Props) {
  const insets = useSafeAreaInsets();
  const title = (
    <View style={styles.title}>
      <Text style={styles.kicker}>{kicker}</Text>
      <Text
        style={styles.name}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.78}
      >
        {name}
      </Text>
    </View>
  );

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { top: insets.top + 8 }]}>
      <View style={[styles.pill, onBack ? null : styles.pillRoot]}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={6}
            onPress={() => {
              impactAsync(ImpactFeedbackStyle.Light);
              onBack();
            }}
            style={styles.back}
          >
            <Glyph name="back" size={24} color={tokens.brand} />
          </Pressable>
        ) : null}
        {onTitlePress || onTitleLongPress ? (
          <Pressable
            accessibilityRole="button"
            onPress={onTitlePress}
            onLongPress={onTitleLongPress}
            delayLongPress={400}
            hitSlop={8}
            style={styles.title}
          >
            {title}
          </Pressable>
        ) : (
          title
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: tokens.screenX,
    zIndex: 30,
    maxWidth: '72%',
  },
  pill: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 56,
    paddingVertical: 6,
    paddingRight: 16,
    paddingLeft: 6,
    backgroundColor: tokens.surface,
    borderRadius: tokens.rPill,
    boxShadow: [shadow.lipSurface, shadow.dropOnArt],
  },
  pillRoot: {
    paddingLeft: 20,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flexShrink: 1,
    minWidth: 0,
  },
  kicker: {
    fontFamily: tokens.font800,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: tokens.brand,
  },
  name: {
    fontFamily: tokens.font900,
    fontSize: 18,
    lineHeight: 21,
    color: tokens.ink,
  },
});

import React from 'react';
import { StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';

import OverlayHud from './OverlayHud';
import StillFrame, { type CoverAnchor } from './StillFrame';
import { LOCATION_STILL_INTRINSIC } from './content';

type Props = {
  name: string;
  kicker: string;
  still: ImageSourcePropType;
  flavor: string;
  onBack: () => void;
  testID?: string;
  stillAnchor?: CoverAnchor;
};

/** Ally / hub still — same World grammar as a location, no Fight. */
export default function NpcStill({
  name,
  kicker,
  still,
  flavor,
  onBack,
  testID,
  stillAnchor = 'center',
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root} testID={testID ?? `npc-still-${name}`}>
      <StillFrame
        source={still}
        intrinsicWidth={LOCATION_STILL_INTRINSIC.width}
        intrinsicHeight={LOCATION_STILL_INTRINSIC.height}
        anchor={stillAnchor}
      />

      <OverlayHud
        insets={insets}
        kicker={kicker}
        title={name}
        left={{ icon: 'back', onPress: onBack, accessibilityLabel: 'Back' }}
      />

      <View pointerEvents="none" style={[styles.veilWrap, { paddingBottom: 16 + insets.bottom }]}>
        <LinearGradient
          colors={['transparent', 'rgba(7,5,16,0.55)', 'rgba(7,5,16,0.92)']}
          style={styles.fade}
        />
        <Text style={styles.flavor}>{flavor}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070510',
  },
  veilWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  fade: {
    height: 72,
  },
  flavor: {
    marginTop: -8,
    paddingHorizontal: 20,
    paddingBottom: 8,
    color: Colors.dark.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowRadius: 6,
  },
});

import React from 'react';
import { StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { Card } from '@/ui/Card';
import { SceneHead } from '@/ui/SceneHead';
import { ScrimTop, SeamDock } from '@/ui/Seam';
import { tokens } from '@/ui/tokens';

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

/** Flavor still for hub NPCs (advisor) and map flavor cards (Pell). Allies use AllyStill. */
export default function NpcStill({
  name,
  kicker,
  still,
  flavor,
  onBack,
  testID,
  stillAnchor = 'center',
}: Props) {
  return (
    <View style={styles.root} testID={testID ?? `npc-still-${name}`}>
      <StillFrame
        source={still}
        intrinsicWidth={LOCATION_STILL_INTRINSIC.width}
        intrinsicHeight={LOCATION_STILL_INTRINSIC.height}
        anchor={stillAnchor}
      />
      <ScrimTop />
      <SeamDock fade={60} />
      <SceneHead kicker={kicker} name={name} onBack={onBack} />
      <Card style={styles.card}>
        <Text style={styles.flavor}>{flavor}</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.canvas,
  },
  card: {
    position: 'absolute',
    left: tokens.screenX,
    right: tokens.screenX,
    bottom: 12,
    zIndex: 30,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  flavor: {
    fontFamily: tokens.font800,
    fontSize: 15,
    lineHeight: 20,
    color: tokens.ink,
  },
});

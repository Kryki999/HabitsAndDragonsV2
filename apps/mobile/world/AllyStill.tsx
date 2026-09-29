import React, { useMemo } from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { useHabitsStore } from '@/habits/store';
import { AllyCard } from '@/ui/AllyCard';
import { SceneHead } from '@/ui/SceneHead';
import { ScrimTop, SeamDock } from '@/ui/Seam';
import { tokens } from '@/ui/tokens';

import StillFrame, { type CoverAnchor } from './StillFrame';
import { LOCATION_STILL_INTRINSIC } from './content';
import { allyNodesFromTrack, globalStreakDays, type AllyTrackDef } from './allyTracks';

type Props = {
  name: string;
  still: ImageSourcePropType;
  track: AllyTrackDef;
  onBack: () => void;
  testID?: string;
  stillAnchor?: CoverAnchor;
};

export default function AllyStill({ name, still, track, onBack, testID, stillAnchor = 'center' }: Props) {
  const activityByDate = useHabitsStore((s) => s.activityByDate);
  const today = new Date().toISOString().split('T')[0]!;
  const streak = globalStreakDays(activityByDate, today);
  const card = useMemo(() => allyNodesFromTrack(track, streak), [streak, track]);

  return (
    <View style={styles.root} testID={testID}>
      <StillFrame
        source={still}
        intrinsicWidth={LOCATION_STILL_INTRINSIC.width}
        intrinsicHeight={LOCATION_STILL_INTRINSIC.height}
        anchor={stillAnchor}
      />
      <ScrimTop />
      <SeamDock fade={60} />
      <SceneHead kicker={track.sceneKicker} name={track.sceneRoom} onBack={onBack} />
      <AllyCard
        name={name}
        raiseLabel={track.raiseLabel}
        raiseValue={card.raiseValue}
        raiseSticker={track.raiseSticker}
        nodes={card.nodes}
        fill={card.fill}
        testID={`ally-card-${name}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.canvas,
  },
});

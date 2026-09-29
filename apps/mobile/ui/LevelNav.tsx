import { StyleSheet, View } from 'react-native';

import { Glyph } from '@/ui/Glyph';
import { PressableLip } from '@/ui/PressableLip';
import { shadow, tokens } from '@/ui/tokens';

export type LevelFloor = {
  id: string;
  label: string;
  locked: boolean;
};

type Props = {
  floors: LevelFloor[];
  currentId: string;
  onSelect: (floor: LevelFloor) => void;
};

/** Arrows move one floor. A closed floor is a lock. The name lives in SceneHead. */
export function LevelNav({ floors, currentId, onSelect }: Props) {
  const index = Math.max(
    0,
    floors.findIndex((floor) => floor.id === currentId),
  );
  const up = index > 0 ? floors[index - 1] : undefined;
  const down = index < floors.length - 1 ? floors[index + 1] : undefined;

  return (
    <View accessibilityRole="tablist" testID="floor-lift" style={styles.pill}>
      {up ? <Step floor={up} direction="up" onSelect={onSelect} /> : null}
      <View style={styles.depth}>
        {floors.map((floor) => {
          const here = floor.id === currentId;
          const closed = floor.locked;
          return (
            <View
              key={floor.id}
              style={[styles.dot, here && styles.dotHere, closed && !here && styles.dotClosed]}
            />
          );
        })}
      </View>
      {down ? <Step floor={down} direction="down" onSelect={onSelect} /> : null}
    </View>
  );
}

function Step({
  floor,
  direction,
  onSelect,
}: {
  floor: LevelFloor;
  direction: 'up' | 'down';
  onSelect: (floor: LevelFloor) => void;
}) {
  const locked = floor.locked;
  return (
    <PressableLip
      testID={`floor-${floor.id}`}
      accessibilityLabel={locked ? `${floor.label}, later` : `Go to ${floor.label}`}
      onPress={() => onSelect(floor)}
      face={locked ? tokens.surface3 : tokens.brand}
      lip={locked ? shadow.cardLip : shadow.lipBrand}
      radius={22}
      style={styles.step}
    >
      <Glyph name={locked ? 'lock' : direction} size={locked ? 18 : 22} color={locked ? tokens.ink3 : tokens.onCanvas} />
    </PressableLip>
  );
}

const styles = StyleSheet.create({
  pill: {
    width: 56,
    padding: 6,
    borderRadius: tokens.rPill,
    backgroundColor: tokens.surface,
    alignItems: 'center',
    gap: 8,
    boxShadow: [shadow.lipSurface, shadow.dropOnArt],
  },
  step: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  depth: {
    alignItems: 'center',
    gap: 5,
    paddingVertical: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.surface3,
  },
  dotHere: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: tokens.gold,
    boxShadow: [{ offsetX: 0, offsetY: 0, blurRadius: 0, color: tokens.goldSoft, spreadDistance: 3 }],
  },
  dotClosed: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: tokens.ink3,
  },
});

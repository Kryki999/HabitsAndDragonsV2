import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

import { isFloorOpen, type InteriorFloorDef } from './interiors';

type Props = {
  floors: InteriorFloorDef[];
  currentId: InteriorFloorDef['id'];
  onSelect: (floor: InteriorFloorDef) => void;
};

/** Compact labeled elevator. Active floor is highlighted; locked stays visible. */
export default function FloorLift({ floors, currentId, onSelect }: Props) {
  return (
    <View accessibilityRole="tablist" style={styles.shaft} testID="floor-lift">
      {floors.map((floor) => {
        const active = floor.id === currentId;
        const locked = !isFloorOpen(floor);
        return (
          <Pressable
            key={floor.id}
            testID={`floor-${floor.id}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: active, disabled: locked }}
            accessibilityLabel={liftLabel(floor, active)}
            onPress={() => {
              if (active) return;
              impactAsync(locked ? ImpactFeedbackStyle.Light : ImpactFeedbackStyle.Medium);
              onSelect(floor);
            }}
            style={({ pressed }) => [
              styles.row,
              active && styles.rowActive,
              locked && styles.rowLocked,
              pressed && !active && styles.rowPressed,
            ]}
          >
            <View style={[styles.pip, active && styles.pipActive, locked && styles.pipLocked]} />
            <Text
              style={[styles.label, active && styles.labelActive, locked && styles.labelLocked]}
              numberOfLines={1}
            >
              {floor.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function liftLabel(floor: InteriorFloorDef, active: boolean): string {
  if (active) return `${floor.label}, current floor`;
  if (!isFloorOpen(floor)) return `${floor.label}, later`;
  return `Go to ${floor.label}`;
}

const styles = StyleSheet.create({
  shaft: {
    minWidth: 104,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.gold + '66',
    backgroundColor: 'rgba(13, 10, 20, 0.78)',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  rowActive: {
    backgroundColor: 'rgba(255, 200, 69, 0.18)',
  },
  rowLocked: {
    opacity: 0.72,
  },
  rowPressed: {
    opacity: 0.82,
  },
  pip: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  pipActive: {
    backgroundColor: Colors.dark.gold,
  },
  pipLocked: {
    backgroundColor: Colors.dark.textMuted,
  },
  label: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  labelActive: {
    color: Colors.dark.gold,
  },
  labelLocked: {
    color: Colors.dark.textMuted,
  },
});

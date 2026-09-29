import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useHabitsStore } from '@/habits/store';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { BottomSheet } from '@/ui/BottomSheet';
import { Glyph } from '@/ui/Glyph';
import { tokens } from '@/ui/tokens';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function TaskSortBottomSheet({ visible, onClose }: Props) {
  const castleQuestSortMode = useHabitsStore((s) => s.castleQuestSortMode);
  const setCastleQuestSortMode = useHabitsStore((s) => s.setCastleQuestSortMode);

  const pick = useCallback(
    (mode: 'default' | 'custom') => {
      impactAsync(ImpactFeedbackStyle.Light);
      setCastleQuestSortMode(mode);
      onClose();
    },
    [setCastleQuestSortMode, onClose],
  );

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.title}>Quest order</Text>
      <Text style={styles.subtitle}>Choose how your due quests appear on the Castle screen.</Text>
      <Option
        title="Default order"
        hint="Same order as when you added quests (stable roster)."
        active={castleQuestSortMode === 'default'}
        onPress={() => pick('default')}
      />
      <Option
        title="Custom order"
        hint="Grab the grip handles on each quest card to drag and reorder. Your layout is saved automatically."
        active={castleQuestSortMode === 'custom'}
        onPress={() => pick('custom')}
      />
    </BottomSheet>
  );
}

function Option({
  title,
  hint,
  active,
  onPress,
}: {
  title: string;
  hint: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.option, active && styles.optionOn]} accessibilityRole="button">
      <View style={styles.optionHead}>
        <Text style={styles.optionTitle}>{title}</Text>
        {active ? <Glyph name="check" size={22} color={tokens.brand} /> : null}
      </View>
      <Text style={styles.optionHint}>{hint}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: tokens.font900,
    fontSize: 22,
    color: tokens.ink,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: tokens.font700,
    fontSize: 14,
    color: tokens.ink2,
    marginBottom: 14,
  },
  option: {
    borderRadius: tokens.rMd,
    backgroundColor: tokens.surface2,
    padding: 16,
    marginBottom: 10,
  },
  optionOn: {
    backgroundColor: tokens.brandSoft,
    boxShadow: [{ offsetX: 0, offsetY: 3, blurRadius: 0, color: tokens.brandDeep }],
  },
  optionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  optionTitle: {
    fontFamily: tokens.font800,
    fontSize: 16,
    color: tokens.ink,
  },
  optionHint: {
    fontFamily: tokens.font700,
    fontSize: 14,
    lineHeight: 18,
    color: tokens.ink2,
  },
});

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import type { StatType, SuggestedHabit, TaskType } from '@/habits/types';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { suggestedHabits } from '@/mocks/suggestedHabits';
import { BottomSheet } from '@/ui/BottomSheet';
import { ButtonPrimary } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Glyph } from '@/ui/Glyph';
import { Sticker } from '@/ui/Sticker';
import { stickerForHabitIcon } from '@/ui/stickerRegistry';
import { tokens } from '@/ui/tokens';

const CHIP_W = 102;

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  initialScheduledDateKey?: string | null;
  onAddHabit: (habit: {
    name: string;
    description: string;
    stat: StatType;
    taskType: TaskType;
    icon: string;
    scheduledDate?: string | null;
  }) => void;
}

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0]!;
}

function dateKeyFromOffsetDays(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0]!;
}

type ModalView = 'choose' | 'suggested' | 'custom';

const ICON_OPTIONS = ['⚔️', '🛡️', '🏃', '📖', '🧠', '💪', '🎯', '🔥', '⭐', '🌟', '💎', '🏆'];

export default function AddHabitModal({ visible, onClose, onAddHabit, initialScheduledDateKey }: AddHabitModalProps) {
  const { width: screenWidth } = useWindowDimensions();
  const [view, setView] = useState<ModalView>('choose');
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType>('daily');
  const [selectedIcon, setSelectedIcon] = useState('⚔️');
  const [selectedScheduledDateKey, setSelectedScheduledDateKey] = useState<string | null>(initialScheduledDateKey ?? null);
  const [customNameInputH, setCustomNameInputH] = useState(56);
  const scheduleScrollRef = useRef<ScrollView>(null);

  const todayKey = useMemo(() => getTodayKey(), []);
  const scheduleChips = useMemo(() => {
    const maxDays = 60;
    return [
      { key: null as string | null, label: 'No date', sub: 'Due today' },
      ...Array.from({ length: maxDays }, (_, i) => {
        const offsetDays = i + 1;
        const key = dateKeyFromOffsetDays(offsetDays);
        const d = new Date();
        d.setDate(d.getDate() + offsetDays);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return { key, label };
      }),
    ];
  }, [todayKey]);

  useEffect(() => {
    if (visible) {
      setView('choose');
      setCustomName('');
      setCustomDesc('');
      setSelectedTaskType('daily');
      setSelectedIcon('⚔️');
      setCustomNameInputH(56);
      const today = getTodayKey();
      setSelectedScheduledDateKey(
        initialScheduledDateKey && initialScheduledDateKey === today ? null : (initialScheduledDateKey ?? null),
      );
    }
  }, [visible, initialScheduledDateKey]);

  useEffect(() => {
    if (view === 'choose' || !selectedScheduledDateKey) return;
    const idx = scheduleChips.findIndex((c) => c.key === selectedScheduledDateKey);
    if (idx <= 0) return;
    const x = Math.max(0, idx * CHIP_W - screenWidth / 2 + CHIP_W / 2);
    const t = setTimeout(() => {
      scheduleScrollRef.current?.scrollTo({ x, animated: false });
    }, 60);
    return () => clearTimeout(t);
  }, [view, selectedScheduledDateKey, scheduleChips, screenWidth]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSelectSuggested = useCallback(
    (habit: SuggestedHabit) => {
      impactAsync(ImpactFeedbackStyle.Heavy);
      onAddHabit({
        name: habit.name,
        description: habit.description,
        stat: habit.stat,
        taskType: habit.taskType,
        icon: habit.icon,
        scheduledDate: selectedScheduledDateKey ?? null,
      });
      handleClose();
    },
    [onAddHabit, handleClose, selectedScheduledDateKey],
  );

  const handleCreateCustom = useCallback(() => {
    if (!customName.trim()) return;
    impactAsync(ImpactFeedbackStyle.Heavy);
    onAddHabit({
      name: customName.trim(),
      description: customDesc.trim() || customName.trim(),
      stat: 'intelligence',
      taskType: selectedTaskType,
      icon: selectedIcon,
      scheduledDate: selectedScheduledDateKey ?? null,
    });
    handleClose();
  }, [customName, customDesc, selectedTaskType, selectedIcon, onAddHabit, handleClose, selectedScheduledDateKey]);

  const schedulePicker = (
    <View style={styles.scheduleWrap}>
      <Text style={styles.fieldLabel}>Plan date</Text>
      <ScrollView ref={scheduleScrollRef} horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.scheduleRow}>
          {scheduleChips.map((c) => {
            const isActive = c.key === selectedScheduledDateKey;
            return (
              <Pressable
                key={c.key ?? 'no_date'}
                onPress={() => setSelectedScheduledDateKey(c.key)}
                style={[styles.chip, isActive && styles.chipOn]}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextOn]}>{c.label}</Text>
                {'sub' in c && c.sub ? <Text style={styles.chipSub}>{c.sub}</Text> : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );

  const dailyHabits = suggestedHabits.filter((h) => h.taskType === 'daily');
  const quickQuests = suggestedHabits.filter((h) => h.taskType === 'one-off');

  return (
    <BottomSheet visible={visible} onClose={handleClose} fill={view !== 'choose'}>
      <View style={styles.sheetHead}>
        {view === 'choose' ? <View style={styles.headSpacer} /> : (
          <Pressable onPress={() => setView('choose')} accessibilityLabel="Back" hitSlop={8}>
            <Glyph name="back" size={22} color={tokens.brand} />
          </Pressable>
        )}
        <Text style={styles.title}>
          {view === 'choose' ? 'Forge a New Habit' : view === 'suggested' ? 'Suggested Quests' : 'Craft Your Quest'}
        </Text>
        <Pressable onPress={handleClose} accessibilityLabel="Close" testID="close-modal" hitSlop={8}>
          <Glyph name="close" size={22} color={tokens.ink2} />
        </Pressable>
      </View>
      {view === 'choose' ? (
        <View style={styles.choose}>
          <Text style={styles.sub}>Choose your path, adventurer</Text>
          <Pressable
            testID="choose-suggested"
            onPress={() => {
              impactAsync(ImpactFeedbackStyle.Heavy);
              setView('suggested');
            }}
          >
            <Card style={styles.path}>
              <Sticker name="scroll" size={32} />
              <View style={styles.pathCopy}>
                <Text style={styles.pathTitle}>Suggested Quests</Text>
                <Text style={styles.pathDesc}>Choose from curated habits with RPG wisdom</Text>
              </View>
              <Glyph name="next" size={20} color={tokens.ink3} />
            </Card>
          </Pressable>
          <Pressable
            testID="choose-custom"
            onPress={() => {
              impactAsync(ImpactFeedbackStyle.Heavy);
              setView('custom');
            }}
          >
            <Card style={styles.path}>
              <Sticker name="swords" size={32} />
              <View style={styles.pathCopy}>
                <Text style={styles.pathTitle}>Custom Quest</Text>
                <Text style={styles.pathDesc}>Craft your own quest</Text>
              </View>
              <Glyph name="next" size={20} color={tokens.ink3} />
            </Card>
          </Pressable>
        </View>
      ) : null}
      {view === 'suggested' ? (
        <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
          {schedulePicker}
          <Text style={styles.group}>Daily habits</Text>
          {dailyHabits.map((habit) => (
            <SuggestedRow key={habit.name} habit={habit} onSelect={handleSelectSuggested} />
          ))}
          <Text style={styles.group}>Quick quests</Text>
          {quickQuests.map((habit) => (
            <SuggestedRow key={habit.name} habit={habit} onSelect={handleSelectSuggested} />
          ))}
          <View style={styles.endPad} />
        </ScrollView>
      ) : null}
      {view === 'custom' ? (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {schedulePicker}
            <View style={styles.typeRow}>
              <Pressable
                style={[styles.typeBtn, selectedTaskType === 'daily' && styles.typeBtnOn]}
                onPress={() => setSelectedTaskType('daily')}
              >
                <Text style={[styles.typeText, selectedTaskType === 'daily' && styles.typeTextOn]}>Daily habit</Text>
              </Pressable>
              <Pressable
                style={[styles.typeBtn, selectedTaskType === 'one-off' && styles.typeBtnOn]}
                onPress={() => setSelectedTaskType('one-off')}
              >
                <Text style={[styles.typeText, selectedTaskType === 'one-off' && styles.typeTextOn]}>One-off quest</Text>
              </Pressable>
            </View>
            <Text style={styles.fieldLabel}>Quest name</Text>
            <TextInput
              style={[styles.input, { height: Math.max(56, customNameInputH) }]}
              placeholder="e.g. Drink 2L Water"
              placeholderTextColor={tokens.ink3}
              value={customName}
              onChangeText={setCustomName}
              multiline
              textAlignVertical="top"
              onContentSizeChange={(e) => {
                const next = Math.min(180, Math.max(56, Math.ceil(e.nativeEvent.contentSize.height) + 18));
                setCustomNameInputH(next);
              }}
              testID="custom-habit-name"
            />
            <Text style={styles.fieldLabel}>Icon</Text>
            <View style={styles.iconGrid}>
              {ICON_OPTIONS.map((icon) => {
                const on = selectedIcon === icon;
                return (
                  <Pressable key={icon} onPress={() => setSelectedIcon(icon)} style={[styles.iconOption, on && styles.iconOptionOn]}>
                    <Sticker name={stickerForHabitIcon(icon)} size={28} />
                  </Pressable>
                );
              })}
            </View>
            <ButtonPrimary
              label="Forge Quest"
              disabled={!customName.trim()}
              onPress={handleCreateCustom}
              testID="create-custom-habit"
            />
            <View style={styles.endPad} />
          </ScrollView>
        </KeyboardAvoidingView>
      ) : null}
    </BottomSheet>
  );
}

function SuggestedRow({ habit, onSelect }: { habit: SuggestedHabit; onSelect: (habit: SuggestedHabit) => void }) {
  return (
    <Pressable
      testID={`suggested-habit-${habit.name}`}
      onPress={() => onSelect(habit)}
      style={styles.suggestedPress}
    >
      <Card style={styles.suggested}>
        <View style={styles.well}>
          <Sticker name={stickerForHabitIcon(habit.icon)} size={28} />
        </View>
        <View style={styles.pathCopy}>
          <Text style={styles.pathTitle}>{habit.name}</Text>
          <Text style={styles.pathDesc} numberOfLines={2}>
            {habit.rpgDescription}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  headSpacer: { width: 22 },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: tokens.font900,
    fontSize: 20,
    color: tokens.ink,
  },
  sub: {
    fontFamily: tokens.font700,
    fontSize: 14,
    color: tokens.ink2,
    textAlign: 'center',
    marginBottom: 14,
  },
  choose: { gap: 10, paddingBottom: 8 },
  path: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  pathCopy: { flex: 1 },
  pathTitle: {
    fontFamily: tokens.font800,
    fontSize: 16,
    color: tokens.ink,
  },
  pathDesc: {
    fontFamily: tokens.font700,
    fontSize: 13,
    color: tokens.ink2,
    marginTop: 2,
  },
  group: {
    fontFamily: tokens.font800,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: tokens.ink2,
    marginTop: 8,
    marginBottom: 8,
  },
  suggestedPress: { marginBottom: 10 },
  suggested: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  well: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleWrap: { marginBottom: 12 },
  scheduleRow: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  fieldLabel: {
    fontFamily: tokens.font800,
    fontSize: 14,
    color: tokens.ink,
    marginBottom: 8,
  },
  chip: {
    minWidth: 92,
    borderRadius: tokens.rSm,
    backgroundColor: tokens.surface2,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  chipOn: { backgroundColor: tokens.brand },
  chipText: { fontFamily: tokens.font800, fontSize: 13, color: tokens.ink },
  chipTextOn: { color: tokens.onCanvas },
  chipSub: { fontFamily: tokens.font700, fontSize: 11, color: tokens.ink3, marginTop: 2 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  typeBtn: {
    flex: 1,
    height: 44,
    borderRadius: tokens.rSm,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBtnOn: { backgroundColor: tokens.brand },
  typeText: { fontFamily: tokens.font800, fontSize: 14, color: tokens.ink },
  typeTextOn: { color: tokens.onCanvas },
  input: {
    borderRadius: tokens.rSm,
    backgroundColor: tokens.surface2,
    color: tokens.ink,
    fontFamily: tokens.font700,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOptionOn: {
    backgroundColor: tokens.brandSoft,
    boxShadow: [{ offsetX: 0, offsetY: 3, blurRadius: 0, color: tokens.brand }],
  },
  endPad: { height: 28 },
});

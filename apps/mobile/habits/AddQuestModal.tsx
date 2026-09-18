import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

import { addDays, formatShortDate, todayKey } from './dates';
import { suggestedQuests, type SuggestedQuest } from './suggested';
import type { HabitDraft, TaskType } from './types';

const ICONS = ['💪', '💧', '🧘', '📖', '📝', '🌙', '📵', '🎯', '🚶', '🏋️', '🍲', '◇'];

type ViewMode = 'choose' | 'suggested' | 'custom';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (draft: HabitDraft) => boolean;
  initialScheduledDate?: string | null;
};

export default function AddQuestModal({
  visible,
  onClose,
  onAdd,
  initialScheduledDate,
}: Props) {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<ViewMode>('choose');
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('◇');
  const [taskType, setTaskType] = useState<TaskType>('daily');
  const [scheduled, setScheduled] = useState<string | null>(null);

  const today = todayKey();

  useEffect(() => {
    if (!visible) return;
    setView('choose');
    setName('');
    setIcon('◇');
    setTaskType('daily');
    setScheduled(
      initialScheduledDate && initialScheduledDate !== today ? initialScheduledDate : null,
    );
  }, [visible, initialScheduledDate, today]);

  const chips = useMemo(
    () => [
      { key: null as string | null, label: 'Dziś', sub: 'Bez daty' },
      ...Array.from({ length: 14 }, (_, i) => {
        const key = addDays(today, i + 1);
        return { key, label: formatShortDate(key), sub: undefined as string | undefined };
      }),
    ],
    [today],
  );

  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  const submit = (draft: HabitDraft) => {
    const ok = onAdd(draft);
    if (!ok) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    close();
  };

  const pickSuggested = (q: SuggestedQuest) => {
    submit({
      name: q.name,
      icon: q.icon,
      taskType: q.taskType,
      scheduledDate: scheduled,
    });
  };

  const schedulePicker = (
    <View style={styles.scheduleWrap}>
      <Text style={styles.fieldLabel}>Plan dnia</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chipRow}>
          {chips.map((c) => {
            const active = c.key === scheduled;
            return (
              <Pressable
                key={c.key ?? 'today'}
                onPress={() => setScheduled(c.key)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{c.label}</Text>
                {c.sub ? <Text style={styles.chipSub}>{c.sub}</Text> : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      {view === 'choose' ? (
        <View style={styles.overlay}>
          <Pressable style={styles.overlayBg} onPress={close} />
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={styles.handle} />
            <Pressable onPress={close} style={styles.closeSheet} accessibilityLabel="Zamknij">
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </Pressable>
            <Text style={styles.chooseTitle}>Nowy quest</Text>
            <Text style={styles.chooseSub}>Nawyk na co dzień albo jednorazowa wyprawa</Text>

            <Pressable
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                setView('suggested');
              }}
              testID="choose-suggested"
            >
              <View style={styles.pathCard}>
                <View style={styles.pathInner}>
                  <View style={[styles.pathIcon, { backgroundColor: `${colors.gold}18` }]}>
                    <Ionicons name="sparkles" size={22} color={colors.gold} />
                  </View>
                  <View style={styles.pathInfo}>
                    <Text style={styles.pathTitle}>Propozycje</Text>
                    <Text style={styles.pathDesc}>Gotowe nawyki IRL — tap i jedziesz</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </View>
                <View style={[styles.pathBottom, { backgroundColor: `${colors.gold}40` }]} />
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                setView('custom');
              }}
              testID="choose-custom"
            >
              <View style={styles.pathCard}>
                <View style={styles.pathInner}>
                  <View style={[styles.pathIcon, { backgroundColor: `${colors.purple}18` }]}>
                    <Ionicons name="create-outline" size={22} color={colors.purple} />
                  </View>
                  <View style={styles.pathInfo}>
                    <Text style={styles.pathTitle}>Własny quest</Text>
                    <Text style={styles.pathDesc}>Nazwa, ikona, daily albo jednorazowe</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </View>
                <View style={[styles.pathBottom, { backgroundColor: `${colors.purple}40` }]} />
              </View>
            </Pressable>
          </View>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={[styles.full, { paddingTop: Math.max(insets.top, 16) }]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable onPress={close} style={styles.closeFull} accessibilityLabel="Zamknij">
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </Pressable>
          <ScrollView
            style={styles.fullScroll}
            contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 28) }}
            keyboardShouldPersistTaps="handled"
          >
            <Pressable onPress={() => setView('choose')} style={styles.backBtn}>
              <Text style={styles.backText}>← Wróć</Text>
            </Pressable>
            {schedulePicker}

            {view === 'suggested' ? (
              <>
                <Text style={styles.sectionTitle}>Propozycje</Text>
                <Text style={styles.groupLabel}>Nawyki</Text>
                {suggestedQuests
                  .filter((q) => q.taskType === 'daily')
                  .map((q) => (
                    <SuggestedRow key={q.name} quest={q} onSelect={pickSuggested} />
                  ))}
                <Text style={styles.groupLabel}>Jednorazowe</Text>
                {suggestedQuests
                  .filter((q) => q.taskType === 'one-off')
                  .map((q) => (
                    <SuggestedRow key={q.name} quest={q} onSelect={pickSuggested} />
                  ))}
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Własny quest</Text>
                <View style={styles.typeSwitch}>
                  <Pressable
                    onPress={() => setTaskType('daily')}
                    style={[styles.typeBtn, taskType === 'daily' && styles.typeBtnActive]}
                  >
                    <Text style={[styles.typeText, taskType === 'daily' && styles.typeTextActive]}>
                      Nawyk
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setTaskType('one-off')}
                    style={[styles.typeBtn, taskType === 'one-off' && styles.typeBtnActive]}
                  >
                    <Text
                      style={[styles.typeText, taskType === 'one-off' && styles.typeTextActive]}
                    >
                      Jednorazowe
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.fieldLabel}>Nazwa</Text>
                <TextInput
                  style={styles.input}
                  placeholder="np. Wypij 2L wody"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  maxLength={80}
                  testID="custom-habit-name"
                />
                <Text style={styles.fieldLabel}>Ikona</Text>
                <View style={styles.iconGrid}>
                  {ICONS.map((item) => (
                    <Pressable
                      key={item}
                      onPress={() => setIcon(item)}
                      style={[
                        styles.iconOpt,
                        icon === item && {
                          borderColor: colors.gold,
                          backgroundColor: `${colors.gold}15`,
                        },
                      ]}
                    >
                      <Text style={styles.iconOptText}>{item}</Text>
                    </Pressable>
                  ))}
                </View>
                <Pressable
                  onPress={() =>
                    submit({ name, icon, taskType, scheduledDate: scheduled })
                  }
                  disabled={!name.trim()}
                  style={[styles.createBtn, !name.trim() && styles.createBtnOff]}
                  testID="create-custom-habit"
                >
                  <Text style={styles.createBtnText}>Dodaj quest</Text>
                </Pressable>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Modal>
  );
}

function SuggestedRow({
  quest,
  onSelect,
}: {
  quest: SuggestedQuest;
  onSelect: (q: SuggestedQuest) => void;
}) {
  return (
    <Pressable
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        onSelect(quest);
      }}
      testID={`suggested-habit-${quest.name}`}
    >
      <View style={styles.suggCard}>
        <View style={styles.suggInner}>
          <Text style={styles.suggIcon}>{quest.icon}</Text>
          <View style={styles.suggInfo}>
            <Text style={styles.suggName}>{quest.name}</Text>
            <Text style={styles.suggHint}>{quest.hint}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </View>
        <View style={[styles.pathBottom, { backgroundColor: `${colors.gold}30` }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.62)',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    alignSelf: 'center',
    marginBottom: 8,
  },
  closeSheet: {
    position: 'absolute',
    top: 10,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 2,
  },
  chooseTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
    marginTop: 8,
  },
  chooseSub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  pathCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pathInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  pathIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathInfo: {
    flex: 1,
    marginLeft: 12,
  },
  pathTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 3,
  },
  pathDesc: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  pathBottom: {
    height: 4,
  },
  full: {
    flex: 1,
    backgroundColor: colors.background,
  },
  closeFull: {
    position: 'absolute',
    top: 8,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fullScroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backBtn: {
    marginBottom: 8,
    paddingVertical: 4,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gold,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 14,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    marginTop: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  scheduleWrap: {
    marginBottom: 16,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    minWidth: 72,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  chipActive: {
    borderColor: colors.gold,
    backgroundColor: `${colors.gold}12`,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  chipTextActive: {
    color: colors.gold,
  },
  chipSub: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  suggCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  suggInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  suggIcon: {
    fontSize: 26,
    marginRight: 12,
  },
  suggInfo: {
    flex: 1,
  },
  suggName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  suggHint: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  typeSwitch: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  typeBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: 10,
    alignItems: 'center',
  },
  typeBtnActive: {
    borderColor: colors.gold,
    backgroundColor: `${colors.gold}15`,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
  },
  typeTextActive: {
    color: colors.gold,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    marginBottom: 16,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  iconOpt: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOptText: {
    fontSize: 20,
  },
  createBtn: {
    borderRadius: 14,
    backgroundColor: colors.gold,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createBtnOff: {
    opacity: 0.45,
  },
  createBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1228',
  },
});

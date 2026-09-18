import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

import ActivityHeatmap from './ActivityHeatmap';
import AddQuestModal from './AddQuestModal';
import CalendarModal from './CalendarModal';
import ChroniclesModal from './ChroniclesModal';
import { addDays, formatDayLabel, todayKey } from './dates';
import HabitCard from './HabitCard';
import {
  buildActivityByDate,
  isHabitCompleteOn,
  isHabitDueOnList,
  isHabitPlannedForDate,
  useHabitsStore,
} from './store';
import type { Habit, TaskType } from './types';

const EDIT_ICONS = ['💪', '💧', '🧘', '📖', '📝', '🌙', '📵', '🎯', '🚶', '🏋️', '🍲', '◇'];

export default function QuestsScreen() {
  const habits = useHabitsStore((s) => s.habits);
  const addHabit = useHabitsStore((s) => s.addHabit);
  const updateHabit = useHabitsStore((s) => s.updateHabit);
  const deleteHabit = useHabitsStore((s) => s.deleteHabit);
  const toggleComplete = useHabitsStore((s) => s.toggleComplete);

  const today = todayKey();
  const [focusDate, setFocusDate] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [chroniclesOpen, setChroniclesOpen] = useState(false);
  const [heatmapSeed, setHeatmapSeed] = useState<string | null>(null);

  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('◇');
  const [editType, setEditType] = useState<TaskType>('daily');

  const [rescheduleHabit, setRescheduleHabit] = useState<Habit | null>(null);

  const effectiveDay = focusDate ?? today;
  const isFocusDay = focusDate !== null;
  const isPast = isFocusDay && effectiveDay < today;
  const isFuture = isFocusDay && effectiveDay > today;

  const activity = useMemo(() => buildActivityByDate(habits), [habits]);

  const dueHabits = useMemo(() => {
    if (!isFocusDay) {
      return habits.filter((h) => isHabitDueOnList(h, today, today));
    }
    return habits.filter((h) => isHabitPlannedForDate(h, effectiveDay, today));
  }, [habits, isFocusDay, effectiveDay, today]);

  const dailies = dueHabits.filter((h) => h.taskType === 'daily');
  const sides = dueHabits.filter((h) => h.taskType === 'one-off');
  const doneCount = dueHabits.filter((h) => isHabitCompleteOn(h, effectiveDay)).length;
  const totalCount = dueHabits.length;

  const openEdit = (habit: Habit) => {
    setEditHabit(habit);
    setEditName(habit.name);
    setEditIcon(habit.icon);
    setEditType(habit.taskType);
  };

  const saveEdit = () => {
    if (!editHabit) return;
    updateHabit(editHabit.id, {
      name: editName,
      icon: editIcon,
      taskType: editType,
    });
    setEditHabit(null);
  };

  const renderSection = (title: string, items: Habit[], empty: string) => (
    <View style={styles.taskSection}>
      <View style={styles.taskSectionHeaderRow}>
        <View style={styles.taskSectionAccent} />
        <Text style={styles.taskSectionTitle}>{title}</Text>
        <View style={styles.taskSectionLine} />
      </View>
      {items.length === 0 ? (
        <Text style={styles.taskSectionEmpty}>{empty}</Text>
      ) : (
        items.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            viewDay={effectiveDay}
            readOnly={isPast || isFuture}
            onToggle={toggleComplete}
            onDelete={deleteHabit}
            onEdit={openEdit}
            onReschedule={setRescheduleHabit}
          />
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.kicker}>
            {isFocusDay ? formatDayLabel(effectiveDay) : 'Stolica · dziś'}
          </Text>
          <Text style={styles.title}>Questy</Text>
        </View>

        <View style={styles.commandHeader}>
          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setCalendarOpen(true);
            }}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
            accessibilityLabel="Kalendarz"
            testID="quests-calendar"
          >
            <Ionicons name="calendar-outline" size={20} color={colors.gold} />
          </Pressable>
          <Text style={styles.progressText} numberOfLines={2}>
            {totalCount > 0
              ? `${doneCount}/${totalCount} questów`
              : 'Brak questów na ten dzień'}
          </Text>
          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setHeatmapSeed(null);
              setChroniclesOpen(true);
            }}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
            accessibilityLabel="Kroniki"
            testID="quests-chronicles"
          >
            <Ionicons name="book-outline" size={20} color={colors.emerald} />
          </Pressable>
        </View>

        {isFocusDay ? (
          <Pressable
            onPress={() => setFocusDate(null)}
            style={styles.focusBanner}
            accessibilityLabel="Wróć do dziś"
          >
            <Text style={styles.focusBannerText}>
              {isPast ? 'Historia' : isFuture ? 'Plan' : 'Dziś'} · {formatDayLabel(effectiveDay)}
            </Text>
            <Text style={styles.focusBannerAction}>Wróć do dziś</Text>
          </Pressable>
        ) : null}

        <View style={styles.heatmapCard}>
          <ActivityHeatmap
            activityByDate={activity}
            compact
            embedded
            title="Łańcuch"
            selectedDate={isFocusDay ? effectiveDay : today}
            onSelectDate={(key) => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setHeatmapSeed(key);
              setChroniclesOpen(true);
            }}
            numDays={84}
          />
        </View>

        {totalCount === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>◇</Text>
            <Text style={styles.emptyTitle}>Brak questów</Text>
            <Text style={styles.emptyDesc}>
              Dodaj pierwszy nawyk IRL. Odhaczenie ma być satysfakcjonujące — mapa i Mentor
              poczekają.
            </Text>
          </View>
        ) : (
          <>
            {renderSection(
              'Nawyki',
              dailies,
              isFocusDay ? 'Brak nawyków tego dnia' : 'Brak nawyków na dziś',
            )}
            <View style={styles.sectionSpacer} />
            {renderSection(
              'Jednorazowe',
              sides,
              isFocusDay ? 'Brak jednorazowych tego dnia' : 'Brak jednorazowych na dziś',
            )}
          </>
        )}

        {isPast ? null : (
          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              setAddOpen(true);
            }}
            style={({ pressed }) => [styles.addCard, pressed && styles.addCardPressed]}
            testID="add-habit-inline-card"
            accessibilityLabel="Dodaj nowy quest"
          >
            <View style={styles.addRow}>
              <View style={styles.addIconWrap}>
                <Ionicons name="add" size={22} color={colors.gold} />
              </View>
              <Text style={styles.addTitle}>Dodaj quest</Text>
            </View>
          </Pressable>
        )}
        <View style={{ height: 28 }} />
      </ScrollView>

      <AddQuestModal
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(draft) => Boolean(addHabit(draft))}
        initialScheduledDate={isFuture ? effectiveDay : null}
      />

      <CalendarModal
        visible={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        focusDateKey={focusDate}
        onSelectDate={(key) => setFocusDate(key === today ? null : key)}
        activityByDate={activity}
      />

      <ChroniclesModal
        visible={chroniclesOpen}
        onClose={() => setChroniclesOpen(false)}
        habits={habits}
        activityByDate={activity}
        today={today}
        initialDate={heatmapSeed}
        onJumpToDate={(key) => setFocusDate(key === today ? null : key)}
      />

      <Modal
        visible={editHabit !== null}
        animationType="slide"
        onRequestClose={() => setEditHabit(null)}
      >
        <View style={styles.fullModal}>
          <View style={styles.fullModalHeader}>
            <Pressable onPress={() => setEditHabit(null)} style={styles.iconBtn}>
              <Text style={styles.closeGlyph}>×</Text>
            </Pressable>
            <Text style={styles.fullModalTitle}>Edytuj quest</Text>
            <View style={styles.iconBtn} />
          </View>
          <ScrollView contentContainerStyle={styles.fullModalBody}>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Nazwa"
              placeholderTextColor={colors.textMuted}
              style={styles.modalInput}
              maxLength={80}
            />
            <View style={styles.iconGrid}>
              {EDIT_ICONS.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setEditIcon(item)}
                  style={[
                    styles.iconOpt,
                    editIcon === item && {
                      borderColor: colors.gold,
                      backgroundColor: `${colors.gold}15`,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 20 }}>{item}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.quickRow}>
              <Pressable
                style={[styles.quickBtn, editType === 'daily' && styles.quickBtnOn]}
                onPress={() => setEditType('daily')}
              >
                <Text style={styles.quickText}>Nawyk</Text>
              </Pressable>
              <Pressable
                style={[styles.quickBtn, editType === 'one-off' && styles.quickBtnOn]}
                onPress={() => setEditType('one-off')}
              >
                <Text style={styles.quickText}>Jednorazowe</Text>
              </Pressable>
            </View>
            <Pressable onPress={saveEdit} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Zapisz</Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={rescheduleHabit !== null}
        animationType="slide"
        onRequestClose={() => setRescheduleHabit(null)}
      >
        <View style={styles.fullModal}>
          <View style={styles.fullModalHeader}>
            <Pressable onPress={() => setRescheduleHabit(null)} style={styles.iconBtn}>
              <Text style={styles.closeGlyph}>×</Text>
            </Pressable>
            <Text style={styles.fullModalTitle}>Przełóż</Text>
            <View style={styles.iconBtn} />
          </View>
          <View style={styles.fullModalBody}>
            <Text style={styles.modalSub}>{rescheduleHabit?.name}</Text>
            <View style={styles.quickRow}>
              <Pressable
                style={styles.quickBtn}
                onPress={() => {
                  if (!rescheduleHabit) return;
                  updateHabit(rescheduleHabit.id, { scheduledDate: addDays(today, 1) });
                  setRescheduleHabit(null);
                }}
              >
                <Text style={styles.quickText}>Jutro</Text>
              </Pressable>
              <Pressable
                style={styles.quickBtn}
                onPress={() => {
                  if (!rescheduleHabit) return;
                  updateHabit(rescheduleHabit.id, { scheduledDate: addDays(today, 7) });
                  setRescheduleHabit(null);
                }}
              >
                <Text style={styles.quickText}>Za tydzień</Text>
              </Pressable>
            </View>
            <Pressable
              style={styles.quickBtn}
              onPress={() => {
                if (!rescheduleHabit) return;
                updateHabit(rescheduleHabit.id, { scheduledDate: null });
                setRescheduleHabit(null);
              }}
            >
              <Text style={styles.quickText}>Dziś (bez daty)</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  commandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 12,
    gap: 8,
  },
  progressText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
  focusBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.gold}55`,
    backgroundColor: `${colors.gold}12`,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  focusBannerText: {
    flex: 1,
    color: colors.text,
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  focusBannerAction: {
    color: colors.gold,
    fontWeight: '800',
    fontSize: 12,
  },
  heatmapCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: `${colors.emerald}33`,
  },
  taskSection: {
    paddingHorizontal: 20,
    marginTop: 4,
  },
  sectionSpacer: {
    height: 18,
  },
  taskSectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  taskSectionAccent: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: `${colors.gold}cc`,
  },
  taskSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  taskSectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  taskSectionEmpty: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 40,
    color: colors.gold,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  addCard: {
    marginTop: 16,
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: `${colors.gold}66`,
    backgroundColor: `${colors.gold}14`,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.gold}20`,
    borderWidth: 1,
    borderColor: `${colors.gold}66`,
  },
  addCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  addTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 0.35,
  },
  fullModal: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fullModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fullModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  fullModalBody: {
    padding: 16,
    gap: 10,
  },
  modalSub: {
    fontSize: 13,
    color: colors.textMuted,
  },
  modalInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickBtnOn: {
    borderColor: `${colors.gold}aa`,
    backgroundColor: `${colors.gold}22`,
  },
  quickText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
  primaryBtn: {
    marginTop: 6,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: 'center',
    paddingVertical: 13,
  },
  primaryBtnText: {
    color: '#1a1228',
    fontWeight: '800',
    fontSize: 14,
  },
  closeGlyph: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
});

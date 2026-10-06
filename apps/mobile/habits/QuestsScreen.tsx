import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import DraggableFlatList, { ScaleDecorator, type RenderItemParams } from 'react-native-draggable-flatlist';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ActivityChroniclesModal from '@/components/ActivityChroniclesModal';
import AddHabitModal from '@/components/AddHabitModal';
import ExpeditionCalendarModal from '@/components/ExpeditionCalendarModal';
import TaskCardOverlay, { type CardMetrics } from '@/components/TaskCardOverlay';
import TaskSortBottomSheet from '@/components/TaskSortBottomSheet';
import { useHeroStore } from '@/hero/store';
import { useHabitsStore } from '@/habits/store';
import type { Habit, StatType, TaskType } from '@/habits/types';
import { orderDueHabitsForCastle } from '@/lib/castleQuestOrder';
import { displayRewardsForHabit } from '@/lib/economy';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { applyPlanningOrderForDate } from '@/lib/planningDayOrder';
import { TutorialHandoffSheet } from '@/onboarding/TutorialHandoffSheet';
import { useOnboardingStore } from '@/onboarding/store';
import { AccountBar, type AccountBarHandle } from '@/ui/AccountBar';
import { BottomSheet } from '@/ui/BottomSheet';
import { ButtonPrimary } from '@/ui/Button';
import { Glyph } from '@/ui/Glyph';
import { HabitRow, type RewardPoint } from '@/ui/HabitRow';
import { PanelInset } from '@/ui/PanelInset';
import { Progress } from '@/ui/Progress';
import { RewardFlyer, type FlyPoint } from '@/ui/RewardFlyer';
import { Seam, vignetteHeight } from '@/ui/Seam';
import { SectionHead } from '@/ui/SectionHead';
import { Sticker } from '@/ui/Sticker';
import { shadowOnCanvas, tokens } from '@/ui/tokens';

const VIGNETTE = require('../lookdev/assets/vignette-mage.jpg');

type Fly = { id: number; sticker: 'coin' | 'key'; from: FlyPoint; to: FlyPoint };

function todayKeyOf() {
  return new Date().toISOString().split('T')[0]!;
}

function shiftDateKey(key: string, days: number) {
  const dt = new Date(`${key}T00:00:00Z`);
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().split('T')[0]!;
}

function crownDayCount(activity: Record<string, { completions: number } | undefined>, today: string) {
  const has = (key: string) => (activity[key]?.completions ?? 0) > 0;
  let cursor = has(today) ? today : shiftDateKey(today, -1);
  let count = 0;
  while (has(cursor)) {
    count += 1;
    cursor = shiftDateKey(cursor, -1);
    if (count > 5000) break;
  }
  return count;
}

function crownBar(days: number) {
  if (days >= 20) return { value: 20, target: 20 };
  if (days >= 10) return { value: days, target: 20 };
  if (days >= 5) return { value: days, target: 10 };
  return { value: days, target: 5 };
}

function questsLeftLabel(left: number, focused: boolean) {
  const noun = left === 1 ? 'quest' : 'quests';
  return focused ? `${left} ${noun} left` : `${left} ${noun} left today`;
}

export default function QuestsScreen() {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const vH = vignetteHeight(windowHeight);

  const profileCreatedAtDateKey = useHabitsStore((s) => s.accountCreatedAtDateKey);
  const resetDailyIfNeeded = useHabitsStore((s) => s.resetDailyIfNeeded);
  const [modalVisible, setModalVisible] = useState(false);
  const [chroniclesOpen, setChroniclesOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [expeditionFocusDateKey, setExpeditionFocusDateKey] = useState<string | null>(null);

  const {
    habits,
    activityByDate,
    completedHabitNamesByDate,
    completeHabit,
    uncompleteHabit,
    addHabit,
    removeHabit,
    castleQuestSortMode,
    castleQuestOrderIds,
    setCastleQuestOrderIds,
    planningDayOrderByDate,
    updateHabit,
    setHabitScheduledDate,
  } = useHabitsStore();

  const [rescheduleHabit, setRescheduleHabit] = useState<Habit | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editIcon, setEditIcon] = useState('⚔️');
  const [editTaskType, setEditTaskType] = useState<Habit['taskType']>('daily');
  const [rescheduleDateInput, setRescheduleDateInput] = useState('');

  const tutorialCueSeen = useOnboardingStore((s) => s.tutorialCueSeen);
  const tutorialDone = useOnboardingStore((s) => s.tutorialDone);

  const barRef = useRef<AccountBarHandle>(null);
  const flyLayerRef = useRef<View>(null);
  const flySeq = useRef(0);
  const [flies, setFlies] = useState<Fly[]>([]);

  useEffect(() => {
    resetDailyIfNeeded();
  }, [resetDailyIfNeeded]);

  const handleAddHabit = useCallback(
    (habit: {
      name: string;
      description: string;
      stat: StatType;
      taskType: TaskType;
      icon: string;
      scheduledDate?: string | null;
    }) => {
      addHabit(habit);
    },
    [addHabit],
  );

  const launchFly = useCallback(async (sticker: 'coin' | 'key', source: RewardPoint) => {
    const layer = flyLayerRef.current;
    const bar = barRef.current;
    if (!layer || !bar) return;
    const origin = await new Promise<{ x: number; y: number } | null>((resolve) => {
      layer.measureInWindow((x, y, width, height) => {
        resolve(width === 0 && height === 0 ? null : { x, y });
      });
    });
    const target = sticker === 'coin' ? await bar.goldCenter() : await bar.keyCenter();
    if (!origin || !target) {
      if (sticker === 'coin') bar.popGold();
      else bar.popKey();
      return;
    }
    const id = ++flySeq.current;
    setFlies((list) => [
      ...list,
      {
        id,
        sticker,
        from: { x: source.x - origin.x, y: source.y - origin.y },
        to: { x: target.x - origin.x, y: target.y - origin.y },
      },
    ]);
  }, []);

  const handleComplete = useCallback(
    (id: string, meta?: { source: RewardPoint }) => {
      const before = useHabitsStore.getState().habits.find((h) => h.id === id);
      if (!before || before.completedToday || before.isFrozen) return;
      completeHabit(id);
      const today = todayKeyOf();
      const rewards = displayRewardsForHabit({
        habitId: id,
        difficulty: before.difficulty ?? 'medium',
        completedToday: true,
        completionsToday: useHabitsStore.getState().activityByDate[today]?.completions ?? 0,
        grantLog: useHeroStore.getState().habitGrantLogByDate ?? {},
        date: today,
      });
      if (!meta?.source) return;
      if (rewards.gold > 0) void launchFly('coin', meta.source);
      if (rewards.keys > 0) void launchFly('key', meta.source);
    },
    [completeHabit, launchFly],
  );

  const handleUncomplete = useCallback(
    (id: string) => {
      uncompleteHabit(id);
    },
    [uncompleteHabit],
  );

  const handleRemove = useCallback(
    (id: string) => {
      removeHabit(id);
    },
    [removeHabit],
  );

  const activeHabits = useMemo(() => habits.filter((h) => h.isActive), [habits]);
  const todayKey = useMemo(() => todayKeyOf(), []);
  const minAccountKey = profileCreatedAtDateKey ?? todayKey;
  const effectiveKey = expeditionFocusDateKey ?? todayKey;
  const isCalendarFocusDay = expeditionFocusDateKey !== null;
  const isPastCastleView =
    expeditionFocusDateKey !== null &&
    expeditionFocusDateKey < todayKey &&
    expeditionFocusDateKey >= minAccountKey;

  const handleExpeditionFocusChange = useCallback(
    (key: string) => {
      setExpeditionFocusDateKey(key === todayKey ? null : key);
    },
    [todayKey],
  );

  const dueHabits = useMemo(() => {
    if (!isCalendarFocusDay) {
      return activeHabits.filter((h) => !h.scheduledDate || h.scheduledDate <= todayKey);
    }
    return activeHabits.filter((h) => (h.scheduledDate ?? todayKey) === effectiveKey);
  }, [activeHabits, todayKey, isCalendarFocusDay, effectiveKey]);

  const orderedDueHabits = useMemo(() => {
    const base = orderDueHabitsForCastle(dueHabits, habits, castleQuestSortMode, castleQuestOrderIds);
    if (!isCalendarFocusDay) return base;
    return applyPlanningOrderForDate(effectiveKey, base, planningDayOrderByDate);
  }, [
    dueHabits,
    habits,
    castleQuestSortMode,
    castleQuestOrderIds,
    isCalendarFocusDay,
    effectiveKey,
    planningDayOrderByDate,
  ]);

  const completedNamesForFocusedDay = completedHabitNamesByDate?.[effectiveKey];

  const [dragQuestData, setDragQuestData] = useState<Habit[]>(orderedDueHabits);
  useEffect(() => {
    setDragQuestData(orderedDueHabits);
  }, [orderedDueHabits]);

  const completedCount = useMemo(() => {
    if (isCalendarFocusDay) {
      return dueHabits.filter((h) => completedNamesForFocusedDay?.includes(h.name)).length;
    }
    return dueHabits.filter((h) => h.completedToday).length;
  }, [dueHabits, isCalendarFocusDay, completedNamesForFocusedDay]);
  const totalCount = dueHabits.length;
  const left = Math.max(0, totalCount - completedCount);
  const isCustomQuestOrder = castleQuestSortMode === 'custom' && totalCount > 0 && !isPastCastleView;

  const crownDays = crownDayCount(activityByDate, todayKey);
  const crown = crownBar(crownDays);

  const onQuestDragEnd = useCallback(
    ({ data }: { data: Habit[] }) => {
      setDragQuestData(data);
      setCastleQuestOrderIds(data.map((h) => h.id));
      impactAsync(ImpactFeedbackStyle.Light);
    },
    [setCastleQuestOrderIds],
  );

  const openEdit = useCallback((hh: Habit) => {
    setEditHabit(hh);
    setEditName(hh.name);
    setEditDesc(hh.description ?? '');
    setEditIcon(hh.icon ?? '⚔️');
    setEditTaskType(hh.taskType);
    setEditOpen(true);
  }, []);

  const openReschedule = useCallback(
    (hh: Habit) => {
      setRescheduleHabit(hh);
      setRescheduleDateInput(hh.scheduledDate ?? todayKey);
      setRescheduleOpen(true);
    },
    [todayKey],
  );

  const arrive = useCallback((fly: Fly) => {
    if (fly.sticker === 'coin') barRef.current?.popGold();
    else barRef.current?.popKey();
    setFlies((list) => list.filter((item) => item.id !== fly.id));
  }, []);

  const listHeader = (
    <View>
      <View style={[styles.vignette, { height: vH }]}>
        <Image source={VIGNETTE} style={[styles.vignetteImage, { height: vH * 1.35, marginTop: -vH * 0.1 }]} />
        <Seam />
        <View style={[styles.accountWrap, { top: Math.max(insets.top, 8) + 2 }]}>
          <AccountBar ref={barRef} />
        </View>
      </View>
      <View style={styles.belowArt}>
        <PanelInset style={styles.crown}>
          <View style={styles.crownBadge}>
            <Sticker name="crown" size={44} />
          </View>
          <View style={styles.crownCol}>
            <Text style={styles.crownTitle}>Crown Day {crownDays}</Text>
            <Progress value={crown.value} max={crown.target} />
          </View>
        </PanelInset>
        <SectionHead
          label={questsLeftLabel(left, isCalendarFocusDay)}
          leading={
            <Pressable
              onPress={() => {
                impactAsync(ImpactFeedbackStyle.Light);
                setCalendarOpen(true);
              }}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Expedition calendar"
            >
              <Glyph name="calendar" size={26} color={tokens.onCanvas} />
            </Pressable>
          }
          trailing={
            <View style={styles.headActions}>
              <Pressable
                onPress={() => {
                  impactAsync(ImpactFeedbackStyle.Light);
                  setChroniclesOpen(true);
                }}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Chronicles"
              >
                <Sticker name="scroll" size={26} />
              </Pressable>
              {!isPastCastleView ? (
                <Pressable
                  onPress={() => {
                    impactAsync(ImpactFeedbackStyle.Light);
                    setSortMenuOpen(true);
                  }}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Sort quests"
                >
                  <Glyph name="filter" size={26} color={tokens.onCanvas} />
                </Pressable>
              ) : null}
              {!isPastCastleView ? (
                <Pressable
                  onPress={() => {
                    impactAsync(ImpactFeedbackStyle.Heavy);
                    setModalVisible(true);
                  }}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Add new quest"
                  testID="add-habit-inline-card"
                >
                  <Glyph name="add" size={26} color={tokens.onCanvas} />
                </Pressable>
              ) : null}
            </View>
          }
        />
        {totalCount === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No quests yet</Text>
            <Text style={styles.emptyDesc}>Tap add to create your first habit or side quest</Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  const renderQuest = (item: Habit, drag?: () => void, isActive?: boolean) => (
    <QuestRow
      key={item.id}
      habit={item}
      drag={isCustomQuestOrder ? drag : undefined}
      isActive={!!isActive}
      readOnly={isPastCastleView}
      historicalCompleted={!!completedNamesForFocusedDay?.includes(item.name)}
      onComplete={handleComplete}
      onUncomplete={handleUncomplete}
      onDelete={handleRemove}
      onEdit={openEdit}
      onReschedule={openReschedule}
    />
  );

  return (
    <View style={styles.screen}>
      {isCustomQuestOrder ? (
        <DraggableFlatList
          data={dragQuestData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, drag, isActive }: RenderItemParams<Habit>) => renderQuest(item, drag, isActive)}
          onDragEnd={onQuestDragEnd}
          activationDistance={10}
          containerStyle={styles.list}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={listHeader}
        />
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {listHeader}
          {orderedDueHabits.map((habit) => renderQuest(habit))}
        </ScrollView>
      )}

      <View ref={flyLayerRef} pointerEvents="none" style={StyleSheet.absoluteFill}>
        {flies.map((fly) => (
          <RewardFlyer
            key={fly.id}
            from={fly.from}
            to={fly.to}
            sticker={fly.sticker}
            onArrive={() => arrive(fly)}
          />
        ))}
      </View>

      <AddHabitModal visible={modalVisible} onClose={() => setModalVisible(false)} onAddHabit={handleAddHabit} />
      <ActivityChroniclesModal
        visible={chroniclesOpen}
        onClose={() => setChroniclesOpen(false)}
        activityByDate={activityByDate ?? {}}
        completedHabitNamesByDate={completedHabitNamesByDate ?? {}}
      />
      <ExpeditionCalendarModal
        visible={calendarOpen}
        onClose={() => {
          setCalendarOpen(false);
          setExpeditionFocusDateKey(null);
        }}
        expeditionFocusDateKey={expeditionFocusDateKey}
        onExpeditionFocusDateKeyChange={handleExpeditionFocusChange}
        profileCreatedAtDateKey={profileCreatedAtDateKey}
        userId={null}
      />
      <TaskSortBottomSheet visible={sortMenuOpen} onClose={() => setSortMenuOpen(false)} />
      <TutorialHandoffSheet visible={!tutorialCueSeen && !tutorialDone} />

      <BottomSheet visible={rescheduleOpen} onClose={() => setRescheduleOpen(false)}>
        <Text style={styles.sheetTitle}>Reschedule Quest</Text>
        <Text style={styles.sheetSub}>{rescheduleHabit?.name ?? ''}</Text>
        <View style={styles.quickRow}>
          <Pressable
            style={styles.quick}
            onPress={() => {
              if (!rescheduleHabit) return;
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              setHabitScheduledDate(rescheduleHabit.id, tomorrow.toISOString().split('T')[0]!);
              setRescheduleOpen(false);
            }}
          >
            <Text style={styles.quickText}>Tomorrow</Text>
          </Pressable>
          <Pressable
            style={styles.quick}
            onPress={() => {
              if (!rescheduleHabit) return;
              const nextWeek = new Date();
              nextWeek.setDate(nextWeek.getDate() + 7);
              setHabitScheduledDate(rescheduleHabit.id, nextWeek.toISOString().split('T')[0]!);
              setRescheduleOpen(false);
            }}
          >
            <Text style={styles.quickText}>Next Week</Text>
          </Pressable>
        </View>
        <TextInput
          value={rescheduleDateInput}
          onChangeText={setRescheduleDateInput}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={tokens.ink3}
          style={styles.input}
        />
        <ButtonPrimary
          label="Apply Date"
          onPress={() => {
            if (!rescheduleHabit) return;
            setHabitScheduledDate(rescheduleHabit.id, rescheduleDateInput.trim() || null);
            setRescheduleOpen(false);
          }}
        />
      </BottomSheet>

      <BottomSheet visible={editOpen} onClose={() => setEditOpen(false)}>
        <Text style={styles.sheetTitle}>Edit Quest</Text>
        <TextInput
          value={editName}
          onChangeText={setEditName}
          placeholder="Quest name"
          placeholderTextColor={tokens.ink3}
          style={styles.input}
        />
        <TextInput
          value={editDesc}
          onChangeText={setEditDesc}
          placeholder="Quest description"
          placeholderTextColor={tokens.ink3}
          multiline
          textAlignVertical="top"
          style={[styles.input, styles.inputMulti]}
        />
        <TextInput
          value={editIcon}
          onChangeText={setEditIcon}
          placeholder="Icon"
          placeholderTextColor={tokens.ink3}
          style={styles.input}
          maxLength={2}
        />
        <View style={styles.quickRow}>
          <Pressable
            style={[styles.quick, editTaskType === 'daily' && styles.quickOn]}
            onPress={() => setEditTaskType('daily')}
          >
            <Text style={[styles.quickText, editTaskType === 'daily' && styles.quickTextOn]}>Daily</Text>
          </Pressable>
          <Pressable
            style={[styles.quick, editTaskType === 'one-off' && styles.quickOn]}
            onPress={() => setEditTaskType('one-off')}
          >
            <Text style={[styles.quickText, editTaskType === 'one-off' && styles.quickTextOn]}>One-off</Text>
          </Pressable>
        </View>
        <ButtonPrimary
          label="Save Changes"
          onPress={() => {
            if (!editHabit || !editName.trim()) return;
            updateHabit(editHabit.id, {
              name: editName,
              description: editDesc,
              icon: editIcon.trim() || '⚔️',
              taskType: editTaskType,
            });
            setEditOpen(false);
          }}
        />
      </BottomSheet>
    </View>
  );
}

function QuestRow({
  habit,
  drag,
  isActive,
  readOnly,
  historicalCompleted,
  onComplete,
  onUncomplete,
  onDelete,
  onEdit,
  onReschedule,
}: {
  habit: Habit;
  drag?: () => void;
  isActive: boolean;
  readOnly: boolean;
  historicalCompleted: boolean;
  onComplete: (id: string, meta?: { source: RewardPoint }) => void;
  onUncomplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onReschedule: (habit: Habit) => void;
}) {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [cardMetrics, setCardMetrics] = useState<CardMetrics | null>(null);
  const cardRef = useRef<View>(null);
  const displayCompleted = readOnly ? historicalCompleted : habit.completedToday;
  const today = todayKeyOf();
  const completionsToday = useHabitsStore((s) => s.activityByDate[today]?.completions ?? 0);
  const grantLog = useHeroStore((s) => s.habitGrantLogByDate ?? {});
  const rewards = displayRewardsForHabit({
    habitId: habit.id,
    difficulty: habit.difficulty ?? 'medium',
    completedToday: habit.completedToday,
    completionsToday,
    grantLog,
    date: today,
  });

  const open = () => {
    if (readOnly || habit.isFrozen) return;
    impactAsync(ImpactFeedbackStyle.Light);
    cardRef.current?.measureInWindow((x, y, width, height) => {
      setCardMetrics({ x, y, width, height });
      setOverlayOpen(true);
    });
  };

  const body = (
    <View>
      <View ref={cardRef} collapsable={false} style={[styles.rowWrap, overlayOpen && styles.rowHidden, isActive && styles.rowDragging]}>
        <HabitRow
          title={habit.name}
          icon={habit.icon}
          gold={rewards.gold}
          done={displayCompleted}
          frozen={!!habit.isFrozen && !readOnly}
          readOnly={readOnly}
          onPress={open}
          onDrag={drag}
          onCheck={readOnly || habit.isFrozen ? undefined : (source) => onComplete(habit.id, { source })}
          testID={`habit-card-${habit.id}`}
        />
      </View>
      {overlayOpen ? (
        <TaskCardOverlay
          visible={overlayOpen}
          habit={habit}
          originMetrics={cardMetrics}
          onClose={() => setOverlayOpen(false)}
          onComplete={onComplete}
          onUncomplete={onUncomplete}
          onDelete={onDelete}
          onEdit={onEdit}
          onReschedule={onReschedule}
          rewardGold={rewards.gold}
          rewardXp={rewards.xp}
        />
      ) : null}
    </View>
  );

  if (drag) return <ScaleDecorator>{body}</ScaleDecorator>;
  return body;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.canvas,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 28,
  },
  vignette: {
    overflow: 'hidden',
    backgroundColor: tokens.canvas,
  },
  vignetteImage: {
    width: '100%',
  },
  accountWrap: {
    position: 'absolute',
    left: tokens.screenX,
    right: tokens.screenX,
    zIndex: 5,
  },
  belowArt: {
    marginTop: -58,
    paddingHorizontal: tokens.screenX,
    gap: 14,
    marginBottom: 10,
  },
  crown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingLeft: 12,
    paddingRight: 16,
  },
  crownBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: tokens.surface,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 14px rgba(40, 50, 140, 0.16)',
  },
  crownCol: {
    flex: 1,
    gap: 8,
  },
  crownTitle: {
    fontFamily: tokens.font900,
    fontSize: 19,
    lineHeight: 22,
    color: tokens.onCanvas,
    ...shadowOnCanvas,
  },
  headActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowWrap: {
    marginHorizontal: tokens.screenX,
    marginBottom: 10,
  },
  rowHidden: {
    opacity: 0,
  },
  rowDragging: {
    opacity: 0.95,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 6,
  },
  emptyTitle: {
    fontFamily: tokens.font900,
    fontSize: 20,
    color: tokens.onCanvas,
    ...shadowOnCanvas,
  },
  emptyDesc: {
    fontFamily: tokens.font700,
    fontSize: 16,
    color: tokens.onCanvas,
    textAlign: 'center',
    ...shadowOnCanvas,
  },
  sheetTitle: {
    fontFamily: tokens.font900,
    fontSize: 22,
    color: tokens.ink,
    marginBottom: 8,
  },
  sheetSub: {
    fontFamily: tokens.font700,
    fontSize: 14,
    color: tokens.ink2,
    marginBottom: 12,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  quick: {
    flex: 1,
    height: 44,
    borderRadius: tokens.rSm,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickOn: {
    backgroundColor: tokens.brandSoft,
  },
  quickText: {
    fontFamily: tokens.font800,
    fontSize: 14,
    color: tokens.ink,
  },
  quickTextOn: {
    color: tokens.brandDeep,
  },
  input: {
    borderRadius: tokens.rSm,
    backgroundColor: tokens.surface2,
    color: tokens.ink,
    fontFamily: tokens.font700,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  inputMulti: {
    minHeight: 90,
    maxHeight: 180,
  },
});

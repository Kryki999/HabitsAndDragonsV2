import { useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

import AddHabitBar from './AddHabitBar';
import HabitCard from './HabitCard';
import { isHabitCompleteToday, useHabitsStore } from './store';
import type { Habit } from './types';

export default function QuestsScreen() {
  const habits = useHabitsStore((s) => s.habits);
  const addHabit = useHabitsStore((s) => s.addHabit);
  const updateHabit = useHabitsStore((s) => s.updateHabit);
  const deleteHabit = useHabitsStore((s) => s.deleteHabit);
  const toggleComplete = useHabitsStore((s) => s.toggleComplete);

  const [editing, setEditing] = useState<Habit | null>(null);
  const [draft, setDraft] = useState('');

  const doneCount = habits.filter((h) => isHabitCompleteToday(h)).length;

  const handleAdd = (name: string) => Boolean(addHabit(name));

  const openActions = (habit: Habit) => {
    Alert.alert(habit.name, 'Quest na dziś.', [
      {
        text: 'Zmień nazwę',
        onPress: () => {
          setDraft(habit.name);
          setEditing(habit);
        },
      },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () => deleteHabit(habit.id),
      },
      { text: 'Anuluj', style: 'cancel' },
    ]);
  };

  const saveEdit = () => {
    if (!editing) return;
    updateHabit(editing.id, draft);
    setEditing(null);
    setDraft('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.kicker}>Stolica · dziś</Text>
          <Text style={styles.title}>Questy</Text>
          <Text style={styles.subtitle}>
            {habits.length === 0
              ? 'Czysta lista nawyków IRL. Świat, loot i Mentor poczekają.'
              : `${doneCount} / ${habits.length} odhaczonych`}
          </Text>
        </View>

        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              onToggle={toggleComplete}
              onLongPress={openActions}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Brak questów</Text>
              <Text style={styles.emptyBody}>
                Dodaj pierwszy nawyk na dole. Odhaczenie ma być satysfakcjonujące — reszta gry
                dogra się później.
              </Text>
            </View>
          }
        />

        <AddHabitBar onAdd={handleAdd} />
      </KeyboardAvoidingView>

      <Modal
        visible={editing !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditing(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setEditing(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Zmień nazwę</Text>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              style={styles.modalInput}
              autoFocus
              maxLength={80}
              onSubmitEditing={saveEdit}
            />
            <View style={styles.modalRow}>
              <Pressable onPress={() => setEditing(null)} style={styles.modalGhost}>
                <Text style={styles.modalGhostLabel}>Anuluj</Text>
              </Pressable>
              <Pressable onPress={saveEdit} style={styles.modalSave}>
                <Text style={styles.modalSaveLabel}>Zapisz</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
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
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexGrow: 1,
  },
  empty: {
    marginTop: 48,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyBody: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(13, 10, 20, 0.72)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  modalTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 12,
  },
  modalInput: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 15,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  modalGhost: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  modalGhostLabel: {
    color: colors.textSecondary,
    fontWeight: '700',
  },
  modalSave: {
    backgroundColor: colors.gold,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalSaveLabel: {
    color: '#1a1228',
    fontWeight: '800',
  },
});

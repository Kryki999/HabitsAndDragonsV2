import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/theme/colors';

type AddHabitBarProps = {
  onAdd: (name: string) => boolean;
};

export default function AddHabitBar({ onAdd }: AddHabitBarProps) {
  const [name, setName] = useState('');

  const submit = () => {
    const ok = onAdd(name);
    if (!ok) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setName('');
  };

  return (
    <View style={styles.row}>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nowy quest (nawyk IRL)"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        returnKeyType="done"
        onSubmitEditing={submit}
        maxLength={80}
        testID="habit-add-input"
      />
      <Pressable
        onPress={submit}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.75 }]}
        testID="habit-add-submit"
        accessibilityRole="button"
        accessibilityLabel="Dodaj quest"
      >
        <Ionicons name="add" size={22} color="#1a1228" />
        <Text style={styles.buttonLabel}>Dodaj</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: colors.tabBar,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  button: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  buttonLabel: {
    color: '#1a1228',
    fontWeight: '800',
    fontSize: 14,
  },
});

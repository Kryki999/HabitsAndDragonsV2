import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

export default function MentorScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <View style={styles.pad}>
        <Text style={styles.kicker}>Tawerna</Text>
        <Text style={styles.title}>Mentor</Text>
        <View style={styles.playground}>
          <Text style={styles.soon}>Wkrótce</Text>
          <Text style={styles.body}>
            Fullscreen coach w lore gry. Zero kluczy LLM w kliencie — AI tylko przez backend,
            kiedy przyjdzie czas.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  pad: { paddingHorizontal: 20, paddingTop: 8 },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
  playground: {
    marginTop: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: colors.surface,
    padding: 20,
    minHeight: 220,
    justifyContent: 'center',
  },
  soon: { color: colors.gold, fontWeight: '800', fontSize: 13, marginBottom: 8 },
  body: { color: colors.textSecondary, fontSize: 15, lineHeight: 22 },
});

import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Nie znaleziono', headerShown: true }} />
      <View style={styles.container}>
        <Text style={styles.title}>Ta ścieżka nie istnieje.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Wróć do Questów</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  link: {
    marginTop: 16,
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gold,
  },
});

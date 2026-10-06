import 'react-native-gesture-handler';
import { Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black, useFonts } from '@expo-google-fonts/nunito';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import OnboardingScreen from '@/onboarding/OnboardingScreen';
import { useOnboardingStore } from '@/onboarding/store';
import { usePersistReady } from '@/onboarding/usePersistReady';
import { tokens } from '@/ui/tokens';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: tokens.brand,
    background: tokens.canvas,
    card: tokens.canvasHi,
    text: tokens.ink,
    border: tokens.surface3,
    notification: tokens.gold,
  },
};

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const [loaded] = useFonts({
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });
  const persistReady = usePersistReady();
  const complete = useOnboardingStore((s) => s.complete);

  useEffect(() => {
    if (loaded && persistReady) SplashScreen.hideAsync().catch(() => undefined);
  }, [loaded, persistReady]);

  if (!loaded || !persistReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: tokens.canvas }}>
      <ThemeProvider value={navTheme}>
        <StatusBar style="light" />
        {complete ? (
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: tokens.canvas },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="onboarding" options={{ gestureEnabled: false, animation: 'fade' }} />
          </Stack>
        ) : (
          <OnboardingScreen />
        )}
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

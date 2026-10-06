import { Redirect } from 'expo-router';

import OnboardingScreen from '@/onboarding/OnboardingScreen';
import { useOnboardingStore } from '@/onboarding/store';

export default function OnboardingRoute() {
  const complete = useOnboardingStore((s) => s.complete);
  if (complete) return <Redirect href="/(tabs)" />;
  return <OnboardingScreen />;
}

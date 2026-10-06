import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { useOnboardingStore } from '@/onboarding/store';
import { BottomSheet } from '@/ui/BottomSheet';
import { ButtonPrimary } from '@/ui/Button';
import { NpcAsk } from '@/ui/NpcAsk';
import { tokens } from '@/ui/tokens';
import { useWorldStore } from '@/world/store';

type Props = {
  visible: boolean;
};

/** Soft Day 0 handoff. Does not force the fight — Gutterjack still uses first-clear chrome. */
export function TutorialHandoffSheet({ visible }: Props) {
  const router = useRouter();
  const markTutorialCueSeen = useOnboardingStore((s) => s.markTutorialCueSeen);
  const openHub = useWorldStore((s) => s.openHub);

  const close = () => markTutorialCueSeen();

  return (
    <BottomSheet visible={visible} onClose={close}>
      <NpcAsk question="The tavern cellar is a mess. Gutterjack. First fight's on the house." />
      <Text style={styles.hint}>World → Crownhaven → Tavern, then the cellar. Quests stay here.</Text>
      <View style={styles.gap} />
      <ButtonPrimary
        label="Take me there"
        block
        testID="onboarding-tutorial-go"
        onPress={() => {
          impactAsync(ImpactFeedbackStyle.Medium);
          markTutorialCueSeen();
          openHub();
          router.navigate('/world');
        }}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontFamily: tokens.font800,
    fontSize: 14,
    lineHeight: 18,
    color: tokens.ink2,
    marginTop: 12,
  },
  gap: {
    height: 16,
  },
});

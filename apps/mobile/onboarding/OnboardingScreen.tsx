import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHabitsStore } from '@/habits/store';
import { useHeroStore } from '@/hero/store';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { habitsFromAnswers, QUIZ, type QuizAnswers, type QuizTopic } from '@/onboarding/quiz';
import { useOnboardingStore } from '@/onboarding/store';
import { ButtonPrimary } from '@/ui/Button';
import { ChoiceRow } from '@/ui/ChoiceRow';
import { NpcAsk } from '@/ui/NpcAsk';
import { Seam } from '@/ui/Seam';
import { StepBar } from '@/ui/StepBar';
import { shadow, shadowOnCanvas, tokens } from '@/ui/tokens';
import { useWorldStore } from '@/world/store';

const BACKDROP = require('../lookdev/assets/still-crownhaven.jpg');

const QUIZ_TOPICS = QUIZ.map((question) => question.id);
const STEPS = ['arrival', 'name', ...QUIZ_TOPICS] as const;

const MIN_NAME = 2;
const MAX_NAME = 24;

function normalizeName(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').slice(0, MAX_NAME);
}

/**
 * Archetype C2. Arrival + required name + 6 one-tap lifestyle questions.
 * Habits are assigned from answers — never a canned pick-list.
 */
export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [nameDraft, setNameDraft] = useState(() => useHeroStore.getState().heroDisplayName ?? '');
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const finishing = useRef(false);
  const step = STEPS[index] ?? 'arrival';
  const total = STEPS.length;
  const stepNumber = index + 1;
  const name = normalizeName(nameDraft);
  const nameOk = name.length >= MIN_NAME;

  const quiz = useMemo(
    () => (QUIZ_TOPICS.includes(step as QuizTopic) ? QUIZ.find((q) => q.id === step) : undefined),
    [step],
  );

  const goBack = useCallback(() => {
    setIndex((n) => Math.max(0, n - 1));
  }, []);

  const onPickAnswer = useCallback(
    (topic: QuizTopic, answerId: string) => {
      if (finishing.current) return;
      impactAsync(ImpactFeedbackStyle.Light);
      const nextAnswers = { ...answers, [topic]: answerId };
      setAnswers(nextAnswers);
      const nextIndex = index + 1;
      if (nextIndex >= STEPS.length) {
        if (normalizeName(nameDraft).length < MIN_NAME) return;
        finishing.current = true;
        useHeroStore.getState().setHeroDisplayName(normalizeName(nameDraft));
        useHabitsStore.getState().seedStarterHabits(habitsFromAnswers(nextAnswers));
        useWorldStore.getState().openHub();
        useOnboardingStore.getState().completeOnboarding();
        useHeroStore.getState().skipMorningToday();
        return;
      }
      setIndex(nextIndex);
    },
    [answers, index, nameDraft],
  );

  const question =
    step === 'arrival'
      ? "You're new. That's fine. Everyone starts as nobody in this city."
      : step === 'name'
        ? 'So, stranger. What do they call you?'
        : (quiz?.question ?? '');

  const hint =
    step === 'arrival'
      ? 'Crownhaven market. You do not know how you got here.'
      : step === 'name'
        ? 'A name they can shout across the market.'
        : (quiz?.hint ?? '');

  return (
    <View style={styles.root} testID="onboarding-screen">
      <View style={styles.backdrop} pointerEvents="none">
        <Image source={BACKDROP} style={styles.art} />
        <View style={styles.tint} />
        <Seam height={210} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.top, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
          <StepBar step={stepNumber} total={total} onBack={index > 0 ? goBack : undefined} />
          <NpcAsk question={question} />
          <Text style={styles.hint}>{hint}</Text>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.body, { paddingBottom: Math.max(insets.bottom, 16) + 88 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 'name' ? (
            <View style={styles.nameWrap}>
              <TextInput
                value={nameDraft}
                onChangeText={setNameDraft}
                placeholder="Your name"
                placeholderTextColor={tokens.ink3}
                autoFocus
                autoCorrect={false}
                autoCapitalize="words"
                maxLength={MAX_NAME}
                returnKeyType="done"
                accessibilityLabel="Display name"
                testID="onboarding-name"
                style={styles.nameField}
              />
            </View>
          ) : null}

          {quiz
            ? quiz.answers.map((answer) => (
                <ChoiceRow
                  key={answer.id}
                  label={answer.label}
                  hint={answer.hint}
                  sticker={answer.sticker}
                  selected={answers[quiz.id] === answer.id}
                  testID={`onboarding-answer-${quiz.id}-${answer.id}`}
                  onPress={() => onPickAnswer(quiz.id, answer.id)}
                />
              ))
            : null}
        </ScrollView>

        {step === 'arrival' ? (
          <View style={[styles.foot, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <ButtonPrimary
              label="I'm nobody. Let's talk."
              block
              testID="onboarding-arrive"
              onPress={() => {
                impactAsync(ImpactFeedbackStyle.Medium);
                setIndex(1);
              }}
            />
          </View>
        ) : null}

        {step === 'name' ? (
          <View style={[styles.foot, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <ButtonPrimary
              label="That's my name"
              block
              disabled={!nameOk}
              testID="onboarding-name-continue"
              onPress={() => {
                if (!nameOk) return;
                impactAsync(ImpactFeedbackStyle.Medium);
                setIndex(2);
              }}
            />
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.canvas,
  },
  flex: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 340,
    overflow: 'hidden',
  },
  art: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(145, 162, 242, 0.5)',
  },
  top: {
    paddingHorizontal: tokens.screenX,
    gap: 16,
  },
  hint: {
    fontFamily: tokens.font800,
    fontSize: 14,
    lineHeight: 18,
    color: tokens.onCanvas,
    paddingLeft: 4,
    ...shadowOnCanvas,
  },
  body: {
    paddingHorizontal: tokens.screenX,
    paddingTop: 12,
    gap: 10,
  },
  nameWrap: {
    minHeight: 68,
    borderRadius: 22,
    backgroundColor: tokens.surface,
    justifyContent: 'center',
    boxShadow: [shadow.lipSurface, shadow.dropSm],
  },
  nameField: {
    minHeight: 68,
    paddingHorizontal: 18,
    fontFamily: tokens.font800,
    fontSize: 18,
    color: tokens.ink,
  },
  foot: {
    position: 'absolute',
    left: tokens.screenX,
    right: tokens.screenX,
    bottom: 0,
  },
});

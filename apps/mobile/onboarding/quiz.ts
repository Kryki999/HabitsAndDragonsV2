import type { AddHabitInput, HabitDifficulty, StatType } from '@/habits/types';
import type { StickerName } from '@/ui/stickerRegistry';

/** Lifestyle bands the stall keeper asks about. Not Mentor AI — 1-tap C2. */
export type QuizTopic = 'sleep' | 'move' | 'mood' | 'focus' | 'mornings' | 'people';

export type HabitTemplate = AddHabitInput & { templateId: string };

type Grant = { templateId: string; weight: number };

export type QuizAnswer = {
  id: string;
  label: string;
  hint: string;
  sticker: StickerName;
  grants: readonly Grant[];
};

export type QuizQuestion = {
  id: QuizTopic;
  question: string;
  hint: string;
  answers: readonly QuizAnswer[];
};

/**
 * Internal habit bank. Players never pick from this list —
 * answers only add weight, then we take the top 3–5.
 */
const TEMPLATES: Record<string, HabitTemplate> = {
  drink_water: {
    templateId: 'drink_water',
    name: 'Drink water',
    description: 'A glass when you wake',
    stat: 'strength' satisfies StatType,
    taskType: 'daily',
    icon: '💧',
    difficulty: 'easy' satisfies HabitDifficulty,
    hexAxes: ['vitality'],
  },
  short_walk: {
    templateId: 'short_walk',
    name: 'Short walk',
    description: '10 minutes outside',
    stat: 'agility',
    taskType: 'daily',
    icon: '🚶',
    difficulty: 'easy',
    hexAxes: ['agility', 'vitality'],
  },
  stretch: {
    templateId: 'stretch',
    name: 'Morning stretch',
    description: '5 minutes, nothing heroic',
    stat: 'agility',
    taskType: 'daily',
    icon: '🧘',
    difficulty: 'easy',
    hexAxes: ['agility'],
  },
  read_pages: {
    templateId: 'read_pages',
    name: 'Read 10 pages',
    description: 'Any book. Phone in another room',
    stat: 'intelligence',
    taskType: 'daily',
    icon: '📖',
    difficulty: 'easy',
    hexAxes: ['intelligence'],
  },
  breaths: {
    templateId: 'breaths',
    name: '3 deep breaths',
    description: 'One quiet minute',
    stat: 'strength',
    taskType: 'daily',
    icon: '🍃',
    difficulty: 'easy',
    hexAxes: ['spirit', 'discipline'],
  },
  journal: {
    templateId: 'journal',
    name: 'Write 3 lines',
    description: 'What happened. No essay',
    stat: 'intelligence',
    taskType: 'daily',
    icon: '📝',
    difficulty: 'easy',
    hexAxes: ['spirit'],
  },
  real_breakfast: {
    templateId: 'real_breakfast',
    name: 'Real breakfast',
    description: 'Sit down. Eat something real',
    stat: 'strength',
    taskType: 'daily',
    icon: '🍞',
    difficulty: 'medium',
    hexAxes: ['vitality'],
  },
  no_screens: {
    templateId: 'no_screens',
    name: 'Screens off',
    description: 'Phone away 20 min before bed',
    stat: 'intelligence',
    taskType: 'daily',
    icon: '📵',
    difficulty: 'medium',
    hexAxes: ['discipline', 'spirit'],
  },
  bedtime: {
    templateId: 'bedtime',
    name: 'Same bedtime',
    description: 'Lights out within 30 min of last night',
    stat: 'strength',
    taskType: 'daily',
    icon: '🌙',
    difficulty: 'medium',
    hexAxes: ['vitality', 'discipline'],
  },
  one_task: {
    templateId: 'one_task',
    name: 'One hard thing',
    description: 'Start the thing you have been avoiding',
    stat: 'intelligence',
    taskType: 'daily',
    icon: '🎯',
    difficulty: 'medium',
    hexAxes: ['intelligence', 'discipline'],
  },
  text_friend: {
    templateId: 'text_friend',
    name: 'Text a friend',
    description: 'One real message, not a like',
    stat: 'agility',
    taskType: 'daily',
    icon: '💬',
    difficulty: 'easy',
    hexAxes: ['spirit'],
  },
  wash_face: {
    templateId: 'wash_face',
    name: 'Wash my face',
    description: 'Morning reset, 2 minutes',
    stat: 'strength',
    taskType: 'daily',
    icon: '🧼',
    difficulty: 'easy',
    hexAxes: ['vitality'],
  },
};

/** If the quiz somehow yields fewer than 3, pad from this order. */
const FLOOR: readonly string[] = ['drink_water', 'breaths', 'short_walk'];

export const QUIZ: readonly QuizQuestion[] = [
  {
    id: 'sleep',
    question: 'How did you sleep, back in that other world?',
    hint: 'Be honest. Tiny is fine.',
    answers: [
      {
        id: 'rough',
        label: 'Rough nights',
        hint: 'I rarely feel rested',
        sticker: 'ice',
        grants: [
          { templateId: 'bedtime', weight: 3 },
          { templateId: 'no_screens', weight: 2 },
        ],
      },
      {
        id: 'mixed',
        label: 'Hit and miss',
        hint: 'Some nights, not most',
        sticker: 'sparkles',
        grants: [
          { templateId: 'no_screens', weight: 2 },
          { templateId: 'drink_water', weight: 1 },
        ],
      },
      {
        id: 'well',
        label: 'I rest well',
        hint: 'Sleep is not the problem',
        sticker: 'sunrise',
        grants: [{ templateId: 'drink_water', weight: 2 }],
      },
    ],
  },
  {
    id: 'move',
    question: 'And your body — does it still remember walking?',
    hint: 'Pick the closest. You can change quests later.',
    answers: [
      {
        id: 'still',
        label: 'I barely move',
        hint: 'Mostly sitting, mostly inside',
        sticker: 'leaf',
        grants: [{ templateId: 'short_walk', weight: 3 }],
      },
      {
        id: 'some',
        label: 'A little, not enough',
        hint: 'Walks, stairs, almost a habit',
        sticker: 'running',
        grants: [
          { templateId: 'short_walk', weight: 2 },
          { templateId: 'stretch', weight: 2 },
        ],
      },
      {
        id: 'train',
        label: 'I already train',
        hint: 'Keep it light here',
        sticker: 'biceps',
        grants: [{ templateId: 'stretch', weight: 2 }],
      },
    ],
  },
  {
    id: 'mood',
    question: 'When the day sits on you, what is it like?',
    hint: 'No wrong weather.',
    answers: [
      {
        id: 'heavy',
        label: 'Heavy',
        hint: 'It takes work to start',
        sticker: 'nazar',
        grants: [
          { templateId: 'breaths', weight: 3 },
          { templateId: 'journal', weight: 2 },
        ],
      },
      {
        id: 'mixed',
        label: 'Mixed',
        hint: 'Depends on the hour',
        sticker: 'heart',
        grants: [{ templateId: 'breaths', weight: 2 }],
      },
      {
        id: 'light',
        label: 'Light enough',
        hint: 'I am mostly alright',
        sticker: 'sparkles',
        grants: [{ templateId: 'breaths', weight: 1 }],
      },
    ],
  },
  {
    id: 'focus',
    question: 'Can you hold a thought, or does it run?',
    hint: 'We will start smaller than you think.',
    answers: [
      {
        id: 'scatter',
        label: 'All over',
        hint: 'Tabs, pings, half-starts',
        sticker: 'bolt',
        grants: [
          { templateId: 'read_pages', weight: 2 },
          { templateId: 'one_task', weight: 3 },
        ],
      },
      {
        id: 'some',
        label: 'Some days',
        hint: 'I can lock in, then I drift',
        sticker: 'brain',
        grants: [{ templateId: 'read_pages', weight: 2 }],
      },
      {
        id: 'sharp',
        label: 'Pretty sharp',
        hint: 'Focus is not the leak',
        sticker: 'bullseye',
        grants: [{ templateId: 'read_pages', weight: 1 }],
      },
    ],
  },
  {
    id: 'mornings',
    question: 'First hour of the day. What is it usually worth?',
    hint: 'The market opens whether you are ready or not.',
    answers: [
      {
        id: 'chaos',
        label: 'Chaos',
        hint: 'I wake up already behind',
        sticker: 'bolt',
        grants: [
          { templateId: 'wash_face', weight: 3 },
          { templateId: 'real_breakfast', weight: 2 },
        ],
      },
      {
        id: 'rush',
        label: 'Coffee and rush',
        hint: 'I leave the house half-ready',
        sticker: 'sunrise',
        grants: [
          { templateId: 'wash_face', weight: 2 },
          { templateId: 'drink_water', weight: 2 },
        ],
      },
      {
        id: 'rhythm',
        label: 'I have a rhythm',
        hint: 'Mornings already work',
        sticker: 'bread',
        grants: [{ templateId: 'drink_water', weight: 1 }],
      },
    ],
  },
  {
    id: 'people',
    question: 'Anyone waiting for you — back there, or here?',
    hint: 'A kingdom is people, even a small one.',
    answers: [
      {
        id: 'alone',
        label: 'I keep to myself',
        hint: 'Easier than reaching out',
        sticker: 'leaf',
        grants: [{ templateId: 'text_friend', weight: 3 }],
      },
      {
        id: 'few',
        label: 'A few. I forget them',
        hint: 'I mean to write. I do not',
        sticker: 'handshake',
        grants: [{ templateId: 'text_friend', weight: 2 }],
      },
      {
        id: 'full',
        label: "I'm surrounded",
        hint: 'People are not the gap',
        sticker: 'heart',
        grants: [],
      },
    ],
  },
];

export type QuizAnswers = Partial<Record<QuizTopic, string>>;

const TARGET_MIN = 3;
const TARGET_MAX = 5;

/**
 * Sum answer weights, keep unique templates, take the strongest 3–5.
 * Floor pads only when a path grants fewer than 3 (e.g. "I'm fine" on every axis).
 */
export function habitsFromAnswers(answers: QuizAnswers): HabitTemplate[] {
  const scores = new Map<string, number>();
  for (const question of QUIZ) {
    const picked = answers[question.id];
    const answer = question.answers.find((entry) => entry.id === picked);
    if (!answer) continue;
    for (const grant of answer.grants) {
      scores.set(grant.templateId, (scores.get(grant.templateId) ?? 0) + grant.weight);
    }
  }

  const ranked = [...scores.entries()]
    .filter(([, weight]) => weight > 0)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    })
    .map(([id]) => id);

  const picked: string[] = ranked.slice(0, TARGET_MAX);
  for (const id of FLOOR) {
    if (picked.length >= TARGET_MIN) break;
    if (!picked.includes(id)) picked.push(id);
  }

  return picked
    .map((id) => TEMPLATES[id])
    .filter((template): template is HabitTemplate => Boolean(template));
}

export function quizAnswerById(topic: QuizTopic, answerId: string | undefined): QuizAnswer | undefined {
  const question = QUIZ.find((entry) => entry.id === topic);
  if (!question || !answerId) return undefined;
  return question.answers.find((entry) => entry.id === answerId);
}

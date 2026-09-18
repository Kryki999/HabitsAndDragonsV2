import type { StatType } from '@/habits/types';

export type HeroQuestCategory = 'daily' | 'epic';

/** In-app tab routes for deep links from Hero quests */
export type HeroQuestRoute =
  | '/(tabs)/mentor'
  | '/(tabs)/index'
  | '/(tabs)/world'
  | '/(tabs)/social'
  | '/(tabs)/hero';

export type HeroQuestDefinition = {
  id: string;
  category: HeroQuestCategory;
  icon: string;
  title: string;
  description: string;
  /** Copy for the hint sheet */
  hint: string;
  rewardGold: number;
  rewardXP?: { stat: StatType; amount: number };
  /** Optional deep link — arrow button */
  navigateTo?: HeroQuestRoute;
  /**
   * Tiered milestone support (epic only).
   * tiers[tierIndex] is the current tier target.
   * After claiming, the UI advances tierIndex → tierIndex+1.
   */
  tiers?: number[];
  tierIndex?: number;
  tierProgress?: number;
};

/** Daily rituals — refresh each calendar day (claim reset). */
export const HERO_DAILY_RITUALS: HeroQuestDefinition[] = [
  {
    id: 'daily_visit_sage',
    category: 'daily',
    icon: '💬',
    title: 'Tell the Mentor how you feel',
    description: 'Talk to the Mentor — at least one message from you.',
    hint: 'Open the Mentor tab, tap the chat field, and send the first thought of the day.',
    rewardGold: 18,
    rewardXP: { stat: 'intelligence', amount: 6 },
    navigateTo: '/(tabs)/mentor',
  },
  {
    id: 'daily_complete_quest',
    category: 'daily',
    icon: '⚔️',
    title: 'Do a quest',
    description: 'Complete any habit or side quest due today.',
    hint: 'On Quests, check off at least one task. Progress counts from device midnight.',
    rewardGold: 28,
    rewardXP: { stat: 'strength', amount: 8 },
    navigateTo: '/(tabs)/index',
  },
  {
    id: 'daily_dungeon',
    category: 'daily',
    icon: '🏰',
    title: 'Fight in the dungeons',
    description: 'Take part in at least one dungeon run.',
    hint: 'World dungeons are not in this slice yet. This ritual stays for visual parity.',
    rewardGold: 35,
    rewardXP: { stat: 'strength', amount: 10 },
    navigateTo: '/(tabs)/world',
  },
  {
    id: 'daily_save_progress',
    category: 'daily',
    icon: '💾',
    title: 'Save your progress',
    description: 'Sync your progress to the cloud.',
    hint: 'Local save is on. Cloud sync is not in this slice — the ritual can still be claimed.',
    rewardGold: 12,
    rewardXP: { stat: 'intelligence', amount: 4 },
    navigateTo: '/(tabs)/world',
  },
  {
    id: 'daily_affirmations',
    category: 'daily',
    icon: '🌟',
    title: 'Repeat your affirmations',
    description: 'Tell the Mentor your daily affirmations.',
    hint: 'In Mentor, write today’s affirmations or ask for them to be generated.',
    rewardGold: 20,
    rewardXP: { stat: 'intelligence', amount: 7 },
    navigateTo: '/(tabs)/mentor',
  },
  {
    id: 'daily_gratitude',
    category: 'daily',
    icon: '😊',
    title: 'What made you glad today?',
    description: 'Share one positive thing from the day with the Mentor.',
    hint: 'Write the Mentor at least one thing you are grateful for or glad about.',
    rewardGold: 18,
    rewardXP: { stat: 'intelligence', amount: 6 },
    navigateTo: '/(tabs)/mentor',
  },
  {
    id: 'daily_mood',
    category: 'daily',
    icon: '🎭',
    title: 'Pick today’s mood',
    description: 'Rate your mood in the daily reflection.',
    hint: 'On Quests, open the calendar for today and fill in Daily Reflection.',
    rewardGold: 15,
    rewardXP: { stat: 'intelligence', amount: 5 },
    navigateTo: '/(tabs)/index',
  },
  {
    id: 'daily_refresh_epic',
    category: 'daily',
    icon: '🔄',
    title: 'Refresh an epic quest',
    description: 'Use an epic-quest reroll with the Mentor.',
    hint: 'Mentor epic rerolls are not in this slice yet. This ritual stays for visual parity.',
    rewardGold: 22,
    rewardXP: { stat: 'agility', amount: 7 },
    navigateTo: '/(tabs)/mentor',
  },
  {
    id: 'daily_plan_tomorrow',
    category: 'daily',
    icon: '📅',
    title: 'Add a quest for tomorrow',
    description: 'Plan at least one task for the next day.',
    hint: 'Open the calendar on Quests, pick tomorrow, and add a task.',
    rewardGold: 20,
    rewardXP: { stat: 'agility', amount: 6 },
    navigateTo: '/(tabs)/index',
  },
  {
    id: 'daily_spend_gold',
    category: 'daily',
    icon: '💰',
    title: 'Spend 100 gold',
    description: 'Make a purchase of at least 100 gold.',
    hint: 'Dungeon shop is not in this slice. Selling a backpack item counts as a market trade for now.',
    rewardGold: 30,
    rewardXP: { stat: 'agility', amount: 8 },
    navigateTo: '/(tabs)/hero',
  },
  {
    id: 'daily_notifications',
    category: 'daily',
    icon: '🔔',
    title: 'Turn on notifications',
    description: 'Make sure notifications are enabled.',
    hint: 'Check system settings and allow the app to send reminders.',
    rewardGold: 10,
    rewardXP: { stat: 'intelligence', amount: 3 },
  },
  {
    id: 'daily_check_history',
    category: 'daily',
    icon: '📜',
    title: 'Check a habit’s history',
    description: 'Review stats or history for one of your habits.',
    hint: 'In Chronicles or the calendar, inspect completion history. Patterns show up there.',
    rewardGold: 14,
    rewardXP: { stat: 'intelligence', amount: 5 },
    navigateTo: '/(tabs)/index',
  },
  {
    id: 'daily_reflection',
    category: 'daily',
    icon: '📝',
    title: 'Add a reflection',
    description: 'Write a short reflection for today or yesterday.',
    hint: 'Open the calendar, pick a day, and fill in Daily Reflection. One sentence is enough.',
    rewardGold: 22,
    rewardXP: { stat: 'intelligence', amount: 10 },
    navigateTo: '/(tabs)/index',
  },
];

/** Progressive milestones — layered (tiers). */
export const HERO_EPIC_MILESTONES: HeroQuestDefinition[] = [
  {
    id: 'epic_collect_items',
    category: 'epic',
    icon: '🎒',
    title: 'Obtain 1 item',
    description: 'Get an item from a dungeon and add it to your backpack.',
    hint: 'Demo stand-in items are already in the backpack on Hero. Dungeon drops come later.',
    rewardGold: 60,
    rewardXP: { stat: 'agility', amount: 18 },
    navigateTo: '/(tabs)/hero',
    tiers: [1, 2, 4, 8, 16],
    tierIndex: 0,
    tierProgress: 0,
  },
  {
    id: 'epic_castle_level',
    category: 'epic',
    icon: '🏯',
    title: 'Evolve your home to level 2',
    description: 'Grow your stronghold to the next level.',
    hint: 'Earn XP by completing habits. Home tier follows player level — still a visual demo.',
    rewardGold: 100,
    rewardXP: { stat: 'strength', amount: 25 },
    navigateTo: '/(tabs)/index',
    tiers: [2, 4, 8, 16, 32],
    tierIndex: 0,
    tierProgress: 1,
  },
  {
    id: 'epic_defeat_bosses',
    category: 'epic',
    icon: '👹',
    title: 'Defeat 1 unique boss',
    description: 'Face and defeat unique dungeon bosses.',
    hint: 'World dungeons are not in this slice yet. Progress will show here later.',
    rewardGold: 80,
    rewardXP: { stat: 'strength', amount: 22 },
    navigateTo: '/(tabs)/world',
    tiers: [1, 3, 7, 15, 30],
    tierIndex: 0,
    tierProgress: 0,
  },
  {
    id: 'epic_add_friend',
    category: 'epic',
    icon: '👥',
    title: 'Add 1 friend',
    description: 'Connect with other players in the Realm.',
    hint: 'Social is still a stub. Search and invites come later.',
    rewardGold: 70,
    rewardXP: { stat: 'intelligence', amount: 20 },
    navigateTo: '/(tabs)/social',
    tiers: [1, 3, 7, 15, 30],
    tierIndex: 0,
    tierProgress: 0,
  },
  {
    id: 'epic_rare_item',
    category: 'epic',
    icon: '💎',
    title: 'Obtain a rare item',
    description: 'Get an item of Rare rarity or higher.',
    hint: 'Rare drops come from later dungeon tiers. Collect keys and fight when World ships.',
    rewardGold: 120,
    rewardXP: { stat: 'agility', amount: 30 },
    navigateTo: '/(tabs)/world',
    tiers: [1, 2, 4, 8, 16],
    tierIndex: 0,
    tierProgress: 0,
  },
];

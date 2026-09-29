import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { HeroHexStats } from '@/constants/heroHexStats';
import type { LootRarity } from '@/types/dungeonLoot';
import type { StickerName } from '@/ui/stickerRegistry';

export const MY_FRIEND_CODE = 'HD-W4ND';
export const PLACEHOLDER_HOUSE = 'Barn';

export type SocialLoadout = {
  name: string;
  rarity: LootRarity;
  sticker: StickerName;
};

export type ValleyHero = {
  id: string;
  code: string;
  name: string;
  level: number;
  title: string;
  house: string;
  daysInRealm: number;
  emote: string | null;
  emoteSticker: StickerName | null;
  hueRotate: number;
  outfit: SocialLoadout | null;
  relic: SocialLoadout | null;
  hexStats: HeroHexStats;
};

export const VALLEY_HEROES: ValleyHero[] = [
  {
    id: 'moth',
    code: 'HD-M0TH',
    name: 'Moth',
    level: 8,
    title: 'Barn',
    house: PLACEHOLDER_HOUSE,
    daysInRealm: 40,
    emote: 'Sparkle',
    emoteSticker: 'sparkles',
    hueRotate: 42,
    outfit: { name: 'Night Coat', rarity: 'rare', sticker: 'coat' },
    relic: { name: 'Nazar', rarity: 'epic', sticker: 'nazar' },
    hexStats: { strength: 70, agility: 22, intelligence: 40, vitality: 55, spirit: 82, discipline: 48 },
  },
  {
    id: 'copper',
    code: 'HD-C0PP',
    name: 'Copper',
    level: 5,
    title: 'Wayfarer',
    house: PLACEHOLDER_HOUSE,
    daysInRealm: 21,
    emote: 'Salute',
    emoteSticker: 'handshake',
    hueRotate: 188,
    outfit: { name: 'Forge Coat', rarity: 'epic', sticker: 'coat' },
    relic: { name: 'Ember Charm', rarity: 'uncommon', sticker: 'bolt' },
    hexStats: { strength: 62, agility: 18, intelligence: 24, vitality: 48, spirit: 30, discipline: 41 },
  },
  {
    id: 'wren',
    code: 'HD-WR3N',
    name: 'Wren',
    level: 6,
    title: 'Windwalker',
    house: PLACEHOLDER_HOUSE,
    daysInRealm: 28,
    emote: 'Sparkle',
    emoteSticker: 'sparkles',
    hueRotate: 300,
    outfit: { name: 'Trail Cloak', rarity: 'uncommon', sticker: 'coat' },
    relic: null,
    hexStats: { strength: 22, agility: 74, intelligence: 36, vitality: 40, spirit: 58, discipline: 33 },
  },
  {
    id: 'salt',
    code: 'HD-S4LT',
    name: 'Salt',
    level: 3,
    title: 'Wayfarer',
    house: PLACEHOLDER_HOUSE,
    daysInRealm: 9,
    emote: null,
    emoteSticker: null,
    hueRotate: 88,
    outfit: { name: 'Salt Helm', rarity: 'common', sticker: 'helmet' },
    relic: { name: 'Ice Charm', rarity: 'rare', sticker: 'ice' },
    hexStats: { strength: 28, agility: 16, intelligence: 20, vitality: 61, spirit: 34, discipline: 25 },
  },
  {
    id: 'brin',
    code: 'HD-BR1N',
    name: 'Brin',
    level: 7,
    title: 'Lore Novice',
    house: PLACEHOLDER_HOUSE,
    daysInRealm: 33,
    emote: 'Sparkle',
    emoteSticker: 'sparkles',
    hueRotate: 230,
    outfit: { name: 'Night Coat', rarity: 'rare', sticker: 'coat' },
    relic: { name: 'Nazar', rarity: 'epic', sticker: 'nazar' },
    hexStats: { strength: 18, agility: 26, intelligence: 71, vitality: 32, spirit: 44, discipline: 66 },
  },
];

export type InviteResult = 'ok' | 'unknown' | 'self' | 'already' | 'empty';

type SocialState = {
  myCode: string;
  myEmote: string | null;
  myEmoteSticker: StickerName | null;
  circleIds: string[];
  pendingInbound: string[];
  pendingOutbound: string[];
};

type SocialActions = {
  sendInvite: (rawCode: string) => InviteResult;
};

function normalizeCode(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

export function valleyHeroById(id: string): ValleyHero | undefined {
  return VALLEY_HEROES.find((h) => h.id === id);
}

export function valleyHeroByCode(raw: string): ValleyHero | undefined {
  const code = normalizeCode(raw);
  if (!code) return undefined;
  return VALLEY_HEROES.find((h) => normalizeCode(h.code) === code);
}

type SocialStore = SocialState & SocialActions;

export const useSocialStore = create<SocialStore>()(
  persist(
    (set, get) => ({
      myCode: MY_FRIEND_CODE,
      myEmote: 'Salute',
      myEmoteSticker: 'handshake',
      circleIds: [],
      pendingInbound: [],
      pendingOutbound: [],

      sendInvite: (rawCode) => {
        const code = normalizeCode(rawCode);
        if (!code) return 'empty';
        if (normalizeCode(get().myCode) === code) return 'self';
        const hero = valleyHeroByCode(code);
        if (!hero) return 'unknown';
        if (get().circleIds.includes(hero.id)) return 'already';
        set((state) => ({
          circleIds: [...state.circleIds, hero.id],
          pendingOutbound: state.pendingOutbound.filter((id) => id !== hero.id),
        }));
        return 'ok';
      },
    }),
    {
      name: 'hnd-social-local',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        myCode: state.myCode,
        myEmote: state.myEmote,
        myEmoteSticker: state.myEmoteSticker,
        circleIds: state.circleIds,
        pendingInbound: state.pendingInbound,
        pendingOutbound: state.pendingOutbound,
      }),
    },
  ),
);

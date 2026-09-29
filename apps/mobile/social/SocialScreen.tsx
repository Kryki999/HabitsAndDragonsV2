import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TITLE_DEFINITIONS } from '@/constants/titles';
import { useHabitsStore } from '@/habits/store';
import { useHeroStore } from '@/hero/store';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { resolveLootItemById } from '@/lib/itemCatalog';
import { HousePeek, type HousePeekSubject } from '@/social/HousePeek';
import {
  PLACEHOLDER_HOUSE,
  VALLEY_HEROES,
  type SocialLoadout,
  type ValleyHero,
  useSocialStore,
  valleyHeroById,
} from '@/social/store';
import { AccountBar } from '@/ui/AccountBar';
import { Avatar } from '@/ui/Avatar';
import { BottomSheet } from '@/ui/BottomSheet';
import { ButtonPrimary, ButtonSoft } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { IconButton } from '@/ui/IconButton';
import { ItemTile, stickerForLootIcon } from '@/ui/ItemTile';
import { Portrait } from '@/ui/Portrait';
import { SectionHead } from '@/ui/SectionHead';
import { Slot } from '@/ui/Slot';
import { Sticker } from '@/ui/Sticker';
import { tokens } from '@/ui/tokens';

function daysSince(dateString: string): number {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 0;
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)));
}

function loadoutOf(itemId: string | null): SocialLoadout | null {
  if (!itemId) return null;
  const entry = resolveLootItemById(itemId);
  if (!entry) return null;
  return { name: entry.name, rarity: entry.rarity, sticker: stickerForLootIcon(entry.icon) };
}

function LoadTile({
  filled,
  size,
  ghost,
}: {
  filled: SocialLoadout | null;
  size: number;
  ghost: 'coat' | 'nazar';
}) {
  if (filled) {
    return <ItemTile rarity={filled.rarity} sticker={filled.sticker} size={size} radius={12} />;
  }
  return <Slot size={size} radius={12} ghost={ghost} />;
}

export default function SocialScreen() {
  const router = useRouter();
  const playerLevel = useHeroStore((s) => s.playerLevel);
  const hexStats = useHeroStore((s) => s.hexStats);
  const createdAt = useHeroStore((s) => s.createdAt);
  const heroDisplayName = useHeroStore((s) => s.heroDisplayName);
  const unlockedTitleIds = useHeroStore((s) => s.unlockedTitleIds);
  const equippedOutfitId = useHeroStore((s) => s.equippedOutfitId);
  const equippedRelicId = useHeroStore((s) => s.equippedRelicId);

  const accountCreatedAtDateKey = useHabitsStore((s) => s.accountCreatedAtDateKey);
  const activityByDate = useHabitsStore((s) => s.activityByDate);

  const myCode = useSocialStore((s) => s.myCode);
  const myEmote = useSocialStore((s) => s.myEmote);
  const myEmoteSticker = useSocialStore((s) => s.myEmoteSticker);
  const circleIds = useSocialStore((s) => s.circleIds);
  const sendInvite = useSocialStore((s) => s.sendInvite);

  const [codeSheet, setCodeSheet] = useState<'yours' | 'enter' | null>(null);
  const [enterValue, setEnterValue] = useState('');
  const [enterError, setEnterError] = useState<string | null>(null);
  const [peek, setPeek] = useState<HousePeekSubject | null>(null);

  const name = (heroDisplayName?.trim() || 'Wayfarer').slice(0, 48);
  const unlocked = useMemo(() => new Set(unlockedTitleIds), [unlockedTitleIds]);
  const titles = useMemo(
    () => TITLE_DEFINITIONS.filter((d) => unlocked.has(d.id)).map((d) => d.name),
    [unlocked],
  );
  const title = titles[0] ?? 'Wayfarer';
  const outfit = loadoutOf(equippedOutfitId);
  const relic = loadoutOf(equippedRelicId);

  const daysInRealm = useMemo(() => {
    const keys = Object.keys(activityByDate).filter(Boolean).sort();
    const join = createdAt || accountCreatedAtDateKey || keys[0];
    if (!join) return 0;
    return daysSince(join);
  }, [createdAt, accountCreatedAtDateKey, activityByDate]);

  const circle = useMemo(
    () => circleIds.map(valleyHeroById).filter((h): h is ValleyHero => !!h),
    [circleIds],
  );

  const selfPeek = useCallback((): HousePeekSubject => {
    return {
      kicker: 'How they see you',
      name,
      level: playerLevel,
      title,
      house: PLACEHOLDER_HOUSE,
      daysInRealm,
      emote: myEmote,
      emoteSticker: myEmoteSticker,
      titles,
      outfit,
      relic,
      hexStats,
    };
  }, [name, playerLevel, title, daysInRealm, myEmote, myEmoteSticker, titles, outfit, relic, hexStats]);

  const heroPeek = useCallback((hero: ValleyHero, kicker: string): HousePeekSubject => {
    return {
      kicker,
      name: hero.name,
      level: hero.level,
      title: hero.title,
      house: hero.house,
      daysInRealm: hero.daysInRealm,
      emote: hero.emote,
      emoteSticker: hero.emoteSticker,
      titles: hero.title ? [hero.title] : [],
      outfit: hero.outfit,
      relic: hero.relic,
      hexStats: hero.hexStats,
    };
  }, []);

  const onCopyMyCode = useCallback(async () => {
    await Clipboard.setStringAsync(myCode);
    impactAsync(ImpactFeedbackStyle.Light);
  }, [myCode]);

  const closeSheets = useCallback(() => {
    setCodeSheet(null);
    setEnterError(null);
    setEnterValue('');
  }, []);

  const onSendInvite = useCallback(() => {
    const result = sendInvite(enterValue);
    if (result === 'ok') {
      impactAsync(ImpactFeedbackStyle.Medium);
      closeSheets();
      return;
    }
    if (result === 'unknown') setEnterError('No hero uses that code.');
    else if (result === 'self') setEnterError("That's your code.");
    else if (result === 'already') setEnterError('Already in your circle.');
    else setEnterError('Enter their code.');
  }, [enterValue, sendInvite, closeSheets]);

  return (
    <LinearGradient
      colors={[tokens.canvasHi, tokens.canvas]}
      locations={[0, 0.28]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.stack}
          showsVerticalScrollIndicator={false}
        >
          <AccountBar />

          <Card style={styles.call}>
            <Pressable
              onPress={() => setPeek(selfPeek())}
              accessibilityRole="button"
              accessibilityLabel={`${name}. Level ${playerLevel}. Tap to peek`}
            >
              <View style={styles.callTop}>
                <Portrait />
                <View style={styles.callWho}>
                  <Text style={styles.callCaption}>How they see you</Text>
                  <Text style={styles.callName} numberOfLines={1}>
                    {name}
                  </Text>
                  <Text style={styles.callMeta}>
                    Level {playerLevel} · {title} · {PLACEHOLDER_HOUSE} · tap to peek
                  </Text>
                </View>
              </View>
              <Text style={[styles.caption, styles.equippedLabel]}>Equipped</Text>
              <View style={styles.load}>
                <LoadTile filled={outfit} size={48} ghost="coat" />
                <LoadTile filled={relic} size={48} ghost="nazar" />
              </View>
              <View style={styles.emo}>
                <View style={styles.emoWell}>
                  {myEmoteSticker ? <Sticker name={myEmoteSticker} size={22} /> : null}
                </View>
                <Text style={styles.emoLabel}>{myEmote ? `${myEmote} equipped` : 'No emote equipped'}</Text>
              </View>
            </Pressable>
            <ButtonSoft
              label="Change outfit"
              glyph="edit"
              block
              onPress={() => {
                impactAsync(ImpactFeedbackStyle.Light);
                router.navigate('/hero');
              }}
            />
          </Card>

          <SectionHead label="Your circle" />
          {circle.length === 0 ? (
            <Card style={styles.empty}>
              <Text style={styles.emptyCopy}>No one here yet.</Text>
              <ButtonPrimary
                label="Enter a code"
                block
                onPress={() => {
                  setEnterError(null);
                  setEnterValue('');
                  setCodeSheet('enter');
                }}
              />
              <ButtonSoft
                label="Your code"
                block
                onPress={() => setCodeSheet('yours')}
              />
            </Card>
          ) : (
            <View style={styles.list}>
              {circle.map((hero) => (
                <HeroRow
                  key={hero.id}
                  hero={hero}
                  onPress={() => setPeek(heroPeek(hero, 'In your circle'))}
                />
              ))}
              <View style={styles.circleActions}>
                <ButtonPrimary
                  label="Enter a code"
                  block
                  onPress={() => {
                    setEnterError(null);
                    setEnterValue('');
                    setCodeSheet('enter');
                  }}
                />
                <ButtonSoft label="Your code" block onPress={() => setCodeSheet('yours')} />
              </View>
            </View>
          )}

          <SectionHead label="Heroes of the Valley" />
          <View style={styles.list}>
            {VALLEY_HEROES.map((hero) => (
              <HeroRow
                key={hero.id}
                hero={hero}
                onPress={() => setPeek(heroPeek(hero, 'Hero of the Valley'))}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      {peek ? <HousePeek subject={peek} onClose={() => setPeek(null)} /> : null}

      <BottomSheet visible={codeSheet === 'yours'} onClose={closeSheets}>
        <View style={styles.sheetHd}>
          <Text style={styles.sheetTitle}>Your code</Text>
          <IconButton glyph="close" size={40} accessibilityLabel="Close" onPress={closeSheets} />
        </View>
        <Text style={styles.caption}>Share this</Text>
        <View style={styles.codeWell}>
          <Text style={styles.codeText} selectable>
            {myCode}
          </Text>
          <IconButton glyph="copy" size={40} accessibilityLabel="Copy code" onPress={onCopyMyCode} />
        </View>
        <Text style={styles.hint}>Give it to a friend. They enter it on Social. Not a password.</Text>
      </BottomSheet>

      <BottomSheet visible={codeSheet === 'enter'} onClose={closeSheets}>
        <View style={styles.sheetHd}>
          <Text style={styles.sheetTitle}>Add a hero</Text>
          <IconButton glyph="close" size={40} accessibilityLabel="Close" onPress={closeSheets} />
        </View>
        <Text style={styles.caption}>Their code</Text>
        <View style={styles.codeWell}>
          <TextInput
            value={enterValue}
            onChangeText={(t) => {
              setEnterValue(t);
              setEnterError(null);
            }}
            placeholder="HD-M0TH"
            placeholderTextColor={tokens.ink3}
            autoCapitalize="characters"
            autoCorrect={false}
            autoComplete="off"
            secureTextEntry={false}
            style={styles.codeInput}
            accessibilityLabel="Their friend code"
          />
        </View>
        <ButtonPrimary label="Send invite" block onPress={onSendInvite} />
          <Text style={[styles.hint, enterError ? styles.hintError : null]}>
            {enterError ?? 'They have to accept. No nick search.'}
          </Text>
      </BottomSheet>
    </LinearGradient>
  );
}

function HeroRow({ hero, onPress }: { hero: ValleyHero; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${hero.name}. Tap to peek`}>
      <Card style={styles.heroRow}>
        <Avatar size={48} hueRotate={hero.hueRotate} />
        <View style={styles.rowWho}>
          <Text style={styles.rowName} numberOfLines={1}>
            {hero.name}
          </Text>
          <Text style={styles.rowMeta}>
            Lv {hero.level} · {hero.house}
          </Text>
        </View>
        <View style={styles.rowLoot}>
          <LoadTile filled={hero.outfit} size={40} ghost="coat" />
          <LoadTile filled={hero.relic} size={40} ghost="nazar" />
        </View>
        {hero.emoteSticker ? <Sticker name={hero.emoteSticker} size={32} /> : <View style={styles.emoSpacer} />}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  stack: {
    paddingHorizontal: tokens.screenX,
    paddingBottom: 28,
    gap: 8,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  call: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  callTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  callWho: {
    flex: 1,
    minWidth: 0,
  },
  callCaption: {
    fontFamily: tokens.font800,
    fontSize: 11,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: tokens.brand,
  },
  callName: {
    fontFamily: tokens.font900,
    fontSize: 24,
    lineHeight: 28,
    color: tokens.ink,
    marginTop: 4,
    marginBottom: 6,
  },
  callMeta: {
    fontFamily: tokens.font800,
    fontSize: 13,
    lineHeight: 16,
    color: tokens.ink2,
  },
  caption: {
    fontFamily: tokens.font800,
    fontSize: 11,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: tokens.ink2,
  },
  equippedLabel: {
    marginTop: 12,
    marginBottom: 8,
  },
  load: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  emo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  emoWell: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: [{ offsetX: 0, offsetY: 3, blurRadius: 0, color: tokens.surface3 }],
  },
  emoLabel: {
    fontFamily: tokens.font800,
    fontSize: 13,
    color: tokens.ink2,
  },
  empty: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 8,
  },
  emptyCopy: {
    fontFamily: tokens.font800,
    fontSize: 14,
    lineHeight: 18,
    color: tokens.ink2,
    marginBottom: 2,
  },
  list: {
    gap: 8,
  },
  circleActions: {
    gap: 8,
    marginTop: 2,
  },
  heroRow: {
    height: 72,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowWho: {
    flex: 1,
    minWidth: 0,
  },
  rowName: {
    fontFamily: tokens.font900,
    fontSize: 16,
    lineHeight: 18,
    color: tokens.ink,
  },
  rowMeta: {
    marginTop: 3,
    fontFamily: tokens.font800,
    fontSize: 12,
    lineHeight: 14,
    color: tokens.ink2,
  },
  rowLoot: {
    flexDirection: 'row',
    gap: 6,
  },
  emoSpacer: {
    width: 32,
    height: 32,
  },
  sheetHd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  sheetTitle: {
    flex: 1,
    fontFamily: tokens.font900,
    fontSize: 20,
    color: tokens.ink,
  },
  codeWell: {
    height: 52,
    borderRadius: 16,
    backgroundColor: tokens.surface2,
    boxShadow: [{ offsetX: 0, offsetY: 2, blurRadius: 0, color: 'rgba(40, 50, 140, 0.08)' }],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 14,
    paddingRight: 6,
    marginTop: 8,
    marginBottom: 14,
  },
  codeText: {
    flex: 1,
    fontFamily: tokens.font900,
    fontSize: 18,
    color: tokens.ink,
    letterSpacing: 1.4,
  },
  codeInput: {
    flex: 1,
    fontFamily: tokens.font900,
    fontSize: 18,
    color: tokens.ink,
    letterSpacing: 1,
    paddingVertical: 0,
  },
  hint: {
    fontFamily: tokens.font800,
    fontSize: 13,
    lineHeight: 17,
    color: tokens.ink2,
    textAlign: 'center',
    marginTop: 10,
  },
  hintError: {
    color: tokens.danger,
  },
});

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Modal, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  impactAsync,
  notificationAsync,
  ImpactFeedbackStyle,
  NotificationFeedbackType,
} from '@/lib/hapticsGate';
import { ButtonFlow } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Glyph } from '@/ui/Glyph';
import { ItemTile, bibleRarityName, stickerForLootIcon } from '@/ui/ItemTile';
import type { StickerName } from '@/ui/stickerRegistry';
import { tokens } from '@/ui/tokens';
import type { DungeonLootEntry, LootRarity } from '@/types/dungeonLoot';

import { FightKicker, FightNote, FightSparks, FightTitle, FightWash } from './FightChrome';
import { headlineLootId } from './engine';
import type { FightLootPrize } from './types';

const WIN_IDX = 34;
const TOTAL_ITEMS = 40;
const ITEM_WIDTH = 82;
const ITEM_GAP = 8;
const ITEM_TOTAL = ITEM_WIDTH + ITEM_GAP;
const ROULETTE_ANIM_DURATION_MS = 5000;

type Phase = 'spinning' | 'reveal';

type Props = {
  visible: boolean;
  bossName: string;
  dungeonName: string;
  accentColor: string;
  lootTable: readonly DungeonLootEntry[];
  prize: FightLootPrize | null;
  onCollect: () => void;
};

function buildStrip(table: readonly DungeonLootEntry[], wonId: string): DungeonLootEntry[] {
  const fallback = table.find((e) => e.id === wonId) ?? table[0];
  if (!fallback) return [];
  return Array.from({ length: TOTAL_ITEMS }, (_, i) => {
    if (i === WIN_IDX) return table.find((e) => e.id === wonId) ?? fallback;
    return table[Math.floor(Math.random() * table.length)] ?? fallback;
  });
}

function prizeRarity(prize: FightLootPrize): LootRarity {
  if (prize.kind === 'item') return prize.item.rarity;
  if (prize.kind === 'items') return prize.headline.rarity;
  return prize.entry.rarity;
}

function rewardTitle(prize: FightLootPrize): string {
  if (prize.kind === 'gold') return prize.entry.name;
  if (prize.kind === 'item') return prize.item.name;
  if (prize.kind === 'items') return prize.headline.name;
  return prize.entry.name;
}

function rewardKicker(prize: FightLootPrize): string {
  if (prize.kind === 'gold') return 'Gold';
  if (prize.kind === 'empty') return 'Empty';
  const item = prize.kind === 'items' ? prize.headline : prize.item;
  const rarity = bibleRarityName(item.rarity);
  const slot = item.consumable ? 'consumable' : item.itemSlot === 'outfit' ? 'outfit' : 'relic';
  return `${rarity} ${slot}`;
}

function rewardHint(prize: FightLootPrize): string | undefined {
  if (prize.kind === 'gold') return `+${prize.amount}`;
  if (prize.kind === 'empty') return undefined;
  const item = prize.kind === 'items' ? prize.headline : prize.item;
  if (item.consumable) {
    return item.id === 'gutterjack_wine' ? item.combatHint : 'Goes to your pack';
  }
  return 'Wear on Hero — cosmetic only';
}

function rewardSticker(prize: FightLootPrize): StickerName | undefined {
  if (prize.kind === 'gold') return 'coin';
  if (prize.kind === 'item') return stickerForLootIcon(prize.item.icon);
  if (prize.kind === 'items') return stickerForLootIcon(prize.headline.icon);
  return undefined;
}

function prizeDescription(prize: FightLootPrize): string {
  if (prize.kind === 'gold') return prize.entry.description;
  if (prize.kind === 'item') return prize.item.description;
  if (prize.kind === 'items') return prize.headline.description;
  return prize.entry.description;
}

function cellSticker(entry: DungeonLootEntry): StickerName | undefined {
  if (entry.kind === 'gold') return 'coin';
  if (entry.kind === 'item') return stickerForLootIcon(entry.icon);
  return undefined;
}

function cellQty(entry: DungeonLootEntry): string | undefined {
  if (entry.kind !== 'gold') return undefined;
  if (entry.goldMin === entry.goldMax) return `×${entry.goldMin}`;
  return `${entry.goldMin}–${entry.goldMax}`;
}

function cellLabel(entry: DungeonLootEntry): string {
  if (entry.kind === 'gold') return 'Gold';
  if (entry.kind === 'empty') return 'Empty';
  return entry.name;
}

export default function BossVictoryLootModal({
  visible,
  bossName,
  lootTable,
  prize,
  onCollect,
}: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const [phase, setPhase] = useState<Phase>('spinning');
  const [strip, setStrip] = useState<DungeonLootEntry[]>([]);

  const stripTX = useRef(new Animated.Value(0)).current;
  const rouletteFade = useRef(new Animated.Value(0)).current;
  const revealScale = useRef(new Animated.Value(0.92)).current;
  const revealOpacity = useRef(new Animated.Value(0)).current;
  const btnFade = useRef(new Animated.Value(0)).current;

  const wonId = prize ? headlineLootId(prize) : '';

  useEffect(() => {
    if (!visible || !prize) return;

    setPhase('spinning');
    setStrip(buildStrip(lootTable, wonId));
    stripTX.setValue(0);
    rouletteFade.setValue(0);
    revealScale.setValue(0.92);
    revealOpacity.setValue(0);
    btnFade.setValue(0);

    const fade = Animated.timing(rouletteFade, { toValue: 1, duration: 300, useNativeDriver: true });
    fade.start();

    const finalTX = screenWidth / 2 - WIN_IDX * ITEM_TOTAL - ITEM_WIDTH / 2;
    const variance = (Math.random() - 0.5) * 36;
    let hapticTick = 0;
    const hapticId = setInterval(() => {
      hapticTick += 1;
      impactAsync(hapticTick % 5 === 0 ? ImpactFeedbackStyle.Heavy : ImpactFeedbackStyle.Light);
    }, 120);
    const stopHaptic = setTimeout(() => clearInterval(hapticId), 2200);
    let landed: ReturnType<typeof setTimeout> | undefined;
    let revealed: ReturnType<typeof setTimeout> | undefined;

    const spin = Animated.timing(stripTX, {
      toValue: finalTX + variance,
      duration: ROULETTE_ANIM_DURATION_MS,
      easing: Easing.out(Easing.poly(4)),
      useNativeDriver: true,
    });
    spin.start(({ finished }) => {
      if (!finished) return;
      landed = setTimeout(() => {
        impactAsync(ImpactFeedbackStyle.Heavy);
        notificationAsync(NotificationFeedbackType.Success);
      }, 180);
      revealed = setTimeout(() => {
        setPhase('reveal');
        Animated.parallel([
          Animated.spring(revealScale, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }),
          Animated.timing(revealOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        ]).start(() => {
          Animated.timing(btnFade, { toValue: 1, duration: 350, delay: 300, useNativeDriver: true }).start();
        });
      }, 500);
    });

    return () => {
      clearInterval(hapticId);
      clearTimeout(stopHaptic);
      if (landed) clearTimeout(landed);
      if (revealed) clearTimeout(revealed);
      fade.stop();
      spin.stop();
    };
  }, [visible, prize, lootTable, wonId, screenWidth, btnFade, revealOpacity, revealScale, rouletteFade, stripTX]);

  const extraNames = useMemo(() => {
    if (!prize || prize.kind !== 'items') return [];
    return prize.items.filter((i) => i.id !== prize.headline.id).map((i) => i.name);
  }, [prize]);

  if (!visible || !prize) return null;

  const hint = rewardHint(prize);
  const sticker = rewardSticker(prize);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={phase === 'reveal' ? onCollect : undefined}
      statusBarTranslucent
    >
      <View style={styles.root}>
        {phase === 'reveal' ? <FightWash gold /> : <FightWash />}
        {phase === 'reveal' ? <FightSparks /> : null}

        {phase === 'spinning' ? (
          <Animated.View style={[styles.rollScreen, { opacity: rouletteFade }]}>
            <View style={styles.rollHead}>
              <FightKicker>{bossName}</FightKicker>
              <FightTitle>Rolling</FightTitle>
            </View>
            <View style={styles.roll}>
              <View style={styles.tickUp} />
              <View style={styles.window}>
                <Animated.View style={[styles.strip, { transform: [{ translateX: stripTX }] }]}>
                  {strip.map((entry, index) => (
                    <View key={`${entry.id}_${index}`} style={styles.cell}>
                      {entry.kind === 'empty' ? (
                        <View style={styles.empty}>
                          <Glyph name="close" size={26} color={tokens.ink3} />
                        </View>
                      ) : (
                        <ItemTile
                          rarity={entry.rarity}
                          sticker={cellSticker(entry)}
                          qty={cellQty(entry)}
                          size={78}
                        />
                      )}
                      <Text style={styles.cellName} numberOfLines={2}>
                        {cellLabel(entry)}
                      </Text>
                    </View>
                  ))}
                </Animated.View>
                <LinearGradient
                pointerEvents="none"
                colors={[tokens.canvas, 'rgba(145,162,242,0)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.fadeL}
              />
              <LinearGradient
                pointerEvents="none"
                colors={['rgba(145,162,242,0)', tokens.canvas]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.fadeR}
              />
              </View>
              <View style={styles.tickDown} />
            </View>
            <FightNote>The strip slows onto one prize</FightNote>
          </Animated.View>
        ) : null}

        {phase === 'reveal' ? (
          <Animated.View style={[styles.reveal, { opacity: revealOpacity, transform: [{ scale: revealScale }] }]}>
            <View style={styles.prize}>
              {prize.kind === 'empty' || !sticker ? (
                <View style={styles.emptyPrize}>
                  <Glyph name="close" size={64} color={tokens.ink3} />
                </View>
              ) : (
                <ItemTile rarity={prizeRarity(prize)} sticker={sticker} size={168} />
              )}
            </View>
            <View style={styles.revealCopy}>
              <FightKicker gold>{rewardKicker(prize)}</FightKicker>
              <FightTitle>{rewardTitle(prize)}</FightTitle>
            </View>
            <Card style={styles.give}>
              <Text style={styles.giveCaption}>What it does</Text>
              {hint ? <Text style={styles.giveBold}>{hint}</Text> : null}
              <Text style={styles.giveBody}>{prizeDescription(prize)}</Text>
              {extraNames.length > 0 ? <Text style={styles.giveBody}>Also: {extraNames.join(', ')}</Text> : null}
            </Card>
            <Animated.View style={[styles.foot, { opacity: btnFade }]}>
              <ButtonFlow
                label="Collect"
                block
                testID="collect-loot"
                onPress={() => {
                  impactAsync(ImpactFeedbackStyle.Medium);
                  onCollect();
                }}
              />
            </Animated.View>
          </Animated.View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.canvas,
  },
  rollScreen: {
    flex: 1,
    alignItems: 'center',
  },
  rollHead: {
    alignItems: 'center',
    gap: 8,
    marginTop: 108,
  },
  roll: {
    width: '100%',
    marginTop: 36,
    alignItems: 'center',
  },
  window: {
    position: 'relative',
    height: 116,
    width: '100%',
    overflow: 'hidden',
  },
  strip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cell: {
    width: ITEM_WIDTH,
    marginRight: ITEM_GAP,
    alignItems: 'center',
    gap: 6,
  },
  cellName: {
    fontFamily: tokens.font800,
    fontSize: 11,
    lineHeight: 13,
    color: tokens.onCanvas,
    textAlign: 'center',
    textShadowColor: 'rgba(59, 71, 158, 0.28)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
  },
  empty: {
    width: 78,
    height: 78,
    borderRadius: 16,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: [{ offsetX: 0, offsetY: 4, blurRadius: 0, color: tokens.lipSurface }],
  },
  tickUp: {
    width: 0,
    height: 0,
    marginBottom: 6,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: tokens.gold,
  },
  tickDown: {
    width: 0,
    height: 0,
    marginTop: 6,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: tokens.gold,
  },
  fadeL: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 36,
  },
  fadeR: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 36,
  },
  reveal: {
    flex: 1,
    alignItems: 'center',
  },
  prize: {
    marginTop: 120,
  },
  emptyPrize: {
    width: 168,
    height: 168,
    borderRadius: 32,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  revealCopy: {
    alignItems: 'center',
    gap: 6,
    marginTop: 28,
    paddingHorizontal: 24,
  },
  give: {
    marginTop: 22,
    marginHorizontal: 24,
    alignSelf: 'stretch',
    paddingHorizontal: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  giveCaption: {
    fontFamily: tokens.font800,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: tokens.brand,
    marginBottom: 6,
  },
  giveBold: {
    fontFamily: tokens.font900,
    fontSize: 18,
    lineHeight: 22,
    color: tokens.ink,
    textAlign: 'center',
    marginBottom: 6,
  },
  giveBody: {
    fontFamily: tokens.font800,
    fontSize: 15,
    lineHeight: 20,
    color: tokens.ink2,
    textAlign: 'center',
  },
  foot: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 40,
  },
});

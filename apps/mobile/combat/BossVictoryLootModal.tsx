import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ban, Gift, Sparkles, Trophy } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { LOOT_RARITY_COLOR } from '@/constants/lootRarity';
import { LootGlyph } from '@/lib/lootGlyph';
import {
  impactAsync,
  notificationAsync,
  ImpactFeedbackStyle,
  NotificationFeedbackType,
} from '@/lib/hapticsGate';
import type { DungeonLootEntry, LootIconId, LootRarity } from '@/types/dungeonLoot';

import { headlineLootId } from './engine';
import type { FightLootPrize } from './types';

const WIN_IDX = 34;
const TOTAL_ITEMS = 40;
const ITEM_WIDTH = 82;
const ITEM_HEIGHT = 104;
const ITEM_GAP = 8;
const ITEM_TOTAL = ITEM_WIDTH + ITEM_GAP;
const ROULETTE_ANIM_DURATION_MS = 5000;

const RARITY_LABEL: Record<LootRarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};

type Phase = 'chest' | 'spinning' | 'reveal';

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

function prizeName(prize: FightLootPrize): string {
  if (prize.kind === 'gold') return `${prize.amount} gold`;
  if (prize.kind === 'item') return prize.item.name;
  if (prize.kind === 'items') return prize.headline.name;
  return prize.entry.name;
}

function prizeDescription(prize: FightLootPrize): string {
  if (prize.kind === 'gold') return prize.entry.description;
  if (prize.kind === 'item') return prize.item.description;
  if (prize.kind === 'items') return prize.headline.description;
  return prize.entry.description;
}

function prizeIcon(prize: FightLootPrize): LootIconId | 'empty' {
  if (prize.kind === 'gold') return 'coins';
  if (prize.kind === 'item') return prize.item.icon;
  if (prize.kind === 'items') return prize.headline.icon;
  return 'empty';
}

export default function BossVictoryLootModal({
  visible,
  bossName,
  dungeonName,
  accentColor,
  lootTable,
  prize,
  onCollect,
}: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const [phase, setPhase] = useState<Phase>('chest');
  const [strip, setStrip] = useState<DungeonLootEntry[]>([]);

  const chestPulse = useRef(new Animated.Value(1)).current;
  const chestOpacity = useRef(new Animated.Value(0)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const stripTX = useRef(new Animated.Value(0)).current;
  const rouletteFade = useRef(new Animated.Value(0)).current;
  const revealScale = useRef(new Animated.Value(0.5)).current;
  const revealOpacity = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.5)).current;
  const btnFade = useRef(new Animated.Value(0)).current;

  const wonId = prize ? headlineLootId(prize) : '';

  useEffect(() => {
    if (!visible || !prize) return;

    setPhase('chest');
    chestOpacity.setValue(0);
    headerFade.setValue(0);
    stripTX.setValue(0);
    rouletteFade.setValue(0);
    revealScale.setValue(0.5);
    revealOpacity.setValue(0);
    glowPulse.setValue(0.5);
    btnFade.setValue(0);
    setStrip(buildStrip(lootTable, wonId));

    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(chestOpacity, { toValue: 1, duration: 400, delay: 200, useNativeDriver: true }),
    ]).start();
  }, [visible, prize, lootTable, wonId, btnFade, chestOpacity, glowPulse, headerFade, revealOpacity, revealScale, rouletteFade, stripTX]);

  useEffect(() => {
    if (phase !== 'chest') {
      chestPulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(chestPulse, {
          toValue: 1.07,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(chestPulse, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [phase, chestPulse]);

  useEffect(() => {
    if (phase !== 'reveal') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.4, duration: 1400, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [phase, glowPulse]);

  const handleOpenChest = useCallback(() => {
    if (phase !== 'chest') return;
    impactAsync(ImpactFeedbackStyle.Heavy);

    Animated.timing(chestOpacity, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start(() => {
      setPhase('spinning');
      Animated.timing(rouletteFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const finalTX = screenWidth / 2 - WIN_IDX * ITEM_TOTAL - ITEM_WIDTH / 2;
      const variance = (Math.random() - 0.5) * 36;

      let hapticTick = 0;
      const hapticId = setInterval(() => {
        hapticTick += 1;
        impactAsync(hapticTick % 5 === 0 ? ImpactFeedbackStyle.Heavy : ImpactFeedbackStyle.Light);
      }, 120);
      setTimeout(() => clearInterval(hapticId), 2200);

      Animated.timing(stripTX, {
        toValue: finalTX + variance,
        duration: ROULETTE_ANIM_DURATION_MS,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          impactAsync(ImpactFeedbackStyle.Heavy);
          notificationAsync(NotificationFeedbackType.Success);
        }, 180);
        setTimeout(() => {
          setPhase('reveal');
          Animated.parallel([
            Animated.spring(revealScale, {
              toValue: 1,
              friction: 5,
              tension: 70,
              useNativeDriver: true,
            }),
            Animated.timing(revealOpacity, {
              toValue: 1,
              duration: 350,
              useNativeDriver: true,
            }),
          ]).start(() => {
            Animated.timing(btnFade, {
              toValue: 1,
              duration: 350,
              delay: 300,
              useNativeDriver: true,
            }).start();
          });
        }, 500);
      });
    });
  }, [phase, screenWidth, chestOpacity, rouletteFade, stripTX, revealScale, revealOpacity, btnFade]);

  const extraNames = useMemo(() => {
    if (!prize || prize.kind !== 'items') return [];
    return prize.items.filter((i) => i.id !== prize.headline.id).map((i) => i.name);
  }, [prize]);

  if (!visible || !prize) return null;

  const rarityColor = LOOT_RARITY_COLOR[prizeRarity(prize)];
  const icon = prizeIcon(prize);
  const cursorX = screenWidth / 2;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={phase === 'reveal' ? onCollect : undefined}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <View style={[StyleSheet.absoluteFill, styles.webBg]} />
        <LinearGradient
          colors={['rgba(5,2,12,0.75)', 'rgba(5,2,12,0.4)', 'rgba(5,2,12,0.82)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />

        <View style={[styles.bgOrb1, { backgroundColor: accentColor + '14' }]} />
        <View style={[styles.bgOrb2, { backgroundColor: rarityColor + '10' }]} />

        <Animated.View style={[styles.header, { opacity: headerFade }]}>
          <View style={styles.headerBadge}>
            <Trophy size={14} color={Colors.dark.gold} />
            <Text style={styles.headerBadgeText}>{dungeonName}</Text>
          </View>
          <Text style={styles.victoryText}>VICTORY</Text>
          <Text style={[styles.bossText, { color: accentColor }]}>{bossName} defeated</Text>
        </Animated.View>

        {phase === 'chest' && (
          <Animated.View style={[styles.chestPhase, { opacity: chestOpacity }]}>
            <View style={styles.chestGlowWrap}>
              <Animated.View
                style={[
                  styles.chestGlowRing,
                  {
                    borderColor: accentColor + '55',
                    shadowColor: accentColor,
                    transform: [{ scale: chestPulse }],
                  },
                ]}
              />
              <Animated.View style={{ transform: [{ scale: chestPulse }] }}>
                <View style={styles.chestGlyph}>
                  <Gift size={88} color={Colors.dark.gold} strokeWidth={1.6} />
                </View>
              </Animated.View>
            </View>

            <Text style={styles.tapHint}>Tap to open</Text>

            <Pressable
              testID="open-boss-chest"
              onPress={handleOpenChest}
              style={({ pressed }) => [styles.openBtn, pressed && styles.openBtnPressed]}
            >
              <LinearGradient
                colors={[accentColor + 'ee', accentColor + '99']}
                style={styles.openBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Sparkles size={20} color="#fff" />
                <Text style={styles.openBtnText}>Open Boss Chest</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        )}

        {phase === 'spinning' && (
          <Animated.View style={[styles.roulettePhase, { opacity: rouletteFade }]}>
            <Text style={styles.spinningLabel}>Rolling loot…</Text>
            <View style={styles.rouletteOuter}>
              <LinearGradient
                colors={['rgba(5,2,12,1)', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.edgeFadeLeft}
                pointerEvents="none"
              />
              <LinearGradient
                colors={['transparent', 'rgba(5,2,12,1)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.edgeFadeRight}
                pointerEvents="none"
              />
              <View style={[styles.cursorLine, { left: cursorX - 1, borderColor: Colors.dark.gold }]} pointerEvents="none" />
              <View
                style={[styles.cursorArrowTop, { left: cursorX - 7, borderBottomColor: Colors.dark.gold }]}
                pointerEvents="none"
              />
              <View
                style={[styles.cursorArrowBottom, { left: cursorX - 7, borderTopColor: Colors.dark.gold }]}
                pointerEvents="none"
              />
              <View style={styles.rouletteClip}>
                <Animated.View style={[styles.rouletteStrip, { transform: [{ translateX: stripTX }] }]}>
                  {strip.map((entry, index) => {
                    const rColor = LOOT_RARITY_COLOR[entry.rarity];
                    const isWinner = index === WIN_IDX;
                    return (
                      <View
                        key={`${entry.id}_${index}`}
                        style={[
                          styles.rouletteItem,
                          {
                            width: ITEM_WIDTH,
                            height: ITEM_HEIGHT,
                            marginRight: ITEM_GAP,
                            borderColor: rColor + (isWinner ? 'ff' : '55'),
                            backgroundColor: isWinner ? rColor + '22' : rColor + '0d',
                          },
                        ]}
                      >
                        <LinearGradient
                          colors={[rColor + '18', 'transparent']}
                          style={StyleSheet.absoluteFill}
                          start={{ x: 0.5, y: 0 }}
                          end={{ x: 0.5, y: 1 }}
                        />
                        {entry.kind === 'empty' ? (
                          <Ban size={34} color={Colors.dark.textMuted} />
                        ) : (
                          <LootGlyph
                            icon={entry.kind === 'gold' ? 'coins' : entry.icon}
                            size={34}
                            color={entry.kind === 'gold' ? Colors.dark.gold : rColor}
                          />
                        )}
                        <Text style={[styles.rouletteItemName, { color: rColor + 'ee' }]} numberOfLines={2}>
                          {entry.kind === 'gold' ? 'Gold' : entry.name}
                        </Text>
                        <View style={[styles.rarityDot, { backgroundColor: rColor }]} />
                      </View>
                    );
                  })}
                </Animated.View>
              </View>
            </View>
          </Animated.View>
        )}

        {phase === 'reveal' && (
          <Animated.View
            style={[styles.revealPhase, { opacity: revealOpacity, transform: [{ scale: revealScale }] }]}
          >
            <Animated.View
              style={[
                styles.revealGlowRing,
                { borderColor: rarityColor + '55', shadowColor: rarityColor, opacity: glowPulse },
              ]}
            />
            <View style={[styles.revealHalo, { borderColor: rarityColor + '99', shadowColor: rarityColor }]}>
              <LinearGradient
                colors={[rarityColor + '40', Colors.dark.surface + 'dd']}
                style={styles.revealHaloInner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {icon === 'empty' ? (
                  <Ban size={60} color={Colors.dark.textMuted} />
                ) : (
                  <LootGlyph icon={icon} size={60} color={rarityColor} />
                )}
              </LinearGradient>
            </View>
            <View
              style={[
                styles.revealRarityBadge,
                { borderColor: rarityColor + 'aa', backgroundColor: rarityColor + '1e' },
              ]}
            >
              <Text style={[styles.revealRarityText, { color: rarityColor }]}>
                {RARITY_LABEL[prizeRarity(prize)].toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.revealName, { color: rarityColor }]}>{prizeName(prize)}</Text>
            <Text style={styles.revealDescription}>{prizeDescription(prize)}</Text>
            {extraNames.length > 0 ? (
              <Text style={styles.extraDrop}>Also: {extraNames.join(', ')}</Text>
            ) : null}

            <Animated.View style={[styles.collectWrap, { opacity: btnFade }]}>
              <Pressable
                testID="collect-loot"
                onPress={() => {
                  impactAsync(ImpactFeedbackStyle.Medium);
                  onCollect();
                }}
                style={({ pressed }) => [styles.collectBtn, pressed && styles.collectBtnPressed]}
              >
                <LinearGradient
                  colors={[...Colors.gradients.gold]}
                  style={styles.collectGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Trophy size={18} color="#1a1228" strokeWidth={2.5} />
                  <Text style={styles.collectText}>Collect Loot</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webBg: {
    backgroundColor: 'rgba(5,2,12,0.97)',
  },
  bgOrb1: {
    position: 'absolute',
    top: '15%',
    left: '10%',
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  bgOrb2: {
    position: 'absolute',
    bottom: '18%',
    right: '8%',
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.dark.surface + 'cc',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.dark.gold + '44',
    marginBottom: 10,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.dark.gold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  victoryText: {
    fontSize: 38,
    fontWeight: '800',
    color: Colors.dark.gold,
    letterSpacing: 3,
    textShadowColor: Colors.dark.gold + '88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  bossText: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  chestPhase: {
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 40,
  },
  chestGlowWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  chestGlowRing: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.6,
        shadowRadius: 28,
        shadowOffset: { width: 0, height: 0 },
      },
      default: {},
    }),
  },
  chestGlyph: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26,18,40,0.85)',
    borderWidth: 2,
    borderColor: Colors.dark.gold + '66',
  },
  tapHint: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    marginBottom: 22,
    letterSpacing: 0.3,
  },
  openBtn: {
    borderRadius: 18,
    overflow: 'hidden',
    width: 280,
  },
  openBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  openBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  openBtnText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  roulettePhase: {
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
  },
  spinningLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 18,
  },
  rouletteOuter: {
    width: '100%',
    height: ITEM_HEIGHT + 28,
    justifyContent: 'center',
    position: 'relative',
  },
  rouletteClip: {
    width: '100%',
    height: ITEM_HEIGHT,
    overflow: 'hidden',
    alignItems: 'flex-start',
  },
  rouletteStrip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rouletteItem: {
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    gap: 6,
    overflow: 'hidden',
  },
  rouletteItemName: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 13,
  },
  rarityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  edgeFadeLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 64,
    zIndex: 5,
  },
  edgeFadeRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 64,
    zIndex: 5,
  },
  cursorLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    borderWidth: 1.5,
    borderRadius: 1,
    zIndex: 10,
  },
  cursorArrowTop: {
    position: 'absolute',
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    zIndex: 11,
  },
  cursorArrowBottom: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    zIndex: 11,
  },
  revealPhase: {
    alignItems: 'center',
    paddingHorizontal: 28,
    marginTop: 30,
    maxWidth: 380,
    width: '100%',
  },
  revealGlowRing: {
    position: 'absolute',
    top: -20,
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1.5,
  },
  revealHalo: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  revealHaloInner: {
    width: 114,
    height: 114,
    borderRadius: 57,
    alignItems: 'center',
    justifyContent: 'center',
  },
  revealRarityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 12,
  },
  revealRarityText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  revealName: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  revealDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 14,
  },
  extraDrop: {
    fontSize: 13,
    color: Colors.dark.gold,
    marginBottom: 12,
    fontWeight: '700',
  },
  collectWrap: {
    width: '100%',
  },
  collectBtn: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  collectBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  collectGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  collectText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1228',
    letterSpacing: 0.4,
  },
});

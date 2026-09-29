import { Image, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { HeroHexStats } from '@/constants/heroHexStats';
import type { SocialLoadout } from '@/social/store';
import { Card } from '@/ui/Card';
import { Chip } from '@/ui/Chip';
import { EquipSlot } from '@/ui/EquipSlot';
import { IconButton } from '@/ui/IconButton';
import { Seam, vignetteHeight } from '@/ui/Seam';
import { StatHex } from '@/ui/StatHex';
import type { StickerName } from '@/ui/stickerRegistry';
import { tokens } from '@/ui/tokens';

const VIGNETTE = require('../lookdev/assets/vignette-mage.jpg');

export type HousePeekSubject = {
  kicker: string;
  name: string;
  level: number;
  title: string;
  house: string;
  daysInRealm: number;
  emote: string | null;
  emoteSticker: StickerName | null;
  titles: string[];
  outfit: SocialLoadout | null;
  relic: SocialLoadout | null;
  hexStats: HeroHexStats;
};

type Props = {
  subject: HousePeekSubject;
  onClose: () => void;
};

/** Layout A house-first peek. Do not name this wrapper "peek" — that is the map PeekCard. */
export function HousePeek({ subject, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const vH = vignetteHeight(windowHeight);
  const extraTitles = subject.titles.filter((t) => t !== subject.title);

  return (
    <View style={styles.housePeek} testID="house-peek" accessibilityViewIsModal>
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.vignetteWrap, { height: vH }]}>
          <Image
            source={VIGNETTE}
            resizeMode="cover"
            style={[styles.vignetteImage, { height: vH * 1.35, marginTop: -vH * 0.18 }]}
          />
          <Seam />
        </View>
        <View style={styles.sheetCards}>
          <Card style={styles.idCard}>
            <Text style={styles.kicker}>{subject.kicker}</Text>
            <Text style={styles.name} numberOfLines={1}>
              {subject.name}
            </Text>
            <Text style={styles.meta}>
              Level {subject.level} · {subject.title}
            </Text>
            {extraTitles.map((title) => (
              <Text key={title} style={styles.meta}>
                {title}
              </Text>
            ))}
          </Card>
          <Card style={styles.eqCard}>
            <View style={styles.equip}>
              <EquipSlot kind="outfit" filled={subject.outfit} tileSize={72} add={false} />
              <EquipSlot kind="relic" filled={subject.relic} tileSize={72} add={false} />
            </View>
            <View style={styles.facts}>
              <Chip sticker="castle" label={subject.house} />
              <Chip glyph="time" label={`${subject.daysInRealm} days`} />
              {subject.emote ? (
                <Chip sticker={subject.emoteSticker ?? 'handshake'} label={subject.emote} />
              ) : null}
            </View>
          </Card>
          <Card style={styles.hexCard}>
            <Text style={styles.caption}>Stats</Text>
            <StatHex stats={subject.hexStats} />
          </Card>
        </View>
      </ScrollView>
      <View
        style={[styles.topRow, { top: Math.max(insets.top, 8) + 6 }]}
      >
        <IconButton glyph="close" ghost size={44} accessibilityLabel="Close" onPress={onClose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  housePeek: {
    ...StyleSheet.absoluteFill,
    zIndex: 20,
    backgroundColor: tokens.canvas,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingBottom: 28,
  },
  vignetteWrap: {
    overflow: 'hidden',
    backgroundColor: tokens.canvasDeep,
  },
  vignetteImage: {
    width: '100%',
  },
  sheetCards: {
    marginTop: -48,
    paddingHorizontal: tokens.screenX,
    gap: 10,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  idCard: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  kicker: {
    fontFamily: tokens.font800,
    fontSize: 11,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: tokens.brand,
  },
  name: {
    fontFamily: tokens.font900,
    fontSize: 24,
    lineHeight: 28,
    color: tokens.ink,
    marginTop: 4,
  },
  meta: {
    marginTop: 2,
    fontFamily: tokens.font800,
    fontSize: 13,
    lineHeight: 16,
    color: tokens.ink2,
  },
  eqCard: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  equip: {
    flexDirection: 'row',
    gap: 14,
  },
  facts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  hexCard: {
    paddingTop: 10,
    paddingHorizontal: 8,
    paddingBottom: 14,
  },
  caption: {
    fontFamily: tokens.font800,
    fontSize: 11,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: tokens.ink2,
    paddingHorizontal: 8,
    paddingTop: 2,
  },
  topRow: {
    position: 'absolute',
    left: tokens.screenX,
    right: tokens.screenX,
    zIndex: 30,
    flexDirection: 'row',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
});

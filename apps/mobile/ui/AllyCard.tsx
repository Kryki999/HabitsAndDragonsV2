import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/ui/Card';
import { Glyph } from '@/ui/Glyph';
import { Sticker } from '@/ui/Sticker';
import type { StickerName } from '@/ui/stickerRegistry';
import { tokens } from '@/ui/tokens';

export type AllyNodeStatus = 'done' | 'next' | 'locked';

export type AllyNode = {
  status: AllyNodeStatus;
  /** Kit gap under the node is 12px. Keep it. */
  title: string;
  reward?: string;
  sticker?: StickerName;
};

type Props = {
  name: string;
  raiseLabel: string;
  raiseValue?: string;
  raiseSticker: StickerName;
  nodes: readonly AllyNode[];
  /** 0–1 fill toward the next node. */
  fill: number;
  testID?: string;
};

export function AllyCard({ name, raiseLabel, raiseValue, raiseSticker, nodes, fill, testID }: Props) {
  const width = Math.max(0, Math.min(1, fill)) * 100;
  return (
    <Card style={styles.card} testID={testID}>
      <View style={styles.row1}>
        <Text
          style={styles.name}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
        >
          {name}
        </Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Ally</Text>
        </View>
        <View style={styles.raise}>
          <Sticker name={raiseSticker} size={20} />
          <Text style={styles.raiseLabel}>
            {raiseLabel}
            {raiseValue ? (
              <>
                {' '}
                <Text style={styles.raiseValue}>{raiseValue}</Text>
              </>
            ) : null}
          </Text>
        </View>
      </View>
      <View style={styles.track}>
        <View style={styles.bar}>
          <View style={[styles.fill, { width: `${width}%` }]} />
        </View>
        {nodes.map((node) => (
          <View key={node.title} style={styles.lv}>
            <View style={styles.nodeWrap}>
              <View
                style={[
                  styles.node,
                  node.status === 'done' && styles.nodeDone,
                  node.status === 'next' && styles.nodeNext,
                  node.status === 'locked' && styles.nodeLocked,
                ]}
              >
                {node.status === 'locked' ? (
                  <Glyph name="lock" size={16} color={tokens.ink3} />
                ) : node.sticker ? (
                  <Sticker name={node.sticker} size={22} bare />
                ) : null}
              </View>
              {node.status === 'done' ? (
                <View style={styles.badge}>
                  <Glyph name="check" size={10} color={tokens.onCanvas} />
                </View>
              ) : null}
            </View>
            <Text style={styles.lbl}>
              <Text style={[styles.lblTitle, node.status === 'next' && styles.lblTitleNext]}>{node.title}</Text>
              {node.reward ? `\n${node.reward}` : ''}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: tokens.screenX,
    right: tokens.screenX,
    bottom: 12,
    zIndex: 30,
    paddingTop: 12,
    paddingRight: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    boxShadow: [
      { offsetX: 0, offsetY: 4, blurRadius: 0, color: tokens.lipSurface },
      { offsetX: 0, offsetY: 8, blurRadius: 18, color: 'rgba(12, 10, 30, 0.45)' },
    ],
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 30,
  },
  name: {
    flexShrink: 1,
    minWidth: 0,
    fontFamily: tokens.font900,
    fontSize: 20,
    lineHeight: 24,
    color: tokens.ink,
  },
  tag: {
    flexShrink: 0,
    height: 22,
    paddingHorizontal: 9,
    borderRadius: tokens.rPill,
    backgroundColor: '#dcf5e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontFamily: tokens.font900,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: tokens.successDeep,
  },
  raise: {
    flexShrink: 0,
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 30,
    paddingLeft: 7,
    paddingRight: 11,
    borderRadius: tokens.rPill,
    backgroundColor: tokens.surface2,
  },
  raiseLabel: {
    fontFamily: tokens.font800,
    fontSize: 13,
    color: tokens.ink2,
  },
  raiseValue: {
    fontFamily: tokens.font900,
    color: tokens.goldDeep,
  },
  track: {
    position: 'relative',
    flexDirection: 'row',
    marginTop: 10,
  },
  bar: {
    position: 'absolute',
    left: '16.66%',
    right: '16.66%',
    top: 13,
    height: 8,
    borderRadius: tokens.rPill,
    backgroundColor: tokens.surface2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: tokens.rPill,
    backgroundColor: tokens.gold,
    boxShadow: [{ offsetX: 0, offsetY: -2, blurRadius: 0, color: tokens.goldDeep, inset: true }],
  },
  lv: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
  },
  nodeWrap: {
    width: 34,
    height: 34,
  },
  node: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: tokens.surface,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: [
      { offsetX: 0, offsetY: 0, blurRadius: 0, color: tokens.surface3, spreadDistance: 3 },
      { offsetX: 0, offsetY: 3, blurRadius: 0, color: tokens.surface3, spreadDistance: 3 },
    ],
  },
  nodeDone: {
    boxShadow: [
      { offsetX: 0, offsetY: 0, blurRadius: 0, color: tokens.success, spreadDistance: 3 },
      { offsetX: 0, offsetY: 3, blurRadius: 0, color: tokens.successDeep, spreadDistance: 3 },
    ],
  },
  nodeNext: {
    boxShadow: [
      { offsetX: 0, offsetY: 0, blurRadius: 0, color: tokens.gold, spreadDistance: 3 },
      { offsetX: 0, offsetY: 3, blurRadius: 0, color: tokens.goldDeep, spreadDistance: 3 },
      { offsetX: 0, offsetY: 0, blurRadius: 0, color: tokens.goldSoft, spreadDistance: 8 },
    ],
  },
  nodeLocked: {
    backgroundColor: tokens.surface2,
  },
  badge: {
    position: 'absolute',
    top: -5,
    left: 26,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: tokens.success,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: [{ offsetX: 0, offsetY: 0, blurRadius: 0, color: tokens.surface, spreadDistance: 2 }],
  },
  lbl: {
    fontFamily: tokens.font800,
    fontSize: 12,
    lineHeight: 13,
    color: tokens.ink2,
    textAlign: 'center',
  },
  lblTitle: {
    fontFamily: tokens.font900,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: tokens.ink3,
  },
  lblTitleNext: {
    color: tokens.goldDeep,
  },
});

import React, { useCallback } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

import { winChanceColor } from './winChanceColor';
import type { WinChanceBreakdown } from './types';

type Props = {
  visible: boolean;
  breakdown: WinChanceBreakdown | null;
  onClose: () => void;
};

export default function WinChanceBreakdownModal({ visible, breakdown, onClose }: Props) {
  const handleClose = useCallback(() => {
    impactAsync(ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  if (!visible || !breakdown) return null;

  const color = winChanceColor(breakdown.displayPct);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={styles.sheet} pointerEvents="box-none">
          <LinearGradient colors={['#2a1f42', '#1a1228', '#120c1c']} style={styles.card}>
            <Pressable onPress={handleClose} hitSlop={12} style={styles.close}>
              <X size={18} color={Colors.dark.textMuted} />
            </Pressable>
            <Text style={styles.kicker}>Win chance</Text>
            <Text style={[styles.pct, { color }]}>{breakdown.displayPct}%</Text>
            {breakdown.tutorialLock ? (
              <Text style={styles.lockNote}>First cellar — tutorial lock. Later fights use the sum below.</Text>
            ) : null}

            <View style={styles.lines}>
              {breakdown.lines.map((line) => (
                <View key={line.label} style={styles.lineRow}>
                  <View style={styles.lineText}>
                    <Text style={styles.lineLabel}>{line.label}</Text>
                    {line.detail ? <Text style={styles.lineDetail}>{line.detail}</Text> : null}
                  </View>
                  {line.pct != null ? (
                    <Text style={styles.linePct}>
                      {line.pct > 0 && !line.label.startsWith('Tutorial') && line.label !== 'Base chance'
                        ? `+${line.pct}%`
                        : `${line.pct}%`}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>

            <Text style={styles.improveKicker}>How to improve</Text>
            {breakdown.howToImprove.map((tip) => (
              <Text key={tip} style={styles.tip}>
                · {tip}
              </Text>
            ))}

            <Pressable onPress={handleClose} style={styles.done}>
              <Text style={styles.doneText}>Got it</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 22,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(5,2,12,0.78)',
  },
  sheet: {
    width: '100%',
    maxWidth: 360,
  },
  card: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: Colors.dark.borderGlow + '55',
  },
  close: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    padding: 6,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: Colors.dark.textMuted,
    textTransform: 'uppercase',
  },
  pct: {
    fontSize: 42,
    fontWeight: '900',
    marginTop: 4,
  },
  lockNote: {
    marginTop: 4,
    marginBottom: 10,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.dark.gold,
  },
  lines: {
    marginTop: 12,
    gap: 10,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  lineText: {
    flex: 1,
  },
  lineLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  lineDetail: {
    marginTop: 2,
    fontSize: 11,
    color: Colors.dark.textMuted,
  },
  linePct: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.dark.gold,
  },
  improveKicker: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: Colors.dark.cyan,
    textTransform: 'uppercase',
  },
  tip: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.dark.textSecondary,
    marginBottom: 4,
  },
  done: {
    marginTop: 16,
    alignSelf: 'stretch',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.dark.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  doneText: {
    textAlign: 'center',
    fontWeight: '800',
    color: Colors.dark.gold,
    fontSize: 15,
  },
});

import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { useHeroStore } from '@/hero/store';
import { impactAsync, ImpactFeedbackStyle, notificationAsync, NotificationFeedbackType } from '@/lib/hapticsGate';
import { nextHiddenFogRegionId } from '@/world/layout';
import { useWorldStore } from '@/world/store';

type Props = {
  visible: boolean;
  onClose: () => void;
};

/**
 * DEV-only overlay. Production never mounts this — AccountBar gates on `__DEV__`.
 * Mutates `hero` + `world` stores so the account bar updates live.
 */
export default function DevToolsPanel({ visible, onClose }: Props) {
  if (!__DEV__) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <DevToolsBody onClose={onClose} />
    </Modal>
  );
}

function DevToolsBody({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const gold = useHeroStore((s) => s.gold);
  const dungeonKeys = useHeroStore((s) => s.dungeonKeys ?? 0);
  const playerLevel = useHeroStore((s) => s.playerLevel);
  const addGold = useHeroStore((s) => s.addGold);
  const addDungeonKeys = useHeroStore((s) => s.addDungeonKeys);
  const setPlayerLevel = useHeroStore((s) => s.setPlayerLevel);
  const discoverRegion = useWorldStore((s) => s.discoverRegion);
  const revealAllMap = useWorldStore((s) => s.revealAllMap);
  const resetWorldDiscovery = useWorldStore((s) => s.resetWorldDiscovery);
  const clearEncounterCooldowns = useWorldStore((s) => s.clearEncounterCooldowns);
  const discoveredRegionIds = useWorldStore((s) => s.discoveredRegionIds);

  const [levelDraft, setLevelDraft] = useState(String(playerLevel));
  const [resetArmed, setResetArmed] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    setLevelDraft(String(playerLevel));
  }, [playerLevel]);

  useEffect(() => {
    if (!resetArmed) return;
    const t = setTimeout(() => setResetArmed(false), 2600);
    return () => clearTimeout(t);
  }, [resetArmed]);

  const nextFog = nextHiddenFogRegionId(discoveredRegionIds);

  const bump = (run: () => void) => {
    impactAsync(ImpactFeedbackStyle.Light);
    run();
  };

  const revealNext = () => {
    const id = nextHiddenFogRegionId(useWorldStore.getState().discoveredRegionIds);
    if (!id) {
      setNote('All fog regions already open.');
      return;
    }
    discoverRegion(id);
    notificationAsync(NotificationFeedbackType.Success);
    setNote(`Revealed ${id}.`);
  };

  const revealAll = () => {
    revealAllMap();
    notificationAsync(NotificationFeedbackType.Success);
    setNote('All map locations revealed.');
  };

  const resetWorld = () => {
    if (!resetArmed) {
      setResetArmed(true);
      return;
    }
    resetWorldDiscovery();
    setResetArmed(false);
    notificationAsync(NotificationFeedbackType.Warning);
    setNote('World discovery reset.');
  };

  const applyLevel = () => {
    const parsed = Number(levelDraft);
    if (!Number.isFinite(parsed)) {
      setNote('Level must be a number.');
      return;
    }
    bump(() => setPlayerLevel(parsed));
  };

  return (
    <View pointerEvents="box-none" style={styles.root} testID="dev-tools-panel">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close DEV tools"
        onPress={onClose}
        style={styles.backdrop}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        pointerEvents="box-none"
        style={[styles.sheetWrap, { paddingTop: Math.max(insets.top, 10) + 12 }]}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.kicker}>DEV</Text>
            <Pressable onPress={onClose} hitSlop={8} accessibilityLabel="Close">
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>DEV tools</Text>
          <Text style={styles.readout}>
            Lv.{playerLevel} · {gold} gold · {dungeonKeys} keys
          </Text>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.body}
            style={styles.scroll}
          >
            <Section label="Level">
              <Row>
                <ToolButton label="+1" onPress={() => bump(() => setPlayerLevel(playerLevel + 1))} />
                <TextInput
                  value={levelDraft}
                  onChangeText={setLevelDraft}
                  keyboardType="number-pad"
                  placeholder="Set"
                  placeholderTextColor={Colors.dark.textMuted}
                  accessibilityLabel="Set level"
                  style={styles.input}
                />
                <ToolButton label="Set" onPress={applyLevel} />
              </Row>
            </Section>

            <Section label="Gold">
              <Row>
                <ToolButton label="+10" onPress={() => bump(() => addGold(10))} />
                <ToolButton label="+100" onPress={() => bump(() => addGold(100))} />
              </Row>
            </Section>

            <Section label="Dungeon keys">
              <Row>
                <ToolButton label="+1" onPress={() => bump(() => addDungeonKeys(1))} />
                <ToolButton label="+5" onPress={() => bump(() => addDungeonKeys(5))} />
              </Row>
              <ToolButton
                label="Ready all dungeon CDs"
                onPress={() => bump(() => clearEncounterCooldowns())}
                wide
              />
            </Section>

            <Section label="Map">
              <ToolButton
                label={nextFog ? `Reveal next fog (${nextFog})` : 'Reveal next fog (none left)'}
                onPress={revealNext}
                disabled={!nextFog}
                wide
              />
              <ToolButton label="Reveal all map locations" onPress={revealAll} wide />
              <ToolButton
                label={resetArmed ? 'Confirm reset' : 'Reset world'}
                onPress={resetWorld}
                wide
                danger
              />
            </Section>

            {note ? <Text style={styles.note}>{note}</Text> : null}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

function ToolButton({
  label,
  onPress,
  wide,
  danger,
  disabled,
}: {
  label: string;
  onPress: () => void;
  wide?: boolean;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        wide && styles.btnWide,
        danger && styles.btnDanger,
        disabled && styles.btnDisabled,
        pressed && !disabled && styles.btnPressed,
      ]}
    >
      <Text style={[styles.btnLabel, danger && styles.btnLabelDanger]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(7, 5, 16, 0.55)',
  },
  sheetWrap: {
    ...StyleSheet.absoluteFill,
    paddingHorizontal: 12,
  },
  card: {
    maxHeight: '78%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.gold + '66',
    backgroundColor: 'rgba(13, 10, 20, 0.94)',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kicker: {
    color: Colors.dark.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  close: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  readout: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  scroll: {
    marginTop: 8,
  },
  body: {
    paddingBottom: 12,
    gap: 12,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    color: Colors.dark.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.surface,
    color: Colors.dark.text,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.gold + '66',
    backgroundColor: Colors.dark.surface,
    alignItems: 'center',
  },
  btnWide: {
    alignSelf: 'stretch',
  },
  btnDanger: {
    borderColor: Colors.dark.ruby + '88',
  },
  btnDisabled: {
    opacity: 0.45,
  },
  btnPressed: {
    opacity: 0.8,
  },
  btnLabel: {
    color: Colors.dark.gold,
    fontSize: 13,
    fontWeight: '800',
  },
  btnLabelDanger: {
    color: Colors.dark.ruby,
  },
  note: {
    color: Colors.dark.cyan,
    fontSize: 12,
    fontWeight: '700',
  },
});

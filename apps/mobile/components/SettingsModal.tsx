import { StyleSheet, Switch, Text, View } from 'react-native';

import { useHapticsStore } from '@/lib/hapticsGate';
import { BottomSheet } from '@/ui/BottomSheet';
import { ButtonPrimary } from '@/ui/Button';
import { Glyph } from '@/ui/Glyph';
import { tokens } from '@/ui/tokens';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SettingsModal({ visible, onClose }: Props) {
  const hapticsEnabled = useHapticsStore((s) => s.hapticsEnabled);
  const setHapticsEnabled = useHapticsStore((s) => s.setHapticsEnabled);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.row}>
        <View style={styles.well}>
          <Glyph name="settings" size={22} color={tokens.brand} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.rowTitle}>Haptics</Text>
          <Text style={styles.rowSub}>Vibration on taps and quests</Text>
        </View>
        <Switch
          value={hapticsEnabled}
          onValueChange={setHapticsEnabled}
          trackColor={{ false: tokens.surface3, true: tokens.brand }}
          thumbColor={tokens.surface}
        />
      </View>
      <ButtonPrimary label="Done" onPress={onClose} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: tokens.font900,
    fontSize: 22,
    color: tokens.ink,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    marginBottom: 12,
  },
  well: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: tokens.font800,
    fontSize: 16,
    color: tokens.ink,
  },
  rowSub: {
    fontFamily: tokens.font700,
    fontSize: 14,
    color: tokens.ink2,
    marginTop: 2,
  },
});

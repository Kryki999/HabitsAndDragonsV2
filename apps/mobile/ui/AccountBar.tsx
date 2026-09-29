import { forwardRef, useImperativeHandle, useRef, useState, type ComponentType, type RefObject } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import SettingsModal from '@/components/SettingsModal';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { Avatar } from '@/ui/Avatar';
import { CurrencyPill } from '@/ui/CurrencyPill';
import { IconButton } from '@/ui/IconButton';
import { shadowOnCanvas, tokens } from '@/ui/tokens';
import { useHeroStore } from '@/hero/store';

type DevToolsPanelProps = { visible: boolean; onClose: () => void };

const DevToolsPanel: ComponentType<DevToolsPanelProps> | null = __DEV__
  ? (require('../components/DevToolsPanel').default as ComponentType<DevToolsPanelProps>)
  : null;

export type AccountBarHandle = {
  goldCenter: () => Promise<{ x: number; y: number } | null>;
  keyCenter: () => Promise<{ x: number; y: number } | null>;
  popGold: () => void;
  popKey: () => void;
};

function measureCenter(ref: RefObject<View | null>) {
  return new Promise<{ x: number; y: number } | null>((resolve) => {
    const node = ref.current;
    if (!node) {
      resolve(null);
      return;
    }
    node.measureInWindow((x, y, width, height) => {
      if (width === 0 && height === 0) resolve(null);
      else resolve({ x: x + width / 2, y: y + height / 2 });
    });
  });
}

export const AccountBar = forwardRef<AccountBarHandle>(function AccountBar(_props, ref) {
  const gold = useHeroStore((s) => s.gold);
  const dungeonKeys = useHeroStore((s) => s.dungeonKeys ?? 0);
  const playerLevel = useHeroStore((s) => s.playerLevel);
  const heroDisplayName = useHeroStore((s) => s.heroDisplayName);
  const name = (heroDisplayName?.trim() || 'Wayfarer').slice(0, 48);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [devOpen, setDevOpen] = useState(false);
  const [goldPop, setGoldPop] = useState(0);
  const [keyPop, setKeyPop] = useState(0);
  const goldRef = useRef<View>(null);
  const keyRef = useRef<View>(null);

  useImperativeHandle(ref, () => ({
    goldCenter: () => measureCenter(goldRef),
    keyCenter: () => measureCenter(keyRef),
    popGold: () => setGoldPop((n) => n + 1),
    popKey: () => setKeyPop((n) => n + 1),
  }));

  const openDev = __DEV__
    ? () => {
        impactAsync(ImpactFeedbackStyle.Medium);
        setDevOpen(true);
      }
    : undefined;

  return (
    <View testID="account-bar" accessibilityRole="header" style={styles.bar}>
      {DevToolsPanel ? <DevToolsPanel visible={devOpen} onClose={() => setDevOpen(false)} /> : null}
      <SettingsModal visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <Pressable
        testID="account-level"
        accessibilityRole="button"
        accessibilityLabel={`${name}, Level ${playerLevel}`}
        onLongPress={openDev}
        delayLongPress={450}
        style={styles.who}
      >
        <Avatar size={44} />
        <View style={styles.whoText}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.level}>Lv {playerLevel}</Text>
        </View>
      </Pressable>
      <View style={styles.spacer} />
      <CurrencyPill
        ref={goldRef}
        sticker="coin"
        value={gold}
        popSignal={goldPop}
        testID="account-gold"
        accessibilityLabel={`${gold} gold`}
      />
      <CurrencyPill
        ref={keyRef}
        sticker="key"
        value={dungeonKeys}
        popSignal={keyPop}
        testID="account-keys"
        accessibilityLabel={`${dungeonKeys} keys`}
      />
      <IconButton
        glyph="settings"
        size={40}
        accessibilityLabel="Settings"
        testID="account-settings"
        onPress={() => {
          impactAsync(ImpactFeedbackStyle.Light);
          setSettingsOpen(true);
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  bar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  who: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
    minWidth: 0,
  },
  whoText: {
    flexShrink: 1,
    minWidth: 0,
    gap: 3,
  },
  name: {
    fontFamily: tokens.font900,
    fontSize: 17,
    lineHeight: 18,
    color: tokens.onCanvas,
    ...shadowOnCanvas,
  },
  level: {
    fontFamily: tokens.font800,
    fontSize: 12,
    lineHeight: 14,
    color: tokens.onCanvas,
    opacity: 0.92,
    ...shadowOnCanvas,
  },
  spacer: {
    flex: 1,
    minWidth: 4,
  },
});

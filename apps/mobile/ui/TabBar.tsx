import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (event: { type: 'tabPress'; target: string; canPreventDefault: true }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

import { Avatar } from '@/ui/Avatar';
import { Sticker } from '@/ui/Sticker';
import type { StickerName } from '@/ui/stickerRegistry';
import { shadowOnCanvas, tokens } from '@/ui/tokens';
import { useSocialStore } from '@/social/store';

const TABS: { name: string; label: string; sticker?: StickerName; avatar?: boolean }[] = [
  { name: 'index', label: 'Quests', sticker: 'scroll' },
  { name: 'world', label: 'World', sticker: 'worldMap' },
  { name: 'hero', label: 'Hero', avatar: true },
  { name: 'social', label: 'Social', sticker: 'handshake' },
  { name: 'mentor', label: 'Path', sticker: 'crown' },
];

export function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const padBottom = Math.max(insets.bottom, 30);
  const pendingInvite = useSocialStore((s) => s.pendingInbound.length > 0);

  return (
    <View style={[styles.bar, { paddingBottom: padBottom, height: 66 + padBottom }]}>
      {state.routes.map((route, index) => {
        const meta = TABS.find((tab) => tab.name === route.name) ?? {
          name: route.name,
          label: route.name,
          sticker: 'scroll' as const,
        };
        const active = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!active && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={meta.label}
            style={[styles.tab, active && styles.tabActive]}
          >
            <TabMark meta={meta} />
            {meta.name === 'social' && pendingInvite ? <View style={styles.badge} /> : null}
            <Text style={[styles.label, active ? styles.labelActive : styles.labelIdle]}>{meta.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function TabMark({ meta }: { meta: (typeof TABS)[number] }) {
  if (meta.avatar) return <Avatar size={36} borderWidth={2} />;
  if (meta.sticker) return <Sticker name={meta.sticker} size={34} />;
  return null;
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: tokens.canvasHi,
    borderTopLeftRadius: tokens.rLg,
    borderTopRightRadius: tokens.rLg,
    flexDirection: 'row',
    paddingTop: 8,
    paddingHorizontal: 8,
    boxShadow: '0 -1px 0 rgba(255,255,255,0.55) inset, 0 -8px 24px rgba(40, 50, 140, 0.14)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    borderRadius: 18,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: '28%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.danger,
    borderWidth: 1.5,
    borderColor: tokens.canvasHi,
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  label: {
    fontFamily: tokens.font800,
    fontSize: 12,
    lineHeight: 14,
  },
  labelIdle: {
    color: tokens.onCanvas,
    ...shadowOnCanvas,
  },
  labelActive: {
    color: tokens.canvasInk,
  },
});

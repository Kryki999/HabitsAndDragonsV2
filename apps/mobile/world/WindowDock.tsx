import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Map as MapIcon } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import type { LocationWindowDef } from './catalog';
import IconHit from './IconHit';
import type { LocationWindowId } from './types';

export type DockItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  onPress: () => void;
  active?: boolean;
  muted?: boolean;
};

type Props = {
  windows: LocationWindowDef[];
  currentWindowId: LocationWindowId;
  onSelectWindow: (id: LocationWindowId) => void;
  /** First slot: jump back to the kingdom map. */
  onMap?: () => void;
  extra?: DockItem[];
};

/** Right-rail icon nav between location windows. Phone-first ~48px hits. */
export default function WindowDock({ windows, currentWindowId, onSelectWindow, onMap, extra }: Props) {
  return (
    <View pointerEvents="box-none" style={styles.rail}>
      {onMap ? (
        <IconHit icon={MapIcon} accessibilityLabel="Kingdom map" caption="Map" onPress={onMap} size={48} />
      ) : null}
      {windows.map((win) => (
        <IconHit
          key={win.id}
          icon={win.icon}
          accessibilityLabel={win.label}
          caption={win.label}
          active={win.id === currentWindowId}
          onPress={() => onSelectWindow(win.id)}
          size={48}
        />
      ))}
      {extra?.map((item) => (
        <IconHit
          key={item.id}
          icon={item.icon}
          accessibilityLabel={item.label}
          caption={item.label}
          active={item.active}
          muted={item.muted}
          onPress={item.onPress}
          size={48}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    position: 'absolute',
    right: 8,
    top: '22%',
    zIndex: 8,
    gap: 10,
    alignItems: 'center',
  },
});

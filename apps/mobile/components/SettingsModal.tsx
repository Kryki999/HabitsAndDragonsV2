import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Vibrate, X } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useHapticsStore } from '@/lib/hapticsGate';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SettingsModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const hapticsEnabled = useHapticsStore((s) => s.hapticsEnabled);
  const setHapticsEnabled = useHapticsStore((s) => s.setHapticsEnabled);
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(slide, { toValue: 0, friction: 9, tension: 65, useNativeDriver: true }),
      ]).start();
    } else {
      fade.setValue(0);
      slide.setValue(24);
    }
  }, [fade, slide, visible]);

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <Animated.View style={[styles.backdrop, { opacity: fade }]} />
        </Pressable>
        <Animated.View
          style={[
            styles.sheetWrap,
            { paddingBottom: Math.max(insets.bottom, 16) + 12, opacity: fade, transform: [{ translateY: slide }] },
          ]}
        >
          <LinearGradient colors={['#1e1830', '#120e1c']} style={styles.sheet} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Settings</Text>
              <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn} accessibilityLabel="Close settings">
                <X size={22} color={Colors.dark.textMuted} />
              </Pressable>
            </View>

            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <Vibrate size={20} color={Colors.dark.gold} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Haptics</Text>
                <Text style={styles.rowSub}>Vibration on taps and quests</Text>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
                trackColor={{ false: '#3a3248', true: Colors.dark.emerald + '88' }}
                thumbColor={hapticsEnabled ? Colors.dark.emerald : '#9a8fb0'}
              />
            </View>

            <Pressable onPress={onClose} style={styles.doneOuter}>
              <LinearGradient colors={[...Colors.gradients.purple]} style={styles.doneBtn}>
                <Text style={styles.doneText}>Done</Text>
              </LinearGradient>
            </Pressable>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  sheetWrap: {
    paddingHorizontal: 16,
  },
  sheet: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.dark.text,
  },
  closeBtn: {
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border + '55',
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  rowSub: {
    fontSize: 12,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  doneOuter: {
    marginTop: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },
  doneBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
});

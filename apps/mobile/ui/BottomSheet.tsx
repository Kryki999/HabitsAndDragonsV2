import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tokens } from '@/ui/tokens';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Tall sheet for calendar and multi-step add-habit. */
  fill?: boolean;
};

export function BottomSheet({ visible, onClose, children, fill = false }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
      presentationStyle="overFullScreen"
    >
      <View style={styles.root}>
        <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Close" />
        <View
          style={[
            styles.sheet,
            fill ? styles.fill : styles.hug,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <View style={styles.handle} />
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: tokens.scrim,
  },
  sheet: {
    backgroundColor: tokens.surface,
    borderTopLeftRadius: tokens.rLg,
    borderTopRightRadius: tokens.rLg,
    paddingTop: 10,
    paddingHorizontal: 16,
    position: 'relative',
    zIndex: 2,
  },
  hug: {
    maxHeight: '86%',
  },
  fill: {
    height: '92%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: tokens.rPill,
    backgroundColor: tokens.surface3,
    alignSelf: 'center',
    marginBottom: 12,
  },
});

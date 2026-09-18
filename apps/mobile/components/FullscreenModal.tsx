import React from "react";
import { Modal, StyleSheet, View, type ModalProps } from "react-native";

type Props = {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  animationType?: ModalProps["animationType"];
};

/**
 * Edge-to-edge sheet host for Android + iOS.
 * RN Dialog/Modal otherwise leaves see-through strips at the status bar
 * and navigation bar. Content should pad with SafeAreaView / insets;
 * this shell must paint the full window.
 */
export default function FullscreenModal({
  visible,
  onRequestClose,
  children,
  animationType = "slide",
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={onRequestClose}
    >
      <View style={styles.root} collapsable={false}>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    ...StyleSheet.absoluteFill,
    backgroundColor: "#080510",
  },
});

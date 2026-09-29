import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { shadow, tokens } from '@/ui/tokens';

type Props = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Card({ children, style, testID }: Props) {
  return (
    <View style={[styles.card, style]} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.surface,
    borderRadius: tokens.rLg,
    boxShadow: [shadow.cardLip, shadow.dropSm],
  },
});

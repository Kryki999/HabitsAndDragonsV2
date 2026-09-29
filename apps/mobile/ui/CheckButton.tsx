import { StyleSheet } from 'react-native';

import { Glyph } from '@/ui/Glyph';
import { PressableLip } from '@/ui/PressableLip';
import { shadow, tokens } from '@/ui/tokens';

type Props = {
  done?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
};

export function CheckButton({ done = false, disabled, onPress, accessibilityLabel, testID }: Props) {
  return (
    <PressableLip
      onPress={onPress}
      disabled={disabled}
      face={done ? tokens.success : tokens.surface2}
      lip={done ? shadow.lipSuccess : shadow.lipSurface}
      radius={16}
      style={styles.box}
      accessibilityLabel={accessibilityLabel ?? (done ? 'Completed' : 'Mark complete')}
      testID={testID}
    >
      <Glyph name="check" size={26} color={done ? tokens.onCanvas : tokens.brand} />
    </PressableLip>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 56,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

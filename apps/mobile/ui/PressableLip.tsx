import { useRef, useState, type ReactNode } from 'react';
import { Animated, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { shadow, tokens } from '@/ui/tokens';

type Lip = (typeof shadow)[keyof typeof shadow];

type Props = {
  onPress?: () => void;
  disabled?: boolean;
  lip: Lip;
  extraShadow?: Lip;
  radius: number;
  face: string;
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'none';
  testID?: string;
  /** Stretch to the parent width so a pill button fills the row. */
  block?: boolean;
  children: ReactNode;
};

/** Press = scale 0.96 and the lip drops, 90ms. */
export function PressableLip({
  onPress,
  disabled,
  lip,
  extraShadow,
  radius,
  face,
  style,
  accessibilityLabel,
  accessibilityRole = 'button',
  testID,
  block = false,
  children,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const drop = useRef(new Animated.Value(0)).current;
  const [down, setDown] = useState(false);

  const animate = (pressed: boolean) => {
    setDown(pressed);
    Animated.parallel([
      Animated.timing(scale, {
        toValue: pressed ? 0.96 : 1,
        duration: tokens.durPress,
        useNativeDriver: true,
      }),
      Animated.timing(drop, {
        toValue: pressed ? 4 : 0,
        duration: tokens.durPress,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      style={block ? { alignSelf: 'stretch' } : undefined}
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => animate(true)}
      onPressOut={() => animate(false)}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      testID={testID}
    >
      <Animated.View style={[{ transform: [{ translateY: drop }, { scale }] }, block && { alignSelf: 'stretch' }]}>
        <Animated.View
          style={[
            {
              backgroundColor: face,
              borderRadius: radius,
              boxShadow: down ? (extraShadow ? [extraShadow] : []) : extraShadow ? [lip, extraShadow] : [lip],
            },
            style,
          ]}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

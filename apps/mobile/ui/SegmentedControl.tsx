import { Pressable, StyleSheet, Text, View } from 'react-native';

import { shadow, tokens } from '@/ui/tokens';

type Props = {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  /** Track on mist (Buy/Sell). Default = on white. */
  onCanvas?: boolean;
};

export function SegmentedControl({ options, value, onChange, onCanvas = false }: Props) {
  return (
    <View style={[styles.track, onCanvas && styles.trackCanvas]}>
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[
              styles.option,
              active && (onCanvas ? styles.optionOnCanvas : styles.optionOn),
            ]}
          >
            <Text
              style={[
                styles.label,
                onCanvas && styles.labelCanvas,
                active && (onCanvas ? styles.labelOnCanvas : styles.labelOn),
              ]}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: 18,
    backgroundColor: tokens.surface2,
  },
  trackCanvas: {
    backgroundColor: tokens.canvasDeep,
    boxShadow: [{ offsetX: 0, offsetY: 2, blurRadius: 0, color: 'rgba(0,0,0,0.08)', inset: true }],
  },
  option: {
    flex: 1,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionOn: {
    backgroundColor: tokens.brand,
    boxShadow: [shadow.lipBrand],
  },
  optionOnCanvas: {
    backgroundColor: tokens.surface,
    boxShadow: [shadow.lipSurface],
  },
  label: {
    fontFamily: tokens.font800,
    fontSize: 15,
    color: tokens.ink2,
  },
  labelCanvas: {
    color: tokens.onCanvas,
  },
  labelOn: {
    color: tokens.onCanvas,
  },
  labelOnCanvas: {
    color: tokens.ink,
  },
});

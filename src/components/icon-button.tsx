import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { colors } from '@/constants/theme';

type Props = {
  /** Native icon: Apple SF Symbol on iPhone, Material Symbol on Android. */
  icon: SymbolViewProps['name'];
  /** Read aloud by screen readers, since the button has no text. */
  label: string;
  onPress: () => void;
  /** Invisible and untappable, but still takes up space so layout doesn't jump. */
  hidden?: boolean;
};

export function IconButton({ icon, label, onPress, hidden = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityElementsHidden={hidden}
      disabled={hidden}
      hitSlop={12}
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed, hidden && styles.hidden]}
    >
      <SymbolView name={icon} size={26} tintColor={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.6,
  },
  hidden: {
    opacity: 0,
  },
});

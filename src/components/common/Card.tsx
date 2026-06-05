/**
 * Card — reusable surface container
 *
 * Usage:
 *   <Card isDark={isDark}>...</Card>
 *   <Card isDark={isDark} onPress={...} accessibilityLabel="Open quiz">...</Card>
 */
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface CardProps {
  children: React.ReactNode;
  isDark: boolean;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  /** Extra left border colour for subject/category cards */
  accentColor?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export default function Card({
  children,
  isDark,
  onPress,
  style,
  accentColor,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: CardProps) {
  const bg = isDark ? '#161B27' : '#ffffff';
  const borderColor = isDark ? '#2A2D3A' : '#f3f4f6';

  const containerStyle: ViewStyle[] = [
    styles.card,
    { backgroundColor: bg, borderColor },
    accentColor
      ? { borderLeftColor: accentColor, borderLeftWidth: 4 }
      : undefined,
    ...(Array.isArray(style) ? style : style ? [style] : []),
  ].filter(Boolean) as ViewStyle[];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.75}
        style={containerStyle}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 0.5,
    padding: 16,
  },
});

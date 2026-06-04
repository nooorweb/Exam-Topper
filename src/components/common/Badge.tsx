/**
 * Badge — reusable status/label pill.
 *
 * Usage:
 *   <Badge label="CRITICAL" color="#ef4444" isDark={isDark} />
 *   <Badge label="Live Sync" color="#10b981" icon={<Wifi size={10} color="#10b981" />} isDark={isDark} />
 */
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Text from './Text';

interface BadgeProps {
  label: string;
  color: string;
  isDark?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  /** Override background opacity. Default: 0.12 */
  bgOpacity?: number;
}

export default function Badge({ label, color, icon, style, bgOpacity = 0.12 }: BadgeProps) {
  // Build a hex bg by appending alpha — works with standard 6-digit hex colours
  const hexAlpha = Math.round(bgOpacity * 255)
    .toString(16)
    .padStart(2, '0');
  const bg = color.startsWith('#') && color.length === 7
    ? `${color}${hexAlpha}`
    : `${color}20`;

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  icon: {
    flexShrink: 0,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

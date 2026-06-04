/**
 * ToggleRow — settings toggle row with label, description, Switch and optional divider.
 *
 * Usage:
 *   <ToggleRow
 *     label="Dark Mode"
 *     sub="Switch between light and dark theme"
 *     value={isDark}
 *     onToggle={toggleTheme}
 *     isDark={isDark}
 *   />
 */
import React from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import Text from './Text';

interface ToggleRowProps {
  label: string;
  sub?: string;
  value: boolean;
  onToggle: () => void;
  isDark: boolean;
  separator?: boolean;
  /** Replace switch with a custom right-hand element */
  rightElement?: React.ReactNode;
}

export default function ToggleRow({
  label,
  sub,
  value,
  onToggle,
  isDark,
  separator = true,
  rightElement,
}: ToggleRowProps) {
  const borderColor = isDark ? '#1f1f23' : '#e5e7eb';
  const textColor = isDark ? '#f4f4f5' : '#1f2937';
  const mutedColor = isDark ? '#6b7280' : '#9ca3af';

  return (
    <View
      style={[
        styles.row,
        separator && { borderBottomWidth: 1, borderBottomColor: borderColor },
      ]}
    >
      <View style={styles.textGroup}>
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        {sub ? (
          <Text style={[styles.sub, { color: mutedColor }]}>{sub}</Text>
        ) : null}
      </View>

      {rightElement ?? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#374151', true: '#a5b4fc' }}
          thumbColor={value ? '#6366f1' : '#9ca3af'}
          accessibilityRole="switch"
          accessibilityLabel={label}
          accessibilityState={{ checked: value }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // Minimum 44pt touch area
    minHeight: 52,
    paddingVertical: 10,
    gap: 10,
  },
  textGroup: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  sub: {
    fontSize: 10,
    marginTop: 3,
    lineHeight: 14,
  },
});

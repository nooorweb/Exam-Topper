/**
 * SectionHeader — small uppercase section label with an optional icon.
 *
 * Usage:
 *   <SectionHeader icon={<Bell size={13} color={C.primary} />} title="NOTIFICATIONS" isDark={isDark} />
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Text';

interface SectionHeaderProps {
  title: string;
  isDark: boolean;
  icon?: React.ReactNode;
}

export default function SectionHeader({ title, isDark, icon }: SectionHeaderProps) {
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const mutedColor = isDark ? '#6b7280' : '#9ca3af';

  return (
    <View style={[styles.header, { borderBottomColor: borderColor }]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.title, { color: mutedColor }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  icon: {
    flexShrink: 0,
  },
  title: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});

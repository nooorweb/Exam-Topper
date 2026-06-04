/**
 * EmptyState — centred icon + title + subtitle for empty list states.
 *
 * Usage:
 *   <EmptyState
 *     icon={<HelpCircle size={32} color={colors.textMuted} />}
 *     title="No matching words found"
 *     subtitle="Try modifying your search or check bookmarks."
 *     isDark={isDark}
 *   />
 */
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Card from './Card';
import Text from './Text';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  isDark: boolean;
  style?: ViewStyle;
  /** Optional CTA button rendered below the text */
  action?: React.ReactNode;
}

export default function EmptyState({
  icon,
  title,
  subtitle,
  isDark,
  style,
  action,
}: EmptyStateProps) {
  const textColor = isDark ? '#f4f4f5' : '#1f2937';
  const mutedColor = isDark ? '#9ca3af' : '#6b7280';

  const cardStyle = style ? [styles.card, style] : [styles.card];

  return (
    <Card isDark={isDark} style={cardStyle}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.sub, { color: mutedColor }]}>{subtitle}</Text>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 10,
  },
  iconWrap: {
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  sub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  action: {
    marginTop: 8,
    width: '100%',
  },
});

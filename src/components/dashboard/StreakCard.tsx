/**
 * StreakCard.tsx
 * Shows current streak, longest streak, and a 7-day activity calendar dot strip.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../common';
import { Flame, TrendingUp, Calendar } from 'lucide-react-native';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  totalQuestions: number;
  accuracy: number;         // 0–100
  lastActiveDate: string | null;
  isDark: boolean;
}

export default function StreakCard({
  currentStreak,
  longestStreak,
  totalQuestions,
  accuracy,
  lastActiveDate,
  isDark,
}: StreakCardProps) {
  const colors = {
    card: isDark ? '#121214' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1f2937',
    textMuted: isDark ? '#6b7280' : '#9ca3af',
    border: isDark ? '#1f1f23' : '#e5e7eb',
    primary: '#6366f1',
    amber: '#f59e0b',
    success: '#10b981',
  };

  // Build last 7 days activity dots
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const isActive = lastActiveDate !== null && dateStr <= lastActiveDate;
    const isToday = i === 6;
    return { dateStr, isActive, isToday, label: ['S','M','T','W','T','F','S'][d.getDay()] };
  });

  const streakActive = currentStreak > 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBg, { backgroundColor: streakActive ? 'rgba(245,158,11,0.12)' : (isDark ? '#1c1c1f' : '#f3f4f6') }]}>
            <Flame size={16} color={streakActive ? colors.amber : colors.textMuted} fill={streakActive ? colors.amber : 'none'} />
          </View>
          <View>
            <Text style={[styles.label, { color: colors.textMuted }]}>DAILY STREAK</Text>
            <Text style={[styles.streakNum, { color: streakActive ? colors.amber : colors.text }]}>
              {currentStreak}
              <Text style={[styles.streakUnit, { color: colors.textMuted }]}> days</Text>
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={[styles.longestBadge, { backgroundColor: isDark ? '#1c1c1f' : '#f3f4f6' }]}>
            <TrendingUp size={10} color={colors.primary} />
            <Text style={[styles.longestText, { color: colors.primary }]}>Best: {longestStreak}d</Text>
          </View>
        </View>
      </View>

      {/* 7-day dot calendar */}
      <View style={styles.dotsRow}>
        {days.map((day, i) => (
          <View key={i} style={styles.dotCol}>
            <Text style={[styles.dayLabel, { color: colors.textMuted }]}>{day.label}</Text>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: day.isToday && streakActive
                    ? colors.amber
                    : day.isActive
                    ? `${colors.primary}80`
                    : (isDark ? '#27272a' : '#f3f4f6'),
                  borderWidth: day.isToday ? 2 : 0,
                  borderColor: day.isToday ? colors.amber : 'transparent',
                },
              ]}
            />
          </View>
        ))}
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Bottom stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statVal, { color: colors.text }]}>{totalQuestions}</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>PRACTICED</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statVal, { color: accuracy >= 70 ? colors.success : accuracy >= 50 ? colors.amber : '#ef4444' }]}>
            {accuracy}%
          </Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>ACCURACY</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statVal, { color: colors.text }]}>{longestStreak}</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>BEST STREAK</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerRight: {},
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  streakNum: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  streakUnit: { fontSize: 14, fontWeight: '400' },
  longestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  longestText: { fontSize: 11, fontWeight: '700' },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dotCol: { alignItems: 'center', gap: 4 },
  dayLabel: { fontSize: 9, fontWeight: '600' },
  dot: { width: 28, height: 28, borderRadius: 8 },
  divider: { height: 1, opacity: 0.5 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: { flex: 1, alignItems: 'center', gap: 3 },
  statVal: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
  statDivider: { width: 1, height: 28 },
});

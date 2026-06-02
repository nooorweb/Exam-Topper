import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import {
  Database,
  BookMarked,
  Flame,
  CheckCircle2,
  Award,
  TrendingUp,
} from 'lucide-react-native';

export function ProfileStats() {
  const { mcqs, vocab, stats, currentTheme } = useApp();
  const isDark = currentTheme === 'dark';

  const colors = {
    bg: isDark ? '#09090b' : '#f9fafb',
    card: isDark ? '#121214' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1f2937',
    textMuted: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#1f1f23' : '#e5e7eb',
    primary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  };

  const totalSessions = stats?.sessions?.length || 0;
  const streak = stats?.streak || 0;
  const totalQuestions = stats?.totalQuestionsAnswered || 0;
  const accuracy = totalQuestions > 0
    ? `${Math.round((stats.correctAnswersCount / totalQuestions) * 100)}%`
    : '0%';

  const statItems = [
    {
      label: 'MCQs Loaded',
      val: mcqs.length,
      color: '#6366f1',
      bgLight: 'rgba(99, 102, 241, 0.1)',
      icon: <Database size={16} color="#6366f1" />,
    },
    {
      label: 'Vocab Cards',
      val: vocab.length,
      color: '#8b5cf6',
      bgLight: 'rgba(139, 92, 246, 0.1)',
      icon: <BookMarked size={16} color="#8b5cf6" />,
    },
    {
      label: 'Quiz Sessions',
      val: totalSessions,
      color: '#06b6d4',
      bgLight: 'rgba(6, 182, 212, 0.1)',
      icon: <Award size={16} color="#06b6d4" />,
    },
    {
      label: 'Study Streak',
      val: `${streak}d`,
      color: '#f59e0b',
      bgLight: 'rgba(245, 158, 11, 0.1)',
      icon: <Flame size={16} color="#f59e0b" fill="#f59e0b" />,
    },
    {
      label: 'Qs Answered',
      val: totalQuestions,
      color: '#10b981',
      bgLight: 'rgba(16, 185, 129, 0.1)',
      icon: <CheckCircle2 size={16} color="#10b981" />,
    },
    {
      label: 'Accuracy',
      val: accuracy,
      color: '#ef4444',
      bgLight: 'rgba(239, 68, 68, 0.1)',
      icon: <TrendingUp size={16} color="#ef4444" />,
    },
  ];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <TrendingUp size={15} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>YOUR LEARNING DASHBOARD</Text>
      </View>
      
      <View style={styles.grid}>
        {statItems.map((item) => (
          <View
            key={item.label}
            style={[
              styles.statBox,
              {
                backgroundColor: isDark ? '#1c1c1f' : '#f9fafb',
                borderColor: colors.border,
              },
            ]}
          >
            <View style={[styles.iconBg, { backgroundColor: item.bgLight }]}>
              {item.icon}
            </View>
            <Text style={[styles.statVal, { color: item.color }]}>{item.val}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.08)',
    paddingBottom: 8,
  },
  title: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  statBox: {
    width: '48.5%',
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconBg: {
    padding: 6,
    borderRadius: 8,
    marginBottom: 6,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 8.5,
    fontWeight: 'bold',
    marginTop: 2,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
});

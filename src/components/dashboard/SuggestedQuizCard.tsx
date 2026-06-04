/**
 * SuggestedQuizCard.tsx
 * "Suggested For You" horizontal scroll of recommended MCQ sets.
 * Zero Supabase reads — powered by useRecommendations (local logic).
 */
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text } from '../common';
import { Sparkles, Play, BookOpen, Globe, Calculator, Monitor, Award, ChevronRight } from 'lucide-react-native';
import type { MCQ } from '../../types';

interface SuggestedQuizCardProps {
  suggested: MCQ[];
  isDark: boolean;
  onStartQuiz: (category: string, mcqIds: string[]) => void;
}

const CATEGORY_META: Record<string, { color: string; shortLabel: string; Icon: any }> = {
  'English':           { color: '#3b82f6', shortLabel: 'ENG', Icon: BookOpen },
  'General Knowledge': { color: '#f97316', shortLabel: 'GK',  Icon: Globe },
  'Pakistan Studies':  { color: '#ef4444', shortLabel: 'PAK', Icon: Award },
  'Mathematics':       { color: '#10b981', shortLabel: 'MATH', Icon: Calculator },
  'Computer Science':  { color: '#a855f7', shortLabel: 'CS',  Icon: Monitor },
  'Islamiat':          { color: '#f59e0b', shortLabel: 'ISL', Icon: BookOpen },
};

export default function SuggestedQuizCard({ suggested, isDark, onStartQuiz }: SuggestedQuizCardProps) {
  const colors = {
    card: isDark ? '#121214' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1f2937',
    textMuted: isDark ? '#6b7280' : '#9ca3af',
    border: isDark ? '#1f1f23' : '#e5e7eb',
    primary: '#6366f1',
    primaryDim: isDark ? 'rgba(99,102,241,0.12)' : '#e0e7ff',
  };

  // Group suggested into mini-sets of 5 per category
  const sets = React.useMemo(() => {
    const grouped: Record<string, MCQ[]> = {};
    for (const mcq of suggested) {
      if (!grouped[mcq.category]) grouped[mcq.category] = [];
      if (grouped[mcq.category].length < 10) grouped[mcq.category].push(mcq);
    }
    return Object.entries(grouped).map(([category, mcqs]) => ({
      category,
      mcqs,
      count: mcqs.length,
      meta: CATEGORY_META[category] ?? { color: '#6366f1', shortLabel: '?', Icon: Sparkles },
    }));
  }, [suggested]);

  if (sets.length === 0) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.headerRow}>
          <Sparkles size={14} color={colors.primary} />
          <Text style={[styles.headerLabel, { color: colors.textMuted }]}>SUGGESTED FOR YOU</Text>
        </View>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          Complete a quiz to unlock personalised suggestions.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.sparklesBg, { backgroundColor: colors.primaryDim }]}>
            <Sparkles size={13} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.headerLabel, { color: colors.textMuted }]}>SUGGESTED FOR YOU</Text>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Personalised Sets</Text>
          </View>
        </View>
        <Text style={[styles.setCount, { color: colors.textMuted }]}>{sets.length} sets</Text>
      </View>

      {/* Horizontal scroll of set cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sets.map((set) => {
          const Icon = set.meta.Icon;
          const col = set.meta.color;
          return (
            <TouchableOpacity
              key={set.category}
              onPress={() => onStartQuiz(set.category, set.mcqs.map((m) => m.id))}
              style={[
                styles.setCard,
                {
                  backgroundColor: isDark ? '#18181b' : '#fafafa',
                  borderColor: `${col}30`,
                },
              ]}
            >
              {/* Icon circle */}
              <View style={[styles.setIconCircle, { backgroundColor: `${col}18` }]}>
                <Icon size={22} color={col} />
              </View>

              {/* Short label */}
              <View style={[styles.shortLabelBadge, { backgroundColor: `${col}15` }]}>
                <Text style={[styles.shortLabel, { color: col }]}>{set.meta.shortLabel}</Text>
              </View>

              {/* Category name */}
              <Text style={[styles.setCatName, { color: colors.text }]} numberOfLines={2}>
                {set.category}
              </Text>

              {/* Question count */}
              <Text style={[styles.setQCount, { color: colors.textMuted }]}>
                {set.count} Questions
              </Text>

              {/* Difficulty dots */}
              <View style={styles.diffDots}>
                {[1, 2, 3].map((d) => (
                  <View
                    key={d}
                    style={[
                      styles.diffDot,
                      {
                        backgroundColor: d <= 2 ? col : (isDark ? '#27272a' : '#e5e7eb'),
                        opacity: d <= 2 ? 0.8 : 0.3,
                      },
                    ]}
                  />
                ))}
                <Text style={[styles.diffLabel, { color: colors.textMuted }]}>Medium</Text>
              </View>

              {/* Start button */}
              <TouchableOpacity
                onPress={() => onStartQuiz(set.category, set.mcqs.map((m) => m.id))}
                style={[styles.startBtn, { backgroundColor: col }]}
              >
                <Play size={11} color="#fff" fill="#fff" />
                <Text style={styles.startBtnText}>Start</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}

        {/* "See All" card */}
        <TouchableOpacity
          onPress={() => onStartQuiz('mixed', [])}
          style={[
            styles.setCard,
            styles.seeAllCard,
            { backgroundColor: colors.primaryDim, borderColor: `${colors.primary}30` },
          ]}
        >
          <ChevronRight size={28} color={colors.primary} />
          <Text style={[styles.seeAllText, { color: colors.primary }]}>Mixed{'\n'}Practice</Text>
          <Text style={[styles.seeAllSub, { color: colors.primary }]}>All subjects</Text>
        </TouchableOpacity>
      </ScrollView>
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
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  sparklesBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  headerTitle: { fontSize: 15, fontWeight: '700', marginTop: 1 },
  setCount: { fontSize: 11, fontWeight: '600' },
  scrollContent: { gap: 10, paddingRight: 4 },
  setCard: {
    width: 140,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    gap: 8,
  },
  setIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortLabelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  shortLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  setCatName: { fontSize: 13, fontWeight: '700', lineHeight: 17 },
  setQCount: { fontSize: 10, fontWeight: '500' },
  diffDots: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  diffDot: { width: 6, height: 6, borderRadius: 3 },
  diffLabel: { fontSize: 9, fontWeight: '500', marginLeft: 2 },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 2,
  },
  startBtnText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  seeAllCard: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  seeAllText: { fontSize: 14, fontWeight: '800', textAlign: 'center', lineHeight: 18 },
  seeAllSub: { fontSize: 10, fontWeight: '500', opacity: 0.7 },
  emptyText: { fontSize: 12, lineHeight: 18 },
});

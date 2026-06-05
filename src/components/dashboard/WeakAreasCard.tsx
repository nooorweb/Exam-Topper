/**
 * WeakAreasCard.tsx
 * Shows top weak subjects with accuracy bars and a Practice button per area.
 */
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../common';
import { AlertTriangle, ChevronRight, TrendingDown } from 'lucide-react-native';
import type { WeakArea } from '../../services/analytics.service';

interface WeakAreasCardProps {
  weakAreas: WeakArea[];
  isDark: boolean;
  onPractice: (category: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'English': '#3b82f6',
  'General Knowledge': '#f97316',
  'Pakistan Studies': '#ef4444',
  'Mathematics': '#10b981',
  'Computer Science': '#a855f7',
  'Islamiat': '#f59e0b',
};

export default function WeakAreasCard({ weakAreas, isDark, onPractice }: WeakAreasCardProps) {
  const colors = {
    card: isDark ? '#121214' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1f2937',
    textMuted: isDark ? '#6b7280' : '#9ca3af',
    border: isDark ? '#1f1f23' : '#e5e7eb',
    primary: '#6366f1',
    danger: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
  };

  const getAccuracyColor = (pct: number) => {
    if (pct < 40) return colors.danger;
    if (pct < 65) return colors.warning;
    return colors.success;
  };

  if (weakAreas.length === 0) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.emptyState}>
          <TrendingDown size={24} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No data yet</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>
            Complete a quiz to see your weak areas appear here.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBg, { backgroundColor: 'rgba(239,68,68,0.10)' }]}>
            <AlertTriangle size={15} color={colors.danger} />
          </View>
          <View>
            <Text style={[styles.headerLabel, { color: colors.textMuted }]}>NEEDS WORK</Text>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Weak Areas</Text>
          </View>
        </View>
        <View style={[styles.countBadge, { backgroundColor: isDark ? '#1c1c1f' : '#f3f4f6' }]}>
          <Text style={[styles.countText, { color: colors.primary }]}>{weakAreas.length} found</Text>
        </View>
      </View>

      {/* Area rows */}
      <View style={styles.areaList}>
        {weakAreas.slice(0, 4).map((area, i) => {
          const acColor = getAccuracyColor(area.accuracy_pct);
          const catColor = CATEGORY_COLORS[area.subject] ?? colors.primary;
          return (
            <View key={area.subject}>
              {i > 0 && <View style={[styles.separator, { backgroundColor: colors.border }]} />}
              <View style={styles.areaRow}>
                <View style={styles.areaLeft}>
                  {/* Category color dot */}
                  <View style={[styles.catDot, { backgroundColor: catColor }]} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.areaTopRow}>
                      <Text style={[styles.areaName, { color: colors.text }]} numberOfLines={1}>
                        {area.subject}
                      </Text>
                      <Text style={[styles.areaAccuracy, { color: acColor }]}>
                        {Math.round(area.accuracy_pct)}%
                      </Text>
                    </View>
                    {/* Accuracy bar */}
                    <View style={[styles.barBg, { backgroundColor: isDark ? '#27272a' : '#f3f4f6' }]}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            backgroundColor: acColor,
                            width: `${Math.min(area.accuracy_pct, 100)}%`,
                            opacity: 0.85,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.areaSub, { color: colors.textMuted }]}>
                      {area.incorrect_count} wrong answers
                    </Text>
                  </View>
                </View>

                {/* Practice CTA */}
                <TouchableOpacity
                  onPress={() => onPractice(area.subject)}
                  style={[styles.practiceBtn, { backgroundColor: `${catColor}15`, borderColor: `${catColor}30` }]}
                >
                  <Text style={[styles.practiceBtnText, { color: catColor }]}>Fix</Text>
                  <ChevronRight size={11} color={catColor} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  headerTitle: { fontSize: 15, fontWeight: '700', marginTop: 1 },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  countText: { fontSize: 11, fontWeight: '700' },
  areaList: { gap: 2 },
  separator: { height: 1, marginVertical: 10, opacity: 0.4 },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  areaLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  catDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: -14,
  },
  areaTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  areaName: { fontSize: 12, fontWeight: '600', flex: 1 },
  areaAccuracy: { fontSize: 12, fontWeight: '800' },
  barBg: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  barFill: { height: '100%', borderRadius: 3 },
  areaSub: { fontSize: 9, fontWeight: '500' },
  practiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  practiceBtnText: { fontSize: 11, fontWeight: '800' },
  emptyState: { alignItems: 'center', gap: 8, paddingVertical: 16 },
  emptyTitle: { fontSize: 14, fontWeight: '700' },
  emptySub: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
});

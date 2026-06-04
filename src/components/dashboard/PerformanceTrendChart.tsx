/**
 * PerformanceTrendChart.tsx
 * A pure-RN mini line chart showing score trend over the last 14 days.
 * No external chart library needed — drawn with SVG via react-native-svg.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../common';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import Svg, { Polyline, Circle, Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import type { PerformanceTrendPoint } from '../../services/analytics.service';

interface PerformanceTrendChartProps {
  data: PerformanceTrendPoint[];
  isDark: boolean;
}

const CHART_W = 280;
const CHART_H = 80;
const PADDING = 8;

export default function PerformanceTrendChart({ data, isDark }: PerformanceTrendChartProps) {
  const colors = {
    card: isDark ? '#121214' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1f2937',
    textMuted: isDark ? '#6b7280' : '#9ca3af',
    border: isDark ? '#1f1f23' : '#e5e7eb',
    primary: '#6366f1',
    success: '#10b981',
    danger: '#ef4444',
    grid: isDark ? '#1f1f23' : '#f3f4f6',
  };

  // ─── Compute trend arrow ────────────────────────────────────────────────────
  const avgAll = data.length > 0
    ? data.reduce((s, d) => s + d.score_percent, 0) / data.length
    : 0;
  const recentHalf = data.slice(Math.floor(data.length / 2));
  const avgRecent = recentHalf.length > 0
    ? recentHalf.reduce((s, d) => s + d.score_percent, 0) / recentHalf.length
    : avgAll;
  const trendDelta = Math.round(avgRecent - avgAll);
  const TrendIcon = trendDelta > 2 ? TrendingUp : trendDelta < -2 ? TrendingDown : Minus;
  const trendColor = trendDelta > 2 ? colors.success : trendDelta < -2 ? colors.danger : colors.textMuted;

  // ─── Build chart points ─────────────────────────────────────────────────────
  const buildPoints = () => {
    if (data.length < 2) return null;
    const scores = data.map(d => d.score_percent);
    const minS = Math.max(0, Math.min(...scores) - 10);
    const maxS = Math.min(100, Math.max(...scores) + 10);
    const range = Math.max(maxS - minS, 20);

    const pts = data.map((d, i) => {
      const x = PADDING + (i / (data.length - 1)) * (CHART_W - PADDING * 2);
      const y = CHART_H - PADDING - ((d.score_percent - minS) / range) * (CHART_H - PADDING * 2);
      return { x, y, score: d.score_percent };
    });

    const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');

    // Area fill path
    const areaPath = [
      `M ${pts[0].x},${CHART_H}`,
      pts.map(p => `L ${p.x},${p.y}`).join(' '),
      `L ${pts[pts.length - 1].x},${CHART_H}`,
      'Z',
    ].join(' ');

    return { pts, polyline, areaPath };
  };

  const chart = buildPoints();

  // ─── Empty state ────────────────────────────────────────────────────────────
  if (!chart || data.length < 2) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.header}>
          <Text style={[styles.headerLabel, { color: colors.textMuted }]}>14-DAY TREND</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Performance Chart</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Complete at least 2 quizzes to see your trend.
          </Text>
        </View>
      </View>
    );
  }

  const lastScore = Math.round(data[data.length - 1].score_percent);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerLabel, { color: colors.textMuted }]}>14-DAY TREND</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Performance Chart</Text>
        </View>
        <View style={styles.trendBadge}>
          <TrendIcon size={13} color={trendColor} />
          <Text style={[styles.trendText, { color: trendColor }]}>
            {trendDelta > 0 ? '+' : ''}{trendDelta}%
          </Text>
          <View style={[styles.scorePill, { backgroundColor: isDark ? '#1c1c1f' : '#f3f4f6' }]}>
            <Text style={[styles.scorePillText, { color: colors.primary }]}>Latest: {lastScore}%</Text>
          </View>
        </View>
      </View>

      {/* Y-axis labels */}
      <View style={styles.chartContainer}>
        <View style={styles.yAxis}>
          {[100, 75, 50, 25].map(label => (
            <Text key={label} style={[styles.yLabel, { color: colors.textMuted }]}>{label}</Text>
          ))}
        </View>

        {/* SVG Chart */}
        <View style={{ flex: 1 }}>
          <Svg width="100%" height={CHART_H + 4} viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                <Stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
              </LinearGradient>
            </Defs>

            {/* Grid lines */}
            {[25, 50, 75].map((pct) => {
              const yGrid = CHART_H - PADDING - ((pct - 0) / 100) * (CHART_H - PADDING * 2);
              return (
                <Polyline
                  key={pct}
                  points={`${PADDING},${yGrid} ${CHART_W - PADDING},${yGrid}`}
                  stroke={isDark ? '#27272a' : '#f3f4f6'}
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              );
            })}

            {/* Area fill */}
            <Path d={chart.areaPath} fill="url(#grad)" />

            {/* Line */}
            <Polyline
              points={chart.polyline}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Dots on each data point */}
            {chart.pts.map((pt, i) => (
              <Circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={i === chart.pts.length - 1 ? 5 : 3}
                fill={i === chart.pts.length - 1 ? '#6366f1' : 'white'}
                stroke="#6366f1"
                strokeWidth="2"
              />
            ))}
          </Svg>

          {/* X-axis: first and last date */}
          <View style={styles.xAxis}>
            <Text style={[styles.xLabel, { color: colors.textMuted }]}>
              {data[0]?.completed_at.split('T')[0].slice(5)}
            </Text>
            <Text style={[styles.xLabel, { color: colors.textMuted }]}>Today</Text>
          </View>
        </View>
      </View>

      {/* Bottom summary */}
      <View style={[styles.summaryRow, { borderTopColor: colors.border }]}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryVal, { color: colors.text }]}>{data.length}</Text>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>SESSIONS</Text>
        </View>
        <View style={[styles.summaryDiv, { backgroundColor: colors.border }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryVal, { color: colors.text }]}>{Math.round(avgAll)}%</Text>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>AVG SCORE</Text>
        </View>
        <View style={[styles.summaryDiv, { backgroundColor: colors.border }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryVal, { color: trendColor }]}>
            {trendDelta > 0 ? '↑' : trendDelta < 0 ? '↓' : '→'} {Math.abs(trendDelta)}%
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>TREND</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  headerTitle: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' },
  trendText: { fontSize: 13, fontWeight: '800' },
  scorePill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  scorePillText: { fontSize: 10, fontWeight: '700' },
  chartContainer: { flexDirection: 'row', gap: 8 },
  yAxis: { justifyContent: 'space-between', paddingVertical: 4, width: 24 },
  yLabel: { fontSize: 8, fontWeight: '600', textAlign: 'right' },
  xAxis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  xLabel: { fontSize: 9, fontWeight: '500' },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  summaryItem: { flex: 1, alignItems: 'center', gap: 3 },
  summaryVal: { fontSize: 16, fontWeight: '800' },
  summaryLabel: { fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
  summaryDiv: { width: 1, height: 28 },
  emptyState: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { fontSize: 12, textAlign: 'center' },
});

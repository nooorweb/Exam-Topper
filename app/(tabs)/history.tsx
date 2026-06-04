/**
 * history.tsx
 * Quiz History tab — shows all past sessions from:
 *   1. Cloud (Supabase quiz_attempts) when user is logged in
 *   2. Local stats.sessions as fallback (offline / not logged in)
 * Paginated: loads 20 rows at a time with "Load More" footer.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  History,
  Trophy,
  ChevronDown,
  WifiOff,
} from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { QuizService, type QuizAttemptRow } from '../../src/services/quiz.service';
import SplashLoader from '../../src/components/common/SplashLoader';

// ─── Unified row type (cloud or local) ───────────────────────────────────────

interface HistoryRow {
  id: string;
  category: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSecs: number;
  completedAt: string;
  source: 'cloud' | 'local';
}

const PAGE_SIZE = 20;

// ─── Category colours ─────────────────────────────────────────────────────────

const CAT_COLORS: Record<string, string> = {
  English: '#3b82f6',
  'General Knowledge': '#f97316',
  'Pakistan Studies': '#ef4444',
  Mathematics: '#10b981',
  'Computer Science': '#a855f7',
  Islamiat: '#f59e0b',
  'Mixed Practice': '#6366f1',
};

// ─── Helper ───────────────────────────────────────────────────────────────────

const fmtTime = (secs: number) => {
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
};

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getGrade = (pct: number) => {
  if (pct >= 90) return { label: 'A+', color: '#10b981' };
  if (pct >= 80) return { label: 'A', color: '#10b981' };
  if (pct >= 70) return { label: 'B', color: '#6366f1' };
  if (pct >= 60) return { label: 'C', color: '#f59e0b' };
  if (pct >= 50) return { label: 'D', color: '#f97316' };
  return { label: 'F', color: '#ef4444' };
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function HistoryScreen() {
  const { currentTheme, stats, user } = useApp();
  const isDark = currentTheme === 'dark';

  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [source, setSource] = useState<'cloud' | 'local'>('local');

  const colors = {
    bg: isDark ? '#09090b' : '#f9fafb',
    card: isDark ? '#121214' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1f2937',
    textMuted: isDark ? '#6b7280' : '#9ca3af',
    border: isDark ? '#1f1f23' : '#e5e7eb',
    primary: '#6366f1',
    success: '#10b981',
    danger: '#ef4444',
  };

  // ── Load from cloud ─────────────────────────────────────────────────────────
  const loadCloud = useCallback(async (pageNum: number, append: boolean) => {
    if (!user) return false;
    const { data, error } = await QuizService.getHistory(user.id, pageNum, PAGE_SIZE);
    if (error || !data) return false;

    const mapped: HistoryRow[] = data.map((r: QuizAttemptRow) => ({
      id: r.id,
      category: r.category,
      scorePercent: r.score_percent,
      correctCount: r.correct_count,
      totalQuestions: r.total_questions,
      timeSpentSecs: r.time_spent_secs,
      completedAt: r.completed_at,
      source: 'cloud',
    }));

    setRows((prev) => (append ? [...prev, ...mapped] : mapped));
    setHasMore(mapped.length === PAGE_SIZE);
    setSource('cloud');
    return true;
  }, [user]);

  // ── Load from local stats ───────────────────────────────────────────────────
  const loadLocal = useCallback(() => {
    const mapped: HistoryRow[] = stats.sessions.map((s) => ({
      id: s.id,
      category: s.category,
      scorePercent: s.totalQuestions > 0 ? Math.round((s.score / s.totalQuestions) * 100) : 0,
      correctCount: s.score,
      totalQuestions: s.totalQuestions,
      timeSpentSecs: s.timeSpent,
      completedAt: s.date,
      source: 'local',
    }));
    setRows(mapped);
    setHasMore(false);
    setSource('local');
  }, [stats.sessions]);

  // ── Initial load ────────────────────────────────────────────────────────────
  const initialLoad = useCallback(async () => {
    setLoading(true);
    const cloudOk = await loadCloud(0, false);
    if (!cloudOk) loadLocal();
    setPage(0);
    setLoading(false);
  }, [loadCloud, loadLocal]);

  useEffect(() => {
    initialLoad();
  }, [initialLoad]);

  // ── Refresh ─────────────────────────────────────────────────────────────────
  const handleRefresh = async () => {
    setRefreshing(true);
    await initialLoad();
    setRefreshing(false);
  };

  // ── Load more ───────────────────────────────────────────────────────────────
  const handleLoadMore = async () => {
    if (!hasMore || loadingMore || source !== 'cloud') return;
    setLoadingMore(true);
    const nextPage = page + 1;
    await loadCloud(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

  // ── Summary stats ───────────────────────────────────────────────────────────
  const avgScore = rows.length > 0
    ? Math.round(rows.reduce((s, r) => s + r.scorePercent, 0) / rows.length)
    : 0;
  const bestScore = rows.length > 0 ? Math.max(...rows.map((r) => r.scorePercent)) : 0;

  // ── Row renderer ────────────────────────────────────────────────────────────
  const renderRow = ({ item, index }: { item: HistoryRow; index: number }) => {
    const grade = getGrade(item.scorePercent);
    const catColor = CAT_COLORS[item.category] ?? colors.primary;
    const isPass = item.scorePercent >= 50;

    return (
      <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Left: index + grade circle */}
        <View style={styles.rowLeft}>
          <Text style={[styles.rowIndex, { color: colors.textMuted }]}>#{index + 1}</Text>
          <View style={[styles.gradeBadge, { backgroundColor: `${grade.color}18`, borderColor: `${grade.color}40` }]}>
            <Text style={[styles.gradeText, { color: grade.color }]}>{grade.label}</Text>
          </View>
        </View>

        {/* Center: details */}
        <View style={styles.rowCenter}>
          <View style={styles.rowCatRow}>
            <View style={[styles.catDot, { backgroundColor: catColor }]} />
            <Text style={[styles.rowCat, { color: catColor }]} numberOfLines={1}>
              {item.category}
            </Text>
            {item.source === 'local' && (
              <View style={[styles.localBadge, { backgroundColor: isDark ? '#27272a' : '#f3f4f6' }]}>
                <WifiOff size={8} color={colors.textMuted} />
                <Text style={[styles.localBadgeText, { color: colors.textMuted }]}>Local</Text>
              </View>
            )}
          </View>

          <View style={styles.rowStatsRow}>
            <View style={styles.rowStat}>
              <CheckCircle2 size={10} color={colors.success} />
              <Text style={[styles.rowStatText, { color: colors.text }]}>
                {item.correctCount}/{item.totalQuestions}
              </Text>
            </View>
            <View style={styles.rowStat}>
              <Clock size={10} color={colors.textMuted} />
              <Text style={[styles.rowStatText, { color: colors.textMuted }]}>
                {fmtTime(item.timeSpentSecs)}
              </Text>
            </View>
          </View>

          <Text style={[styles.rowDate, { color: colors.textMuted }]}>
            {fmtDate(item.completedAt)}
          </Text>
        </View>

        {/* Right: score */}
        <View style={styles.rowRight}>
          <Text style={[styles.rowScore, { color: isPass ? colors.success : colors.danger }]}>
            {Math.round(item.scorePercent)}%
          </Text>
          {isPass
            ? <CheckCircle2 size={14} color={colors.success} />
            : <XCircle size={14} color={colors.danger} />
          }
        </View>
      </View>
    );
  };

  // ── List header ─────────────────────────────────────────────────────────────
  const ListHeader = () => (
    <View style={styles.listHeader}>
      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <History size={16} color={colors.primary} />
          <Text style={[styles.summaryVal, { color: colors.text }]}>{rows.length}</Text>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>SESSIONS</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Award size={16} color='#f59e0b' />
          <Text style={[styles.summaryVal, { color: colors.text }]}>{avgScore}%</Text>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>AVG SCORE</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Trophy size={16} color={colors.success} />
          <Text style={[styles.summaryVal, { color: colors.text }]}>{bestScore}%</Text>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>BEST</Text>
        </View>
      </View>

      {/* Source notice */}
      <View style={[styles.sourceBanner, {
        backgroundColor: source === 'cloud' ? (isDark ? 'rgba(99,102,241,0.08)' : '#eff6ff') : (isDark ? '#18181b' : '#f9fafb'),
        borderColor: source === 'cloud' ? `${colors.primary}30` : colors.border,
      }]}>
        {source === 'cloud'
          ? <CheckCircle2 size={11} color={colors.primary} />
          : <WifiOff size={11} color={colors.textMuted} />
        }
        <Text style={[styles.sourceBannerText, { color: source === 'cloud' ? colors.primary : colors.textMuted }]}>
          {source === 'cloud'
            ? `Synced from cloud · ${rows.length} sessions`
            : 'Showing local sessions — sign in to sync to cloud'}
        </Text>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>RECENT ATTEMPTS</Text>
    </View>
  );

  // ── List footer ─────────────────────────────────────────────────────────────
  const ListFooter = () => {
    if (!hasMore) return (
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>— All sessions loaded —</Text>
      </View>
    );
    return (
      <TouchableOpacity
        onPress={handleLoadMore}
        disabled={loadingMore}
        style={[styles.loadMoreBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
      >
        <ChevronDown size={14} color={colors.primary} />
        <Text style={[styles.loadMoreText, { color: colors.primary }]}>
          {loadingMore ? 'Loading...' : 'Load More'}
        </Text>
      </TouchableOpacity>
    );
  };

  // ── Empty state ─────────────────────────────────────────────────────────────
  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIconBg, { backgroundColor: isDark ? '#1c1c1f' : '#f3f4f6' }]}>
        <History size={28} color={colors.textMuted} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No quiz history yet</Text>
      <Text style={[styles.emptySub, { color: colors.textMuted }]}>
        Complete your first quiz to see your results here.
      </Text>
    </View>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading) {
    return <SplashLoader isDark={isDark} message="Loading your quiz history..." />;
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        renderItem={renderRow}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={rows.length === 0 ? styles.emptyContainer : styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 40 },
  emptyContainer: { flex: 1 },
  listHeader: { gap: 12, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  summaryVal: { fontSize: 18, fontWeight: '900' },
  summaryLabel: { fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
  sourceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  sourceBannerText: { fontSize: 10, fontWeight: '600' },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  rowLeft: { alignItems: 'center', gap: 6, width: 36 },
  rowIndex: { fontSize: 9, fontWeight: '700' },
  gradeBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: { fontSize: 12, fontWeight: '900' },
  rowCenter: { flex: 1, gap: 4 },
  rowCatRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  catDot: { width: 6, height: 6, borderRadius: 3 },
  rowCat: { fontSize: 11, fontWeight: '700', flex: 1 },
  localBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  localBadgeText: { fontSize: 8, fontWeight: '600' },
  rowStatsRow: { flexDirection: 'row', gap: 12 },
  rowStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rowStatText: { fontSize: 10, fontWeight: '600' },
  rowDate: { fontSize: 9, fontWeight: '500' },
  rowRight: { alignItems: 'center', gap: 4 },
  rowScore: { fontSize: 16, fontWeight: '900' },
  footer: { alignItems: 'center', paddingVertical: 20 },
  footerText: { fontSize: 11, fontWeight: '500' },
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  loadMoreText: { fontSize: 12, fontWeight: '700' },
  emptyState: { alignItems: 'center', gap: 10, paddingTop: 80 },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: '800' },
  emptySub: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
});

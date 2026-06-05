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
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Text } from '../../src/components/common';
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
import { router } from 'expo-router';

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
  English: '#60A5FA',
  'General Knowledge': '#F59E0B',
  'Pakistan Studies': '#F87171',
  Mathematics: '#34D399',
  'Computer Science': '#A78BFA',
  Islamiat: '#06b6d4',
  'Mixed Practice': '#7C6FF0',
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
  if (pct >= 90) return { label: 'A+', color: '#10B981' };
  if (pct >= 80) return { label: 'A', color: '#10B981' };
  if (pct >= 70) return { label: 'B', color: '#7C6FF0' };
  if (pct >= 60) return { label: 'C', color: '#F59E0B' };
  if (pct >= 50) return { label: 'D', color: '#F59E0B' };
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
    bg: isDark ? '#0E1117' : '#f9fafb',
    card: isDark ? '#161B27' : '#ffffff',
    text: isDark ? '#e1e2eb' : '#1f2937',
    textMuted: isDark ? '#c8c4d6' : '#9ca3af',
    border: isDark ? '#2A2D3A' : '#e5e7eb',
    primary: '#7C6FF0',
    success: '#10B981',
    danger: '#ef4444',
  };

  // ── Load from cloud ─────────────────────────────────────────────────────────
  const loadCloud = useCallback(async (pageNum: number, append: boolean) => {
    if (!user) return false;
    const { data, error } = await QuizService.getHistory(user.id, pageNum, PAGE_SIZE);
    if (error || !data) return false;

    const mapped: HistoryRow[] = data.map((r: QuizAttemptRow) => ({
      id: r.id,
      category: r.subject,          // new schema: 'subject' column
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
      <View style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 0.5,
        borderRadius: 14,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Left vertical border stripe */}
        <View style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          backgroundColor: grade.color,
        }} />

        {/* Circular Grade Badge */}
        <View style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: `${grade.color}15`,
          borderColor: `${grade.color}30`,
          borderWidth: 0.5,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 4,
        }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: grade.color }}>
            {grade.label}
          </Text>
        </View>

        {/* Details (Middle) */}
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }} numberOfLines={1}>
            {item.category}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 11, color: colors.textMuted }}>
              {item.correctCount}/{item.totalQuestions}
            </Text>
            <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.textMuted }} />
            <Text style={{ fontSize: 11, color: colors.textMuted }}>
              {fmtTime(item.timeSpentSecs)}
            </Text>
            {item.source === 'local' && (
              <>
                <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.textMuted }} />
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  paddingHorizontal: 4,
                  paddingVertical: 1,
                  borderRadius: 4,
                }}>
                  <WifiOff size={8} color={colors.textMuted} />
                  <Text style={{ fontSize: 8, color: colors.textMuted, fontWeight: '600' }}>Local</Text>
                </View>
              </>
            )}
          </View>
          <Text style={{ fontSize: 9, color: colors.textMuted, marginTop: 2 }}>
            {fmtDate(item.completedAt)}
          </Text>
        </View>

        {/* Score & Icon (Right) */}
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: isPass ? colors.success : colors.danger }}>
            {Math.round(item.scorePercent)}%
          </Text>
          {isPass ? (
            <CheckCircle2 size={16} color={colors.success} />
          ) : (
            <XCircle size={16} color={colors.danger} />
          )}
        </View>
      </View>
    );
  };

  // ── List header ─────────────────────────────────────────────────────────────
  const ListHeader = () => (
    <View style={styles.listHeader}>
      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 0.5 }]}>
          <History size={16} color={colors.primary} />
          <Text style={[styles.summaryVal, { color: colors.text, marginTop: 4 }]}>{rows.length}</Text>
          <Text style={[styles.summaryLabel, { color: colors.textMuted, marginTop: 2 }]}>SESSIONS</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 0.5 }]}>
          <Award size={16} color='#F59E0B' />
          <Text style={[styles.summaryVal, { color: colors.text, marginTop: 4 }]}>{avgScore}%</Text>
          <Text style={[styles.summaryLabel, { color: colors.textMuted, marginTop: 2 }]}>AVG SCORE</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 0.5 }]}>
          <Trophy size={16} color='#10B981' />
          <Text style={[styles.summaryVal, { color: colors.text, marginTop: 4 }]}>{bestScore}%</Text>
          <Text style={[styles.summaryLabel, { color: colors.textMuted, marginTop: 2 }]}>BEST</Text>
        </View>
      </View>

      {/* Source notice banner */}
      <View style={[styles.sourceBanner, {
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 0.5,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }]}>
        {source === 'cloud' ? (
          <>
            <CheckCircle2 size={14} color={colors.primary} />
            <Text style={{ fontSize: 11, color: colors.text, flex: 1 }}>
              Synced from cloud · {rows.length} sessions
            </Text>
          </>
        ) : (
          <>
            <WifiOff size={14} color={colors.textMuted} />
            <Text style={{ fontSize: 11, color: colors.textMuted, flex: 1 }}>
              Showing local sessions — sign in to sync
            </Text>
            <TouchableOpacity onPress={() => router.push('/settings')}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary }}>
                SIGN IN
              </Text>
            </TouchableOpacity>
          </>
        )}
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
    <View style={[styles.emptyState, { backgroundColor: colors.bg }]}>
      {/* Source notice */}
      <View style={[{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 0.5,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 40,
        alignSelf: 'stretch',
        marginHorizontal: 16,
      }]}>
        {user ? (
          <>
            <CheckCircle2 size={14} color={colors.primary} />
            <Text style={{ fontSize: 11, color: colors.text, flex: 1 }}>Signed in · history synced from cloud</Text>
          </>
        ) : (
          <>
            <WifiOff size={14} color={colors.textMuted} />
            <Text style={{ fontSize: 11, color: colors.textMuted, flex: 1 }}>Sign in to sync quiz history across devices</Text>
            <TouchableOpacity onPress={() => router.push('/settings')}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary }}>SIGN IN</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Icon */}
      <View style={[styles.emptyIconBg, { backgroundColor: isDark ? '#1c2032' : '#f3f4f6', marginBottom: 6 }]}>
        <History size={32} color={colors.primary} />
      </View>

      <Text style={[styles.emptyTitle, { color: colors.text }]}>No quiz history yet</Text>
      <Text style={[styles.emptySub, { color: colors.textMuted }]}>
        {'Your completed quizzes will appear here.\nStart a quiz from the home screen to begin!'}
      </Text>

      <TouchableOpacity
        onPress={() => router.push('/')}
        style={[styles.startQuizBtn, { backgroundColor: colors.primary }]}
      >
        <Trophy size={16} color='#fff' />
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Start a Quiz</Text>
      </TouchableOpacity>
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  emptyIconBg: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 4 },
  startQuizBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 8,
  },
});

/**
 * useAnalytics.ts
 * Fetches analytics data for the dashboard — all 4 queries run in parallel.
 * Data is cached in Supabase's pre-aggregated tables, so reads are cheap.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  AnalyticsService,
  type WeakArea,
  type PerformanceTrendPoint,
  type DashboardSummary,
  type CategoryBreakdown,
} from '../services/analytics.service';
import { useAuth } from './useAuth';

export interface AnalyticsData {
  weakAreas: WeakArea[];
  performanceTrend: PerformanceTrendPoint[];
  summary: DashboardSummary | null;
  breakdown: CategoryBreakdown[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const useAnalytics = (): AnalyticsData => {
  const { user } = useAuth();
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [performanceTrend, setPerformanceTrend] = useState<PerformanceTrendPoint[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [breakdown, setBreakdown] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // All 4 queries run in parallel — total: 4 Supabase reads
      const [areas, trend, sm, bd] = await Promise.all([
        AnalyticsService.getWeakAreas(user.id),
        AnalyticsService.getPerformanceTrend(user.id, 14),
        AnalyticsService.getDashboardSummary(user.id),
        AnalyticsService.getCategoryBreakdown(user.id),
      ]);
      setWeakAreas(areas);
      setPerformanceTrend(trend);
      setSummary(sm);
      setBreakdown(bd);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { weakAreas, performanceTrend, summary, breakdown, loading, error, refresh: fetchData };
};

/**
 * analytics.service.ts
 * Read-only analytics queries — all optimised for minimal Supabase reads.
 * Results should be cached locally by the calling hook.
 */
import { supabase } from '../lib/supabase';

export interface WeakArea {
  category: string;
  incorrect_count: number;
  accuracy_pct: number;
}

export interface PerformanceTrendPoint {
  score_percent: number;
  completed_at: string;
  category: string;
}

export interface DashboardSummary {
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

export interface CategoryBreakdown {
  category: string;
  attempts: number;
  avgScore: number;
}

export const AnalyticsService = {
  /**
   * Get user's top 5 weakest categories sorted by accuracy ascending.
   * Uses the pre-aggregated `weak_areas` table — zero re-scanning of attempt_answers.
   */
  getWeakAreas: async (userId: string, limit = 5): Promise<WeakArea[]> => {
    const { data } = await supabase
      .from('weak_areas')
      .select('category, incorrect_count, accuracy_pct')
      .eq('user_id', userId)
      .order('accuracy_pct', { ascending: true }) // Worst first
      .limit(limit);
    return (data as WeakArea[]) ?? [];
  },

  /**
   * Get score trend over the last N days.
   * Used by the performance chart on the dashboard.
   */
  getPerformanceTrend: async (
    userId: string,
    days = 14,
  ): Promise<PerformanceTrendPoint[]> => {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const { data } = await supabase
      .from('quiz_attempts')
      .select('score_percent, completed_at, category')
      .eq('user_id', userId)
      .gte('completed_at', since.toISOString())
      .order('completed_at', { ascending: true });
    return (data as PerformanceTrendPoint[]) ?? [];
  },

  /**
   * Lightweight dashboard stats from denormalized user_profiles columns.
   * 1 read — never aggregates attempt_answers.
   */
  getDashboardSummary: async (
    userId: string,
  ): Promise<DashboardSummary | null> => {
    const { data } = await supabase
      .from('user_profiles')
      .select(
        'total_questions_answered, correct_answers_count, current_streak, longest_streak, last_active_date',
      )
      .eq('id', userId)
      .single();

    if (!data) return null;
    return {
      totalQuestionsAnswered: data.total_questions_answered ?? 0,
      correctAnswersCount: data.correct_answers_count ?? 0,
      currentStreak: data.current_streak ?? 0,
      longestStreak: data.longest_streak ?? 0,
      lastActiveDate: data.last_active_date ?? null,
    };
  },

  /**
   * Per-category attempt count + average score.
   * Aggregated on the client from quiz_attempts to avoid a heavy GROUP BY.
   */
  getCategoryBreakdown: async (userId: string): Promise<CategoryBreakdown[]> => {
    const { data } = await supabase
      .from('quiz_attempts')
      .select('category, score_percent')
      .eq('user_id', userId);

    if (!data || data.length === 0) return [];

    const map: Record<string, { attempts: number; totalScore: number }> = {};
    for (const row of data) {
      if (!map[row.category]) map[row.category] = { attempts: 0, totalScore: 0 };
      map[row.category].attempts++;
      map[row.category].totalScore += row.score_percent;
    }

    return Object.entries(map).map(([category, { attempts, totalScore }]) => ({
      category,
      attempts,
      avgScore: Math.round((totalScore / attempts) * 10) / 10,
    }));
  },
};


import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  display_name?: string;
  avatar_url?: string;
  onboarding_done: boolean;
  selected_subjects: string[];
  exam_target?: string;
  daily_goal_minutes: number;
  total_questions_answered: number;
  correct_answers_count: number;
  current_streak: number;
  longest_streak: number;
  last_active_date?: string;
  created_at: string;
  updated_at: string;
}

export const UserService = {
  /** Fetch user profile from Supabase */
  getProfile: async (userId: string): Promise<UserProfile | null> => {
    const { data } = await supabase
      .from('user_profiles')
      .select('id, display_name, avatar_url, onboarding_done, selected_subjects, exam_target, daily_goal_minutes, total_questions_answered, correct_answers_count, current_streak, longest_streak, last_active_date, created_at, updated_at')
      .eq('id', userId)
      .single();
    return data as UserProfile | null;
  },

  /** Mark onboarding complete and save preferences */
  completeOnboarding: async (
    userId: string,
    prefs: {
      selectedSubjects: string[];
      examTarget: string;
      dailyGoalMinutes: number;
    }
  ) => {
    return supabase
      .from('user_profiles')
      .update({
        onboarding_done: true,
        selected_subjects: prefs.selectedSubjects,
        exam_target: prefs.examTarget,
        daily_goal_minutes: prefs.dailyGoalMinutes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
  },

  /** Update user display name */
  updateDisplayName: async (userId: string, displayName: string) => {
    return supabase
      .from('user_profiles')
      .update({
        display_name: displayName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
  },

  /**
   * Atomically increment user stats via Postgres RPC.
   * Requires the `increment_user_stats` function created in SQL editor.
   */
  updateStats: async (
    userId: string,
    delta: {
      totalQuestions: number;
      correctAnswers: number;
      streakDate: string; // 'YYYY-MM-DD'
    }
  ) => {
    return supabase.rpc('increment_user_stats', {
      p_user_id: userId,
      p_questions: delta.totalQuestions,
      p_correct: delta.correctAnswers,
      p_streak_date: delta.streakDate,
    });
  },
};

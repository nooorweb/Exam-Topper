import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizSession } from '../types';

const PENDING_SYNC_KEY = 'smart_prep_pending_sync';

const isUuid = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export interface QuizAttemptRow {
  id: string;
  category: string;
  score_percent: number;
  correct_count: number;
  total_questions: number;
  time_spent_secs: number;
  completed_at: string;
}

export const QuizService = {
  /**
   * Persist a quiz session to Supabase.
   * Writes:
   *   1. quiz_attempts (1 row)
   *   2. attempt_answers (batch — one row per answer)
   *   3. weak_areas (upsert — 1 write)
   */
  saveAttempt: async (userId: string, session: QuizSession): Promise<string> => {
    const scorePercent = (session.score / session.totalQuestions) * 100;

    // 1. Insert quiz attempt
    const { data: attempt, error } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: userId,
        category: session.category,
        started_at: new Date(
          new Date(session.date).getTime() - session.timeSpent * 1000
        ).toISOString(),
        completed_at: session.date,
        time_spent_secs: session.timeSpent,
        total_questions: session.totalQuestions,
        correct_count: session.score,
        score_percent: scorePercent,
      })
      .select('id')
      .single();

    if (error || !attempt) throw error ?? new Error('Failed to insert quiz attempt');

    // 2. Batch insert answers
    const answerRows = session.answers.map((ans) => ({
      attempt_id: attempt.id,
      user_id: userId,
      mcq_id: isUuid(ans.mcqId) ? ans.mcqId : null,
      category: session.category,
      selected_option: ans.selectedOption,
      correct_option: ans.correctOption,
      is_correct: ans.isCorrect,
    }));

    if (answerRows.length > 0) {
      await supabase.from('attempt_answers').insert(answerRows);
    }

    // 3. Upsert weak_areas summary
    const incorrect = session.answers.filter((a) => !a.isCorrect).length;
    const total = session.answers.length;

    if (total > 0) {
      await supabase.from('weak_areas').upsert(
        [
          {
            user_id: userId,
            category: session.category,
            incorrect_count: incorrect,
            total_count: total,
            accuracy_pct: ((total - incorrect) / total) * 100,
            last_updated: new Date().toISOString(),
          },
        ],
        { onConflict: 'user_id,category', ignoreDuplicates: false }
      );
    }

    return attempt.id;
  },

  /** Queue a failed sync for retry on next app open */
  queueForSync: async (session: QuizSession): Promise<void> => {
    const existing = await AsyncStorage.getItem(PENDING_SYNC_KEY);
    const pending: QuizSession[] = existing ? JSON.parse(existing) : [];
    pending.push(session);
    await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(pending));
  },

  /** Flush all offline-queued sessions to Supabase */
  flushPendingSync: async (userId: string): Promise<void> => {
    const existing = await AsyncStorage.getItem(PENDING_SYNC_KEY);
    if (!existing) return;
    const pending: QuizSession[] = JSON.parse(existing);
    const failed: QuizSession[] = [];
    for (const session of pending) {
      try {
        await QuizService.saveAttempt(userId, session);
      } catch {
        // Keep failed sessions for next retry
        failed.push(session);
      }
    }
    if (failed.length > 0) {
      await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(failed));
    } else {
      await AsyncStorage.removeItem(PENDING_SYNC_KEY);
    }
  },

  /** Paginated quiz history (avoid loading ALL sessions at once) */
  getHistory: async (
    userId: string,
    page = 0,
    pageSize = 20
  ) => {
    return supabase
      .from('quiz_attempts')
      .select(
        'id, category, score_percent, correct_count, total_questions, time_spent_secs, completed_at'
      )
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);
  },
};

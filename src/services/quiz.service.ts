import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizSession } from '../types';

const PENDING_SYNC_KEY = 'smart_prep_pending_sync';

const isUuid = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export interface QuizAttemptRow {
  id: string;
  subject: string;   // renamed from category → subject to match new schema
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
   *   3. weak_areas (upsert — 1 write per subject)
   */
  saveAttempt: async (userId: string, session: QuizSession): Promise<string> => {
    const scorePercent = (session.score / session.totalQuestions) * 100;

    const answersSummary = session.answers.map((ans) => ({
      m: isUuid(ans.mcqId) ? ans.mcqId.slice(0, 8) : ans.mcqId,
      s: ans.selectedOption,
      c: ans.correctOption,
    }));

    // 1. Insert quiz attempt with JSONB answers summary
    const { data: attempt, error } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: userId,
        subject: session.category,
        started_at: new Date(
          new Date(session.date).getTime() - session.timeSpent * 1000
        ).toISOString(),
        completed_at: session.date,
        time_spent_secs: session.timeSpent,
        total_questions: session.totalQuestions,
        correct_count: session.score,
        score_percent: scorePercent,
        answers_summary: answersSummary,
      })
      .select('id')
      .single();

    if (error || !attempt) throw error ?? new Error('Failed to insert quiz attempt');

    // 2. Call upsert_weak_area RPC (accumulating statistics)
    const incorrect = session.answers.filter((a) => !a.isCorrect).length;
    const total = session.answers.length;

    if (total > 0) {
      const { error: rpcError } = await supabase.rpc('upsert_weak_area', {
        p_user_id: userId,
        p_subject: session.category,
        p_incorrect: incorrect,
        p_total: total,
      });

      if (rpcError) {
        console.error('Error invoking upsert_weak_area RPC:', rpcError);
      }
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
        failed.push(session);
      }
    }
    if (failed.length > 0) {
      await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(failed));
    } else {
      await AsyncStorage.removeItem(PENDING_SYNC_KEY);
    }
  },

  /** Paginated quiz history — newest first */
  getHistory: async (
    userId: string,
    page = 0,
    pageSize = 20
  ) => {
    return supabase
      .from('quiz_attempts')
      .select(
        'id, subject, score_percent, correct_count, total_questions, time_spent_secs, completed_at'
      )
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);
  },
};

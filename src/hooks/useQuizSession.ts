/**
 * useQuizSession.ts
 * Wraps quiz session persistence with offline-first sync logic.
 * - Always saves to AsyncStorage immediately (offline-first)
 * - Attempts cloud sync in background; queues on failure
 */
import { useCallback } from 'react';
import { QuizService } from '../services/quiz.service';
import { UserService } from '../services/user.service';
import { useAuth } from './useAuth';
import { QuizSession } from '../types';

export interface SaveSessionResult {
  saved: boolean;
  synced: boolean;
}

export const useQuizSession = () => {
  const { user } = useAuth();

  const saveSession = useCallback(
    async (session: QuizSession): Promise<SaveSessionResult> => {
      if (!user) {
        // Not logged in — local save handled by AppContext, no cloud sync
        return { saved: true, synced: false };
      }

      try {
        await QuizService.saveAttempt(user.id, session);
        await UserService.updateStats(user.id, {
          totalQuestions: session.totalQuestions,
          correctAnswers: session.score,
          streakDate: new Date().toISOString().split('T')[0],
        });
        return { saved: true, synced: true };
      } catch (e) {
        // Cloud failed — queue for retry on next app open
        console.warn('Quiz sync failed, queuing for retry:', e);
        await QuizService.queueForSync(session);
        return { saved: true, synced: false };
      }
    },
    [user]
  );

  /** Call on app startup to flush any pending offline quiz sessions */
  const flushPendingSync = useCallback(async () => {
    if (!user) return;
    try {
      await QuizService.flushPendingSync(user.id);
    } catch (e) {
      console.warn('Failed to flush pending quiz sync:', e);
    }
  }, [user]);

  return { saveSession, flushPendingSync };
};

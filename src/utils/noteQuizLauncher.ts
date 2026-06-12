/**
 * noteQuizLauncher.ts
 * ─────────────────────────────────────────────────────────────
 * Launches a note-specific quiz by:
 *  1. Fetching MCQs for the topic from Supabase (note_topic_mcqs table)
 *  2. Applying a persistent rotation so question order changes each session
 *     (last-seen questions cycle to the front next time)
 *  3. Writing rotated MCQs to AsyncStorage → quiz-session picks them up
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Router } from 'expo-router';
import { MCQService } from '../services/mcq.service';

/** Same key used by the AI Quiz flow — quiz-session.tsx reads from here */
export const AI_QUIZ_TEMP_KEY = 'smart_prep_ai_quiz_temp';

/** Per-topic rotation index storage key */
const ROTATION_KEY_PREFIX = 'note_quiz_rotation_';

/**
 * Rotates an array by `offset` positions so element at index `offset`
 * becomes the new first element.
 *
 * Example: rotate([Q1,Q2,Q3,Q4,Q5,Q6], 3) → [Q4,Q5,Q6,Q1,Q2,Q3]
 */
function rotateArray<T>(arr: T[], offset: number): T[] {
  if (arr.length === 0 || offset === 0) return arr;
  const idx = ((offset % arr.length) + arr.length) % arr.length;
  return [...arr.slice(idx), ...arr.slice(0, idx)];
}

/** Read current rotation index from AsyncStorage (0 on first use). */
async function getRotationIndex(topicId: string): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(`${ROTATION_KEY_PREFIX}${topicId}`);
    if (raw !== null) {
      const parsed = parseInt(raw, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
  } catch (_) {}
  return 0;
}

/**
 * Advance rotation index by ⌈N/2⌉ so the next quiz starts from
 * whichever question was halfway through this session.
 */
async function advanceRotationIndex(topicId: string, total: number): Promise<void> {
  if (total <= 0) return;
  try {
    const current = await getRotationIndex(topicId);
    const next = (current + Math.ceil(total / 2)) % total;
    await AsyncStorage.setItem(`${ROTATION_KEY_PREFIX}${topicId}`, String(next));
  } catch (_) {}
}

/**
 * Main entry point — call this when the user taps "Quiz" on a note topic.
 *
 * @param topicId     Note topic id (matches note_topic_mcqs.note_topic_id)
 * @param topicTitle  Display name shown in the quiz results screen
 * @param router      Expo Router instance from the calling component
 * @param subject     Subject name used as fallback if DB returns no MCQs
 * @returns           'launched' | 'no_mcqs'
 */
export async function launchNoteQuiz(
  topicId: string,
  topicTitle: string,
  router: Router,
  subject?: string,
): Promise<'launched' | 'no_mcqs'> {
  // 1. Fetch MCQs from Supabase
  const mcqs = await MCQService.fetchNoteTopicMCQs(topicId);

  if (mcqs.length === 0) {
    return 'no_mcqs';
  }

  // 2. Read current rotation index
  const rotationIdx = await getRotationIndex(topicId);

  // 3. Rotate so different questions lead each session
  const rotatedMcqs = rotateArray(mcqs, rotationIdx);

  // 4. Advance rotation for next session (fire-and-forget)
  advanceRotationIndex(topicId, mcqs.length).catch(() => {});

  // 5. Write to temp storage — quiz-session.tsx reads this on mount
  await AsyncStorage.setItem(AI_QUIZ_TEMP_KEY, JSON.stringify(rotatedMcqs));

  // 6. Navigate to quiz-session in AI quiz mode
  router.push({
    pathname: '/quiz-session',
    params: {
      aiQuizMode: 'true',
      aiCategory: topicTitle,
    },
  });

  return 'launched';
}

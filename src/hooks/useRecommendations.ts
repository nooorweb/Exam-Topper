/**
 * useRecommendations.ts
 * Pure local logic — ZERO extra Supabase reads.
 * Recommends MCQs from weak areas and high-importance questions.
 */
import { useMemo } from 'react';
import { MCQ, UserStats } from '../types';

export const useRecommendations = (mcqs: MCQ[], stats: UserStats) => {
  const suggested = useMemo(() => {
    if (!stats.weakAreas.length) {
      // Fallback: high-importance MCQs
      return mcqs.filter((m) => m.importance === 'high').slice(0, 10);
    }

    // Top 2 weakest categories
    const weakCategories = stats.weakAreas
      .slice(0, 2)
      .map((w) => w.category);

    // Build set of recently attempted MCQ IDs
    const attempted = new Set(
      stats.sessions.flatMap((s) => s.answers.map((a) => a.mcqId))
    );

    const importanceScore: Record<string, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };

    const recommended = mcqs
      .filter((m) => weakCategories.includes(m.category))
      .filter((m) => !attempted.has(m.id)) // Prefer unattempted
      .sort(
        (a, b) =>
          (importanceScore[b.importance ?? 'medium'] ?? 2) -
          (importanceScore[a.importance ?? 'medium'] ?? 2)
      )
      .slice(0, 15);

    // Pad to at least 5 if needed
    if (recommended.length < 5) {
      const extras = mcqs
        .filter((m) => weakCategories.includes(m.category))
        .filter((m) => !recommended.find((r) => r.id === m.id))
        .slice(0, 15 - recommended.length);
      return [...recommended, ...extras];
    }

    return recommended;
  }, [mcqs, stats]);

  return { suggested };
};

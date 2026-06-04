import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MCQ } from '../types';

const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours
const CACHE_KEY = (category: string) => `smart_prep_mcq_cache_${category}`;

export const MCQService = {
  /**
   * Fetch MCQs by category with 6-hour AsyncStorage cache.
   * On cache hit: zero Supabase reads.
   * On cache miss: paginated Supabase query.
   */
  fetchByCategory: async (
    category: string,
    page = 0,
    pageSize = 50
  ): Promise<MCQ[]> => {
    // 1. Check cache first
    const cacheRaw = await AsyncStorage.getItem(CACHE_KEY(category));
    if (cacheRaw) {
      const cache = JSON.parse(cacheRaw);
      const age = Date.now() - cache.timestamp;
      if (age < CACHE_TTL_MS && cache.page === page) {
        return cache.data as MCQ[]; // Serve from cache — 0 Supabase reads
      }
    }

    // 2. Fetch from Supabase
    const { data, error } = await supabase
      .from('mcqs')
      .select(
        'id, question, options, correct_answer, explanation, category, subcategory, exam_type, difficulty, importance, is_repeated'
      )
      .eq('category', category)
      .eq('is_public', true)
      .order('importance', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) throw error;

    // 3. Normalize DB snake_case → app camelCase
    const mcqs: MCQ[] = (data ?? []).map((row) => ({
      id: row.id,
      question: row.question,
      options: row.options,
      correctAnswer: row.correct_answer,
      explanation: row.explanation ?? '',
      category: row.category as MCQ['category'],
      subcategory: row.subcategory ?? undefined,
      examType: row.exam_type ?? undefined,
      importance: row.importance ?? undefined,
      isRepeated: row.is_repeated ?? false,
    }));

    // 4. Store in cache
    await AsyncStorage.setItem(
      CACHE_KEY(category),
      JSON.stringify({ data: mcqs, timestamp: Date.now(), page })
    );

    return mcqs;
  },

  /** Invalidate cache for one category or all MCQ caches */
  invalidateCache: async (category?: string): Promise<void> => {
    if (category) {
      await AsyncStorage.removeItem(CACHE_KEY(category));
    } else {
      const keys = await AsyncStorage.getAllKeys();
      const mcqKeys = keys.filter((k) =>
        k.startsWith('smart_prep_mcq_cache_')
      );
      if (mcqKeys.length > 0) {
        await AsyncStorage.multiRemove(mcqKeys);
      }
    }
  },
};

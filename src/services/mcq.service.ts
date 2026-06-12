import { supabase } from '../lib/supabase';
import { MCQ } from '../types';
import { CacheService } from './cache.service';
import { DEFAULT_MCQS } from '../data/defaultData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUBJECT_TABLE_MAP: Record<string, string> = {
  'English': 'english_mcqs',
  'Pakistan Studies': 'pakistan_studies_mcqs',
  'General Knowledge': 'general_knowledge_mcqs',
  'Computer Science': 'computer_science_mcqs',
  'Mathematics': 'mathematics_mcqs',
  'Islamiat': 'islamiat_mcqs',
};

const getTableName = (subject: string): string => {
  return SUBJECT_TABLE_MAP[subject] || 'english_mcqs';
};

export const MCQService = {
  /**
   * Fetch MCQs for a subject from local cache or Supabase.
   * If difficulty is specified, it will fetch from cache or query matching rows.
   * Falls back to DEFAULT_MCQS for offline stability.
   */
  fetchQuizQuestions: async (
    subject: string,
    difficulty: string,
    limit: number
  ): Promise<MCQ[]> => {
    try {
      const normalizedDifficulty = difficulty === 'All' ? 'medium' : difficulty.toLowerCase();
      
      // 1. Try local cache first
      const cached = await CacheService.getSubjectMCQs(subject, normalizedDifficulty);
      if (cached && cached.length > 0) {
        // Shuffle and return requested slice
        return [...cached].sort(() => 0.5 - Math.random()).slice(0, limit);
      }

      // Special handling for Shortcut Keys which are note-linked in the note_topic_mcqs table
      if (subject === 'Shortcut Keys') {
        const { data, error } = await supabase
          .from('note_topic_mcqs')
          .select('id, question, options, correct_answer, explanation, category')
          .in('note_topic_id', ['cs-note-shortcut-word', 'cs-note-shortcut-excel', 'cs-note-shortcut-ppt'])
          .eq('is_public', true);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const mcqs: MCQ[] = data.map((row) => ({
            id: row.id,
            question: row.question,
            options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
            correctAnswer: row.correct_answer,
            explanation: row.explanation ?? '',
            category: 'Shortcut Keys' as any,
          }));

          await CacheService.setSubjectMCQs(subject, normalizedDifficulty, mcqs);

          return [...mcqs].sort(() => 0.5 - Math.random()).slice(0, limit);
        }
        return [];
      }

      // 2. Query corresponding table in Supabase
      const tableName = getTableName(subject);
      
      let query = supabase
        .from(tableName)
        .select('id, question, options, correct_answer, explanation, subcategory, exam_type, difficulty, importance, is_repeated')
        .eq('is_public', true);

      // Apply difficulty filter if it's not "All"
      if (difficulty !== 'All') {
        query = query.eq('difficulty', normalizedDifficulty);
      }

      // Fetch 3 times the limit so we can shuffle nicely in memory
      const { data, error } = await query
        .limit(limit * 3)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const mcqs: MCQ[] = data.map((row) => ({
          id: row.id,
          question: row.question,
          options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
          correctAnswer: row.correct_answer,
          explanation: row.explanation ?? '',
          category: subject as MCQ['category'],
          subcategory: row.subcategory ?? undefined,
          examType: row.exam_type ?? undefined,
          importance: row.importance ?? undefined,
          isRepeated: row.is_repeated ?? false,
        }));

        const uniqueMCQs: MCQ[] = [];
        const seen = new Set<string>();
        for (const mcq of mcqs) {
          const normalizedQuestion = mcq.question.trim().toLowerCase();
          if (!seen.has(normalizedQuestion)) {
            seen.add(normalizedQuestion);
            uniqueMCQs.push(mcq);
          }
        }

        // Update local cache
        await CacheService.setSubjectMCQs(subject, normalizedDifficulty, uniqueMCQs);

        return [...uniqueMCQs].sort(() => 0.5 - Math.random()).slice(0, limit);
      }
    } catch (error) {
      console.warn(`MCQService: Failed to fetch from Supabase. Falling back to local/default.`, error);
    }

    // 3. Fallback: Try reading from AsyncStorage's smart_prep_mcqs first
    try {
      const stored = await AsyncStorage.getItem('smart_prep_mcqs');
      if (stored) {
        const parsed: MCQ[] = JSON.parse(stored);
        let fallbackPool = parsed.filter(m => m.category === subject);
        if (fallbackPool.length > 0) {
          if (difficulty !== 'All') {
            const targetDiff = difficulty.toLowerCase();
            const filtered = fallbackPool.filter(m => (m.importance || 'medium') === targetDiff);
            if (filtered.length > 0) fallbackPool = filtered;
          }
          return fallbackPool.sort(() => 0.5 - Math.random()).slice(0, limit);
        }
      }
    } catch (e) {
      console.warn("MCQService: Failed to load fallback from AsyncStorage", e);
    }

    // Last resort fallback
    let fallbackPool = DEFAULT_MCQS.filter(m => m.category === subject);
    if (difficulty !== 'All') {
      const targetDiff = difficulty.toLowerCase();
      fallbackPool = fallbackPool.filter(m => (m.importance || 'medium') === targetDiff);
    }
    return fallbackPool.sort(() => 0.5 - Math.random()).slice(0, limit);
  },

  /**
   * Invalidate local cache for one subject or all subjects.
   */
  invalidateCache: async (subject?: string): Promise<void> => {
    if (subject) {
      await CacheService.invalidateSubject(subject);
    } else {
      await CacheService.clearAll();
    }
  },

  /**
   * Fetch mixed questions across all subjects
   */
  fetchMixedQuestions: async (
    difficulty: string,
    limit: number
  ): Promise<MCQ[]> => {
    const subjects = Object.keys(SUBJECT_TABLE_MAP);
    const limitPerSubject = Math.ceil(limit / subjects.length);
    
    try {
      const promises = subjects.map(sub => MCQService.fetchQuizQuestions(sub, difficulty, limitPerSubject));
      const results = await Promise.all(promises);
      const mixed = results.flat().sort(() => 0.5 - Math.random());
      return mixed.slice(0, limit);
    } catch (error) {
      console.warn("MCQService: Failed to fetch mixed from Supabase, falling back.", error);
      let fallbackPool = [...DEFAULT_MCQS];
      if (difficulty !== 'All') {
        const targetDiff = difficulty.toLowerCase();
        fallbackPool = fallbackPool.filter(m => (m.importance || 'medium') === targetDiff);
      }
      return fallbackPool.sort(() => 0.5 - Math.random()).slice(0, limit);
    }
  },

  /**
   * Fetch MCQs linked to a specific note topic from the note_topic_mcqs table.
   * Returns questions ordered by sort_order (stable, deterministic order).
   * The caller (noteQuizLauncher) applies rotation on top of this fixed order.
   */
  fetchNoteTopicMCQs: async (noteTopicId: string): Promise<MCQ[]> => {
    try {
      const { data, error } = await supabase
        .from('note_topic_mcqs')
        .select('id, question, options, correct_answer, explanation, category, sort_order')
        .eq('note_topic_id', noteTopicId)
        .eq('is_public', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const mcqs = data.map((row) => ({
          id: row.id,
          question: row.question,
          options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
          correctAnswer: row.correct_answer,
          explanation: row.explanation ?? '',
          category: row.category as MCQ['category'],
        }));

        const uniqueMCQs: MCQ[] = [];
        const seen = new Set<string>();
        for (const mcq of mcqs) {
          const normalizedQuestion = mcq.question.trim().toLowerCase();
          if (!seen.has(normalizedQuestion)) {
            seen.add(normalizedQuestion);
            uniqueMCQs.push(mcq);
          }
        }

        return uniqueMCQs;
      }
    } catch (error) {
      console.warn(`MCQService: Failed to fetch note MCQs for ${noteTopicId}`, error);
    }
    return [];
  },

  /** Fetch all public MCQs across all subjects from Supabase */
  fetchAllMCQs: async (): Promise<MCQ[]> => {
    const subjects = Object.keys(SUBJECT_TABLE_MAP);
    let allMCQs: MCQ[] = [];

    // Query subject tables resiliently
    for (const subject of subjects) {
      try {
        const tableName = SUBJECT_TABLE_MAP[subject];
        const { data, error } = await supabase
          .from(tableName)
          .select('id, question, options, correct_answer, explanation, subcategory, exam_type, difficulty, importance, is_repeated')
          .eq('is_public', true);
        
        if (error) throw error;

        if (data) {
          const mapped = data.map((row) => ({
            id: row.id,
            question: row.question,
            options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
            correctAnswer: row.correct_answer,
            explanation: row.explanation ?? '',
            category: subject as MCQ['category'],
            subcategory: row.subcategory ?? undefined,
            examType: row.exam_type ?? undefined,
            importance: row.importance ?? undefined,
            isRepeated: row.is_repeated ?? false,
          }));
          allMCQs = [...allMCQs, ...mapped];
        }
      } catch (err) {
        console.warn(`MCQService: Failed to fetch MCQs for subject ${subject}`, err);
      }
    }

    // Query note_topic_mcqs resiliently
    try {
      const { data: noteMcqs, error: noteError } = await supabase
        .from('note_topic_mcqs')
        .select('id, question, options, correct_answer, explanation, category, note_topic_id')
        .eq('is_public', true);
      
      if (noteError) throw noteError;

      if (noteMcqs) {
        const mappedNoteMcqs = noteMcqs.map((row) => {
          const isShortcut = row.note_topic_id && row.note_topic_id.startsWith('cs-note-shortcut-');
          return {
            id: row.id,
            question: row.question,
            options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
            correctAnswer: row.correct_answer,
            explanation: row.explanation ?? '',
            category: (isShortcut ? 'Shortcut Keys' : row.category) as MCQ['category'],
            subcategory: undefined,
            examType: undefined,
            importance: undefined,
            isRepeated: false,
          };
        });
        allMCQs = [...allMCQs, ...mappedNoteMcqs];
      }
    } catch (e) {
      console.warn("MCQService: Failed to fetch note_topic_mcqs in fetchAllMCQs", e);
    }

    // Deduplicate by question text
    const seen = new Set<string>();
    const uniqueMCQs: MCQ[] = [];
    
    for (const mcq of allMCQs) {
      const normalizedQuestion = mcq.question.trim().toLowerCase();
      if (!seen.has(normalizedQuestion)) {
        seen.add(normalizedQuestion);
        uniqueMCQs.push(mcq);
      }
    }
    
    return uniqueMCQs;
  }
};

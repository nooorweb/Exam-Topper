import { supabase } from '../lib/supabase';
import { VocabWord } from '../types';

export const VocabService = {
  /** Fetch all public vocab words from Supabase */
  fetchVocabWords: async (): Promise<VocabWord[]> => {
    try {
      const { data, error } = await supabase
        .from('vocab_words')
        .select('*')
        .eq('is_public', true);

      if (error) throw error;

      if (data) {
        return data.map((row) => ({
          id: row.id,
          word: row.word,
          meaning: row.meaning,
          urduMeaning: row.urdu_meaning ?? undefined,
          synonyms: Array.isArray(row.synonyms) 
            ? row.synonyms 
            : (typeof row.synonyms === 'string' ? JSON.parse(row.synonyms) : []),
          antonyms: Array.isArray(row.antonyms) 
            ? row.antonyms 
            : (typeof row.antonyms === 'string' ? JSON.parse(row.antonyms) : []),
          example: row.example ?? '',
          category: row.category ?? 'General Vocabulary',
          isBookmarked: false,
        }));
      }
    } catch (err) {
      console.warn('VocabService: Failed to fetch vocab from database', err);
    }
    return [];
  },

  /** Fetch user bookmarks from Supabase */
  fetchUserBookmarks: async (userId: string): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('user_vocab_bookmarks')
        .select('vocab_id')
        .eq('user_id', userId);

      if (error) throw error;
      return data ? data.map(row => row.vocab_id) : [];
    } catch (err) {
      console.warn('VocabService: Failed to fetch bookmarks from Supabase', err);
      return [];
    }
  },

  /** Save/remove bookmark in Supabase user_vocab_bookmarks */
  toggleBookmark: async (userId: string, vocabId: string, isBookmarked: boolean): Promise<void> => {
    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('user_vocab_bookmarks')
          .insert({ user_id: userId, vocab_id: vocabId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_vocab_bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('vocab_id', vocabId);
        if (error) throw error;
      }
    } catch (err) {
      console.warn('VocabService: Failed to toggle bookmark in Supabase', err);
    }
  }
};

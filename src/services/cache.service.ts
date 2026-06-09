import AsyncStorage from '@react-native-async-storage/async-storage';
import { MCQ } from '../types';

const CACHE_PREFIX = 'smart_prep_mcq_cache_';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachePayload {
  timestamp: number;
  data: MCQ[];
}

export const CacheService = {
  /**
   * Fetch MCQs from local cache if present and not expired.
   */
  getSubjectMCQs: async (subject: string, difficulty: string): Promise<MCQ[] | null> => {
    try {
      const key = `${CACHE_PREFIX}${subject.toLowerCase().replace(/\s+/g, '_')}_${difficulty.toLowerCase()}`;
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const payload: CachePayload = JSON.parse(cached);
      const isExpired = Date.now() - payload.timestamp > CACHE_TTL_MS;

      if (isExpired) {
        // Cache expired, remove it asynchronously
        AsyncStorage.removeItem(key).catch(console.error);
        return null;
      }

      return payload.data;
    } catch (error) {
      console.error('Failed to read MCQ cache:', error);
      return null;
    }
  },

  /**
   * Save MCQs to local cache with current timestamp.
   */
  setSubjectMCQs: async (subject: string, difficulty: string, mcqs: MCQ[]): Promise<void> => {
    try {
      const key = `${CACHE_PREFIX}${subject.toLowerCase().replace(/\s+/g, '_')}_${difficulty.toLowerCase()}`;
      const payload: CachePayload = {
        timestamp: Date.now(),
        data: mcqs,
      };
      await AsyncStorage.setItem(key, JSON.stringify(payload));
    } catch (error) {
      console.error('Failed to write MCQ cache:', error);
    }
  },

  /**
   * Invalidate cache for a specific subject (all difficulties).
   */
  invalidateSubject: async (subject: string): Promise<void> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const subjectKeyPart = `${CACHE_PREFIX}${subject.toLowerCase().replace(/\s+/g, '_')}_`;
      const keysToRemove = keys.filter(key => key.startsWith(subjectKeyPart));
      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
      }
    } catch (error) {
      console.error('Failed to invalidate MCQ cache:', error);
    }
  },

  /**
   * Clear all cached MCQs.
   */
  clearAll: async (): Promise<void> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove = keys.filter(key => key.startsWith(CACHE_PREFIX));
      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
      }
    } catch (error) {
      console.error('Failed to clear all MCQ cache:', error);
    }
  }
};

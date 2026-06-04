/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MCQ, VocabWord, UserStats, QuizSession } from '../types';
import { DEFAULT_MCQS, DEFAULT_VOCAB } from '../data/defaultData';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { QuizService } from '../services/quiz.service';
import { Alert } from 'react-native';

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

interface AppContextProps {
  mcqs: MCQ[];
  vocab: VocabWord[];
  stats: UserStats;
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
  bookmarkWord: (id: string) => void;
  addMCQ: (mcq: Omit<MCQ, 'id'>) => void;
  addVocab: (word: Omit<VocabWord, 'id' | 'isBookmarked'>) => void;
  bulkImportMCQs: (rawJson: string) => { success: boolean; count: number; error?: string };
  bulkImportVocab: (rawJson: string) => { success: boolean; count: number; error?: string };
  saveQuizSession: (session: Omit<QuizSession, 'id' | 'date'>) => void;
  resetStats: () => void;
  isNewDayDetected: boolean;
  setIsNewDayDetected: (val: boolean) => void;
  autoDownloadWallpaper: boolean;
  setAutoDownloadWallpaper: (val: boolean) => void;
  daySeed: number;
  // Supabase Auth extension
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  syncWithCloud: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [vocab, setVocab] = useState<VocabWord[]>([]);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');
  const [isNewDayDetected, setIsNewDayDetected] = useState<boolean>(false);
  const [autoDownloadWallpaper, setAutoDownloadWallpaper] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [stats, setStats] = useState<UserStats>({
    streak: 0,
    lastActiveDate: null,
    totalQuestionsAnswered: 0,
    correctAnswersCount: 0,
    weakAreas: [],
    sessions: [],
  });

  const daySeed = useMemo(() => {
    const baseDate = new Date('2026-01-01').getTime();
    const currentDate = new Date().getTime();
    return Math.floor((currentDate - baseDate) / (1000 * 60 * 60 * 24));
  }, []);

  // 1. Initial Load of Local App Data from AsyncStorage
  useEffect(() => {
    const initAppData = async () => {
      try {
        // Daily Check
        const todayStr = new Date().toDateString();
        const lastOpenedStr = await AsyncStorage.getItem('smart_prep_last_opened_date');
        if (lastOpenedStr && lastOpenedStr !== todayStr) {
          setIsNewDayDetected(true);
        }
        await AsyncStorage.setItem('smart_prep_last_opened_date', todayStr);

        // Auto Download Setting
        const autoDownloadStr = await AsyncStorage.getItem('smart_prep_auto_download_wp');
        setAutoDownloadWallpaper(autoDownloadStr === 'true');

        // MCQs loading
        const storedMcqs = await AsyncStorage.getItem('smart_prep_mcqs');
        let parsedMcqs: MCQ[] = storedMcqs ? JSON.parse(storedMcqs) : [];

        // Legacy ID mapping
        const legacyIdMap: Record<string, string> = {
          'cs-1': '9a6e1106-cf4c-47bc-ad74-884814d48d56',
          'cs-2': 'a4f21db5-eb07-4a0d-85ad-2900ea903960',
          'cs-3': 'fce46eb9-cdde-45c1-8408-bd974d6c4d7e',
          'cs-4': '85beeb5c-5fb2-4752-9ea8-654dbdb189c4',
          'cs-5': '5101037f-ec73-455b-b9d9-5f214690e80a',
          'ps-1': '40cc8c0e-d1b4-4b53-b09e-05e80931505c',
          'ps-2': '299d2572-c2cb-46a4-8ef8-cc5ec93dfc57',
          'ps-3': 'd58f3319-3db6-47b2-9d32-d1d789069a30',
          'ps-4': 'c0993092-23c8-47fb-b472-7634f19b2a65',
          'ps-5': 'f72365bb-d18e-4a67-9b27-5d07010a01cc',
          'eng-1': '87317e3f-67ee-4bdf-87f5-ee1f3918a2bc',
          'eng-2': 'e99a1cb0-c533-4f9b-bd5e-6345ec41b0fc',
          'eng-3': '7636e05d-cc45-42a9-b425-b072f8de38a3',
          'eng-4': '5ab70b8a-b9c2-4db1-8636-6e415ef48a3e',
          'gk-1': 'a1bb4021-d7fe-41dc-accd-b4ec3c2ea8ef',
          'gk-2': 'c3bf68a4-0ef6-4f40-8b42-d1c9ef005efc',
          'gk-3': '9aee9bc7-6ecb-439f-bd96-3ef1a196ecf9',
          'gk-4': 'bdab728e-5b12-4217-bfde-e16e09ebef5a',
          'math-1': 'df6b04ec-24e0-4ad7-8db1-4e78a69bf2cc',
          'math-2': '7a52bbcd-20fa-40ea-9b88-cb94d75d658c',
          'math-3': '8e9c614b-2f3b-4886-ac15-d227c8ff6a99',
          'math-4': '844cc9ee-a83a-4aeb-a029-41718bf7ee2a',
          'math-5': '3df71fb2-b7ce-4bb0-b74c-47b2ff9222c5',
        };

        let hasUpdates = false;
        if (parsedMcqs.length > 0) {
          parsedMcqs = parsedMcqs.map((m) => {
            if (legacyIdMap[m.id]) {
              hasUpdates = true;
              return { ...m, id: legacyIdMap[m.id] };
            }
            if (m.id.startsWith('custom-mcq-')) {
              hasUpdates = true;
              return { ...m, id: generateUUID() };
            }
            return m;
          });
        } else {
          parsedMcqs = DEFAULT_MCQS;
          hasUpdates = true;
        }

        if (hasUpdates) {
          await AsyncStorage.setItem('smart_prep_mcqs', JSON.stringify(parsedMcqs));
        }
        setMcqs(parsedMcqs);

        // Vocab loading
        const storedVocab = await AsyncStorage.getItem('smart_prep_vocab');
        if (storedVocab) {
          setVocab(JSON.parse(storedVocab));
        } else {
          setVocab(DEFAULT_VOCAB);
          await AsyncStorage.setItem('smart_prep_vocab', JSON.stringify(DEFAULT_VOCAB));
        }

        // Stats loading
        const storedStats = await AsyncStorage.getItem('smart_prep_stats');
        if (storedStats) {
          setStats(JSON.parse(storedStats));
        }

        // Theme Loading
        const storedTheme = await AsyncStorage.getItem('smart_prep_theme');
        if (storedTheme === 'light' || storedTheme === 'dark') {
          setCurrentTheme(storedTheme);
        } else {
          setCurrentTheme('dark');
        }
      } catch (err) {
        console.error('Failed to initialize local data', err);
      } finally {
        setLoading(false);
      }
    };

    initAppData();

    // 2. Auth Session Bootstrap via AuthService
    AuthService.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      // Flush any quiz sessions queued while offline
      if (u) {
        QuizService.flushPendingSync(u.id).catch(() => null);
      }
    });

    const { data: { subscription } } = AuthService.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (_event === 'SIGNED_IN' && u) {
        QuizService.flushPendingSync(u.id).catch(() => null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSetAutoDownloadWallpaper = async (val: boolean) => {
    setAutoDownloadWallpaper(val);
    await AsyncStorage.setItem('smart_prep_auto_download_wp', String(val));
  };

  const toggleTheme = async () => {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(nextTheme);
    await AsyncStorage.setItem('smart_prep_theme', nextTheme);
  };

  const bookmarkWord = async (id: string) => {
    const updated = vocab.map((v) => (v.id === id ? { ...v, isBookmarked: !v.isBookmarked } : v));
    setVocab(updated);
    await AsyncStorage.setItem('smart_prep_vocab', JSON.stringify(updated));
  };

  const addMCQ = async (newMcq: Omit<MCQ, 'id'>) => {
    const mcqWithId: MCQ = {
      ...newMcq,
      id: generateUUID(),
    };
    const updated = [mcqWithId, ...mcqs];
    setMcqs(updated);
    await AsyncStorage.setItem('smart_prep_mcqs', JSON.stringify(updated));
    
  };

  const addVocab = async (newVocab: Omit<VocabWord, 'id' | 'isBookmarked'>) => {
    const vocabWithId: VocabWord = {
      ...newVocab,
      id: `custom-vocab-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      isBookmarked: false,
    };
    const updated = [vocabWithId, ...vocab];
    setVocab(updated);
    await AsyncStorage.setItem('smart_prep_vocab', JSON.stringify(updated));

  };

  const bulkImportMCQs = (rawJson: string) => {
    try {
      const parsed = JSON.parse(rawJson);
      if (!Array.isArray(parsed)) {
        return { success: false, count: 0, error: 'JSON must be a valid array of MCQ objects' };
      }

      const validMCQs: MCQ[] = [];
      for (const item of parsed) {
        if (
          typeof item.question === 'string' &&
          Array.isArray(item.options) &&
          item.options.length >= 2 &&
          typeof item.correctAnswer === 'number' &&
          typeof item.explanation === 'string' &&
          typeof item.category === 'string'
        ) {
          validMCQs.push({
            id: item.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id)
              ? item.id
              : generateUUID(),
            question: item.question,
            options: item.options,
            correctAnswer: item.correctAnswer,
            explanation: item.explanation,
            category: item.category as MCQ['category'],
            subcategory: item.subcategory || 'General',
            examType: item.examType || 'Practice',
            isRepeated: !!item.isRepeated,
            repeatCount: typeof item.repeatCount === 'number' ? item.repeatCount : undefined,
            importance: item.importance || 'medium',
          });
        }
      }

      if (validMCQs.length === 0) {
        return { success: false, count: 0, error: 'No valid MCQs found matching the required format' };
      }

      const updated = [...validMCQs, ...mcqs];
      setMcqs(updated);
      AsyncStorage.setItem('smart_prep_mcqs', JSON.stringify(updated));
      return { success: true, count: validMCQs.length };
    } catch (e: any) {
      return { success: false, count: 0, error: e.message || 'Failed to parse JSON' };
    }
  };

  const bulkImportVocab = (rawJson: string) => {
    try {
      const parsed = JSON.parse(rawJson);
      if (!Array.isArray(parsed)) {
        return { success: false, count: 0, error: 'JSON must be a valid array of Word objects' };
      }

      const validVocab: VocabWord[] = [];
      for (const item of parsed) {
        if (typeof item.word === 'string' && typeof item.meaning === 'string') {
          validVocab.push({
            id: item.id || `imported-vocab-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            word: item.word,
            meaning: item.meaning,
            synonyms: Array.isArray(item.synonyms) ? item.synonyms : [],
            antonyms: Array.isArray(item.antonyms) ? item.antonyms : [],
            example: typeof item.example === 'string' ? item.example : '',
            isBookmarked: false,
            category: item.category || 'General Vocabulary',
          });
        }
      }

      if (validVocab.length === 0) {
        return { success: false, count: 0, error: 'No valid Vocabulary words found' };
      }

      const updated = [...validVocab, ...vocab];
      setVocab(updated);
      AsyncStorage.setItem('smart_prep_vocab', JSON.stringify(updated));
      return { success: true, count: validVocab.length };
    } catch (e: any) {
      return { success: false, count: 0, error: e.message || 'Failed to parse JSON' };
    }
  };

  const saveQuizSession = async (sessionData: Omit<QuizSession, 'id' | 'date'>) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newSession: QuizSession = {
      ...sessionData,
      id: `session-${Date.now()}`,
      date: new Date().toISOString(),
    };

    // Calculate streak
    let newStreak = stats.streak;
    if (stats.lastActiveDate === null) {
      newStreak = 1;
    } else {
      const lastActive = new Date(stats.lastActiveDate);
      const today = new Date(todayStr);
      const diffTime = Math.abs(today.getTime() - lastActive.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1; // broken streak
      }
    }

    // Update weak areas tracking
    const catMap: Record<string, number> = {};
    stats.weakAreas.forEach((wa) => {
      catMap[wa.category] = wa.incorrectCount;
    });

    sessionData.answers.forEach((ans) => {
      if (!ans.isCorrect) {
        const mcq = mcqs.find((m) => m.id === ans.mcqId);
        if (mcq) {
          catMap[mcq.category] = (catMap[mcq.category] || 0) + 1;
        }
      }
    });

    const updatedWeakAreas = Object.keys(catMap)
      .map((cat) => ({
        category: cat,
        incorrectCount: catMap[cat],
      }))
      .sort((a, b) => b.incorrectCount - a.incorrectCount);

    const updatedStats: UserStats = {
      ...stats,
      streak: newStreak > 0 ? newStreak : 1,
      lastActiveDate: todayStr,
      totalQuestionsAnswered: stats.totalQuestionsAnswered + sessionData.totalQuestions,
      correctAnswersCount: stats.correctAnswersCount + sessionData.score,
      weakAreas: updatedWeakAreas,
      sessions: [newSession, ...stats.sessions],
    };

    setStats(updatedStats);
    await AsyncStorage.setItem('smart_prep_stats', JSON.stringify(updatedStats));

    // Cloud sync via QuizService (offline-first: queues if network fails)
    if (user) {
      try {
        await QuizService.saveAttempt(user.id, newSession);
        await UserService.updateStats(user.id, {
          totalQuestions: sessionData.totalQuestions,
          correctAnswers: sessionData.score,
          streakDate: todayStr,
        });
      } catch (e) {
        // Queue for retry on next app open
        await QuizService.queueForSync(newSession);
        console.warn('Quiz sync queued for retry:', e);
      }
    }
  };

  const resetStats = async () => {
    const resetValues: UserStats = {
      streak: 0,
      lastActiveDate: null,
      totalQuestionsAnswered: 0,
      correctAnswersCount: 0,
      weakAreas: [],
      sessions: [],
    };
    setStats(resetValues);
    await AsyncStorage.setItem('smart_prep_stats', JSON.stringify(resetValues));

    const clearBookmarks = vocab.map((v) => ({ ...v, isBookmarked: false }));
    setVocab(clearBookmarks);
    await AsyncStorage.setItem('smart_prep_vocab', JSON.stringify(clearBookmarks));

    // Cloud reset handled via UserService in future phase
  };

  // Auth Operations — delegated to AuthService
  const signIn = async (email: string, password: string) => {
    const { data, error } = await AuthService.signInWithEmail(email, password);
    if (data?.user) setUser(data.user);
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await AuthService.signUpWithEmail(email, password);
    if (data?.user) setUser(data.user);
    return { error };
  };

  const signOut = async () => {
    await AuthService.signOut();
    setUser(null);
  };

  /**
   * Flush any offline-queued quiz sessions to Supabase.
   * Call on app startup after auth is confirmed.
   */
  const syncWithCloud = async () => {
    if (!user) return;
    try {
      // Flush any offline-queued quiz sessions first
      await QuizService.flushPendingSync(user.id);
      // Profile is managed by UserService RPC — no JSON blob merge needed
    } catch (e) {
      console.log('Cloud sync error:', e);
    }
    // Cloud sync: custom MCQs are user-created, persist via mcqs table
    // (handled by MCQService in Phase 5 — skipped here to avoid breaking current flow);
  };

  return (
    <AppContext.Provider
      value={{
        mcqs,
        vocab,
        stats,
        currentTheme,
        toggleTheme,
        bookmarkWord,
        addMCQ,
        addVocab,
        bulkImportMCQs,
        bulkImportVocab,
        saveQuizSession,
        resetStats,
        isNewDayDetected,
        setIsNewDayDetected,
        autoDownloadWallpaper,
        setAutoDownloadWallpaper: handleSetAutoDownloadWallpaper,
        daySeed,
        // Auth
        user,
        loading,
        signIn,
        signUp,
        signOut,
        syncWithCloud,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

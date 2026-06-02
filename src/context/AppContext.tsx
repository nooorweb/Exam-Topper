/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MCQ, VocabWord, UserStats, QuizSession } from '../types';
import { DEFAULT_MCQS, DEFAULT_VOCAB } from '../data/defaultData';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

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
        if (storedMcqs) {
          setMcqs(JSON.parse(storedMcqs));
        } else {
          setMcqs(DEFAULT_MCQS);
          await AsyncStorage.setItem('smart_prep_mcqs', JSON.stringify(DEFAULT_MCQS));
        }

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

    // 2. Supabase Session Listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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
      id: `custom-mcq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    const updated = [mcqWithId, ...mcqs];
    setMcqs(updated);
    await AsyncStorage.setItem('smart_prep_mcqs', JSON.stringify(updated));
    
    // Cloud sync logic if user is authenticated
    if (user) {
      try {
        await supabase.from('mcqs').insert([{ ...mcqWithId, user_id: user.id }]);
      } catch (e) {
        console.log('Failed to upload custom MCQ to cloud', e);
      }
    }
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

    if (user) {
      try {
        await supabase.from('vocab').insert([{ ...vocabWithId, user_id: user.id }]);
      } catch (e) {
        console.log('Failed to upload vocab to cloud', e);
      }
    }
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
            id: item.id || `imported-mcq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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

    // Upload to Supabase cloud if user is logged in
    if (user) {
      try {
        await supabase.from('quiz_sessions').insert([{ ...newSession, user_id: user.id }]);
        await supabase
          .from('user_profiles')
          .upsert({ id: user.id, updated_at: new Date(), stats: updatedStats });
      } catch (e) {
        console.log('Failed to sync quiz session to cloud', e);
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

    if (user) {
      try {
        await supabase.from('user_profiles').upsert({ id: user.id, updated_at: new Date(), stats: resetValues });
        // Optionally delete cloud records as well
      } catch (e) {
        console.log('Failed to reset cloud stats', e);
      }
    }
  };

  // Auth Operations
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (data?.user) setUser(data.user);
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (data?.user) setUser(data.user);
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const syncWithCloud = async () => {
    if (!user) return;
    try {
      // 1. Fetch user profile stats
      const { data: profile, error: pError } = await supabase
        .from('user_profiles')
        .select('stats')
        .eq('id', user.id)
        .single();

      if (profile?.stats) {
        const cloudStats = profile.stats as UserStats;
        // Merge strategy: take the one with higher total questions or merge lists
        if (cloudStats.totalQuestionsAnswered > stats.totalQuestionsAnswered) {
          setStats(cloudStats);
          await AsyncStorage.setItem('smart_prep_stats', JSON.stringify(cloudStats));
        } else {
          // Upload local stats as it is more fresh
          await supabase.from('user_profiles').upsert({ id: user.id, stats });
        }
      }
    } catch (e) {
      console.log('Cloud sync error', e);
    }
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

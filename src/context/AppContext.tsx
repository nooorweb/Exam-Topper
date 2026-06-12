/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MCQ, VocabWord, UserStats, QuizSession } from '../types';
import { NoteTopic, SubjectNotebook } from '../data/notesData';
import { VocabService } from '../services/vocab.service';
import { MCQService } from '../services/mcq.service';
import { NoteService } from '../services/note.service';
import { AuthService } from '../services/auth.service';
import { UserService, type UserProfile } from '../services/user.service';
import { QuizService } from '../services/quiz.service';
import { Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

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
  noteTopics: NoteTopic[];
  subjectNotebooks: SubjectNotebook[];
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
  examFocus: string;
  setExamFocus: (focus: string) => Promise<void>;
  examSubFocus: string;
  setExamSubFocus: (subFocus: string) => Promise<void>;
  // Supabase Auth extension
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  syncWithCloud: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [vocab, setVocab] = useState<VocabWord[]>([]);
  const [noteTopics, setNoteTopics] = useState<NoteTopic[]>([]);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');
  const [isNewDayDetected, setIsNewDayDetected] = useState<boolean>(false);
  const [autoDownloadWallpaper, setAutoDownloadWallpaper] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [examFocus, setExamFocusState] = useState<string>('General');
  const [examSubFocus, setExamSubFocusState] = useState<string>('General');

  const setExamFocus = async (focus: string) => {
    setExamFocusState(focus);
    await AsyncStorage.setItem('smart_prep_focus', focus);
  };

  const setExamSubFocus = async (subFocus: string) => {
    setExamSubFocusState(subFocus);
    await AsyncStorage.setItem('smart_prep_sub_focus', subFocus);
  };

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

  const fetchUserProfile = async (userId: string) => {
    try {
      const p = await UserService.getProfile(userId);
      setProfile(p);
      if (p) {
        if (p.onboarding_done) {
          await AsyncStorage.setItem('smart_prep_onboarding_complete', 'true');
        } else {
          const localDoneVal = await AsyncStorage.getItem('smart_prep_onboarding_complete');
          if (localDoneVal === 'true') {
            const savedFocus = await AsyncStorage.getItem('smart_prep_focus');
            await UserService.completeOnboarding(userId, {
              selectedSubjects: savedFocus ? [savedFocus] : [],
              examTarget: savedFocus || 'General',
              dailyGoalMinutes: 20,
            });
            p.onboarding_done = true;
            setProfile({ ...p });
          }
        }
      }
      return p;
    } catch (err) {
      console.error('Error fetching user profile in AppContext:', err);
      setProfile(null);
      return null;
    }
  };

  const loadVocabData = async (userId?: string) => {
    try {
      let dbVocab = await VocabService.fetchVocabWords();
      if (dbVocab && dbVocab.length > 0) {
        let bookmarkedIds: string[] = [];
        if (userId) {
          bookmarkedIds = await VocabService.fetchUserBookmarks(userId);
        } else {
          const storedLocal = await AsyncStorage.getItem('smart_prep_vocab');
          if (storedLocal) {
            const parsedLocal: VocabWord[] = JSON.parse(storedLocal);
            bookmarkedIds = parsedLocal.filter(w => w.isBookmarked).map(w => w.id);
          }
        }
        const bookmarkSet = new Set(bookmarkedIds);
        dbVocab = dbVocab.map(w => ({
          ...w,
          isBookmarked: bookmarkSet.has(w.id)
        }));
        setVocab(dbVocab);
        await AsyncStorage.setItem('smart_prep_vocab', JSON.stringify(dbVocab));
      } else {
        const storedLocal = await AsyncStorage.getItem('smart_prep_vocab');
        if (storedLocal) {
          setVocab(JSON.parse(storedLocal));
        }
      }
    } catch (err) {
      console.error('Error loading vocab data:', err);
    }
  };

  const loadMCQData = async () => {
    try {
      const dbMcqs = await MCQService.fetchAllMCQs();
      if (dbMcqs && dbMcqs.length > 0) {
        setMcqs(dbMcqs);
        await AsyncStorage.setItem('smart_prep_mcqs', JSON.stringify(dbMcqs));
      }
    } catch (err) {
      console.error('Error loading MCQs data from database:', err);
    }
  };

  const loadNotesData = async () => {
    try {
      const dbNotes = await NoteService.fetchNoteTopics();
      if (dbNotes && dbNotes.length > 0) {
        setNoteTopics(dbNotes);
        await AsyncStorage.setItem('smart_prep_notes', JSON.stringify(dbNotes));
      } else {
        const storedLocal = await AsyncStorage.getItem('smart_prep_notes');
        if (storedLocal) {
          setNoteTopics(JSON.parse(storedLocal));
        }
      }
    } catch (err) {
      console.error('Error loading notes data from database:', err);
      const storedLocal = await AsyncStorage.getItem('smart_prep_notes');
      if (storedLocal) {
        setNoteTopics(JSON.parse(storedLocal));
      }
    }
  };

  const subjectNotebooks = useMemo<SubjectNotebook[]>(() => {
    const SUBJECT_ORDER: SubjectNotebook['subject'][] = [
      'English',
      'Mathematics',
      'General Knowledge',
      'Pakistan Studies',
      'Computer Science',
      'Islamiat',
    ];

    const SUBJECT_DETAILS: Record<SubjectNotebook['subject'], { iconName: string; description: string }> = {
      'English': {
        iconName: 'BookOpen',
        description: 'Master prepositions, conditional sentences, active-passive voice, and high-frequency idioms tested in competitive tests.',
      },
      'Mathematics': {
        iconName: 'Calculator',
        description: 'Quick formula lookup sheets and mental calculation methods for fast-paced competitive math screening.',
      },
      'General Knowledge': {
        iconName: 'Globe',
        description: 'Syllabus notes regarding International Organizations, world geography, straits, and standard sovereign currencies.',
      },
      'Pakistan Studies': {
        iconName: 'Map',
        description: 'Chronological pre-partition freedom struggles, geographies, constitutional histories, and military/treaty timelines.',
      },
      'Computer Science': {
        iconName: 'Cpu',
        description: 'Review core concepts in database management systems, data structures, and OSI networking models.',
      },
      'Shortcut Keys': {
        iconName: 'Cpu',
        description: 'Master advanced MS Word, MS Excel, and MS PowerPoint keyboard shortcuts.',
      },
      'Islamiat': {
        iconName: 'BookOpen',
        description: 'Islamic history, pillars of Islam, Quranic revelations, and life of Prophet Muhammad (PBUH) tested in competitive exams.',
      },
    };

    return SUBJECT_ORDER.map((subject) => {
      const details = SUBJECT_DETAILS[subject];
      const topics = noteTopics.filter((t) => t.subject === subject);

      return {
        subject,
        iconName: details.iconName,
        description: details.description,
        topics,
      };
    });
  }, [noteTopics]);

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

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

        // Load exam focus
        const storedFocus = await AsyncStorage.getItem('smart_prep_focus');
        if (storedFocus) {
          setExamFocusState(storedFocus);
        }

        const storedSubFocus = await AsyncStorage.getItem('smart_prep_sub_focus');
        if (storedSubFocus) {
          setExamSubFocusState(storedSubFocus);
        }

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
        }

        if (hasUpdates) {
          await AsyncStorage.setItem('smart_prep_mcqs', JSON.stringify(parsedMcqs));
        }
        setMcqs(parsedMcqs);
        // Load fresh MCQs from DB in background
        loadMCQData();

        // Vocab loading
        const storedVocab = await AsyncStorage.getItem('smart_prep_vocab');
        if (storedVocab) {
          setVocab(JSON.parse(storedVocab));
        }
        // Fetch fresh words from DB in background
        loadVocabData();

        // Notes loading
        const storedNotes = await AsyncStorage.getItem('smart_prep_notes');
        if (storedNotes) {
          setNoteTopics(JSON.parse(storedNotes));
        }
        // Fetch fresh notes from DB in background
        loadNotesData();

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
      if (u) {
        await fetchUserProfile(u.id);
        await loadVocabData(u.id);
        QuizService.flushPendingSync(u.id).catch(() => null);
      } else {
        await loadVocabData();
      }
    });

    const { data: { subscription } } = AuthService.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (_event === 'SIGNED_IN' && u) {
        await fetchUserProfile(u.id);
        await loadVocabData(u.id);
        QuizService.flushPendingSync(u.id).catch(() => null);
      } else if (_event === 'SIGNED_OUT') {
        setProfile(null);
        await loadVocabData();
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
    const word = vocab.find(v => v.id === id);
    if (!word) return;
    const nextBookmarked = !word.isBookmarked;

    const updated = vocab.map((v) => (v.id === id ? { ...v, isBookmarked: nextBookmarked } : v));
    setVocab(updated);
    await AsyncStorage.setItem('smart_prep_vocab', JSON.stringify(updated));

    if (user) {
      await VocabService.toggleBookmark(user.id, id, nextBookmarked);
    }
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
        const cat = mcq?.category || ans.category;
        if (cat) {
          catMap[cat] = (catMap[cat] || 0) + 1;
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

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { data, error } = await AuthService.signUpWithEmail(email, password, displayName);
    if (data?.user) setUser(data.user);
    return { error };
  };

  const signInWithGoogle = async () => {
    try {
      if (Platform.OS === 'web') {
        const { error } = await AuthService.signInWithGoogleWeb(window.location.origin);
        return { error };
      }

      const redirectUrl = Linking.createURL('/auth/callback');
      const { data, error } = await AuthService.signInWithGoogle(redirectUrl);
      
      if (error) return { error };
      if (!data?.url) return { error: new Error('No Auth URL returned') };

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (result.type === 'success') {
        const urlStr = result.url;
        const hashIndex = urlStr.indexOf('#');
        const queryIndex = urlStr.indexOf('?');
        const paramStr = hashIndex !== -1 
          ? urlStr.substring(hashIndex + 1) 
          : (queryIndex !== -1 ? urlStr.substring(queryIndex + 1) : '');

        const getParam = (name: string) => {
          const match = paramStr.match(new RegExp('[#?&]' + name + '=([^&#]*)'));
          if (match) return decodeURIComponent(match[1]);
          const match2 = paramStr.match(new RegExp('(^|&)' + name + '=([^&#]*)'));
          return match2 ? decodeURIComponent(match2[2]) : null;
        };

        const access_token = getParam('access_token');
        const refresh_token = getParam('refresh_token');

        if (access_token && refresh_token) {
          const { error: sessionError } = await AuthService.setSessionFromTokens(access_token, refresh_token);
          if (sessionError) return { error: sessionError };
          return { error: null };
        } else {
          return { error: new Error('Failed to extract tokens from redirect URL') };
        }
      } else {
        return { error: new Error('Sign in was cancelled or failed') };
      }
    } catch (e) {
      return { error: e };
    }
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
        noteTopics,
        subjectNotebooks,
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
        examFocus,
        setExamFocus,
        examSubFocus,
        setExamSubFocus,
        // Auth
        user,
        profile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        syncWithCloud,
        refreshProfile,
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

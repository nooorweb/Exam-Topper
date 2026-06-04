/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0 for A, 1 for B, 2 for C, 3 for D
  explanation: string;
  category: 'English' | 'General Knowledge' | 'Pakistan Studies' | 'Computer Science' | 'Mathematics' | 'Islamiat';
  subcategory?: string;
  examType?: string; // e.g. "KPPSC Past Paper 2023", "ETEA 2022", "FIA 2021"
  isRepeated?: boolean;
  repeatCount?: number;
  importance?: 'high' | 'medium' | 'low';
}

export interface VocabWord {
  id: string;
  word: string;
  meaning: string;
  urduMeaning?: string; // Urdu translation/meaning
  synonyms: string[];
  antonyms: string[];
  example: string;
  isBookmarked: boolean;
  category?: string;
}

export interface QuizSession {
  id: string;
  date: string;
  timeSpent: number; // in seconds
  score: number;
  totalQuestions: number;
  category: string;
  mode?: 'practice' | 'exam';
  isAiGenerated?: boolean; // true for Gemini AI-powered quiz sessions
  timePerQuestion?: number; // 0 = no timer; positive = seconds per question
  answers: {
    mcqId: string;
    question: string;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
    category?: string; // included so AI quizzes can track weak areas without main MCQ pool lookup
  }[];
}

export interface UserStats {
  streak: number;
  lastActiveDate: string | null;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  weakAreas: { category: string; incorrectCount: number }[];
  sessions: QuizSession[];
}

export interface WallpaperSettings {
  backgroundType: 'gradient' | 'solid' | 'abstract';
  backgroundIndex: number;
  textCol: string;
  fontFamily: string;
  wordsCount: number;
  showDetails: boolean; // meaning, synonyms, antonyms
}

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  BackHandler,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from '../src/components/common';
import { useApp } from '../src/context/AppContext';
import { MCQ, QuizSession } from '../src/types';
import { MCQService } from '../src/services/mcq.service';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Award,
  Clock,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  BookOpen,
  Sparkles,
} from 'lucide-react-native';
import { impactLight, notificationSuccess, notificationError } from '../src/utils/haptics';

export const AI_QUIZ_TEMP_KEY = 'smart_prep_ai_quiz_temp';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnswerRecord {
  mcqId: string;
  question: string;
  selectedOption: number;   // -1 = skipped/unanswered
  correctOption: number;
  isCorrect: boolean;
  options: string[];
  explanation: string;
  examType?: string;
  category: string;
}

const matchesFocus = (mcq: MCQ, focus: string): boolean => {
  const examTypeLower = (mcq.examType || '').toLowerCase();
  
  if (focus === 'KPPSC & ETEA') {
    return examTypeLower.includes('kppsc') || examTypeLower.includes('etea');
  }
  if (focus === 'FIA Inspector') {
    return examTypeLower.includes('fia') || examTypeLower.includes('fpsc');
  }
  if (focus === 'CSS Descriptive') {
    return examTypeLower.includes('css') || examTypeLower.includes('fpsc');
  }
  if (focus === 'All Punjab/Sindh Boards') {
    return examTypeLower.includes('pms') || examTypeLower.includes('nts') || examTypeLower.includes('board');
  }
  return true;
};

const getCleanBadgeText = (examType: string | undefined, userFocus: string): string | null => {
  if (!examType) return null;
  const examLower = examType.toLowerCase();
  
  if (userFocus === 'KPPSC & ETEA') {
    if (examLower.includes('kppsc') || examLower.includes('etea')) {
      return examType;
    }
    return 'KPPSC & ETEA Prep';
  }
  if (userFocus === 'FIA Inspector') {
    if (examLower.includes('fia') || examLower.includes('fpsc')) {
      return examType;
    }
    return 'FIA Inspector Prep';
  }
  if (userFocus === 'CSS Descriptive') {
    if (examLower.includes('css') || examLower.includes('fpsc')) {
      return examType;
    }
    return 'CSS Prep';
  }
  if (userFocus === 'All Punjab/Sindh Boards') {
    if (examLower.includes('pms') || examLower.includes('nts') || examLower.includes('board')) {
      return examType;
    }
    return 'PMS Prep';
  }
  return examType;
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QuizSessionScreen() {
  const { mcqs, saveQuizSession, currentTheme } = useApp();
  const isDark = currentTheme === 'dark';

  const params = useLocalSearchParams();
  const categoryParam = params.category as string;
  const isMixed = categoryParam === 'mixed' || !categoryParam;
  const questionsLimit = parseInt(params.limit as string) || 10;
  const negativeMarking = parseFloat(params.negativeMarking as string) || 0;
  const difficultyParam = (params.difficulty as string) || 'All';
  // AI quiz mode: questions are loaded from a temp AsyncStorage key
  const isAiMode = params.aiQuizMode === 'true';
  const aiCategory = (params.aiCategory as string) || 'AI Mock';

  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [userFocus, setUserFocus] = useState<string>('KPPSC & ETEA');

  // ── Load MCQs asynchronously (from database/cache or local storage) ────────
  useEffect(() => {
    if (isAiMode) {
      const loadAiMCQs = async () => {
        const startTime = Date.now();
        const focus = await AsyncStorage.getItem('smart_prep_focus');
        if (focus) {
          setUserFocus(focus);
        }
        try {
          const raw = await AsyncStorage.getItem(AI_QUIZ_TEMP_KEY);
          if (raw) {
            const parsed: MCQ[] = JSON.parse(raw);
            setQuestions(parsed);
            // Clear temp key so it doesn't persist or contaminate anything
            await AsyncStorage.removeItem(AI_QUIZ_TEMP_KEY);
          }
        } catch (e) {
          console.error('Failed to load AI quiz from temp storage', e);
        } finally {
          const elapsed = Date.now() - startTime;
          const delay = Math.max(0, 1200 - elapsed);
          setTimeout(() => {
            setLoading(false);
          }, delay);
        }
      };
      loadAiMCQs();
    } else {
      // Standard mode: Synchronous, fully offline filtering of local pool with exam focus priority
      const loadStandardMCQs = async () => {
        const focus = await AsyncStorage.getItem('smart_prep_focus');
        const activeFocus = focus || 'KPPSC & ETEA';
        setUserFocus(activeFocus);

        const customIds = params.customMCQIds as string;
        let selectedQuestions: MCQ[] = [];
        if (customIds) {
          const ids = customIds.split(',');
          selectedQuestions = mcqs.filter(m => ids.includes(m.id));
        } else {
          let pool = [...mcqs];
          if (!isMixed) pool = pool.filter(m => m.category === categoryParam);

          // Apply user's exam focus filter to avoid the "mix pickle"
          let focusPool = pool.filter(m => matchesFocus(m, activeFocus));
          if (focusPool.length === 0) focusPool = pool;

          let filteredPool = [...focusPool];
          if (difficultyParam === 'Conceptual') {
            const conceptual = filteredPool.filter(m => m.importance === 'medium' || m.importance === 'low');
            if (conceptual.length > 0) filteredPool = conceptual;
          } else if (difficultyParam === 'High Repeats') {
            const repeats = filteredPool.filter(m => m.isRepeated === true);
            if (repeats.length > 0) filteredPool = repeats;
          }

          selectedQuestions = filteredPool.sort(() => 0.5 - Math.random()).slice(0, questionsLimit);

          // If not enough questions match, fill with other ones from the category
          if (selectedQuestions.length < questionsLimit) {
            const remaining = questionsLimit - selectedQuestions.length;
            const selectedIds = new Set(selectedQuestions.map(q => q.id));
            const extra = pool.filter(q => !selectedIds.has(q.id)).sort(() => 0.5 - Math.random()).slice(0, remaining);
            selectedQuestions = [...selectedQuestions, ...extra];
          }
        }
        setQuestions(selectedQuestions);
        setLoading(false);
      };
      loadStandardMCQs();
    }
  }, [isAiMode, categoryParam, isMixed, questionsLimit, difficultyParam, params.customMCQIds, mcqs]);

  // ── Theme colours ────────────────────────────────────────────────────────
  const C = {
    bg: isDark ? '#09090b' : '#f4f4f5',
    card: isDark ? '#121214' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#18181b',
    textMuted: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#27272a' : '#e4e4e7',
    primary: '#6366f1',
    primaryBg: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)',
    success: '#10b981',
    successBg: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5',
    danger: '#ef4444',
    dangerBg: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2',
    warning: '#f59e0b',
    neutral: isDark ? '#27272a' : '#f3f4f6',
    aiAccent: '#10b981',
  };

  // ── Filter & shuffle session MCQs ────────────────────────────────────────
  const sessionMCQs = questions;

  // ── Quiz state ───────────────────────────────────────────────────────────
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);   // locked after tap, before next Q
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'correct'>('all');

  // Animation for flash feedback
  const flashAnim = useRef(new Animated.Value(0)).current;

  // ── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isCompleted || sessionMCQs.length === 0) return;
    const id = setInterval(() => setTimeSpent(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [isCompleted, sessionMCQs.length]);

  // ── Android back button ──────────────────────────────────────────────────
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      handleQuit();
      return true;
    });
    return () => sub.remove();
  }, []);

  // ── Reset selection when index changes ───────────────────────────────────
  useEffect(() => {
    setSelectedOption(null);
    setIsAdvancing(false);
  }, [currentIdx]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleQuit = () => {
    Alert.alert(
      'Quit Session',
      'End this session? Your progress for this test will be lost.',
      [
        { text: 'Continue', style: 'cancel' },
        { text: 'Quit', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  /** Called when user taps an option. Records answer and auto-advances after 600 ms. */
  const handleOptionTap = (optionIdx: number) => {
    if (isAdvancing) return;   // prevent double-tap
    setSelectedOption(optionIdx);
    setIsAdvancing(true);

    const mcq = sessionMCQs[currentIdx];
    const correct = optionIdx === mcq.correctAnswer;

    // Haptic feedback
    if (correct) notificationSuccess(); else notificationError();

    // Flash animation
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();

    const record: AnswerRecord = {
      mcqId: mcq.id,
      question: mcq.question,
      selectedOption: optionIdx,
      correctOption: mcq.correctAnswer,
      isCorrect: correct,
      options: mcq.options,
      explanation: mcq.explanation || '',
      examType: mcq.examType,
      category: mcq.category,
    };

    const updatedAnswers = [...answers, record];

    // After 650 ms → move to next or finish
    setTimeout(() => {
      if (currentIdx + 1 < sessionMCQs.length) {
        setAnswers(updatedAnswers);
        setCurrentIdx(prev => prev + 1);
      } else {
        // Session complete
        setAnswers(updatedAnswers);
        const scoreCount = updatedAnswers.filter(a => a.isCorrect).length;
        const sessionCategory = isAiMode
          ? `AI Mock · ${aiCategory}`
          : isMixed ? 'Mixed Practice' : categoryParam;
        saveQuizSession({
          totalQuestions: sessionMCQs.length,
          score: scoreCount,
          category: sessionCategory,
          timeSpent: timeSpent,
          isAiGenerated: isAiMode,
          answers: updatedAnswers.map(a => ({
            mcqId: a.mcqId,
            question: a.question,
            selectedOption: a.selectedOption,
            correctOption: a.correctOption,
            isCorrect: a.isCorrect,
            category: a.category, // pass through for AI weak-area tracking
          })),
          mode: 'exam',
        });
        setIsCompleted(true);
      }
    }, 650);
  };

  // ─── Loading state ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={[s.fill, { backgroundColor: C.bg }]}>
        <View style={s.emptyBox}>
          <Sparkles size={44} color={C.success} />
          <Text style={[s.emptyTitle, { color: C.text }]}>
            {isAiMode ? 'Loading AI Quiz…' : 'Loading Quiz…'}
          </Text>
          <Text style={[s.emptyBody, { color: C.textMuted }]}>
            {isAiMode
              ? 'Preparing your Gemini-generated questions. This only takes a moment.'
              : 'Fetching optimized practice questions from database/cache.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Empty state ────────────────────────────────────────────────────────
  if (sessionMCQs.length === 0) {
    return (
      <SafeAreaView style={[s.fill, { backgroundColor: C.bg }]}>
        <View style={s.emptyBox}>
          <AlertTriangle size={44} color={C.warning} />
          <Text style={[s.emptyTitle, { color: C.text }]}>No Questions Found</Text>
          <Text style={[s.emptyBody, { color: C.textMuted }]}>
            {isAiMode
              ? 'The AI quiz could not be loaded. Please try generating again from the Quiz tab.'
              : `Not enough MCQs in "${isMixed ? 'Mixed' : categoryParam}" with those settings. Try adjusting difficulty or adding questions.`}
          </Text>
          <TouchableOpacity onPress={() => router.back()} style={[s.btnAction, { backgroundColor: C.primary }]}>
            <Text style={s.btnActionText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Results screen ─────────────────────────────────────────────────────
  if (isCompleted) {
    const scoreCount = answers.filter(a => a.isCorrect).length;
    const wrongCount = answers.filter(a => !a.isCorrect).length;
    const accuracy = Math.round((scoreCount / answers.length) * 100);
    const penalty = wrongCount * negativeMarking;
    const netScore = scoreCount - penalty;
    const isExcellent = accuracy >= 80;
    const isPassing = accuracy >= 50;

    const filtered = answers.filter(a =>
      reviewFilter === 'all' ? true : reviewFilter === 'wrong' ? !a.isCorrect : a.isCorrect
    );

    const ringColor = isExcellent ? C.success : isPassing ? C.warning : C.danger;

    return (
      <SafeAreaView style={[s.fill, { backgroundColor: C.bg }]}>
        <ScrollView contentContainerStyle={s.resultsContent}>

          {/* ── Hero card ── */}
          <View style={[s.heroCard, { backgroundColor: C.card, borderColor: C.border }]}>
            {/* Circular score ring */}
            <View style={[s.ring, { borderColor: ringColor }]}>
              <Text style={[s.ringPct, { color: C.text }]}>{accuracy}%</Text>
              <Text style={[s.ringLabel, { color: C.textMuted }]}>ACCURACY</Text>
            </View>

            <Text style={[s.heroMsg, { color: C.text }]}>
              {isExcellent ? '🎉 Excellent!' : isPassing ? '👍 Good Attempt!' : '💪 Keep Practicing!'}
            </Text>
            <Text style={[s.heroSub, { color: C.textMuted }]}>
              {sessionMCQs.length} MCQs · {Math.round(timeSpent / 60) || 1} min
            </Text>

            {/* Stat pills */}
            <View style={s.statRow}>
              <View style={[s.statPill, { backgroundColor: C.successBg }]}>
                <CheckCircle2 size={14} color={C.success} />
                <Text style={[s.statPillText, { color: C.success }]}>
                  {scoreCount} Correct
                </Text>
              </View>
              <View style={[s.statPill, { backgroundColor: C.dangerBg }]}>
                <XCircle size={14} color={C.danger} />
                <Text style={[s.statPillText, { color: C.danger }]}>
                  {wrongCount} Wrong
                </Text>
              </View>
              <View style={[s.statPill, { backgroundColor: C.primaryBg }]}>
                <Clock size={14} color={C.primary} />
                <Text style={[s.statPillText, { color: C.primary }]}>
                  {timeSpent}s
                </Text>
              </View>
            </View>

            {/* Negative marking merit box */}
            {negativeMarking > 0 && (
              <View style={[s.meritBox, { backgroundColor: isDark ? '#1c1917' : '#fffbeb', borderColor: '#fde68a' }]}>
                <Text style={[s.meritTitle, { color: isDark ? '#f59e0b' : '#92400e' }]}>
                  KPPSC / ETEA MERIT SHEET
                </Text>
                <View style={s.meritGrid}>
                  <View style={s.meritCell}>
                    <Text style={[s.meritCellVal, { color: C.success }]}>+{scoreCount}</Text>
                    <Text style={[s.meritCellLabel, { color: C.textMuted }]}>Correct</Text>
                  </View>
                  <View style={s.meritCell}>
                    <Text style={[s.meritCellVal, { color: C.danger }]}>-{penalty.toFixed(2)}</Text>
                    <Text style={[s.meritCellLabel, { color: C.textMuted }]}>Penalty</Text>
                  </View>
                  <View style={s.meritCell}>
                    <Text style={[s.meritCellVal, { color: C.primary }]}>{netScore.toFixed(2)}</Text>
                    <Text style={[s.meritCellLabel, { color: C.textMuted }]}>Net Score</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* ── Filter tabs ── */}
          <View style={[s.filterRow, { backgroundColor: C.card, borderColor: C.border }]}>
            {(['all', 'correct', 'wrong'] as const).map(f => (
              <TouchableOpacity
                key={f}
                onPress={() => setReviewFilter(f)}
                style={[
                  s.filterTab,
                  reviewFilter === f && { backgroundColor: f === 'wrong' ? C.danger : f === 'correct' ? C.success : C.primary },
                ]}
              >
                <Text style={[
                  s.filterTabText,
                  { color: reviewFilter === f ? '#fff' : C.textMuted },
                ]}>
                  {f === 'all' ? `All (${answers.length})` : f === 'correct' ? `Correct (${scoreCount})` : `Wrong (${wrongCount})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Question review list ── */}
          <Text style={[s.reviewHeader, { color: C.textMuted }]}>QUESTION REVIEW</Text>

          {filtered.map((ans, i) => {
            const qNum = answers.indexOf(ans) + 1;
            return (
              <View key={ans.mcqId + i} style={[s.reviewCard, { backgroundColor: C.card, borderColor: C.border }]}>
                {/* Question header */}
                <View style={s.reviewTop}>
                  <View style={[s.qNumBadge, { backgroundColor: ans.isCorrect ? C.successBg : C.dangerBg }]}>
                    <Text style={[s.qNumText, { color: ans.isCorrect ? C.success : C.danger }]}>Q{qNum}</Text>
                  </View>
                  {getCleanBadgeText(ans.examType, userFocus) && (
                    <View style={[s.examBadge, { backgroundColor: C.primaryBg }]}>
                      <Text style={[s.examBadgeText, { color: C.primary }]}>
                        {getCleanBadgeText(ans.examType, userFocus)}
                      </Text>
                    </View>
                  )}
                  {ans.isCorrect
                    ? <CheckCircle2 size={16} color={C.success} style={{ marginLeft: 'auto' }} />
                    : <XCircle size={16} color={C.danger} style={{ marginLeft: 'auto' }} />
                  }
                </View>

                <Text style={[s.reviewQuestion, { color: C.text }]}>{ans.question}</Text>

                {/* Options */}
                <View style={s.reviewOptions}>
                  {ans.options.map((opt, oi) => {
                    const isCorrectOpt = oi === ans.correctOption;
                    const isUserPick = oi === ans.selectedOption;
                    const isWrongPick = isUserPick && !ans.isCorrect;

                    let bg = C.neutral;
                    let border = C.border;
                    let textColor = C.text;

                    if (isCorrectOpt) {
                      bg = C.successBg;
                      border = C.success;
                      textColor = C.success;
                    } else if (isWrongPick) {
                      bg = C.dangerBg;
                      border = C.danger;
                      textColor = C.danger;
                    }

                    return (
                      <View key={oi} style={[s.reviewOpt, { backgroundColor: bg, borderColor: border }]}>
                        <View style={[s.optAlpha, {
                          backgroundColor: isCorrectOpt ? C.success : isWrongPick ? C.danger : C.border,
                        }]}>
                          <Text style={[s.optAlphaText, { color: (isCorrectOpt || isWrongPick) ? '#fff' : C.textMuted }]}>
                            {['A', 'B', 'C', 'D'][oi]}
                          </Text>
                        </View>
                        <Text style={[s.reviewOptText, { color: textColor, fontWeight: isCorrectOpt ? '700' : '400' }]}>
                          {opt}
                        </Text>
                        {isCorrectOpt && (
                          <CheckCircle2 size={13} color={C.success} style={{ marginLeft: 'auto', flexShrink: 0 }} />
                        )}
                        {isWrongPick && (
                          <XCircle size={13} color={C.danger} style={{ marginLeft: 'auto', flexShrink: 0 }} />
                        )}
                      </View>
                    );
                  })}
                </View>

                {/* Explanation */}
                {ans.explanation ? (
                  <View style={[s.explanationBox, { backgroundColor: isDark ? '#1a1a0f' : '#fefce8', borderColor: '#fde68a' }]}>
                    <View style={s.explanationHeader}>
                      <BookOpen size={13} color="#ca8a04" />
                      <Text style={[s.explanationTitle, { color: '#ca8a04' }]}>Explanation</Text>
                    </View>
                    <Text style={[s.explanationText, { color: C.text }]}>{ans.explanation}</Text>
                  </View>
                ) : null}
              </View>
            );
          })}

          {/* ── Action buttons ── */}
          <View style={s.actionRow}>
            <TouchableOpacity onPress={() => router.replace('/')} style={[s.btnDash, { borderColor: C.border }]}>
              <Home size={15} color={C.text} />
              <Text style={[s.btnDashText, { color: C.text }]}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCurrentIdx(0);
                setAnswers([]);
                setSelectedOption(null);
                setIsAdvancing(false);
                setIsCompleted(false);
                setTimeSpent(0);
                setReviewFilter('all');
              }}
              style={[s.btnRetake, { backgroundColor: C.primary }]}
            >
              <RotateCcw size={15} color="#fff" />
              <Text style={s.btnRetakeText}>Retake Quiz</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Active quiz screen ──────────────────────────────────────────────────
  const currentMCQ = sessionMCQs[currentIdx];
  const progress = ((currentIdx) / sessionMCQs.length) * 100;

  return (
    <SafeAreaView style={[s.fill, { backgroundColor: C.bg }]}>

      {/* Header bar */}
      <View style={[s.header, { borderBottomColor: C.border }]}>
        <TouchableOpacity onPress={handleQuit} style={[s.quitBtn, { borderColor: C.border }]}>
          <Text style={[s.quitBtnText, { color: C.textMuted }]}>✕ Quit</Text>
        </TouchableOpacity>

        <View style={[s.counterBadge, { backgroundColor: C.neutral }]}>
          <Text style={[s.counterText, { color: C.text }]}>
            {currentIdx + 1} / {sessionMCQs.length}
          </Text>
        </View>

        <View style={[s.timerBadge, { backgroundColor: C.neutral }]}>
          <Clock size={11} color={C.textMuted} />
          <Text style={[s.timerText, { color: C.textMuted }]}>{timeSpent}s</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={[s.progressTrack, { backgroundColor: C.neutral }]}>
        <View style={[s.progressFill, { width: `${progress}%`, backgroundColor: C.primary }]} />
      </View>

      <ScrollView contentContainerStyle={s.quizContent} showsVerticalScrollIndicator={false}>

        {/* Category + exam badge */}
        <View style={s.metaRow}>
          <Text style={[s.categoryLabel, { color: C.primary }]}>
            {currentMCQ.category.toUpperCase()}
          </Text>
          {getCleanBadgeText(currentMCQ.examType, userFocus) && (
            <View style={[s.examBadge, { backgroundColor: C.primaryBg }]}>
              <Text style={[s.examBadgeText, { color: C.primary }]}>
                {getCleanBadgeText(currentMCQ.examType, userFocus)}
              </Text>
            </View>
          )}
          {currentMCQ.isRepeated && (
            <View style={[s.repeatBadge, { backgroundColor: isDark ? 'rgba(245,158,11,0.15)' : '#fef3c7', flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
              <RotateCcw size={10} color="#b45309" />
              <Text style={[s.repeatBadgeText, { color: '#b45309' }]}>Repeated</Text>
            </View>
          )}
        </View>

        {/* Question card */}
        <View style={[s.questionCard, { backgroundColor: C.card, borderColor: C.border }]}>
          <Text style={[s.questionText, { color: C.text }]}>{currentMCQ.question}</Text>
        </View>

        {/* Instruction hint */}
        <Text style={[s.hintText, { color: C.textMuted }]}>
          Tap an option to answer and continue
        </Text>

        {/* Options */}
        <View style={s.optionsList}>
          {currentMCQ.options.map((opt, oi) => {
            const alpha = ['A', 'B', 'C', 'D'][oi];
            const isSelected = selectedOption === oi;
            const isCorrectOpt = isSelected && oi === currentMCQ.correctAnswer;
            const isWrongOpt = isSelected && oi !== currentMCQ.correctAnswer;

            // While advancing: show green for correct, red for wrong pick
            let optBg = C.card;
            let optBorder = C.border;
            let alphaBg = C.neutral;
            let alphaTextColor = C.textMuted;
            let optTextColor = C.text;

            if (isAdvancing && isSelected) {
              if (isCorrectOpt) {
                optBg = C.successBg;
                optBorder = C.success;
                alphaBg = C.success;
                alphaTextColor = '#fff';
                optTextColor = C.success;
              } else if (isWrongOpt) {
                optBg = C.dangerBg;
                optBorder = C.danger;
                alphaBg = C.danger;
                alphaTextColor = '#fff';
                optTextColor = C.danger;
              }
            } else if (!isAdvancing && isSelected) {
              optBg = C.primaryBg;
              optBorder = C.primary;
              alphaBg = C.primary;
              alphaTextColor = '#fff';
            }

            return (
              <TouchableOpacity
                key={oi}
                onPress={() => handleOptionTap(oi)}
                disabled={isAdvancing}
                activeOpacity={0.75}
                style={[s.optionBtn, { backgroundColor: optBg, borderColor: optBorder }]}
              >
                <View style={[s.alphaBox, { backgroundColor: alphaBg }]}>
                  <Text style={[s.alphaText, { color: alphaTextColor }]}>{alpha}</Text>
                </View>
                <Text style={[s.optionText, { color: optTextColor }]}>{opt}</Text>
                {isAdvancing && isCorrectOpt && (
                  <CheckCircle2 size={16} color={C.success} style={{ marginLeft: 'auto' }} />
                )}
                {isAdvancing && isWrongOpt && (
                  <XCircle size={16} color={C.danger} style={{ marginLeft: 'auto' }} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom padding for scroll */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  fill: { flex: 1 },

  // ── Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  quitBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  quitBtnText: { fontSize: 11, fontWeight: '600' },
  counterBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  counterText: { fontSize: 12, fontWeight: '700' },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  timerText: { fontSize: 11, fontWeight: '600' },

  // ── Progress bar
  progressTrack: { height: 3, width: '100%' },
  progressFill: { height: '100%' },

  // ── Quiz content
  quizContent: { padding: 16, paddingBottom: 8 },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  categoryLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  examBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  examBadgeText: { fontSize: 9, fontWeight: '700' },
  repeatBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  repeatBadgeText: { fontSize: 9, fontWeight: '700' },

  questionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 10,
  },
  questionText: { fontSize: 14, fontWeight: '700', lineHeight: 20 },

  hintText: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 14,
    fontStyle: 'italic',
  },

  // ── Options
  optionsList: { gap: 10 },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  alphaBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  alphaText: { fontSize: 12, fontWeight: '800' },
  optionText: { fontSize: 13, flex: 1, lineHeight: 17 },

  // ── Empty
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  emptyBody: { fontSize: 12, textAlign: 'center', lineHeight: 17, marginBottom: 20 },
  btnAction: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  btnActionText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // ── Results
  resultsContent: { padding: 16, paddingBottom: 40, gap: 12 },

  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  ring: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  ringPct: { fontSize: 22, fontWeight: '900' },
  ringLabel: { fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
  heroMsg: { fontSize: 17, fontWeight: '900' },
  heroSub: { fontSize: 11 },

  statRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statPillText: { fontSize: 11, fontWeight: '700' },

  meritBox: {
    width: '100%',
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  meritTitle: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 10,
  },
  meritGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  meritCell: { alignItems: 'center' },
  meritCellVal: { fontSize: 14, fontWeight: '800' },
  meritCellLabel: { fontSize: 9, marginTop: 2 },

  // ── Filter tabs
  filterRow: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  filterTabText: { fontSize: 11, fontWeight: '700' },

  reviewHeader: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
    marginLeft: 2,
  },

  // ── Review card
  reviewCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  qNumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qNumText: { fontSize: 10, fontWeight: '800' },
  reviewQuestion: { fontSize: 13, fontWeight: '700', lineHeight: 18 },

  reviewOptions: { gap: 7 },
  reviewOpt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  optAlpha: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optAlphaText: { fontSize: 10, fontWeight: '800' },
  reviewOptText: { fontSize: 12, flex: 1, lineHeight: 16 },

  explanationBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 6,
  },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  explanationTitle: { fontSize: 10, fontWeight: '800' },
  explanationText: { fontSize: 12, lineHeight: 17 },

  // ── Bottom action buttons
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  btnDash: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  btnDashText: { fontSize: 12, fontWeight: '700' },
  btnRetake: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnRetakeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});

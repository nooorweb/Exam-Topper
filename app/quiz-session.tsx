import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import { useApp } from '../src/context/AppContext';
import { MCQ, QuizSession } from '../src/types';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Volume2,
  VolumeX,
  Award,
  Clock,
  ArrowRight,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function QuizSessionScreen() {
  const { mcqs, saveQuizSession, currentTheme } = useApp();
  const isDark = currentTheme === 'dark';

  const params = useLocalSearchParams();
  const categoryParam = params.category as string;
  const isMixed = categoryParam === 'mixed' || !categoryParam;
  const questionsLimit = parseInt(params.limit as string) || 10;
  const negativeMarking = parseFloat(params.negativeMarking as string) || 0;
  const difficultyParam = params.difficulty as string || 'All';

  // Filter & Shuffle MCQs for this session
  const sessionMCQs = useMemo(() => {
    let pool = [...mcqs];

    // Filter by subject category
    if (!isMixed) {
      pool = pool.filter((m) => m.category === categoryParam);
    }

    // Filter by difficulty/importance
    if (difficultyParam === 'Conceptual') {
      pool = pool.filter((m) => m.importance === 'medium' || m.importance === 'low');
    } else if (difficultyParam === 'High Repeats') {
      pool = pool.filter((m) => m.isRepeated === true);
    }

    // Shuffle pool
    const shuffled = pool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, questionsLimit);
  }, [mcqs, categoryParam, isMixed, questionsLimit, difficultyParam]);

  // Quiz states
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [timeSpentTotal, setTimeSpentTotal] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [answersList, setAnswersList] = useState<QuizSession['answers']>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const colors = {
    bg: isDark ? '#09090b' : '#f9fafb',
    card: isDark ? '#121214' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1f2937',
    textMuted: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#1f1f23' : '#f3f4f6',
    borderAccent: isDark ? '#27272a' : '#e5e7eb',
    primary: '#6366f1',
    primaryBg: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.bg,
    },
    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
    },
    text: {
      color: colors.text,
    },
    textMuted: {
      color: colors.textMuted,
    },
  });

  // Track back button handler for Android
  useEffect(() => {
    const backAction = () => {
      handleQuit();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  // Monitor index change and reset state
  useEffect(() => {
    setIsAnswerChecked(false);
    setSelectedOption(null);
  }, [currentIdx]);

  // Stopwatch timer
  useEffect(() => {
    if (isQuizCompleted || sessionMCQs.length === 0) return;
    const interval = setInterval(() => {
      setTimeSpentTotal((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isQuizCompleted, sessionMCQs]);

  const handleQuit = () => {
    Alert.alert(
      'Quit Session',
      'Are you sure you want to end this practice session? Your progress for this test will be lost.',
      [
        { text: 'Continue Practice', style: 'cancel' },
        { text: 'Quit Test', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(optionIdx);
    if (soundEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswerChecked) return;

    setIsAnswerChecked(true);
    const currentMCQ = sessionMCQs[currentIdx];
    const isCorrect = selectedOption === currentMCQ.correctAnswer;

    if (isCorrect) {
      setScore((s) => s + 1);
      if (soundEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else {
      if (soundEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }

    setAnswersList((prevList) => [
      ...prevList,
      {
        mcqId: currentMCQ.id,
        question: currentMCQ.question,
        selectedOption: selectedOption,
        correctOption: currentMCQ.correctAnswer,
        isCorrect: isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < sessionMCQs.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Complete Session
      setIsQuizCompleted(true);
      saveQuizSession({
        totalQuestions: sessionMCQs.length,
        score: score,
        category: isMixed ? 'Mixed Practice' : categoryParam,
        timeSpent: timeSpentTotal,
        answers: answersList,
      });
    }
  };

  if (sessionMCQs.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, dynamicStyles.container]}>
        <View style={styles.emptyContainer}>
          <AlertTriangle size={48} color={colors.warning} />
          <Text style={[styles.emptyTitle, dynamicStyles.text]}>No Questions Found</Text>
          <Text style={[styles.emptySubtitle, dynamicStyles.textMuted]}>
            We don't have enough MCQs in the "{isMixed ? 'Mixed' : categoryParam}" filter that match the selected settings. Try changing difficulty filters or add questions.
          </Text>
          <TouchableOpacity onPress={() => router.back()} style={[styles.btnAction, { backgroundColor: colors.primary }]}>
            <Text style={styles.btnActionText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentMCQ = sessionMCQs[currentIdx];
  const progressPct = (currentIdx / sessionMCQs.length) * 100;

  if (isQuizCompleted) {
    const accuracy = Math.round((score / sessionMCQs.length) * 100);
    const isExcellent = accuracy >= 80;
    const isPassing = accuracy >= 50;
    const incorrectAnswersCount = answersList.filter((a) => !a.isCorrect).length;
    const penaltyApplied = incorrectAnswersCount * negativeMarking;
    const netMerit = score - penaltyApplied;

    return (
      <SafeAreaView style={[styles.safeArea, dynamicStyles.container]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Results Header Card */}
          <View style={[styles.resultsHero, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
            <View style={[styles.circularBadge, { borderColor: isExcellent ? colors.success : isPassing ? colors.warning : colors.danger }]}>
              <Text style={[styles.circularBadgeText, dynamicStyles.text]}>{accuracy}%</Text>
              <Text style={styles.circularBadgeSub}>ACCURACY</Text>
            </View>

            <Text style={[styles.resultsMessage, dynamicStyles.text]}>
              {isExcellent ? 'Excellent Effort!' : isPassing ? 'Good Attempt!' : 'Keep Practicing!'}
            </Text>
            <Text style={[styles.resultsSummaryText, dynamicStyles.textMuted]}>
              Completed {sessionMCQs.length} MCQs in {Math.round(timeSpentTotal / 60) || 1} mins.
            </Text>

            {/* Negative Marking Summary Sheet */}
            {negativeMarking > 0 && (
              <View style={[styles.meritBox, { backgroundColor: isDark ? '#1c1917' : '#fffbeb', borderColor: '#fef3c7' }]}>
                <Text style={[styles.meritTitle, { color: isDark ? '#f59e0b' : '#b45309' }]}>KPPSC / ETEA MOCK MERIT</Text>
                <View style={styles.meritRow}>
                  <View style={styles.meritCol}>
                    <Text style={[styles.meritLabel, dynamicStyles.textMuted]}>Gross Correct</Text>
                    <Text style={[styles.meritVal, { color: colors.success }]}>+{score}</Text>
                  </View>
                  <View style={styles.meritCol}>
                    <Text style={[styles.meritLabel, dynamicStyles.textMuted]}>Wrong Penalty</Text>
                    <Text style={[styles.meritVal, { color: colors.danger }]}>-{penaltyApplied.toFixed(2)}</Text>
                  </View>
                  <View style={styles.meritCol}>
                    <Text style={[styles.meritLabel, dynamicStyles.textMuted]}>Net Score</Text>
                    <Text style={[styles.meritVal, { color: colors.primary }]}>{netMerit.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Detailed Question Review List */}
          <Text style={[styles.sectionTitle, dynamicStyles.textMuted]}>QUESTION REVIEW SHEET</Text>

          {sessionMCQs.map((item, idx) => {
            const matchedAnswer = answersList.find((a) => a.mcqId === item.id);
            const userAns = matchedAnswer ? matchedAnswer.selectedOption : -1;
            const isCorrect = userAns === item.correctAnswer;

            return (
              <View key={item.id} style={[styles.reviewCard, dynamicStyles.card]}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewIndex}>Q{idx + 1}</Text>
                  {item.examType && (
                    <View style={styles.badgeWrap}>
                      <Text style={[styles.badgeText, { color: colors.primary }]}>{item.examType}</Text>
                    </View>
                  )}
                </View>

                <Text style={[styles.reviewQuestionText, dynamicStyles.text]}>{item.question}</Text>

                <View style={styles.reviewOptionsList}>
                  {item.options.map((opt, optIdx) => {
                    const isOptionCorrect = optIdx === item.correctAnswer;
                    const isOptionSelected = optIdx === userAns;

                    let rowColor = isDark ? '#18181b' : '#f9fafb';
                    let borderColor = isDark ? '#27272a' : '#e4e4e7';

                    if (isOptionCorrect) {
                      rowColor = isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5';
                      borderColor = colors.success;
                    } else if (isOptionSelected && !isCorrect) {
                      rowColor = isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2';
                      borderColor = colors.danger;
                    }

                    return (
                      <View
                        key={optIdx}
                        style={[
                          styles.reviewOptionRow,
                          {
                            backgroundColor: rowColor,
                            borderColor: borderColor,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.reviewOptionText,
                            dynamicStyles.text,
                            isOptionCorrect && { fontWeight: 'bold', color: colors.success },
                            isOptionSelected && !isCorrect && { color: colors.danger },
                          ]}
                        >
                          {opt}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {item.explanation && (
                  <View style={[styles.explanationCard, { backgroundColor: isDark ? '#201b17' : '#fdfaf2', borderColor: '#f5e8c4' }]}>
                    <Text style={styles.explanationTitle}>Explanation Review:</Text>
                    <Text style={[styles.reviewExplanationText, dynamicStyles.text]}>{item.explanation}</Text>
                  </View>
                )}
              </View>
            );
          })}

          {/* Action Triggers */}
          <View style={styles.resultsButtons}>
            <TouchableOpacity onPress={() => router.replace('/')} style={styles.btnDashboard}>
              <Home size={15} color={colors.text} />
              <Text style={[styles.btnDashboardText, dynamicStyles.text]}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setCurrentIdx(0);
                setScore(0);
                setTimeSpentTotal(0);
                setIsQuizCompleted(false);
                setAnswersList([]);
              }}
              style={[styles.btnRetake, { backgroundColor: colors.primary }]}
            >
              <RotateCcw size={15} color="#fff" />
              <Text style={styles.btnRetakeText}>Retake Quiz</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, dynamicStyles.container]}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={handleQuit} style={styles.btnQuit}>
          <Text style={[styles.btnQuitText, dynamicStyles.text]}>Quit</Text>
        </TouchableOpacity>

        <View style={styles.headerRightFlex}>
          <TouchableOpacity onPress={() => setSoundEnabled(!soundEnabled)} style={styles.btnVolume}>
            {soundEnabled ? (
              <Volume2 size={16} color={colors.text} />
            ) : (
              <VolumeX size={16} color={colors.textMuted} />
            )}
          </TouchableOpacity>

          <View style={[styles.counterBadge, { backgroundColor: isDark ? '#1c1c1f' : '#e5e7eb' }]}>
            <Text style={[styles.counterText, dynamicStyles.text]}>
              {currentIdx + 1} / {sessionMCQs.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressBarContainer, { backgroundColor: isDark ? '#1c1c1f' : '#e5e7eb' }]}>
        <View style={[styles.progressBar, { width: `${progressPct}%`, backgroundColor: colors.primary }]} />
      </View>

      <ScrollView contentContainerStyle={styles.quizContent}>
        {/* MCQ Question Card */}
        <View style={[styles.questionCard, dynamicStyles.card]}>
          <View style={styles.questionCategoryRow}>
            <Text style={styles.questionCategory}>{currentMCQ.category}</Text>
            {currentMCQ.examType && (
              <View style={[styles.badgeWrap, { backgroundColor: colors.primaryBg }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>{currentMCQ.examType}</Text>
              </View>
            )}
          </View>

          <Text style={[styles.questionText, dynamicStyles.text]}>{currentMCQ.question}</Text>
        </View>

        {/* Options List */}
        <View style={styles.optionsList}>
          {currentMCQ.options.map((opt, oIdx) => {
            const isSelected = selectedOption === oIdx;
            const alphabet = ['A', 'B', 'C', 'D'][oIdx];

            let optionBg = colors.card;
            let optionBorder = colors.border;
            let textWeight = 'normal';

            if (isSelected) {
              optionBg = isDark ? 'rgba(99, 102, 241, 0.15)' : '#e0e7ff';
              optionBorder = colors.primary;
              textWeight = 'bold';
            }

            if (isAnswerChecked) {
              const isOptionCorrect = oIdx === currentMCQ.correctAnswer;
              if (isOptionCorrect) {
                optionBg = isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5';
                optionBorder = colors.success;
              } else if (isSelected && !isOptionCorrect) {
                optionBg = isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2';
                optionBorder = colors.danger;
              } else {
                optionBg = colors.card;
                optionBorder = colors.border;
              }
            }

            return (
              <TouchableOpacity
                key={oIdx}
                disabled={isAnswerChecked}
                onPress={() => handleOptionSelect(oIdx)}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: optionBg,
                    borderColor: optionBorder,
                    borderWidth: 2,
                  },
                ]}
              >
                <View
                  style={[
                    styles.alphabetCircle,
                    {
                      backgroundColor: isSelected ? colors.primary : isDark ? '#27272a' : '#f3f4f6',
                    },
                  ]}
                >
                  <Text style={[styles.alphabetText, { color: isSelected ? '#fff' : colors.text }]}>
                    {alphabet}
                  </Text>
                </View>
                <Text style={[styles.optionText, dynamicStyles.text, { fontWeight: textWeight as any }]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Checked Result and Explanation */}
        {isAnswerChecked && (
          <View
            style={[
              styles.feedbackCard,
              {
                backgroundColor: selectedOption === currentMCQ.correctAnswer ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                borderColor: selectedOption === currentMCQ.correctAnswer ? colors.success : colors.danger,
              },
            ]}
          >
            <View style={styles.feedbackTitleRow}>
              {selectedOption === currentMCQ.correctAnswer ? (
                <CheckCircle2 size={16} color={colors.success} />
              ) : (
                <XCircle size={16} color={colors.danger} />
              )}
              <Text
                style={[
                  styles.feedbackTitleText,
                  { color: selectedOption === currentMCQ.correctAnswer ? colors.success : colors.danger },
                ]}
              >
                {selectedOption === currentMCQ.correctAnswer ? 'Correct Answer!' : 'Incorrect Answer!'}
              </Text>
            </View>

            {currentMCQ.explanation && (
              <View style={styles.explanationSplit}>
                <Text style={[styles.explanationText, dynamicStyles.text]}>{currentMCQ.explanation}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Action Footer Bar */}
      <View style={styles.actionFooter}>
        {!isAnswerChecked ? (
          <TouchableOpacity
            disabled={selectedOption === null}
            onPress={handleCheckAnswer}
            style={[
              styles.btnCheck,
              {
                backgroundColor: selectedOption !== null ? colors.primary : isDark ? '#1c1c1f' : '#e5e7eb',
              },
            ]}
          >
            <Text style={[styles.btnCheckText, { color: selectedOption !== null ? '#fff' : colors.textMuted }]}>
              Check Answer
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleNextQuestion}
            style={[styles.btnNext, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.btnNextText}>
              {currentIdx + 1 < sessionMCQs.length ? 'Next Question' : 'Finish Quiz'}
            </Text>
            <ArrowRight size={14} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  btnQuit: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
  },
  btnQuitText: {
    fontSize: 10.5,
    fontWeight: 'bold',
  },
  headerRightFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnVolume: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(128,128,128,0.05)',
  },
  counterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  counterText: {
    fontSize: 9.5,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 3,
    width: '100%',
  },
  progressBar: {
    height: '100%',
  },
  quizContent: {
    padding: 16,
  },
  questionCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  questionCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionCategory: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  badgeWrap: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 13.5,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  optionsList: {
    gap: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    gap: 12,
  },
  alphabetCircle: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alphabetText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 11.5,
    flex: 1,
    lineHeight: 15,
  },
  feedbackCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 14,
    marginTop: 16,
  },
  feedbackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  feedbackTitleText: {
    fontSize: 11.5,
    fontWeight: '900',
  },
  explanationSplit: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,0.1)',
    paddingTop: 8,
  },
  explanationText: {
    fontSize: 10.5,
    lineHeight: 14,
  },
  actionFooter: {
    padding: 16,
    marginTop: 'auto',
  },
  btnCheck: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCheckText: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  btnNext: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  btnNextText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: 20,
  },
  btnAction: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnActionText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  resultsHero: {
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  circularBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  circularBadgeText: {
    fontSize: 18,
    fontWeight: '900',
  },
  circularBadgeSub: {
    fontSize: 7.5,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  resultsMessage: {
    fontSize: 16,
    fontWeight: '900',
  },
  resultsSummaryText: {
    fontSize: 10.5,
    marginTop: 2,
  },
  meritBox: {
    width: '100%',
    marginTop: 14,
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
  },
  meritTitle: {
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  meritRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  meritCol: {
    alignItems: 'center',
  },
  meritLabel: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  meritVal: {
    fontSize: 12.5,
    fontWeight: 'bold',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 8,
  },
  reviewCard: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  reviewIndex: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  reviewQuestionText: {
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 16,
    marginBottom: 10,
  },
  reviewOptionsList: {
    gap: 6,
  },
  reviewOptionRow: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
  },
  reviewOptionText: {
    fontSize: 10.5,
  },
  explanationCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  explanationTitle: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#b45309',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  reviewExplanationText: {
    fontSize: 10,
    lineHeight: 14,
  },
  resultsButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  btnDashboard: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnDashboardText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  btnRetake: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnRetakeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

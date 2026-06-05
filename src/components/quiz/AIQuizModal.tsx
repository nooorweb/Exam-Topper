import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sparkles, ChevronRight, ChevronLeft, Award, Globe, Edit, ShieldAlert, WifiOff, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { GeminiService } from '../../services/gemini.service';
import { AI_QUIZ_TEMP_KEY } from '../../../app/quiz-session';
import { Text, Button } from '../common';
import { typography } from '../../lib/typography';


const EXAM_OPTIONS = ['KPPSC', 'FPSC', 'ETEA', 'NTS', 'CSS', 'Other'];
const SUBJECT_OPTIONS = [
  'General Knowledge',
  'English',
  'Math',
  'Computer Science',
  'Islamiat',
  'Pakistan Studies',
  'Current Affairs',
  'Mixed',
];
const QUESTIONS_OPTIONS = [15, 30, 40];
const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard', 'Mixed'];

interface AIQuizModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AIQuizModal({ visible, onClose }: AIQuizModalProps) {
  const { currentTheme, stats } = useApp();
  const isDark = currentTheme === 'dark';

  // ─── Modal States ──────────────────────────────────────────────────────────
  const [step, setStep] = useState<number>(1);
  const [hasSavedSettings, setHasSavedSettings] = useState<boolean>(false);

  // ─── Form States ───────────────────────────────────────────────────────────
  const [exam, setExam] = useState<string>('KPPSC');
  const [post, setPost] = useState<string>('');
  const [subject, setSubject] = useState<string[]>(['General Knowledge']);
  const [numQuestions, setNumQuestions] = useState<number>(15);
  const [difficulty, setDifficulty] = useState<string>('Medium');
  const [language, setLanguage] = useState<string>('English');

  // ─── Operational States ──────────────────────────────────────────────────
  const [loading, setLoading] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('Preparing...');
  const [errorText, setErrorText] = useState<string | null>(null);

  // ─── Load Settings at Startup ─────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;

    const loadInitialSettings = async () => {
      try {
        const lastSettings = await AsyncStorage.getItem('smart_prep_last_ai_quiz_settings');
        if (lastSettings) {
          const parsed = JSON.parse(lastSettings);
          setExam(parsed.exam || 'KPPSC');
          setPost(parsed.post || '');
          if (Array.isArray(parsed.subject)) {
            setSubject(parsed.subject.length > 0 ? parsed.subject : ['General Knowledge']);
          } else if (typeof parsed.subject === 'string') {
            setSubject([parsed.subject]);
          } else {
            setSubject(['General Knowledge']);
          }
          setNumQuestions(parsed.numQuestions || 15);
          setDifficulty(parsed.difficulty || 'Medium');
          setLanguage('English');
          setHasSavedSettings(true);
          setStep(0); // Jump straight to confirmation step
        } else {
          // Pre-fill from user's general exam target focus
          const focus = await AsyncStorage.getItem('smart_prep_focus');
          if (focus) {
            let mappedExam = 'KPPSC';
            if (focus.includes('CSS')) mappedExam = 'CSS';
            else if (focus.includes('FIA')) mappedExam = 'FPSC';
            else if (focus.includes('ETEA')) mappedExam = 'ETEA';
            else if (focus.includes('Punjab')) mappedExam = 'NTS';
            setExam(mappedExam);
          }
          setHasSavedSettings(false);
          setStep(1);
        }
      } catch (err) {
        console.error('Error loading AI quiz initial settings', err);
        setStep(1);
      }
    };

    loadInitialSettings();
  }, [visible]);

  // ─── Theme Colors ──────────────────────────────────────────────────────────
  const colors = {
    overlay: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)',
    card: isDark ? '#121214' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1f2937',
    textMuted: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#27272a' : '#e5e7eb',
    chipBg: isDark ? '#1c1c1f' : '#f3f4f6',
    chipSelected: '#6366f1',
    primary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  };

  // ─── Extract User Weak Topics ──────────────────────────────────────────────
  const getWeakTopics = () => {
    if (stats.weakAreas && stats.weakAreas.length > 0) {
      const sorted = [...stats.weakAreas].sort((a, b) => b.incorrectCount - a.incorrectCount);
      return sorted.slice(0, 3).map((w) => w.category);
    }
    // Fallback analysis from past sessions if direct weakAreas is empty
    if (stats.sessions && stats.sessions.length > 0) {
      const wrongCounts: Record<string, number> = {};
      stats.sessions.slice(-5).forEach((session) => {
        session.answers.forEach((ans) => {
          if (!ans.isCorrect) {
            const cat = ans.category || session.category;
            if (cat) {
              wrongCounts[cat] = (wrongCounts[cat] || 0) + 1;
            }
          }
        });
      });
      const sorted = Object.entries(wrongCounts).sort((a, b) => b[1] - a[1]);
      return sorted.slice(0, 3).map((entry) => entry[0]);
    }
    return [];
  };

  // ─── AI Quiz Generation ────────────────────────────────────────────────────
  const generateQuiz = async () => {
    setLoading(true);
    setErrorText(null);
    setStatusText('Checking AI configurations...');

    try {
      // Check limit again
      const todayStr = new Date().toDateString();
      const storedDate = await AsyncStorage.getItem('smart_prep_ai_quiz_date');
      let count = 3;
      if (storedDate !== todayStr) {
        await AsyncStorage.setItem('smart_prep_ai_quiz_date', todayStr);
        await AsyncStorage.setItem('smart_prep_ai_quiz_count', '3');
      } else {
        const storedCount = await AsyncStorage.getItem('smart_prep_ai_quiz_count');
        count = storedCount ? parseInt(storedCount, 10) : 3;
      }
      if (count <= 0) {
        Alert.alert('Limit Reached', 'You have used all 3 AI quiz generations for today. Please try again tomorrow.');
        setLoading(false);
        return;
      }

      const apiKey = await GeminiService.getApiKey();
      if (!apiKey) {
        Alert.alert(
          'API Key Required',
          'Please go to Settings and add your Gemini API Key first to enable AI Quiz.',
          [
            { text: 'Go to Settings', onPress: () => { onClose(); router.push('/settings'); } },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        setLoading(false);
        return;
      }

      // Save parameters as last used settings in local storage
      const currentSettings = { exam, post, subject, numQuestions, difficulty, language };
      await AsyncStorage.setItem('smart_prep_last_ai_quiz_settings', JSON.stringify(currentSettings));

      setStatusText('Retrieving focus points...');
      const weakTopics = getWeakTopics();
      const joinedSubjects = subject.join(', ');

      setStatusText(`Generating ${numQuestions} custom questions...`);
      const questions = await GeminiService.generateConversationalQuiz({
        exam,
        post: post.trim() || undefined,
        subject: joinedSubjects,
        numQuestions,
        difficulty,
        language,
        weakTopics: weakTopics.length > 0 ? weakTopics : undefined,
      });

      setStatusText('Setting up your session...');
      await AsyncStorage.setItem(AI_QUIZ_TEMP_KEY, JSON.stringify(questions));

      // Decrement the count
      await AsyncStorage.setItem('smart_prep_ai_quiz_count', String(count - 1));

      setLoading(false);
      onClose();

      // Navigate to quiz session
      router.push({
        pathname: '/quiz-session',
        params: {
          aiQuizMode: 'true',
          aiCategory: joinedSubjects,
        },
      });
    } catch (e: any) {
      console.error('[AI Quiz Generation Error]', e);
      let errMsg = 'Failed to generate quiz due to an unexpected error. Please check your internet connection and try again.';
      if (e.message && e.message.includes('JSON')) {
        errMsg = 'The AI returned an invalid response structure. Let\'s try to regenerate a fresh set of questions.';
      } else if (e.message) {
        errMsg = e.message;
      }
      setErrorText(errMsg);
      setLoading(false);
    }
  };

  // ─── Rendering Helpers ─────────────────────────────────────────────────────
  const renderHeader = () => (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <View style={styles.headerTitleRow}>
        <Sparkles size={18} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>AI Custom Quiz Builder</Text>
      </View>
      <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
        <X size={20} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );

  const renderProgress = () => {
    if (step === 0) return null;
    return (
      <View style={styles.progressContainer}>
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            style={[
              styles.progressBar,
              {
                backgroundColor: step >= s ? colors.primary : colors.border,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {renderHeader()}

          {/* ─── LOADING STATE ─── */}
          {loading && (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={colors.primary} style={{ marginBottom: 16 }} />
              <Text style={[styles.statusMainText, { color: colors.text }]}>Generating AI Quiz</Text>
              <Text style={[styles.statusSubText, { color: colors.textMuted }]}>{statusText}</Text>
            </View>
          )}

          {/* ─── ERROR STATE ─── */}
          {!loading && errorText && (
            <View style={styles.centerContainer}>
              <View style={[styles.errorIconContainer, { backgroundColor: colors.danger + '1A' }]}>
                <ShieldAlert size={28} color={colors.danger} />
              </View>
              <Text style={[styles.statusMainText, { color: colors.text }]}>Quiz Setup Failed</Text>
              <Text style={[styles.errorDescription, { color: colors.textMuted }]}>{errorText}</Text>
              <View style={styles.errorActions}>
                <Button
                  label="Retry Generation"
                  onPress={generateQuiz}
                  isDark={isDark}
                  variant="primary"
                  style={{ marginBottom: 10 }}
                />
                <Button
                  label="Adjust Options"
                  onPress={() => setErrorText(null)}
                  isDark={isDark}
                  variant="outline"
                />
              </View>
            </View>
          )}

          {/* ─── STEP 0: CONFIRM PRE-FILLED PROFILE ─── */}
          {!loading && !errorText && step === 0 && (
            <View style={styles.modalContent}>
              <Text style={[styles.stepQuestion, { color: colors.text }]}>
                Generate quiz using your preferred setup?
              </Text>
              <Text style={[styles.stepDesc, { color: colors.textMuted, marginBottom: 20 }]}>
                We've loaded your last settings. You can edit them or proceed to generate immediately.
              </Text>

              <ScrollView style={styles.scrollConfig} contentContainerStyle={styles.confirmLayout}>
                <View style={[styles.confirmRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.confirmLabel, { color: colors.textMuted }]}>Target Exam</Text>
                  <Text style={[styles.confirmVal, { color: colors.text }]}>
                    {exam} {post ? `(${post})` : ''}
                  </Text>
                </View>
                <View style={[styles.confirmRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.confirmLabel, { color: colors.textMuted }]}>Subject / Topic</Text>
                  <Text style={[styles.confirmVal, { color: colors.text }]}>{subject.join(', ')}</Text>
                </View>
                <View style={[styles.confirmRow, { borderBottomColor: colors.border, borderBottomWidth: 0 }]}>
                  <Text style={[styles.confirmLabel, { color: colors.textMuted }]}>Questions & Difficulty</Text>
                  <Text style={[styles.confirmVal, { color: colors.text }]}>
                    {numQuestions} Questions • {difficulty}
                  </Text>
                </View>
              </ScrollView>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() => setStep(1)}
                  style={[styles.btnOutline, { borderColor: colors.border }]}
                >
                  <Edit size={16} color={colors.primary} />
                  <Text style={[styles.btnOutlineText, { color: colors.text }]}>Adjust Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={generateQuiz}
                  style={[styles.btnPrimary, { backgroundColor: colors.success }]}
                >
                  <Sparkles size={16} color="#fff" />
                  <Text style={styles.btnPrimaryText}>Generate Quiz</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ─── STEP 1: EXAM & POST CATEGORY ─── */}
          {!loading && !errorText && step === 1 && (
            <View style={styles.modalContent}>
              {renderProgress()}
              <Text style={[styles.stepQuestion, { color: colors.text }]}>
                Which competitive exam is this mock for?
              </Text>

              <View style={styles.chipGrid}>
                {EXAM_OPTIONS.map((opt) => {
                  const isSelected = exam === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => setExam(opt)}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.chipBg,
                          borderColor: isSelected ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          {
                            color: isSelected ? '#fff' : colors.text,
                            fontWeight: isSelected ? 'bold' : 'normal',
                          },
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
                Department / Job Post Category (Optional)
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: isDark ? '#18181f' : '#f9fafb',
                  },
                ]}
                placeholder="e.g. Computer Operator, ASI, Junior Clerk"
                placeholderTextColor={isDark ? '#4b5563' : '#a1a1aa'}
                value={post}
                onChangeText={setPost}
              />

              <View style={styles.actionRowSingle}>
                <TouchableOpacity
                  onPress={() => setStep(2)}
                  style={[styles.btnPrimary, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.btnPrimaryText}>Continue</Text>
                  <ChevronRight size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ─── STEP 2: SUBJECT & LANGUAGE ─── */}
          {!loading && !errorText && step === 2 && (
            <View style={styles.modalContent}>
              {renderProgress()}
              <Text style={[styles.stepQuestion, { color: colors.text }]}>
                Choose your focus subject
              </Text>

              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Focus Subject</Text>
              <ScrollView style={styles.scrollChips} contentContainerStyle={styles.chipScrollLayout}>
                {SUBJECT_OPTIONS.map((opt) => {
                  const isSelected = subject.includes(opt);
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => {
                        if (isSelected) {
                          if (subject.length > 1) {
                            setSubject(subject.filter((s) => s !== opt));
                          }
                        } else {
                          setSubject([...subject, opt]);
                        }
                      }}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.chipBg,
                          borderColor: isSelected ? colors.primary : colors.border,
                          minWidth: '45%',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          {
                            color: isSelected ? '#fff' : colors.text,
                            fontWeight: isSelected ? 'bold' : 'normal',
                          },
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() => setStep(1)}
                  style={[styles.btnOutline, { borderColor: colors.border }]}
                >
                  <ChevronLeft size={18} color={colors.text} />
                  <Text style={[styles.btnOutlineText, { color: colors.text }]}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setStep(3)}
                  disabled={subject.length === 0}
                  style={[
                    styles.btnPrimary,
                    {
                      backgroundColor: subject.length > 0 ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.btnPrimaryText, { color: subject.length > 0 ? '#fff' : colors.textMuted }]}>
                    Continue
                  </Text>
                  <ChevronRight size={18} color={subject.length > 0 ? '#fff' : colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ─── STEP 3: QUANTITY & DIFFICULTY ─── */}
          {!loading && !errorText && step === 3 && (
            <View style={styles.modalContent}>
              {renderProgress()}
              <Text style={[styles.stepQuestion, { color: colors.text }]}>
                Finally, set questions count & difficulty
              </Text>

              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Number of Questions</Text>
              <View style={styles.chipGrid}>
                {QUESTIONS_OPTIONS.map((opt) => {
                  const isSelected = numQuestions === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => setNumQuestions(opt)}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.chipBg,
                          borderColor: isSelected ? colors.primary : colors.border,
                          flex: 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          {
                            color: isSelected ? '#fff' : colors.text,
                            fontWeight: isSelected ? 'bold' : 'normal',
                          },
                        ]}
                      >
                        {opt} Qs
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Difficulty Level</Text>
              <View style={styles.chipGrid}>
                {DIFFICULTY_OPTIONS.map((opt) => {
                  const isSelected = difficulty === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => setDifficulty(opt)}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.chipBg,
                          borderColor: isSelected ? colors.primary : colors.border,
                          flex: 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          {
                            color: isSelected ? '#fff' : colors.text,
                            fontWeight: isSelected ? 'bold' : 'normal',
                          },
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() => setStep(2)}
                  style={[styles.btnOutline, { borderColor: colors.border }]}
                >
                  <ChevronLeft size={18} color={colors.text} />
                  <Text style={[styles.btnOutlineText, { color: colors.text }]}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={generateQuiz}
                  style={[styles.btnPrimary, { backgroundColor: colors.success }]}
                >
                  <Sparkles size={16} color="#fff" />
                  <Text style={styles.btnPrimaryText}>Create AI Quiz</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  card: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    // Shadow details
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  stepQuestion: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 13,
  },
  textInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 13,
    marginBottom: 4,
  },
  scrollChips: {
    maxHeight: 180,
  },
  chipScrollLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 8,
  },
  scrollConfig: {
    maxHeight: 250,
    marginBottom: 20,
  },
  confirmLayout: {
    gap: 1,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  confirmLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  confirmVal: {
    fontSize: 12,
    fontWeight: '700',
    maxWidth: '60%',
    textAlign: 'right',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionRowSingle: {
    marginTop: 24,
  },
  btnPrimary: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  btnOutline: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnOutlineText: {
    fontSize: 14,
    fontWeight: '700',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 250,
  },
  statusMainText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  statusSubText: {
    fontSize: 13,
    textAlign: 'center',
  },
  errorIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorDescription: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  errorActions: {
    width: '100%',
    gap: 8,
  },
});

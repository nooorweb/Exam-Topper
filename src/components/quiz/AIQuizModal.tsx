import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sparkles, ChevronRight, ChevronLeft, Award, Globe, Edit, ShieldAlert, WifiOff, X, Brain } from 'lucide-react-native';
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

const JOB_SUGGESTIONS = [
  'Computer Operator',
  'Junior Clerk',
  'Senior Clerk',
  'Assistant Sub-Inspector (ASI)',
  'Sub-Inspector (SI)',
  'Assistant Director (AD)',
  'Lecturer',
  'Subject Specialist (SS)',
  'Secondary School Teacher (SST)',
  'Tehsildar',
  'Naib Tehsildar',
  'Accountant',
  'Data Entry Operator',
  'Assistant',
  'Section Officer',
  'Planning Officer',
  'Research Officer',
  'Inspector',
  'Customs Inspector',
  'Appraising Officer',
  'Patwari',
];

const FUNNY_LOAD_MESSAGES = [
  "Bribing Gemini with digital cookies...",
  "Consulting the AI gods for high-yield questions...",
  "Calculating how to make you sweat at 3:00 AM...",
  "Formulating incorrect options that look deceptively correct...",
  "Adding 10% more difficulty because you looked too confident...",
  "Polishing the explanation paragraphs (using 100% organic pixels)...",
  "Sweeping the virtual dust off the department job descriptions...",
  "Gemini is typing... please act natural...",
];

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
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [subject, setSubject] = useState<string[]>(['General Knowledge']);
  const [numQuestions, setNumQuestions] = useState<number>(15);
  const [difficulty, setDifficulty] = useState<string>('Mixed (Medium & Hard)');
  const [language, setLanguage] = useState<string>('English');
  const [generationProgress, setGenerationProgress] = useState<number>(0);

  // ─── Operational States ──────────────────────────────────────────────────
  const [loading, setLoading] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('Preparing...');
  const [errorText, setErrorText] = useState<string | null>(null);

  const [funnyMessage, setFunnyMessage] = useState<string>(FUNNY_LOAD_MESSAGES[0]);

  // Animated values for funny bounce & spin loading animation
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!loading) {
      setFunnyMessage(FUNNY_LOAD_MESSAGES[0]);
      rotateAnim.setValue(0);
      bounceAnim.setValue(0);
      return;
    }

    // Cycle funny messages
    let idx = 0;
    const msgInterval = setInterval(() => {
      idx = (idx + 1) % FUNNY_LOAD_MESSAGES.length;
      setFunnyMessage(FUNNY_LOAD_MESSAGES[idx]);
    }, 2000);

    // Spin animation
    const spinLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      })
    );

    // Bounce animation
    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    spinLoop.start();
    bounceLoop.start();

    return () => {
      clearInterval(msgInterval);
      spinLoop.stop();
      bounceLoop.stop();
    };
  }, [loading]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const bounce = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  // ─── Load Settings at Startup ─────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;

    const loadInitialSettings = async () => {
      try {
        const focus = await AsyncStorage.getItem('smart_prep_focus');
        const activeFocus = focus || 'KPPSC & ETEA';

        let mappedExam = 'KPPSC';
        if (activeFocus.includes('CSS')) mappedExam = 'CSS';
        else if (activeFocus.includes('FIA')) mappedExam = 'FPSC';
        else if (activeFocus.includes('ETEA')) mappedExam = 'ETEA';
        else if (activeFocus.includes('Punjab')) mappedExam = 'NTS';

        const lastSettings = await AsyncStorage.getItem('smart_prep_last_ai_quiz_settings');
        if (lastSettings) {
          const parsed = JSON.parse(lastSettings);
          // Only use last settings if the focus matches the current global focus
          if (parsed.focus === activeFocus) {
            setExam(parsed.exam || mappedExam);
            setPost(parsed.post || '');
            if (Array.isArray(parsed.subject)) {
              setSubject(parsed.subject.length > 0 ? parsed.subject : ['General Knowledge']);
            } else if (typeof parsed.subject === 'string') {
              setSubject([parsed.subject]);
            } else {
              setSubject(['General Knowledge']);
            }
            setNumQuestions(parsed.numQuestions || 15);
            setDifficulty('Mixed (Medium & Hard)');
            setLanguage('English');
            setHasSavedSettings(true);
            setStep(0); // Jump straight to confirmation step
            return;
          }
        }

        // Prefill from current focus if focus changed or no saved settings
        setExam(mappedExam);
        setPost('');
        setSubject(['General Knowledge']);
        setNumQuestions(15);
        setDifficulty('Mixed (Medium & Hard)');
        setLanguage('English');
        setHasSavedSettings(false);
        setStep(1);
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

  const simulateProgress = (target: number, speed = 30) => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!visible) {
          clearInterval(interval);
          resolve();
          return;
        }
        setGenerationProgress((prev) => {
          if (prev >= target) {
            clearInterval(interval);
            resolve();
            return target;
          }
          return prev + 1;
        });
      }, speed);
    });
  };

  // ─── AI Quiz Generation ────────────────────────────────────────────────────
  const generateQuiz = async () => {
    setLoading(true);
    setErrorText(null);
    setGenerationProgress(5);
    setStatusText('Checking AI configurations...');
    await simulateProgress(15, 10);

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
        setGenerationProgress(0);
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
        setGenerationProgress(0);
        return;
      }

      // Save parameters as last used settings in local storage
      const focus = await AsyncStorage.getItem('smart_prep_focus');
      const currentSettings = { exam, post, subject, numQuestions, difficulty, language, focus: focus || 'KPPSC & ETEA' };
      await AsyncStorage.setItem('smart_prep_last_ai_quiz_settings', JSON.stringify(currentSettings));

      setStatusText('Retrieving focus points...');
      await simulateProgress(35, 15);
      const weakTopics = getWeakTopics();
      const joinedSubjects = subject.join(', ');

      setStatusText(`Generating ${numQuestions} custom questions...`);
      const slowProgress = simulateProgress(80, 100);

      const questions = await GeminiService.generateConversationalQuiz({
        exam,
        post: post.trim() || undefined,
        subject: joinedSubjects,
        numQuestions,
        difficulty,
        language,
        weakTopics: weakTopics.length > 0 ? weakTopics : undefined,
      });

      await slowProgress;
      setStatusText('Setting up your session...');
      await simulateProgress(95, 10);
      await AsyncStorage.setItem(AI_QUIZ_TEMP_KEY, JSON.stringify(questions));

      // Decrement the count
      await AsyncStorage.setItem('smart_prep_ai_quiz_count', String(count - 1));

      await simulateProgress(100, 5);

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

  const filteredSuggestions = post.trim()
    ? JOB_SUGGESTIONS.filter((job) =>
        job.toLowerCase().includes(post.toLowerCase()) &&
        job.toLowerCase() !== post.toLowerCase()
      )
    : [];

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
              <Animated.View
                style={{
                  transform: [
                    { translateY: bounce },
                    { rotate: rotation }
                  ],
                  marginBottom: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Brain size={48} color={colors.primary} />
              </Animated.View>
              <Text style={[styles.statusMainText, { color: colors.text }]}>Generating AI Quiz</Text>
              
              {/* Progress Bar */}
              <View style={[styles.loadingBarBg, { backgroundColor: isDark ? '#1c1c1f' : '#e5e7eb' }]}>
                <View 
                  style={[
                    styles.loadingBarFill, 
                    { 
                      backgroundColor: colors.primary, 
                      width: `${generationProgress}%` 
                    }
                  ]} 
                />
              </View>
              
              <Text style={[styles.statusPercentText, { color: colors.primary }]}>{generationProgress}%</Text>
              <Text style={[styles.statusSubText, { color: colors.textMuted, fontStyle: 'italic', textAlign: 'center', marginTop: 4, paddingHorizontal: 10 }]}>
                {funnyMessage}
              </Text>
              <Text style={[styles.statusSubText, { color: colors.primary, fontSize: 11, marginTop: 10, fontWeight: '700' }]}>
                {statusText}
              </Text>
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
              <View style={{ position: 'relative', zIndex: 10 }}>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      color: colors.text,
                      borderColor: colors.border,
                      backgroundColor: isDark ? '#18181f' : '#f9fafb',
                      marginBottom: 0,
                    },
                  ]}
                  placeholder="e.g. Computer Operator, ASI, Junior Clerk"
                  placeholderTextColor={isDark ? '#4b5563' : '#a1a1aa'}
                  value={post}
                  onChangeText={(val) => {
                    setPost(val);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                />

                {showSuggestions && filteredSuggestions.length > 0 && (
                  <View
                    style={[
                      styles.suggestionsContainer,
                      {
                        borderColor: colors.border,
                        backgroundColor: isDark ? '#1c1c1f' : '#ffffff',
                      },
                    ]}
                  >
                    <ScrollView
                      style={styles.suggestionsScroll}
                      keyboardShouldPersistTaps="always"
                      nestedScrollEnabled
                    >
                      {filteredSuggestions.map((job) => (
                        <TouchableOpacity
                          key={job}
                          style={[styles.suggestionItem, { borderBottomColor: colors.border }]}
                          onPress={() => {
                            setPost(job);
                            setShowSuggestions(false);
                          }}
                        >
                          <Text style={{ color: colors.text, fontSize: 13 }}>{job}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View style={styles.actionRow}>
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

          {/* ─── STEP 3: QUANTITY ─── */}
          {!loading && !errorText && step === 3 && (
            <View style={styles.modalContent}>
              {renderProgress()}
              <Text style={[styles.stepQuestion, { color: colors.text }]}>
                Finally, set questions count
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
  suggestionsContainer: {
    position: 'absolute',
    top: 46,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 12,
    maxHeight: 150,
    zIndex: 999,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  suggestionsScroll: {
    maxHeight: 150,
  },
  suggestionItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  loadingBarBg: {
    width: '80%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 8,
  },
  loadingBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  statusPercentText: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
});

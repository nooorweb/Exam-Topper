import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useApp } from '../src/context/AppContext';
import { MCQ } from '../src/types';
import {
  Save,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Clipboard,
  Edit3,
  User,
  LogIn,
  LogOut,
  UserPlus,
  RefreshCw,
} from 'lucide-react-native';

export default function AdminScreen() {
  const {
    mcqs,
    vocab,
    addMCQ,
    addVocab,
    bulkImportMCQs,
    bulkImportVocab,
    resetStats,
    currentTheme,
    user,
    signIn,
    signUp,
    signOut,
    syncWithCloud,
  } = useApp();

  const isDark = currentTheme === 'dark';

  const [activeSegment, setActiveSegment] = useState<'auth' | 'mcq' | 'vocab' | 'bulk'>('auth');

  // Auth form state
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signIn' | 'signUp'>('signIn');
  const [authLoading, setAuthLoading] = useState(false);

  // Manual MCQ state
  const [mcqForm, setMcqForm] = useState({
    question: '',
    optA: '',
    optB: '',
    optC: '',
    optD: '',
    correctAnswer: 0,
    explanation: '',
    category: 'General Knowledge' as MCQ['category'],
    examType: '',
    isRepeated: false,
    repeatCount: 2,
    importance: 'medium' as MCQ['importance'],
  });

  // Manual Vocab state
  const [vocabForm, setVocabForm] = useState({
    word: '',
    meaning: '',
    synonyms: '',
    antonyms: '',
    example: '',
    category: 'General Vocabulary',
  });

  // Bulk state
  const [bulkType, setBulkType] = useState<'mcq' | 'vocab'>('mcq');
  const [bulkText, setBulkText] = useState('');
  const [bulkFeedback, setBulkFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const [submitSuccess, setSubmitSuccess] = useState(false);

  const colors = {
    bg: isDark ? '#09090b' : '#f9fafb',
    card: isDark ? '#121214' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1f2937',
    textMuted: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#1f1f23' : '#e5e7eb',
    primary: '#6366f1',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
  };

  const dynamicStyles = StyleSheet.create({
    container: { backgroundColor: colors.bg },
    card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
    text: { color: colors.text },
    textMuted: { color: colors.textMuted },
    input: {
      backgroundColor: isDark ? '#1c1c1f' : '#f9fafb',
      borderColor: colors.border,
      color: colors.text,
    },
  });

  const handleAuth = async () => {
    if (!authEmail.trim() || !authPassword.trim()) {
      Alert.alert('Validation', 'Please enter both email and password.');
      return;
    }
    setAuthLoading(true);
    try {
      const { error } = authMode === 'signIn'
        ? await signIn(authEmail.trim(), authPassword)
        : await signUp(authEmail.trim(), authPassword);

      if (error) {
        Alert.alert('Authentication Error', error.message || 'Failed to authenticate.');
      } else {
        setAuthEmail('');
        setAuthPassword('');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Something went wrong.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleManualMCQSubmit = () => {
    if (!mcqForm.question.trim() || !mcqForm.optA.trim() || !mcqForm.optB.trim()) {
      Alert.alert('Validation', 'Please provide at least a question and options A & B.');
      return;
    }
    addMCQ({
      question: mcqForm.question,
      options: [mcqForm.optA, mcqForm.optB, mcqForm.optC || 'N/A', mcqForm.optD || 'N/A'],
      correctAnswer: mcqForm.correctAnswer,
      explanation: mcqForm.explanation,
      category: mcqForm.category,
      examType: mcqForm.examType || undefined,
      isRepeated: mcqForm.isRepeated,
      repeatCount: mcqForm.isRepeated ? mcqForm.repeatCount : undefined,
      importance: mcqForm.importance,
    });
    setMcqForm({
      question: '',
      optA: '',
      optB: '',
      optC: '',
      optD: '',
      correctAnswer: 0,
      explanation: '',
      category: 'General Knowledge',
      examType: '',
      isRepeated: false,
      repeatCount: 2,
      importance: 'medium',
    });
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleManualVocabSubmit = () => {
    if (!vocabForm.word.trim() || !vocabForm.meaning.trim()) {
      Alert.alert('Validation', 'Please fill in both the Word and its definition.');
      return;
    }
    const synonymsList = vocabForm.synonyms ? vocabForm.synonyms.split(',').map((s) => s.trim()) : [];
    const antonymsList = vocabForm.antonyms ? vocabForm.antonyms.split(',').map((a) => a.trim()) : [];
    addVocab({
      word: vocabForm.word,
      meaning: vocabForm.meaning,
      synonyms: synonymsList,
      antonyms: antonymsList,
      example: vocabForm.example,
      category: vocabForm.category,
    });
    setVocabForm({ word: '', meaning: '', synonyms: '', antonyms: '', example: '', category: 'General Vocabulary' });
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleBulkSubmit = () => {
    if (!bulkText.trim()) {
      setBulkFeedback({ success: false, message: 'Please enter JSON array data first!' });
      return;
    }
    const res = bulkType === 'mcq' ? bulkImportMCQs(bulkText) : bulkImportVocab(bulkText);
    if (res.success) {
      setBulkFeedback({ success: true, message: `Successfully imported ${res.count} items!` });
      setBulkText('');
    } else {
      setBulkFeedback({ success: false, message: `Import Failed: ${res.error}` });
    }
  };

  const copySampleJSON = () => {
    const sample = bulkType === 'mcq'
      ? JSON.stringify([{
          question: 'What is the capital of Pakistan?',
          options: ['Karachi', 'Lahore', 'Islamabad', 'Peshawar'],
          correctAnswer: 2,
          explanation: 'Islamabad became the official capital in 1967.',
          category: 'General Knowledge',
          examType: 'ETEA Sample Mock',
        }], null, 2)
      : JSON.stringify([{
          word: 'Alleviate',
          meaning: 'Make physical suffering or pain less severe.',
          synonyms: ['relieve', 'soothe'],
          antonyms: ['aggravate'],
          example: 'He took measures to alleviate the backlog.',
          category: 'CSS Vocab',
        }], null, 2);
    setBulkText(sample);
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (t: string) => void,
    props?: any
  ) => (
    <View style={styles.fieldWrapper}>
      <Text style={[styles.fieldLabel, dynamicStyles.textMuted]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.textMuted}
        style={[styles.inputField, dynamicStyles.input]}
        {...props}
      />
    </View>
  );

  const segments: { key: typeof activeSegment; label: string }[] = [
    { key: 'auth', label: 'Account' },
    { key: 'mcq', label: 'Add MCQ' },
    { key: 'vocab', label: 'Add Vocab' },
    { key: 'bulk', label: 'Bulk JSON' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, dynamicStyles.container]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content}>

          {/* Segment Selector */}
          <View style={[styles.segmentWrapper, { backgroundColor: isDark ? '#121214' : '#e5e7eb' }]}>
            {segments.map((seg) => (
              <TouchableOpacity
                key={seg.key}
                onPress={() => { setActiveSegment(seg.key); setBulkFeedback(null); }}
                style={[
                  styles.segmentButton,
                  activeSegment === seg.key && { backgroundColor: colors.primary },
                ]}
              >
                <Text style={[
                  styles.segmentText,
                  { color: activeSegment === seg.key ? '#fff' : colors.textMuted },
                ]}>
                  {seg.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── AUTH SEGMENT ── */}
          {activeSegment === 'auth' && (
            <View style={[styles.formCard, dynamicStyles.card]}>
              {user ? (
                <View style={styles.userInfoBox}>
                  <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
                    <User size={20} color="#fff" />
                  </View>
                  <Text style={[styles.userEmail, dynamicStyles.text]}>{user.email}</Text>
                  <Text style={[styles.userLabel, dynamicStyles.textMuted]}>Authenticated Admin</Text>

                  <TouchableOpacity
                    onPress={() => syncWithCloud()}
                    style={[styles.btnSync, { backgroundColor: isDark ? '#1c1c1f' : '#f3f4f6', borderColor: colors.border }]}
                  >
                    <RefreshCw size={14} color={colors.primary} />
                    <Text style={[styles.btnSyncText, { color: colors.primary }]}>Sync with Cloud</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={signOut}
                    style={[styles.btnSignOut, { borderColor: colors.danger }]}
                  >
                    <LogOut size={14} color={colors.danger} />
                    <Text style={[styles.btnSignOutText, { color: colors.danger }]}>Sign Out</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View style={styles.formHeader}>
                    <LogIn size={16} color={colors.primary} />
                    <Text style={[styles.formTitle, dynamicStyles.text]}>
                      {authMode === 'signIn' ? 'ADMIN SIGN IN' : 'CREATE ACCOUNT'}
                    </Text>
                  </View>
                  <Text style={[styles.authDesc, dynamicStyles.textMuted]}>
                    Sign in to sync your progress and MCQ database across all your devices via Supabase cloud.
                  </Text>

                  {renderInput('Email Address', authEmail, setAuthEmail, {
                    placeholder: 'admin@example.com',
                    keyboardType: 'email-address',
                    autoCapitalize: 'none',
                  })}
                  {renderInput('Password', authPassword, setAuthPassword, {
                    placeholder: '••••••••',
                    secureTextEntry: true,
                  })}

                  <TouchableOpacity
                    onPress={handleAuth}
                    disabled={authLoading}
                    style={[styles.btnSubmit, { backgroundColor: colors.primary, opacity: authLoading ? 0.7 : 1 }]}
                  >
                    <Text style={styles.btnSubmitText}>
                      {authLoading ? 'Please wait...' : authMode === 'signIn' ? 'SIGN IN' : 'CREATE ACCOUNT'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setAuthMode(authMode === 'signIn' ? 'signUp' : 'signIn')}
                    style={styles.btnSwitchAuth}
                  >
                    <Text style={[styles.btnSwitchAuthText, { color: colors.primary }]}>
                      {authMode === 'signIn' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* ── MANUAL MCQ FORM ── */}
          {activeSegment === 'mcq' && (
            <View style={[styles.formCard, dynamicStyles.card]}>
              <View style={styles.formHeader}>
                <Edit3 size={15} color={colors.primary} />
                <Text style={[styles.formTitle, dynamicStyles.text]}>MANUAL MCQ REGISTRY</Text>
              </View>

              {/* Category Select */}
              <View style={styles.fieldWrapper}>
                <Text style={[styles.fieldLabel, dynamicStyles.textMuted]}>SUBJECT CATEGORY *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                  {(['English', 'General Knowledge', 'Pakistan Studies', 'Computer Science', 'Mathematics'] as MCQ['category'][]).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setMcqForm({ ...mcqForm, category: cat })}
                      style={[
                        styles.chipButton,
                        {
                          backgroundColor: mcqForm.category === cat ? colors.primary : isDark ? '#1c1c1f' : '#f3f4f6',
                        },
                      ]}
                    >
                      <Text style={[styles.chipText, { color: mcqForm.category === cat ? '#fff' : colors.text }]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {renderInput('Exam Board Tag (e.g. ETEA 2023)', mcqForm.examType, (v) => setMcqForm({ ...mcqForm, examType: v }), {
                placeholder: 'Leave empty for general practice',
              })}
              {renderInput('Question Text *', mcqForm.question, (v) => setMcqForm({ ...mcqForm, question: v }), {
                placeholder: 'e.g. What does HTTP stand for?',
                multiline: true,
                numberOfLines: 3,
                style: [styles.inputField, dynamicStyles.input, { height: 70 }],
              })}

              {['A', 'B', 'C', 'D'].map((letter, idx) => {
                const key = `opt${letter}` as keyof typeof mcqForm;
                return renderInput(
                  `Option ${letter}${idx < 2 ? ' *' : ''}`,
                  mcqForm[key] as string,
                  (v) => setMcqForm({ ...mcqForm, [key]: v }),
                  { placeholder: `Choice ${letter}` }
                );
              })}

              {/* Correct Answer Selector */}
              <View style={styles.fieldWrapper}>
                <Text style={[styles.fieldLabel, dynamicStyles.textMuted]}>CORRECT ANSWER *</Text>
                <View style={styles.correctAnswerRow}>
                  {[0, 1, 2, 3].map((val) => (
                    <TouchableOpacity
                      key={val}
                      onPress={() => setMcqForm({ ...mcqForm, correctAnswer: val })}
                      style={[
                        styles.answerChip,
                        {
                          backgroundColor: mcqForm.correctAnswer === val ? colors.primary : isDark ? '#1c1c1f' : '#f3f4f6',
                          borderColor: mcqForm.correctAnswer === val ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.chipText, { color: mcqForm.correctAnswer === val ? '#fff' : colors.text }]}>
                        {['A', 'B', 'C', 'D'][val]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Repeated Toggle */}
              <View style={[styles.toggleRow, { borderColor: colors.border }]}>
                <View>
                  <Text style={[styles.toggleLabel, dynamicStyles.text]}>Is Repeated Question?</Text>
                  <Text style={[styles.toggleSub, dynamicStyles.textMuted]}>Appeared multiple times in past papers</Text>
                </View>
                <Switch
                  value={mcqForm.isRepeated}
                  onValueChange={(v) => setMcqForm({ ...mcqForm, isRepeated: v })}
                  trackColor={{ false: '#767577', true: '#a5b4fc' }}
                  thumbColor={mcqForm.isRepeated ? colors.primary : '#f4f3f4'}
                />
              </View>

              {renderInput('Explanation / Solution', mcqForm.explanation, (v) => setMcqForm({ ...mcqForm, explanation: v }), {
                placeholder: 'e.g. Option B is correct because...',
                multiline: true,
                style: [styles.inputField, dynamicStyles.input, { height: 60 }],
              })}

              <TouchableOpacity onPress={handleManualMCQSubmit} style={[styles.btnSubmit, { backgroundColor: colors.primary }]}>
                <Save size={15} color="#fff" />
                <Text style={styles.btnSubmitText}>REGISTER MCQ</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── MANUAL VOCAB FORM ── */}
          {activeSegment === 'vocab' && (
            <View style={[styles.formCard, dynamicStyles.card]}>
              <View style={styles.formHeader}>
                <BookOpen size={15} color={colors.primary} />
                <Text style={[styles.formTitle, dynamicStyles.text]}>VOCABULARY BUILDER</Text>
              </View>

              {renderInput('Vocabulary Word *', vocabForm.word, (v) => setVocabForm({ ...vocabForm, word: v }), {
                placeholder: 'e.g. Magnanimous',
              })}
              {renderInput('Category / Group', vocabForm.category, (v) => setVocabForm({ ...vocabForm, category: v }), {
                placeholder: 'e.g. CSS Vocab, ETEA Core',
              })}
              {renderInput('Definition & Meaning *', vocabForm.meaning, (v) => setVocabForm({ ...vocabForm, meaning: v }), {
                placeholder: 'Enter full dictionary definition...',
                multiline: true,
                style: [styles.inputField, dynamicStyles.input, { height: 70 }],
              })}
              {renderInput('Synonyms (comma separated)', vocabForm.synonyms, (v) => setVocabForm({ ...vocabForm, synonyms: v }), {
                placeholder: 'e.g. generous, noble, bountiful',
              })}
              {renderInput('Antonyms (comma separated)', vocabForm.antonyms, (v) => setVocabForm({ ...vocabForm, antonyms: v }), {
                placeholder: 'e.g. selfish, greedy, mean',
              })}
              {renderInput('Example Sentence', vocabForm.example, (v) => setVocabForm({ ...vocabForm, example: v }), {
                placeholder: 'e.g. He took a magnanimous stance...',
                multiline: true,
                style: [styles.inputField, dynamicStyles.input, { height: 60 }],
              })}

              <TouchableOpacity onPress={handleManualVocabSubmit} style={[styles.btnSubmit, { backgroundColor: colors.primary }]}>
                <Save size={15} color="#fff" />
                <Text style={styles.btnSubmitText}>REGISTER VOCAB CARD</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── BULK JSON IMPORT ── */}
          {activeSegment === 'bulk' && (
            <View style={[styles.formCard, dynamicStyles.card]}>
              <View style={styles.formHeader}>
                <FileCode size={15} color={colors.primary} />
                <Text style={[styles.formTitle, dynamicStyles.text]}>BULK JSON IMPORT</Text>
              </View>

              {/* Type selector */}
              <View style={[styles.segmentWrapper, { backgroundColor: isDark ? '#1c1c1f' : '#e5e7eb' }]}>
                {(['mcq', 'vocab'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => { setBulkType(type); setBulkFeedback(null); }}
                    style={[
                      styles.segmentButton,
                      { flex: 1 },
                      bulkType === type && { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text style={[styles.segmentText, { color: bulkType === type ? '#fff' : colors.textMuted }]}>
                      {type === 'mcq' ? 'Category MCQs' : 'Vocabulary Words'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={copySampleJSON}
                style={[styles.btnCopySchema, { borderColor: colors.primary }]}
              >
                <Clipboard size={12} color={colors.primary} />
                <Text style={[styles.btnCopySchemaText, { color: colors.primary }]}>Load Sample Schema</Text>
              </TouchableOpacity>

              {bulkFeedback && (
                <View
                  style={[
                    styles.feedbackBanner,
                    {
                      backgroundColor: bulkFeedback.success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      borderColor: bulkFeedback.success ? colors.success : colors.danger,
                    },
                  ]}
                >
                  {bulkFeedback.success
                    ? <CheckCircle2 size={14} color={colors.success} />
                    : <AlertTriangle size={14} color={colors.danger} />}
                  <Text style={[styles.feedbackText, { color: bulkFeedback.success ? colors.success : colors.danger }]}>
                    {bulkFeedback.message}
                  </Text>
                </View>
              )}

              <View style={styles.fieldWrapper}>
                <Text style={[styles.fieldLabel, dynamicStyles.textMuted]}>RAW JSON ARRAY *</Text>
                <TextInput
                  value={bulkText}
                  onChangeText={setBulkText}
                  placeholder={'[ { "question": "...", ... } ]'}
                  placeholderTextColor={colors.textMuted}
                  multiline
                  style={[styles.inputField, dynamicStyles.input, styles.bulkTextInput]}
                />
              </View>

              <TouchableOpacity onPress={handleBulkSubmit} style={[styles.btnSubmit, { backgroundColor: colors.primary }]}>
                <Clipboard size={15} color="#fff" />
                <Text style={styles.btnSubmitText}>PARSE & MERGE INTO DATABASE</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* DB Stats */}
          <View style={[styles.statsCard, dynamicStyles.card]}>
            <Text style={[styles.statsLabel, dynamicStyles.textMuted]}>LOCAL STORAGE REGISTRY</Text>
            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: isDark ? '#1c1c1f' : '#f9fafb' }]}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>{mcqs.length}</Text>
                <Text style={[styles.statTitle, dynamicStyles.textMuted]}>LOADED MCQs</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: isDark ? '#1c1c1f' : '#f9fafb' }]}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>{vocab.length}</Text>
                <Text style={[styles.statTitle, dynamicStyles.textMuted]}>VOCAB CARDS</Text>
              </View>
            </View>
          </View>

          {/* Success toast */}
          {submitSuccess && (
            <View style={styles.successToast}>
              <CheckCircle2 size={14} color="#a5b4fc" />
              <Text style={styles.successToastText}>Item registered in local database!</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  segmentWrapper: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 3,
    marginBottom: 16,
    gap: 2,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  segmentText: { fontSize: 10, fontWeight: 'bold' },
  formCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.1)',
    marginBottom: 4,
  },
  formTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  authDesc: { fontSize: 10.5, lineHeight: 14 },
  fieldWrapper: { gap: 5 },
  fieldLabel: { fontSize: 8.5, fontWeight: 'bold', letterSpacing: 0.5 },
  inputField: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
  },
  chipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  chipText: { fontSize: 10.5, fontWeight: 'bold' },
  correctAnswerRow: { flexDirection: 'row', gap: 8 },
  answerChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  toggleLabel: { fontSize: 11, fontWeight: 'bold' },
  toggleSub: { fontSize: 9, marginTop: 1 },
  btnSubmit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 16,
    marginTop: 4,
  },
  btnSubmitText: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  btnCopySchema: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  btnCopySchemaText: { fontSize: 10, fontWeight: 'bold' },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderWidth: 1,
    borderRadius: 12,
  },
  feedbackText: { fontSize: 10.5, fontWeight: 'bold', flex: 1 },
  bulkTextInput: { height: 160, textAlignVertical: 'top', fontFamily: 'monospace' },
  statsCard: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    gap: 10,
  },
  statsLabel: { fontSize: 8.5, fontWeight: 'bold', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
  },
  statNumber: { fontSize: 22, fontWeight: '900' },
  statTitle: { fontSize: 8, fontWeight: 'bold', marginTop: 2 },
  successToast: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  successToastText: { color: '#f9fafb', fontSize: 11, fontWeight: 'bold' },
  userInfoBox: { alignItems: 'center', gap: 10, paddingVertical: 12 },
  avatarCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  userEmail: { fontSize: 14, fontWeight: 'bold' },
  userLabel: { fontSize: 9.5 },
  btnSync: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  btnSyncText: { fontSize: 11, fontWeight: 'bold' },
  btnSignOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  btnSignOutText: { fontSize: 11, fontWeight: 'bold' },
  btnSwitchAuth: { alignItems: 'center', marginTop: 8 },
  btnSwitchAuthText: { fontSize: 11 },
});

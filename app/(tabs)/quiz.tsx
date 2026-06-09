import React, { useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Card, Badge } from '../../src/components/common';
import { useApp } from '../../src/context/AppContext';
import { router } from 'expo-router';
import { Play, Award, ShieldAlert, Sparkles, Brain } from 'lucide-react-native';



export default function QuizSetupScreen() {
  const { currentTheme, user } = useApp();
  const isDark = currentTheme === 'dark';

  // ── Standard Quiz state ─────────────────────────────────────────────────
  const [category, setCategory] = useState<string>('Mixed Practice');
  const [questionsLimit, setQuestionsLimit] = useState<number>(15);
  const [difficulty, setDifficulty] = useState<'All' | 'Conceptual' | 'High Repeats'>('All');
  const [negativeMarking, setNegativeMarking] = useState<boolean>(false);
  const [markingValue, setMarkingValue] = useState<string>('0.25');



  const categories = [
    'Mixed Practice',
    'English',
    'General Knowledge',
    'Pakistan Studies',
    'Computer Science',
    'Mathematics',
  ];

  const questionLimits = [15, 30, 40];

  const colors = {
    bg: isDark ? '#09090b' : '#f9fafb',
    card: isDark ? '#121214' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1f2937',
    textMuted: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#1f1f23' : '#f3f4f6',
    borderAccent: isDark ? '#27272a' : '#e5e7eb',
    primary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  };

  const dynamicStyles = StyleSheet.create({
    container: { backgroundColor: colors.bg },
    card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
    text: { color: colors.text },
    textMuted: { color: colors.textMuted },
  });

  // ── Standard Quiz handler ───────────────────────────────────────────────
  const handleStartQuiz = () => {
    const activeCategory = category === 'Mixed Practice' ? 'mixed' : category;
    const penaltyValue = negativeMarking ? parseFloat(markingValue) || 0.25 : 0;
    router.push({
      pathname: '/quiz-session',
      params: {
        category: activeCategory,
        limit: questionsLimit,
        difficulty,
        negativeMarking: penaltyValue,
      },
    });
  };

  return (
    <ScrollView style={[styles.container, dynamicStyles.container]} contentContainerStyle={styles.content}>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 1: STANDARD QUIZ (uses local MCQ pool)             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <View style={[styles.card, dynamicStyles.card, { padding: 20, borderRadius: 16 }]}>
        <View style={styles.headerRow}>
          <Award size={20} color={colors.primary} />
          <Text style={[styles.headerTitle, dynamicStyles.text]}>Practice Quiz</Text>
        </View>
        <Text style={[styles.headerSubtitle, dynamicStyles.textMuted]}>
          Quiz from your saved question bank. Fully offline, instant start.
        </Text>

        {/* Subject */}
        <Text style={[styles.fieldLabel, dynamicStyles.textMuted]}>Select Subject</Text>
        <View style={styles.optionsList}>
          {categories.map((cat) => {
            const isSelected = category === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.optionButton,
                  { backgroundColor: isSelected ? colors.primary : isDark ? '#1c1c1f' : '#f3f4f6' },
                ]}
              >
                <Text style={[styles.optionText, { color: isSelected ? '#fff' : colors.text, fontWeight: isSelected ? 'bold' : 'normal' }]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Settings sub-card */}
        <View style={[styles.subCard, { backgroundColor: isDark ? '#17171a' : '#f9fafb', borderColor: colors.border }]}>
          <Text style={[styles.subCardTitle, { color: colors.primary }]}>Settings</Text>

          {/* Questions Count */}
          <Text style={[styles.fieldLabel, dynamicStyles.textMuted, { marginTop: 4 }]}>Number of Questions</Text>
          <View style={styles.limitGrid}>
            {questionLimits.map((limit) => {
              const isSelected = questionsLimit === limit;
              return (
                <TouchableOpacity
                  key={limit}
                  onPress={() => setQuestionsLimit(limit)}
                  style={[
                    styles.limitButton,
                    {
                      backgroundColor: isSelected ? colors.primary : isDark ? '#27272a' : '#ffffff',
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.limitText, { color: isSelected ? '#fff' : colors.text, fontWeight: isSelected ? 'bold' : 'normal' }]}>
                    {limit} Q
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>



          {/* Negative Marking */}
          <View style={[styles.cardDivider, { borderTopColor: colors.border }]} />
          <View style={styles.markingToggleContainer}>
            <View style={styles.markingInfo}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <ShieldAlert size={14} color={colors.warning} />
                <Text style={[styles.markingTitle, dynamicStyles.text]}>Negative Marking Penalty</Text>
              </View>
              <Text style={[styles.markingSubtitle, dynamicStyles.textMuted]}>
                Apply penalty deduction for wrong answers.
              </Text>
            </View>
            <Switch
              value={negativeMarking}
              onValueChange={setNegativeMarking}
              trackColor={{ false: '#767577', true: '#a5b4fc' }}
              thumbColor={negativeMarking ? colors.primary : '#f4f3f4'}
            />
          </View>

          {negativeMarking && (
            <View style={styles.markingInputRow}>
              <Text style={[styles.markingInputLabel, dynamicStyles.text]}>Penalty Value:</Text>
              <View style={styles.markingValuesList}>
                {['0.25', '0.33', '0.50'].map((val) => {
                  const isSelected = markingValue === val;
                  return (
                    <TouchableOpacity
                      key={val}
                      onPress={() => setMarkingValue(val)}
                      style={[styles.markingValueBtn, { backgroundColor: isSelected ? colors.primary : isDark ? '#3f3f46' : '#e5e7eb' }]}
                    >
                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: isSelected ? '#ffffff' : colors.text }}>
                        -{val}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Start Standard Quiz Button */}
      <TouchableOpacity onPress={handleStartQuiz} style={[styles.startButton, { backgroundColor: colors.primary }]}>
        <Play size={18} color="#ffffff" fill="#ffffff" />
        <Text style={styles.startButtonText}>Start Quiz</Text>
      </TouchableOpacity>

      <View style={[styles.divider, { borderBottomColor: colors.border }]} />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 2: AI-POWERED QUIZ (Coming Soon)                   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <Card isDark={isDark} style={{ padding: 20, borderRadius: 16 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Brain size={20} color={colors.textMuted} />
          <Text style={[styles.headerTitle, dynamicStyles.text]}>AI Custom Test Builder</Text>
          <View style={[styles.aiBadge, { backgroundColor: isDark ? 'rgba(128,128,128,0.1)' : '#f3f4f6' }]}>
            <Sparkles size={10} color={colors.textMuted} />
            <Text style={[styles.aiBadgeText, { color: colors.textMuted }]}>Coming Soon</Text>
          </View>
        </View>
        
        <View style={{ alignItems: 'center', padding: 20, backgroundColor: isDark ? '#17171a' : '#f9fafb', borderRadius: 12, marginTop: 12 }}>
          <Sparkles size={24} color={colors.primary} />
          <Text style={{ marginTop: 8, fontSize: 14, fontWeight: '700', color: colors.text }}>Coming Soon</Text>
          <Text style={{ marginTop: 4, fontSize: 12, color: colors.textMuted, textAlign: 'center' }}>
            Personalized competitive exam mock tests generated by Gemini AI are currently being calibrated and will be available soon.
          </Text>
        </View>
      </Card>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, gap: 16 },
  card: { borderRadius: 16 },
  divider: { borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  headerSubtitle: { fontSize: 13, lineHeight: 20, marginBottom: 16 },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  aiBadgeText: { fontSize: 10, fontWeight: '700' },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 10,
    marginTop: 14,
    textTransform: 'uppercase',
  },
  optionsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  optionButton: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  optionText: { fontSize: 13 },
  subCard: { borderRadius: 12, borderWidth: 1, padding: 16, marginTop: 16 },
  subCardTitle: { fontSize: 13, fontWeight: '700', marginBottom: 10 },
  limitGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  limitButton: { flexGrow: 1, minWidth: 50, alignItems: 'center', paddingVertical: 12, borderRadius: 10, borderWidth: 1 },
  limitText: { fontSize: 13 },
  difficultyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  difficultyButton: { flexGrow: 1, minWidth: 80, alignItems: 'center', paddingVertical: 12, borderRadius: 10 },
  difficultyText: { fontSize: 13 },
  cardDivider: { borderTopWidth: 1, marginTop: 16, marginBottom: 14 },
  markingToggleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  markingInfo: { flex: 1 },
  markingTitle: { fontSize: 13, fontWeight: '600' },
  markingSubtitle: { fontSize: 11, marginTop: 3 },
  markingInputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, padding: 12, backgroundColor: 'rgba(128,128,128,0.05)', borderRadius: 10 },
  markingInputLabel: { fontSize: 12, fontWeight: '600' },
  markingValuesList: { flexDirection: 'row', gap: 8 },
  markingValueBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 16,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  startButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
});

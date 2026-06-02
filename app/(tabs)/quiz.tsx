import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { router } from 'expo-router';
import { Play, Award, Settings, ShieldAlert, BookOpen } from 'lucide-react-native';

export default function QuizSetupScreen() {
  const { currentTheme } = useApp();
  const isDark = currentTheme === 'dark';

  const [category, setCategory] = useState<string>('Mixed Practice');
  const [questionsLimit, setQuestionsLimit] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<'All' | 'Conceptual' | 'High Repeats'>('All');
  const [negativeMarking, setNegativeMarking] = useState<boolean>(false);
  const [markingValue, setMarkingValue] = useState<string>('0.25');

  const categories = [
    'Mixed Practice',
    'English',
    'General Knowledge',
    'Pakistan Studies',
    'Computer Science',
    'Mathematics'
  ];

  const questionLimits = [5, 10, 15, 20, 30];

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
      <View style={[styles.card, dynamicStyles.card, { padding: 20, borderRadius: 16 }]}>
        <View style={styles.headerRow}>
          <Award size={20} color={colors.primary} />
          <Text style={[styles.headerTitle, dynamicStyles.text]}>Quiz Setup</Text>
        </View>
        <Text style={[styles.headerSubtitle, dynamicStyles.textMuted]}>
          Configure your mock test parameters and get started.
        </Text>

        {/* 1. Category Selection */}
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
                  {
                    backgroundColor: isSelected ? colors.primary : isDark ? '#1c1c1f' : '#f3f4f6',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: isSelected ? '#ffffff' : colors.text,
                      fontWeight: isSelected ? 'bold' : 'normal',
                    },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Test Parameters Sub-Card */}
        <View
          style={[
            styles.subCard,
            {
              backgroundColor: isDark ? '#17171a' : '#f9fafb',
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.subCardTitle, { color: colors.primary }]}>Settings</Text>

          {/* 2. Questions Limit */}
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
                  <Text
                    style={[
                      styles.limitText,
                      {
                        color: isSelected ? '#ffffff' : colors.text,
                        fontWeight: isSelected ? 'bold' : 'normal',
                      },
                    ]}
                  >
                    {limit} Q
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 3. Difficulty */}
          <Text style={[styles.fieldLabel, dynamicStyles.textMuted]}>Focus Method</Text>
          <View style={styles.difficultyRow}>
            {(['All', 'Conceptual', 'High Repeats'] as const).map((diff) => {
              const isSelected = difficulty === diff;
              return (
                <TouchableOpacity
                  key={diff}
                  onPress={() => setDifficulty(diff)}
                  style={[
                    styles.difficultyButton,
                    {
                      backgroundColor: isSelected ? colors.primary : isDark ? '#27272a' : '#ffffff',
                      borderColor: colors.border,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      {
                        color: isSelected ? '#ffffff' : colors.text,
                        fontWeight: isSelected ? 'bold' : '600',
                      },
                    ]}
                  >
                    {diff}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 4. Negative Marking Option */}
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
                      style={[
                        styles.markingValueBtn,
                        {
                          backgroundColor: isSelected ? colors.primary : isDark ? '#3f3f46' : '#e5e7eb',
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: 'bold',
                          color: isSelected ? '#ffffff' : colors.text,
                        }}
                      >
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

      {/* Visual Anchor Divider */}
      <View style={[styles.divider, { borderBottomColor: colors.border }]} />

      <TouchableOpacity
        onPress={handleStartQuiz}
        style={[styles.startButton, { backgroundColor: colors.primary }]}
      >
        <Play size={18} color="#ffffff" fill="#ffffff" />
        <Text style={styles.startButtonText}>Start Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 20,
  },
  card: {
    borderRadius: 16,
    marginBottom: 20,
  },
  subCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginTop: 20,
  },
  subCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    marginBottom: 12,
  },
  divider: {
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0,
    marginBottom: 12,
    marginTop: 16,
  },
  optionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  optionText: {
    fontSize: 14,
  },
  limitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  limitButton: {
    flexGrow: 1,
    minWidth: 50,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  limitText: {
    fontSize: 13,
  },
  difficultyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  difficultyButton: {
    flexGrow: 1,
    minWidth: 80,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 13,
  },
  cardDivider: {
    borderTopWidth: 1,
    marginTop: 20,
    marginBottom: 16,
  },
  markingToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  markingInfo: {
    flex: 1,
  },
  markingTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  markingSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  markingInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    padding: 14,
    backgroundColor: 'rgba(128,128,128,0.05)',
    borderRadius: 12,
  },
  markingInputLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  markingValuesList: {
    flexDirection: 'row',
    gap: 10,
  },
  markingValueBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
  },
});

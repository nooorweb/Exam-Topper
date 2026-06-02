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
      <View style={[styles.card, dynamicStyles.card, { padding: 18, borderRadius: 16 }]}>
        <View style={styles.headerRow}>
          <Award size={18} color={colors.primary} />
          <Text style={[styles.headerTitle, dynamicStyles.text]}>EXAM CONFIGURATION DESK</Text>
        </View>
        <Text style={[styles.headerSubtitle, dynamicStyles.textMuted]}>
          Configure your mock test parameters. All questions reflect official ETEA, KPPSC, and CSS syllabi guidelines.
        </Text>

        {/* 1. Category Selection */}
        <Text style={[styles.fieldLabel, dynamicStyles.textMuted]}>SELECT SUBJECT CATEGORY</Text>
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
          <Text style={[styles.subCardTitle, { color: colors.primary }]}>TEST PARAMETERS</Text>

          {/* 2. Questions Limit */}
          <Text style={[styles.fieldLabel, dynamicStyles.textMuted, { marginTop: 4 }]}>QUESTION LIMIT</Text>
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
          <Text style={[styles.fieldLabel, dynamicStyles.textMuted]}>TARGET FOCUS METHOD</Text>
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
        <Play size={15} color="#ffffff" fill="#ffffff" />
        <Text style={styles.startButtonText}>LAUNCH TIMED QUIZ SESSION</Text>
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
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },
  subCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginTop: 16,
  },
  subCardTitle: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 1,
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 10.5,
    lineHeight: 14,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 8.5,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 12,
  },
  optionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  optionText: {
    fontSize: 10.5,
  },
  limitGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    marginBottom: 8,
  },
  limitButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  limitText: {
    fontSize: 11,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  difficultyButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 10.5,
  },
  cardDivider: {
    borderTopWidth: 1,
    marginTop: 18,
    marginBottom: 14,
  },
  markingToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  markingInfo: {
    flex: 1,
    paddingRight: 10,
  },
  markingTitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  markingSubtitle: {
    fontSize: 9.5,
    marginTop: 2,
  },
  markingInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    padding: 10,
    backgroundColor: 'rgba(128,128,128,0.05)',
    borderRadius: 12,
  },
  markingInputLabel: {
    fontSize: 10.5,
    fontWeight: 'bold',
  },
  markingValuesList: {
    flexDirection: 'row',
    gap: 6,
  },
  markingValueBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 8,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

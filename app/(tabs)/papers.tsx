import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  LayoutAnimation,
  Platform,
} from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { router } from 'expo-router';
import {
  Search,
  Flame,
  Award,
  FileText,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react-native';

export default function PastPapersScreen() {
  const { mcqs, currentTheme } = useApp();
  const isDark = currentTheme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<'All' | 'ETEA' | 'KPPSC' | 'FIA'>('All');
  const [onlyRepeated, setOnlyRepeated] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

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

  const filteredPapers = useMemo(() => {
    return mcqs.filter((m) => {
      // Must have examType to represent a past paper
      if (!m.examType) return false;

      const matchesSearch =
        m.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.examType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase());

      const boardStr = selectedBoard === 'All' ? '' : selectedBoard;
      const matchesBoard = !boardStr || m.examType.toUpperCase().includes(boardStr);
      const matchesRepeated = !onlyRepeated || m.isRepeated;

      return matchesSearch && matchesBoard && matchesRepeated;
    });
  }, [mcqs, searchQuery, selectedBoard, onlyRepeated]);

  const toggleRevealAnswer = (id: string) => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setRevealedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <ScrollView style={[styles.container, dynamicStyles.container]} contentContainerStyle={styles.content}>
      {/* Banner Intro */}
      <View style={[styles.card, dynamicStyles.card, { padding: 16, borderRadius: 16, marginBottom: 16 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <FileText size={14} color={colors.primary} />
          <Text style={[styles.bannerSub, { color: colors.primary }]}>VERIFIED SOURCE REPOSITORY</Text>
        </View>
        <Text style={[styles.bannerTitle, dynamicStyles.text]}>Competitive Past Paper Bank</Text>
        <Text style={[styles.bannerDesc, dynamicStyles.textMuted]}>
          Access repeated questions compiled from previous KPPSC, ETEA, and FIA exams. Study directly with explanatory keys or isolate high repetitions.
        </Text>
      </View>

      {/* Filter and Search options */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Search size={14} color={colors.textMuted} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Filter by year, topic or keyword..."
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, dynamicStyles.text]}
        />
      </View>

      {/* Boards filter row toggles */}
      <View style={[styles.tabsWrapper, { backgroundColor: isDark ? '#121214' : '#e5e7eb' }]}>
        {(['All', 'ETEA', 'KPPSC', 'FIA'] as const).map((board) => (
          <TouchableOpacity
            key={board}
            onPress={() => setSelectedBoard(board)}
            style={[
              styles.tabButton,
              selectedBoard === board && { backgroundColor: isDark ? '#27272a' : '#ffffff' },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: selectedBoard === board ? colors.text : (isDark ? '#d1d5db' : '#595959'),
                  fontWeight: selectedBoard === board ? 'bold' : 'normal',
                },
              ]}
            >
              {board}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Toggle repeated questions only */}
      <View style={[styles.toggleContainer, { borderBottomColor: colors.border }]}>
        <View style={styles.toggleTextFlex}>
          <Flame size={14} color={colors.warning} fill={colors.warning} />
          <Text style={[styles.toggleLabel, dynamicStyles.text]}>Filter only Repeated Questions</Text>
        </View>
        <Switch
          value={onlyRepeated}
          onValueChange={setOnlyRepeated}
          trackColor={{ false: '#767577', true: '#a5b4fc' }}
          thumbColor={onlyRepeated ? colors.primary : '#f4f3f4'}
        />
      </View>

      {/* Past papers list count header */}
      <View style={styles.listHeader}>
        <Sparkles size={11} color={colors.warning} />
        <Text style={[styles.listHeaderText, dynamicStyles.textMuted]}>
          ARCHIVED QUESTIONS ({filteredPapers.length})
        </Text>
      </View>

      {/* Questions list */}
      {filteredPapers.length === 0 ? (
        <View style={[styles.emptyCard, dynamicStyles.card]}>
          <AlertCircle size={32} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, dynamicStyles.text]}>No matching questions found</Text>
          <Text style={[styles.emptySubtitle, dynamicStyles.textMuted]}>
            Try clearing search queries or turning off the repeated questions filter.
          </Text>
        </View>
      ) : (
        <View style={styles.questionsList}>
          {filteredPapers.map((item) => {
            const isRevealed = !!revealedIds[item.id];
            return (
              <View
                key={item.id}
                style={[
                  styles.questionCard,
                  dynamicStyles.card,
                  item.isRepeated && { borderColor: 'rgba(245, 158, 11, 0.2)', borderWidth: 1.5 },
                ]}
              >
                {/* Meta Row */}
                <View style={styles.questionMetaRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={[styles.categoryBadge, { backgroundColor: isDark ? '#1c1c1f' : '#f3f4f6' }]}>
                      <Text style={[styles.categoryText, dynamicStyles.textMuted]}>{item.category}</Text>
                    </View>
                    {item.examType && (
                      <Text style={[styles.examTypeLabel, dynamicStyles.textMuted]}>{item.examType}</Text>
                    )}
                  </View>

                  {item.isRepeated && (
                    <View style={styles.repeatedBadge}>
                      <Flame size={9} color={colors.warning} fill={colors.warning} />
                      <Text style={styles.repeatedBadgeText}>REPEATED {item.repeatCount || '3'}+</Text>
                    </View>
                  )}
                </View>

                {/* Question */}
                <Text style={[styles.questionText, dynamicStyles.text]}>{item.question}</Text>

                {/* Expanded answer sheet */}
                {isRevealed && (
                  <View style={[styles.answerRevealBox, { borderTopColor: colors.border }]}>
                    {item.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === item.correctAnswer;
                      return (
                        <View
                          key={optIdx}
                          style={[
                            styles.optionRow,
                            {
                              backgroundColor: isCorrect
                                ? isDark
                                  ? 'rgba(16,185,129,0.15)'
                                  : '#ecfdf5'
                                : isDark
                                ? '#18181b'
                                : '#f9fafb',
                              borderColor: isCorrect ? colors.success : colors.border,
                            },
                          ]}
                        >
                          <View style={styles.optionContent}>
                            <Text style={[styles.optionAlphabet, dynamicStyles.textMuted]}>
                              {['A', 'B', 'C', 'D'][optIdx]}
                            </Text>
                            <Text
                              style={[
                                styles.optionText,
                                dynamicStyles.text,
                                isCorrect && { fontWeight: 'bold', color: colors.success },
                              ]}
                            >
                              {opt}
                            </Text>
                          </View>
                          {isCorrect && <Check size={12} color={colors.success} />}
                        </View>
                      );
                    })}

                    {item.explanation && (
                      <View style={[styles.explanationCard, { backgroundColor: isDark ? '#201b17' : '#fffbeb', borderColor: '#fef3c7' }]}>
                        <Text style={styles.explanationTitle}>Explanation Key:</Text>
                        <Text style={[styles.explanationText, dynamicStyles.text]}>{item.explanation}</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Action footer */}
                <View style={[styles.questionCardFooter, { borderTopColor: colors.border }]}>
                  <TouchableOpacity onPress={() => toggleRevealAnswer(item.id)}>
                    <Text style={[styles.btnRevealText, { color: colors.success }]}>
                      {isRevealed ? 'Minimize Study Details' : 'Uncover Correct Answer & Key'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      router.push({
                        pathname: '/quiz-session',
                        params: { category: item.category, limit: 10, difficulty: 'All' },
                      });
                    }}
                    style={[styles.btnMiniQuiz, { backgroundColor: isDark ? '#27272a' : '#f3f4f6' }]}
                  >
                    <Text style={[styles.btnMiniQuizText, dynamicStyles.text]}>Practice Subject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}
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
  },
  bannerSub: {
    fontSize: 8.5,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginTop: 2,
  },
  bannerDesc: {
    fontSize: 10.5,
    lineHeight: 14.5,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 11.5,
    padding: 0,
  },
  tabsWrapper: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 3,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  tabText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  toggleTextFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toggleLabel: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  listHeaderText: {
    fontSize: 8.5,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  emptyCard: {
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptySubtitle: {
    fontSize: 10,
    textAlign: 'center',
  },
  questionsList: {
    gap: 12,
    marginBottom: 20,
  },
  questionCard: {
    borderRadius: 16,
    padding: 14,
    elevation: 1,
  },
  questionMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  examTypeLabel: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  repeatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fffbeb',
    borderColor: '#fef3c7',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  repeatedBadgeText: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#d97706',
  },
  questionText: {
    fontSize: 12.5,
    fontWeight: 'bold',
    lineHeight: 16.5,
  },
  answerRevealBox: {
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 12,
    gap: 6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  optionAlphabet: {
    fontSize: 8.5,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    backgroundColor: 'rgba(128,128,128,0.1)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  optionText: {
    fontSize: 10.5,
    flex: 1,
  },
  explanationCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginTop: 6,
  },
  explanationTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#b45309',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  explanationText: {
    fontSize: 9.5,
    lineHeight: 13.5,
  },
  questionCardFooter: {
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnRevealText: {
    fontSize: 9.5,
    fontWeight: 'bold',
  },
  btnMiniQuiz: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  btnMiniQuizText: {
    fontSize: 9.5,
    fontWeight: 'bold',
  },
});

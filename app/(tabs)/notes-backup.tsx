import React, { useState, useMemo, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUBJECT_NOTEBOOKS, NoteTopic, SubjectNotebook } from '../../src/data/notesData';
import { useApp } from '../../src/context/AppContext';
import { router } from 'expo-router';
import {
  BookOpen,
  Calculator,
  Globe,
  Map,
  Cpu,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Check,
  Play,
} from 'lucide-react-native';

export default function NotesScreen() {
  const { currentTheme } = useApp();
  const isDark = currentTheme === 'dark';

  const [activeSubject, setActiveSubject] = useState<SubjectNotebook['subject']>('English');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Syllabus progress checklist state
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>([]);
  const [checkedPoints, setCheckedPoints] = useState<Record<string, boolean>>({});

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

  // Load progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedCompleted = await AsyncStorage.getItem('smart_prep_completed_notes');
        if (savedCompleted) {
          setCompletedTopicIds(JSON.parse(savedCompleted));
        }
        const savedChecked = await AsyncStorage.getItem('smart_prep_checked_points');
        if (savedChecked) {
          setCheckedPoints(JSON.parse(savedChecked));
        }
      } catch (_) {}
    };
    loadProgress();
  }, []);

  // Save completed notes progress
  const saveCompletedProgress = async (updated: string[]) => {
    setCompletedTopicIds(updated);
    await AsyncStorage.setItem('smart_prep_completed_notes', JSON.stringify(updated));
  };

  // Save checked individual bullet points progress
  const saveCheckedPoints = async (updated: Record<string, boolean>) => {
    setCheckedPoints(updated);
    await AsyncStorage.setItem('smart_prep_checked_points', JSON.stringify(updated));
  };

  const toggleTopicCompletion = (id: string) => {
    const updated = completedTopicIds.includes(id)
      ? completedTopicIds.filter((pId) => pId !== id)
      : [...completedTopicIds, id];
    saveCompletedProgress(updated);
  };

  const toggleLineItem = (pointKey: string) => {
    const updated = {
      ...checkedPoints,
      [pointKey]: !checkedPoints[pointKey],
    };
    saveCheckedPoints(updated);
  };

  const subjectList = SUBJECT_NOTEBOOKS.map((s) => s.subject);

  const totalTopicsCount = useMemo(() => {
    return SUBJECT_NOTEBOOKS.reduce((acc, current) => acc + current.topics.length, 0);
  }, []);

  const overallMasteryPercentage = useMemo(() => {
    if (totalTopicsCount === 0) return 0;
    return Math.round((completedTopicIds.length / totalTopicsCount) * 100);
  }, [completedTopicIds, totalTopicsCount]);

  const activeNotebook = useMemo(() => {
    return SUBJECT_NOTEBOOKS.find((n) => n.subject === activeSubject);
  }, [activeSubject]);

  const searchedTopics = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const results: { subject: SubjectNotebook['subject']; topic: NoteTopic }[] = [];
    SUBJECT_NOTEBOOKS.forEach((n) => {
      n.topics.forEach((t) => {
        const matchesQuery =
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.keyPoints.some((pt) => pt.toLowerCase().includes(searchQuery.toLowerCase()));

        if (matchesQuery) {
          results.push({ subject: n.subject, topic: t });
        }
      });
    });
    return results;
  }, [searchQuery]);

  const getSubjectIcon = (sub: SubjectNotebook['subject'], color: string, size: number = 14) => {
    switch (sub) {
      case 'English':
        return <BookOpen size={size} color={color} />;
      case 'Mathematics':
        return <Calculator size={size} color={color} />;
      case 'General Knowledge':
        return <Globe size={size} color={color} />;
      case 'Pakistan Studies':
        return <Map size={size} color={color} />;
      case 'Computer Science':
        return <Cpu size={size} color={color} />;
      default:
        return <BookOpen size={size} color={color} />;
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Reset all syllabus study checklist logs back to 0%?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Logs',
          style: 'destructive',
          onPress: () => {
            saveCompletedProgress([]);
            saveCheckedPoints({});
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, dynamicStyles.container]} contentContainerStyle={styles.content}>
      {/* Syllabus Progress Card */}
      <View style={[styles.card, dynamicStyles.card, { padding: 16, borderRadius: 16 }]}>
        <View style={styles.progressHeader}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressTitle, dynamicStyles.text]}>SYLLABUS PROGRESS TRACKER</Text>
            <Text style={[styles.progressSubtitle, dynamicStyles.textMuted]}>
              Completed {completedTopicIds.length} of {totalTopicsCount} key topics
            </Text>
          </View>
          <View style={styles.progressRingOuter}>
            <Svg width={54} height={54}>
              <Circle
                cx={27}
                cy={27}
                r={22}
                stroke={isDark ? '#27272a' : '#f3f4f6'}
                strokeWidth={4.5}
                fill="transparent"
              />
              <Circle
                cx={27}
                cy={27}
                r={22}
                stroke={colors.primary}
                strokeWidth={4.5}
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={2 * Math.PI * 22 * (1 - overallMasteryPercentage / 100)}
                strokeLinecap="round"
                fill="transparent"
                origin="27, 27"
                rotation="-90"
              />
            </Svg>
            <View style={styles.progressRingTextContainer}>
              <Text style={[styles.progressPercentText, { color: colors.text }]}>
                {overallMasteryPercentage}%
              </Text>
            </View>
          </View>
        </View>

        {completedTopicIds.length > 0 && (
          <TouchableOpacity onPress={handleResetProgress} style={[styles.btnReset, { marginTop: 8 }]}>
            <RotateCcw size={10} color={colors.textMuted} />
            <Text style={[styles.btnResetText, dynamicStyles.textMuted]}>Reset Study Progress</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Global Notes Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Search size={14} color={colors.textMuted} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search all notes, timelines & formulas..."
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, dynamicStyles.text]}
        />
      </View>

      {/* Search Discoveries Board */}
      {searchQuery.trim().length > 0 ? (
        <View style={styles.topicsStack}>
          <Text style={[styles.sectionTitle, dynamicStyles.textMuted]}>
            SEARCH DISCOVERIES ({searchedTopics.length})
          </Text>
          {searchedTopics.length === 0 ? (
            <View style={[styles.emptySearchCard, dynamicStyles.card]}>
              <Text style={[styles.emptySearchTitle, dynamicStyles.text]}>No notes matches found</Text>
              <Text style={[styles.emptySearchSub, dynamicStyles.textMuted]}>
                Try using keywords like "Pre-Partition", "Trigonometry", or "Prepositions".
              </Text>
            </View>
          ) : (
            searchedTopics.map(({ subject, topic }) => {
              const isOpen = selectedTopicId === topic.id;
              const isCompleted = completedTopicIds.includes(topic.id);

              return (
                <View key={topic.id} style={[styles.topicWrapper, dynamicStyles.card]}>
                  <TouchableOpacity
                    onPress={() => setSelectedTopicId(isOpen ? null : topic.id)}
                    style={styles.topicHeader}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <View style={{ padding: 4, backgroundColor: isDark ? '#1c1c1f' : '#f3f4f6', borderRadius: 6 }}>
                          {getSubjectIcon(subject, colors.primary, 10)}
                        </View>
                        <Text style={[styles.subjectTagText, dynamicStyles.textMuted]}>{subject}</Text>
                      </View>
                      <Text style={[styles.topicTitle, dynamicStyles.text]}>{topic.title}</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => toggleTopicCompletion(topic.id)}
                      style={[
                        styles.checkboxCircle,
                        {
                          backgroundColor: isCompleted ? colors.primary : 'transparent',
                          borderColor: isCompleted ? colors.primary : colors.borderAccent,
                        },
                      ]}
                    >
                      {isCompleted && <Check size={10} color="#fff" />}
                    </TouchableOpacity>
                  </TouchableOpacity>

                  {isOpen && (
                    <View style={[styles.topicDetailsContainer, { borderTopColor: colors.border }]}>
                      <TopicDetails
                        topic={topic}
                        subject={subject}
                        isCompleted={isCompleted}
                        toggleComplete={() => toggleTopicCompletion(topic.id)}
                        checkedPoints={checkedPoints}
                        toggleLineItem={toggleLineItem}
                        colors={colors}
                        isDark={isDark}
                      />
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      ) : (
        <>
          {/* Horizontal Tab bar for active Subject */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalTabs}
          >
            {subjectList.map((sub) => {
              const isActive = activeSubject === sub;
              return (
                <TouchableOpacity
                  key={sub}
                  onPress={() => {
                    setActiveSubject(sub);
                    setSelectedTopicId(null);
                  }}
                  style={[
                    styles.tabButton,
                    {
                      backgroundColor: isActive ? colors.primary : colors.card,
                      borderColor: isActive ? colors.primary : colors.border,
                    },
                  ]}
                >
                  {getSubjectIcon(sub, isActive ? '#ffffff' : colors.textMuted, 12)}
                  <Text style={[styles.tabButtonText, { color: isActive ? '#ffffff' : colors.text }]}>
                    {sub}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Active Notebook banner description */}
          {activeNotebook && (
            <View style={[styles.card, dynamicStyles.card, { padding: 12, borderRadius: 16, marginBottom: 12 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {getSubjectIcon(activeSubject, colors.primary, 14)}
                <Text style={[styles.deskLabel, dynamicStyles.text]}>{activeSubject} Study Desk</Text>
              </View>
              <Text style={[styles.deskSub, dynamicStyles.textMuted]}>{activeNotebook.description}</Text>
            </View>
          )}

          {/* Topics Accordion Stack */}
          {activeNotebook && (
            <View style={styles.topicsStack}>
              {activeNotebook.topics.map((topic) => {
                const isOpen = selectedTopicId === topic.id;
                const isCompleted = completedTopicIds.includes(topic.id);

                return (
                  <View key={topic.id} style={[styles.topicWrapper, dynamicStyles.card]}>
                    <TouchableOpacity
                      onPress={() => setSelectedTopicId(isOpen ? null : topic.id)}
                      style={styles.topicHeader}
                    >
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text
                            style={[
                              styles.importanceTag,
                              {
                                backgroundColor:
                                  topic.importance === 'critical'
                                    ? '#fee2e2'
                                    : topic.importance === 'high'
                                    ? '#ffedd5'
                                    : '#f3f4f6',
                                color:
                                  topic.importance === 'critical'
                                    ? '#ef4444'
                                    : topic.importance === 'high'
                                    ? '#f97316'
                                    : '#4b5563',
                              },
                            ]}
                          >
                            {topic.importance} topic
                          </Text>

                          <View style={styles.timeTag}>
                            <Clock size={10} color={colors.textMuted} />
                            <Text style={[styles.timeTagText, dynamicStyles.textMuted]}>
                              {topic.estimatedReadTime} min read
                            </Text>
                          </View>
                        </View>

                        <Text style={[styles.topicTitleText, dynamicStyles.text]}>{topic.title}</Text>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <TouchableOpacity
                          onPress={() => toggleTopicCompletion(topic.id)}
                          style={[
                            styles.checkboxCircle,
                            {
                              backgroundColor: isCompleted ? colors.success : 'transparent',
                              borderColor: isCompleted ? colors.success : colors.borderAccent,
                            },
                          ]}
                        >
                          {isCompleted && <Check size={9} color="#fff" />}
                        </TouchableOpacity>

                        {isOpen ? (
                          <ChevronUp size={16} color={colors.textMuted} />
                        ) : (
                          <ChevronDown size={16} color={colors.textMuted} />
                        )}
                      </View>
                    </TouchableOpacity>

                    {isOpen && (
                      <View style={[styles.topicDetailsContainer, { borderTopColor: colors.border }]}>
                        <TopicDetails
                          topic={topic}
                          subject={activeSubject}
                          isCompleted={isCompleted}
                          toggleComplete={() => toggleTopicCompletion(topic.id)}
                          checkedPoints={checkedPoints}
                          toggleLineItem={toggleLineItem}
                          colors={colors}
                          isDark={isDark}
                        />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

// Topic Details Renderer component
function TopicDetails({
  topic,
  subject,
  isCompleted,
  toggleComplete,
  checkedPoints,
  toggleLineItem,
  colors,
  isDark,
}: {
  topic: NoteTopic;
  subject: string;
  isCompleted: boolean;
  toggleComplete: () => void;
  checkedPoints: Record<string, boolean>;
  toggleLineItem: (key: string) => void;
  colors: any;
  isDark: boolean;
}) {
  return (
    <View style={styles.detailsContent}>
      {/* Overview */}
      <View style={styles.detailSection}>
        <Text style={styles.sectionLabel}>Introduction</Text>
        <Text style={[styles.overviewText, { color: colors.text }]}>{topic.overview}</Text>
      </View>

      {/* Key points checklist */}
      <View style={[styles.checklistCard, { backgroundColor: isDark ? '#18181b' : '#f9fafb', borderColor: colors.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Sparkles size={11} color={colors.primary} />
          <Text style={[styles.checklistHeader, { color: colors.primary }]}>
            High-Yield Key Points (Tap to verify)
          </Text>
        </View>

        <View style={styles.checklistItems}>
          {topic.keyPoints.map((pt, i) => {
            const itemKey = `${topic.id}-pt-${i}`;
            const isPointChecked = !!checkedPoints[itemKey];

            return (
              <TouchableOpacity
                key={i}
                onPress={() => toggleLineItem(itemKey)}
                style={styles.checkItemRow}
              >
                <View
                  style={[
                    styles.pointCheckbox,
                    {
                      backgroundColor: isPointChecked ? colors.primary : 'transparent',
                      borderColor: isPointChecked ? colors.primary : colors.textMuted,
                    },
                  ]}
                >
                  {isPointChecked && <Check size={8} color="#fff" />}
                </View>
                <Text
                  style={[
                    styles.checkItemText,
                    {
                      color: colors.text,
                      textDecorationLine: isPointChecked ? 'line-through' : 'none',
                      opacity: isPointChecked ? 0.5 : 1,
                    },
                  ]}
                >
                  {pt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Formulas if math */}
      {topic.formulas && topic.formulas.length > 0 && (
        <View style={styles.detailSection}>
          <Text style={styles.sectionLabel}>Formula Core</Text>
          <View style={styles.formulasStack}>
            {topic.formulas.map((frm, idx) => (
              <View key={idx} style={[styles.formulaCard, { backgroundColor: isDark ? '#1a1b2e' : '#eef2ff', borderColor: colors.border }]}>
                <View style={styles.formulaHeader}>
                  <Text style={[styles.formulaName, { color: colors.primary }]}>{frm.name}</Text>
                  <Text style={styles.equationTag}>Equation</Text>
                </View>
                <View style={[styles.equationBox, { backgroundColor: isDark ? '#131422' : '#dbeafe' }]}>
                  <Text style={styles.equationText}>{frm.equation}</Text>
                </View>
                <Text style={[styles.formulaAppText, { color: colors.textMuted }]}>
                  <Text style={{ fontWeight: 'bold', color: colors.primary }}>App: </Text>
                  {frm.application}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Lookup Tables */}
      {topic.tables && topic.tables.length > 0 && (
        <View style={styles.detailSection}>
          <Text style={styles.sectionLabel}>Timeline Key Table</Text>
          {topic.tables.map((table, tIdx) => (
            <View key={tIdx} style={[styles.tableBorder, { borderColor: colors.border }]}>
              {/* Header Row */}
              <View style={[styles.tableHeaderRow, { backgroundColor: isDark ? '#27272a' : '#e5e7eb' }]}>
                {table.headers.map((h, hIdx) => (
                  <View key={hIdx} style={styles.tableHeaderCol}>
                    <Text style={[styles.tableHeaderCellText, { color: colors.text }]}>{h}</Text>
                  </View>
                ))}
              </View>

              {/* Rows */}
              {table.rows.map((row, rIdx) => (
                <View
                  key={rIdx}
                  style={[
                    styles.tableRow,
                    {
                      backgroundColor:
                        rIdx % 2 === 1 ? (isDark ? '#18181b' : '#f9fafb') : isDark ? '#121214' : '#ffffff',
                      borderBottomColor: colors.border,
                      borderBottomWidth: rIdx < table.rows.length - 1 ? 1 : 0,
                    },
                  ]}
                >
                  {row.map((val, colIdx) => (
                    <View key={colIdx} style={styles.tableCol}>
                      <Text style={[styles.tableCellText, { color: colors.text }]}>{val}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Analyst Insights */}
      <View style={[styles.insightCard, { backgroundColor: isDark ? '#201b17' : '#fffbeb', borderColor: '#fef3c7' }]}>
        <Text style={styles.insightTitle}>Exam Analyst Insight:</Text>
        <Text style={[styles.insightText, { color: colors.text }]}>{topic.content}</Text>
      </View>

      {/* Topic Action Panel */}
      <View style={[styles.topicActions, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          onPress={toggleComplete}
          style={[
            styles.btnMarkComplete,
            {
              backgroundColor: isCompleted ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5') : colors.card,
              borderColor: isCompleted ? colors.success : colors.borderAccent,
            },
          ]}
        >
          <CheckCircle size={12} color={isCompleted ? colors.success : colors.textMuted} />
          <Text
            style={[
              styles.btnMarkCompleteText,
              {
                color: isCompleted ? colors.success : colors.text,
                fontWeight: isCompleted ? 'bold' : 'normal',
              },
            ]}
          >
            {isCompleted ? 'Marked Confident' : 'Mark Confident'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/quiz-session',
              params: { category: subject, limit: 10, difficulty: 'All' },
            });
          }}
          style={[styles.btnStartTest, { backgroundColor: colors.primary }]}
        >
          <Play size={10} color="#fff" fill="#fff" />
          <Text style={styles.btnStartTestText}>Start Test</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    borderWidth: 1,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  progressSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  progressRingOuter: {
    position: 'relative',
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarBG: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
  },
  btnReset: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 2,
  },
  btnResetText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 11,
    padding: 0,
  },
  horizontalTabs: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  tabButtonText: {
    fontSize: 10.5,
    fontWeight: 'bold',
  },
  deskLabel: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  deskSub: {
    fontSize: 9.5,
    marginTop: 4,
    lineHeight: 13,
  },
  topicsStack: {
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 8.5,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  emptySearchCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  emptySearchTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptySearchSub: {
    fontSize: 10,
    textAlign: 'center',
  },
  topicWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  importanceTag: {
    fontSize: 7.5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timeTagText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  topicTitleText: {
    fontSize: 12,
    fontWeight: '900',
    marginTop: 6,
  },
  checkboxCircle: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicDetailsContainer: {
    borderTopWidth: 1,
    padding: 0,
  },
  detailsContent: {
    padding: 14,
    gap: 12,
  },
  detailSection: {
    gap: 4,
  },
  sectionLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  overviewText: {
    fontSize: 10.5,
    lineHeight: 14,
  },
  checklistCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
  },
  checklistHeader: {
    fontSize: 9.5,
    fontWeight: 'bold',
  },
  checklistItems: {
    gap: 8,
    marginTop: 4,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  pointCheckbox: {
    width: 12,
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
    marginTop: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkItemText: {
    fontSize: 10,
    lineHeight: 14.5,
    flex: 1,
  },
  formulasStack: {
    gap: 8,
  },
  formulaCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 6,
  },
  formulaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formulaName: {
    fontSize: 10.5,
    fontWeight: 'bold',
  },
  equationTag: {
    fontSize: 7.5,
    color: '#a5b4fc',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    fontWeight: 'bold',
  },
  equationBox: {
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  equationText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  formulaAppText: {
    fontSize: 9.5,
  },
  tableBorder: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  tableHeaderCol: {
    flex: 1,
    paddingHorizontal: 8,
  },
  tableHeaderCellText: {
    fontSize: 8.5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  tableCol: {
    flex: 1,
    paddingHorizontal: 8,
  },
  tableCellText: {
    fontSize: 9,
    lineHeight: 12,
  },
  insightCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 10,
  },
  insightTitle: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#b45309',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  insightText: {
    fontSize: 9.5,
    lineHeight: 13.5,
  },
  topicActions: {
    borderTopWidth: 1,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnMarkComplete: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  btnMarkCompleteText: {
    fontSize: 9.5,
  },
  btnStartTest: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  btnStartTestText: {
    color: '#fff',
    fontSize: 9.5,
    fontWeight: 'bold',
  },
  topicTitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  subjectTagText: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

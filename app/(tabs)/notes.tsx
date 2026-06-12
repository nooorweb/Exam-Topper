import React, { useState, useMemo, useEffect } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Text } from '../../src/components/common';
import Svg, { Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NoteTopic, SubjectNotebook } from '../../src/data/notesData';
import { useApp } from '../../src/context/AppContext';
import { router, useLocalSearchParams, useFocusEffect, Router } from 'expo-router';
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
  Zap,
  Target,
  BookMarked,
  Brain,
  Lightbulb,
} from 'lucide-react-native';
import { launchNoteQuiz } from '../../src/utils/noteQuizLauncher';

export default function NotesScreen() {
  const { currentTheme, subjectNotebooks, examFocus } = useApp();
  const isDark = currentTheme === 'dark';
  const SUBJECT_NOTEBOOKS = subjectNotebooks;

  const [activeSubject, setActiveSubject] = useState<SubjectNotebook['subject']>('English');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Syllabus progress checklist state
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>([]);
  const [checkedPoints, setCheckedPoints] = useState<Record<string, boolean>>({});

  // Personalization exam focus states
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

  // Load progress & exam focus when tab screen gets focus or mounts
  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;
      const loadData = async () => {
        try {
          const savedCompleted = await AsyncStorage.getItem('smart_prep_completed_notes');
          if (savedCompleted && isMounted) {
            setCompletedTopicIds(JSON.parse(savedCompleted));
          }
          const savedChecked = await AsyncStorage.getItem('smart_prep_checked_points');
          if (savedChecked && isMounted) {
            setCheckedPoints(JSON.parse(savedChecked));
          }

        } catch (_) {}
      };
      loadData();
      return () => {
        isMounted = false;
      };
    }, [])
  );

  const params = useLocalSearchParams();
  const focusTopicId = params?.focusTopicId;
  const focusSubject = params?.subject;

  useEffect(() => {
    if (focusTopicId) {
      setSelectedTopicId(focusTopicId as string);
      if (focusSubject) {
        setActiveSubject(focusSubject as any);
      }
    }
  }, [focusTopicId, focusSubject]);

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
  }, [SUBJECT_NOTEBOOKS]);

  const overallMasteryPercentage = useMemo(() => {
    if (totalTopicsCount === 0) return 0;
    return Math.round((completedTopicIds.length / totalTopicsCount) * 100);
  }, [completedTopicIds, totalTopicsCount]);

  const activeNotebook = useMemo(() => {
    return SUBJECT_NOTEBOOKS.find((n) => n.subject === activeSubject);
  }, [activeSubject, SUBJECT_NOTEBOOKS]);

  const filteredTopics = useMemo(() => {
    if (!activeNotebook) return [];
    return activeNotebook.topics;
  }, [activeNotebook]);

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
  }, [searchQuery, SUBJECT_NOTEBOOKS]);

  const getSubjectIcon = (sub: SubjectNotebook['subject'], color: string, size: number = 18) => {
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
      {/* Syllabus Progress Card - Enhanced */}
      <View style={[styles.card, dynamicStyles.card, { padding: 20, borderRadius: 18 }]}>
        <View style={styles.progressHeader}>
          <View style={styles.progressInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Zap size={18} color={colors.primary} />
              <Text style={[styles.progressTitle, dynamicStyles.text]}>LEARNING PROGRESS</Text>
            </View>
            <Text style={[styles.progressSubtitle, dynamicStyles.textMuted]}>
              {completedTopicIds.length} of {totalTopicsCount} topics mastered • {overallMasteryPercentage}% complete
            </Text>
          </View>
          <View style={styles.progressRingOuter}>
            <Svg width={64} height={64}>
              <Circle
                cx={32}
                cy={32}
                r={26}
                stroke={isDark ? '#27272a' : '#f3f4f6'}
                strokeWidth={5}
                fill="transparent"
              />
              <Circle
                cx={32}
                cy={32}
                r={26}
                stroke={colors.primary}
                strokeWidth={5}
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={2 * Math.PI * 26 * (1 - overallMasteryPercentage / 100)}
                strokeLinecap="round"
                fill="transparent"
                origin="32, 32"
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
          <TouchableOpacity onPress={handleResetProgress} style={[styles.btnReset, { marginTop: 12 }]}>
            <RotateCcw size={14} color={colors.textMuted} />
            <Text style={[styles.btnResetText, dynamicStyles.textMuted]}>Reset Progress</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Global Notes Search Bar - Enhanced */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Search size={18} color={colors.textMuted} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search notes, formulas, topics..."
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, dynamicStyles.text]}
        />
      </View>

      {/* Search Discoveries Board */}
      {searchQuery.trim().length > 0 ? (
        <View style={styles.topicsStack}>
          <Text style={[styles.sectionTitle, dynamicStyles.textMuted]}>
            🔍 SEARCH RESULTS ({searchedTopics.length})
          </Text>
          {searchedTopics.length === 0 ? (
            <View style={[styles.emptySearchCard, dynamicStyles.card]}>
              <Lightbulb size={32} color={colors.primary} opacity={0.5} />
              <Text style={[styles.emptySearchTitle, dynamicStyles.text]}>No matches found</Text>
              <Text style={[styles.emptySearchSub, dynamicStyles.textMuted]}>
                Try keywords like "Prepositions", "Probability", or "Independence"
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
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <View style={{ padding: 6, backgroundColor: isDark ? '#1c1c1f' : '#f3f4f6', borderRadius: 8 }}>
                          {getSubjectIcon(subject, colors.primary, 14)}
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
                      {isCompleted && <Check size={12} color="#fff" />}
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
                        router={router}
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
          {/* Horizontal Tab bar for active Subject - Enhanced */}
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
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={`${sub} Subject Tab`}
                  style={[
                    styles.tabButton,
                    {
                      backgroundColor: isActive ? colors.primary : colors.card,
                      borderColor: isActive ? colors.primary : colors.border,
                    },
                  ]}
                >
                  {getSubjectIcon(sub, isActive ? '#ffffff' : colors.textMuted, 16)}
                  <Text style={[styles.tabButtonText, { color: isActive ? '#ffffff' : colors.text }]}>
                    {sub}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Active Notebook banner description - Enhanced */}
          {activeNotebook && (
            <View style={[styles.card, dynamicStyles.card, { padding: 16, borderRadius: 16, marginBottom: 16 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                <View style={{ paddingTop: 2 }}>
                  {getSubjectIcon(activeSubject, colors.primary, 20)}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.deskLabel, dynamicStyles.text]}>{activeSubject} Desk</Text>
                  <Text style={[styles.deskSub, dynamicStyles.textMuted]}>{activeNotebook.description}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Topics Accordion Stack - Enhanced */}
          {activeNotebook && (
            <View style={styles.topicsStack}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <BookOpen size={14} color={colors.textMuted} />
                <Text style={[styles.sectionTitle, dynamicStyles.textMuted, { marginBottom: 0 }]}>
                  TOPICS TO MASTER ({filteredTopics.length})
                </Text>
              </View>
              {filteredTopics.length === 0 ? (
                <View style={[styles.emptySearchCard, dynamicStyles.card, { marginTop: 12 }]}>
                  <BookOpen size={32} color={colors.textMuted} opacity={0.6} />
                  <Text style={[styles.emptySearchTitle, dynamicStyles.text, { fontSize: 16, textAlign: 'center' }]}>
                    No topics found
                  </Text>
                  <Text style={[styles.emptySearchSub, dynamicStyles.textMuted, { fontSize: 13, textAlign: 'center' }]}>
                    This subject doesn't contain any topics yet.
                  </Text>
                </View>
              ) : (
                filteredTopics.map((topic) => {
                  const isOpen = selectedTopicId === topic.id;
                  const isCompleted = completedTopicIds.includes(topic.id);

                  return (
                    <View key={topic.id} style={[styles.topicWrapper, dynamicStyles.card]}>
                      <TouchableOpacity
                        onPress={() => setSelectedTopicId(isOpen ? null : topic.id)}
                        accessibilityRole="button"
                        accessibilityState={{ expanded: isOpen }}
                        accessibilityLabel={`Toggle details for ${topic.title}`}
                        style={styles.topicHeader}
                      >
                        <View style={{ flex: 1, paddingRight: 8 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <View
                              style={[
                                styles.importanceTag,
                                {
                                  backgroundColor:
                                    topic.importance === 'critical'
                                      ? '#fee2e2'
                                      : topic.importance === 'high'
                                      ? '#ffedd5'
                                      : '#f3f4f6',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  gap: 4,
                                },
                              ]}
                            >
                              {topic.importance === 'critical' && <Zap size={11} color="#ef4444" fill="#ef4444" />}
                              {topic.importance === 'high' && <Sparkles size={11} color="#f97316" />}
                              {topic.importance === 'medium' && <BookOpen size={11} color="#4b5563" />}
                              <Text
                                style={{
                                  color:
                                    topic.importance === 'critical'
                                      ? '#ef4444'
                                      : topic.importance === 'high'
                                      ? '#f97316'
                                      : '#4b5563',
                                  fontSize: 10,
                                  fontWeight: '800',
                                }}
                              >
                                {topic.importance === 'critical'
                                  ? 'MUST KNOW'
                                  : topic.importance === 'high'
                                  ? 'HIGH'
                                  : 'MEDIUM'}
                              </Text>
                            </View>

                            <View style={styles.timeTag}>
                              <Clock size={13} color={colors.textMuted} />
                              <Text style={[styles.timeTagText, dynamicStyles.textMuted]}>
                                {topic.estimatedReadTime}m
                              </Text>
                            </View>
                          </View>

                          <Text style={[styles.topicTitleText, dynamicStyles.text]}>{topic.title}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <TouchableOpacity
                            onPress={() => toggleTopicCompletion(topic.id)}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: isCompleted }}
                            accessibilityLabel={`Mark ${topic.title} as confident`}
                            style={[
                              styles.checkboxCircle,
                              {
                                backgroundColor: isCompleted ? colors.success : 'transparent',
                                borderColor: isCompleted ? colors.success : colors.borderAccent,
                              },
                            ]}
                          >
                            {isCompleted && <Check size={10} color="#fff" />}
                          </TouchableOpacity>

                          {isOpen ? (
                            <ChevronUp size={18} color={colors.textMuted} />
                          ) : (
                            <ChevronDown size={18} color={colors.textMuted} />
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
                            router={router}
                          />
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

// Topic Details Renderer component - Enhanced with better reading layout
function TopicDetails({
  topic,
  subject,
  isCompleted,
  toggleComplete,
  checkedPoints,
  toggleLineItem,
  colors,
  isDark,
  router: routerProp,
}: {
  topic: NoteTopic;
  subject: string;
  isCompleted: boolean;
  toggleComplete: () => void;
  checkedPoints: Record<string, boolean>;
  toggleLineItem: (key: string) => void;
  colors: any;
  isDark: boolean;
  router: Router;
}) {
  const [readingMode, setReadingMode] = useState<'read' | 'test'>('read');

  return (
    <View style={styles.detailsContent}>
      {/* Reading Mode Toggle - New */}
      <View style={styles.modeToggleContainer}>
        <TouchableOpacity
          onPress={() => setReadingMode('read')}
          accessibilityRole="tab"
          accessibilityState={{ selected: readingMode === 'read' }}
          accessibilityLabel="Read Mode Content"
          style={[
            styles.modeButton,
            {
              backgroundColor: readingMode === 'read' ? colors.primary : 'transparent',
              borderBottomColor: readingMode === 'read' ? colors.primary : colors.border,
            },
          ]}
        >
          <BookMarked size={16} color={readingMode === 'read' ? '#fff' : colors.textMuted} />
          <Text
            style={{
              color: readingMode === 'read' ? '#fff' : colors.text,
              fontSize: 14,
              fontWeight: '600',
            }}
          >
            Read
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setReadingMode('test')}
          accessibilityRole="tab"
          accessibilityState={{ selected: readingMode === 'test' }}
          accessibilityLabel="Practice Test Mode"
          style={[
            styles.modeButton,
            {
              backgroundColor: readingMode === 'test' ? colors.primary : 'transparent',
              borderBottomColor: readingMode === 'test' ? colors.primary : colors.border,
            },
          ]}
        >
          <Brain size={16} color={readingMode === 'test' ? '#fff' : colors.textMuted} />
          <Text
            style={{
              color: readingMode === 'test' ? '#fff' : colors.text,
              fontSize: 14,
              fontWeight: '600',
            }}
          >
            Test
          </Text>
        </TouchableOpacity>
      </View>

      {readingMode === 'read' ? (
        <>
          {/* Introduction - Improved Typography */}
          <View style={[styles.readingSection, { backgroundColor: isDark ? '#1a1a1d' : '#f5f5f7', borderRadius: 14, padding: 14 }]}>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
              <BookOpen size={16} color={colors.primary} />
              <Text style={[styles.readingSectionTitle, { color: colors.primary }]}>Overview</Text>
            </View>
            <Text style={[styles.overviewText, { color: colors.text, lineHeight: 22 }]}>{topic.overview}</Text>
          </View>

          {/* Key Points - Styled Reading View */}
          <View style={[styles.checklistCard, { backgroundColor: isDark ? '#18181b' : '#f9fafb', borderColor: colors.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Sparkles size={18} color={colors.primary} />
              <Text style={[styles.checklistHeader, { color: colors.text, fontSize: 16, fontWeight: '700' }]}>
                Key Points
              </Text>
            </View>

            <View style={styles.checklistItems}>
              {topic.keyPoints.map((pt, i) => {
                const colonIndex = pt.indexOf(':');
                const hasTitle = colonIndex !== -1;
                const title = hasTitle ? pt.substring(0, colonIndex).trim() : '';
                const detail = hasTitle ? pt.substring(colonIndex + 1).trim() : pt;

                return (
                  <View
                    key={i}
                    style={[
                      styles.checkItemRow,
                      {
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                      },
                    ]}
                  >
                    {/* Purple dot on left */}
                    <View style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: colors.primary,
                      marginTop: 6,
                      marginRight: 12,
                      shadowColor: colors.primary,
                      shadowOpacity: 0.5,
                      shadowRadius: 3,
                      elevation: 2,
                    }} />
                    
                    <View style={{ flex: 1 }}>
                      {hasTitle && (
                        <Text style={{
                          fontSize: 14,
                          fontWeight: '700',
                          color: colors.text,
                          marginBottom: 3,
                        }}>
                          {title}
                        </Text>
                      )}
                      <Text style={{
                        fontSize: 13,
                        color: colors.textMuted,
                        lineHeight: 19,
                      }}>
                        {detail}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Formulas if math - Improved */}
          {topic.formulas && topic.formulas.length > 0 && (
            <View style={styles.detailSection}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Target size={18} color={colors.primary} />
                <Text style={[styles.sectionLabel, { color: colors.text, fontSize: 14, fontWeight: '700' }]}>
                  Formulas & Applications
                </Text>
              </View>
              <View style={styles.formulasStack}>
                {topic.formulas.map((frm, idx) => (
                  <View key={idx} style={[styles.formulaCard, { backgroundColor: isDark ? '#1a1b2e' : '#eef2ff', borderColor: colors.border }]}>
                    <View style={styles.formulaHeader}>
                      <Text style={[styles.formulaName, { color: colors.primary, fontSize: 14 }]}>{frm.name}</Text>
                      <View style={styles.equationTag}>
                        <Text style={{ color: '#a5b4fc', fontSize: 10, fontWeight: '600' }}>Eq</Text>
                      </View>
                    </View>
                    <View style={[styles.equationBox, { backgroundColor: isDark ? '#131422' : '#dbeafe' }]}>
                      <Text style={styles.equationText}>{frm.equation}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <Lightbulb size={14} color={colors.warning} />
                      <Text style={[styles.formulaAppText, { color: colors.text, lineHeight: 18 }]}>
                        {frm.application}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Lookup Tables - Improved */}
          {topic.tables && topic.tables.length > 0 && (
            <View style={styles.detailSection}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <BookOpen size={18} color={colors.primary} />
                <Text style={[styles.sectionLabel, { color: colors.text, fontSize: 14, fontWeight: '700' }]}>
                  Timeline & Reference
                </Text>
              </View>
              {topic.tables.map((table, tIdx) => (
                <ScrollView
                  key={tIdx}
                  horizontal
                  showsHorizontalScrollIndicator={true}
                  contentContainerStyle={{ flexGrow: 1 }}
                  style={{ borderRadius: 12, marginBottom: 12 }}
                >
                  <View style={[styles.tableBorder, { borderColor: colors.border, minWidth: Math.max(300, table.headers.length * 115) }]}>
                    {/* Header Row */}
                    <View style={[styles.tableHeaderRow, { backgroundColor: isDark ? '#27272a' : '#e5e7eb' }]}>
                      {table.headers.map((h, hIdx) => (
                        <View key={hIdx} style={styles.tableHeaderCol}>
                          <Text style={[styles.tableHeaderCellText, { color: colors.text, fontSize: 12, fontWeight: '700' }]}>{h}</Text>
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
                            <Text style={[styles.tableCellText, { color: colors.text, fontSize: 13 }]}>{val}</Text>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                </ScrollView>
              ))}
            </View>
          )}

          {/* Analyst Insights */}
          <View style={[styles.insightCard, { backgroundColor: isDark ? '#201b17' : '#fffbeb', borderColor: isDark ? '#332200' : '#fef3c7' }]}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Lightbulb size={18} color={colors.warning} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.insightTitle, { color: colors.warning, fontSize: 14, fontWeight: '700' }]}>
                  Exam Strategy
                </Text>
                <Text style={[styles.insightText, { color: colors.text, lineHeight: 20 }]}>
                  {topic.content}
                </Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        // Test Mode - Knowledge Check
        <KnowledgeTest topic={topic} colors={colors} isDark={isDark} />
      )}

      {/* Topic Action Panel */}
      <View style={[styles.topicActions, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          onPress={toggleComplete}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompleted }}
          accessibilityLabel={`Mark topic ${topic.title} as confident`}
          style={[
            styles.btnMarkComplete,
            {
              backgroundColor: isCompleted ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5') : colors.card,
              borderColor: isCompleted ? colors.success : colors.borderAccent,
            },
          ]}
        >
          <CheckCircle size={14} color={isCompleted ? colors.success : colors.textMuted} />
          <Text
            style={[
              styles.btnMarkCompleteText,
              {
                color: isCompleted ? colors.success : colors.text,
                fontWeight: isCompleted ? 'bold' : 'normal',
                fontSize: 13,
              },
            ]}
          >
            {isCompleted ? 'Confident ✓' : 'Mark Confident'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            const result = await launchNoteQuiz(topic.id, topic.title, routerProp, subject);
            if (result === 'no_mcqs') {
              // Fallback: generic subject quiz when no note-specific MCQs exist
              routerProp.push({
                pathname: '/quiz-session',
                params: { category: subject, limit: 10, difficulty: 'All' },
              });
            }
          }}
          accessibilityRole="button"
          accessibilityLabel={`Start practice quiz for ${topic.title}`}
          style={[styles.btnStartTest, { backgroundColor: colors.primary }]}
        >
          <Play size={12} color="#fff" fill="#fff" />
          <Text style={styles.btnStartTestText}>Quiz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Knowledge Test Component - Interactive testing
function KnowledgeTest({
  topic,
  colors,
  isDark,
}: {
  topic: NoteTopic;
  colors: any;
  isDark: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isAdvancing, setIsAdvancing] = useState(false);

  // Generate simple MCQs from key points
  const questions = topic.keyPoints.slice(0, 3).map((point, i) => ({
    id: i,
    question: `Which of the following relates to: "${topic.keyPoints[i].substring(0, 50)}..."?`,
    options: [topic.keyPoints[i], topic.keyPoints[(i + 1) % topic.keyPoints.length], 'All of the above', 'None of these'],
    correct: 0,
  }));

  if (currentIndex >= questions.length) {
    const correctCount = answers.filter((ans, i) => ans === questions[i].correct).length;
    const percentage = Math.round((correctCount / questions.length) * 100);

    return (
      <View style={{ gap: 16, alignItems: 'center', paddingVertical: 24 }}>
        <View style={{ alignItems: 'center' }}>
          <Brain size={48} color={colors.success} opacity={0.8} />
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.success, marginTop: 12, marginBottom: 8 }}>
            {percentage}%
          </Text>
          <Text style={{ fontSize: 16, color: colors.text, fontWeight: '600' }}>
            {percentage >= 70 ? '🎉 Excellent!' : percentage >= 50 ? '👍 Good!' : '📖 Review again'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setCurrentIndex(0);
            setAnswers([]);
            setIsAdvancing(false);
          }}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Retake Test</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const q = questions[currentIndex];

  const handleOptionSelect = (optionIdx: number) => {
    if (isAdvancing) return;
    
    setIsAdvancing(true);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIdx;
    setAnswers(newAnswers);

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAdvancing(false);
    }, 650);
  };

  return (
    <View style={{ gap: 16 }}>
      <View>
        <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>
          Question {currentIndex + 1} of {questions.length}
        </Text>
        <View style={{ height: 4, backgroundColor: colors.borderAccent, borderRadius: 2, overflow: 'hidden' }}>
          <View
            style={{
              height: '100%',
              backgroundColor: colors.primary,
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </View>
      </View>

      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, lineHeight: 22 }}>
        {q.question}
      </Text>

      <View style={{ gap: 10 }}>
        {q.options.map((opt, i) => {
          const isSelected = answers[currentIndex] === i;
          const isCorrect = i === q.correct;

          return (
            <TouchableOpacity
              key={i}
              onPress={() => handleOptionSelect(i)}
              disabled={isAdvancing}
              style={[
                {
                  borderRadius: 12,
                  padding: 14,
                  borderWidth: 2,
                  borderColor: isSelected
                    ? isCorrect
                      ? colors.success
                      : colors.danger
                    : colors.border,
                  backgroundColor: isSelected
                    ? isCorrect
                      ? isDark
                        ? 'rgba(16, 185, 129, 0.1)'
                        : '#ecfdf5'
                      : isDark
                      ? 'rgba(239, 68, 68, 0.1)'
                      : '#fee2e2'
                    : 'transparent',
                },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: isSelected ? (isCorrect ? colors.success : colors.danger) : colors.border,
                    backgroundColor: isSelected
                      ? isCorrect
                        ? colors.success
                        : colors.danger
                      : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isSelected && <Check size={12} color="#fff" />}
                </View>
                <Text style={{ color: colors.text, fontSize: 14, flex: 1 }}>{opt}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
    gap: 16,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  progressSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  progressRingOuter: {
    position: 'relative',
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentText: {
    fontSize: 16,
    fontWeight: '700',
  },
  btnReset: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnResetText: {
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  horizontalTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  deskLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  deskSub: {
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
  topicsStack: {
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  emptySearchCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  emptySearchTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptySearchSub: {
    fontSize: 14,
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
    padding: 16,
  },
  importanceTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  topicTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  topicTitleText: {
    fontSize: 18,
    fontWeight: '700',
  },
  checkboxCircle: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicDetailsContainer: {
    borderTopWidth: 1,
    padding: 0,
  },
  detailsContent: {
    padding: 16,
    gap: 14,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderBottomWidth: 3,
  },
  readingSection: {
    gap: 8,
  },
  readingSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  detailSection: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  overviewText: {
    fontSize: 15,
  },
  checklistCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  checklistHeader: {
    fontSize: 16,
    fontWeight: '600',
  },
  checklistItems: {
    gap: 10,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  pointCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkItemText: {
    fontSize: 14,
    flex: 1,
  },
  formulasStack: {
    gap: 10,
  },
  formulaCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  formulaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formulaName: {
    fontWeight: '700',
  },
  equationTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  equationBox: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  equationText: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '700',
    color: '#1e40af',
  },
  formulaAppText: {
    fontSize: 13,
  },
  tableBorder: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  tableHeaderCol: {
    flex: 1,
    paddingHorizontal: 10,
  },
  tableHeaderCellText: {
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  tableCol: {
    flex: 1,
    paddingHorizontal: 10,
  },
  tableCellText: {
    lineHeight: 16,
  },
  insightCard: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  insightTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  insightText: {
    fontSize: 14,
  },
  topicActions: {
    borderTopWidth: 1,
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  btnMarkComplete: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnMarkCompleteText: {
    fontWeight: '600',
  },
  btnStartTest: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnStartTestText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  subjectTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

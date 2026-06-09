import React, { useMemo, useState, useRef } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Text, Card, SectionHeader } from '../../src/components/common';
import { useApp } from '../../src/context/AppContext';
import { GeminiService } from '../../src/services/gemini.service';
import {
  Award,
  Flame,
  Play,
  BookOpen,
  CheckCircle2,
  Trophy,
  Shield,
  Wifi,
  WifiOff,
  Image as ImageIcon,
  ChevronRight,
  BarChart3,
  Sparkles,
  Target,
  Bell,
} from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Rect } from 'react-native-svg';
import { triggerWebDownload } from '../../src/lib/wallpaperUtils';
import { SUBJECT_NOTEBOOKS } from '../../src/data/notesData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAnalytics } from '../../src/hooks/useAnalytics';
import { useRecommendations } from '../../src/hooks/useRecommendations';
import StreakCard from '../../src/components/dashboard/StreakCard';
import WeakAreasCard from '../../src/components/dashboard/WeakAreasCard';
import PerformanceTrendChart from '../../src/components/dashboard/PerformanceTrendChart';
import SuggestedQuizCard from '../../src/components/dashboard/SuggestedQuizCard';

const SUBJECT_CONFIGS: Record<string, { label: string; color: string }> = {
  'English': { label: 'ENG', color: '#60A5FA' },
  'General Knowledge': { label: 'GK', color: '#F59E0B' },
  'Pakistan Studies': { label: 'PAK', color: '#F87171' },
  'Computer Science': { label: 'CS', color: '#A78BFA' },
  'Mathematics': { label: 'MATH', color: '#34D399' },
  'Islamiat': { label: 'ISL', color: '#06b6d4' },
};

const renderMarkdownText = (markdownText: string, colors: any) => {
  const lines = markdownText.split('\n');
  return lines.map((line, i) => {
    // 1. Heading 1 / 2 / 3
    if (line.startsWith('#')) {
      const headingText = line.replace(/^#+\s*/, '');
      return (
        <Text key={i} style={{ fontSize: 16, fontWeight: 'bold', color: '#6366f1', marginTop: 16, marginBottom: 6 }}>
          {headingText}
        </Text>
      );
    }
    // 2. Bold bullet points (e.g., * **Title**: description)
    if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
      const cleaned = line.trim().substring(1).trim();
      const boldParts = cleaned.split('**');
      if (boldParts.length >= 3) {
        return (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 4, paddingLeft: 8 }}>
            <Text style={{ color: colors.primary, marginRight: 6 }}>•</Text>
            <Text style={{ flex: 1, fontSize: 13, lineHeight: 20, color: colors.text }}>
              <Text style={{ fontWeight: 'bold', color: colors.text }}>{boldParts[1]}</Text>
              {boldParts.slice(2).join('')}
            </Text>
          </View>
        );
      }
      return (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 4, paddingLeft: 8 }}>
          <Text style={{ color: colors.primary, marginRight: 6 }}>•</Text>
          <Text style={{ flex: 1, fontSize: 13, lineHeight: 20, color: colors.text }}>{cleaned}</Text>
        </View>
      );
    }
    // 3. Bold inline text (e.g. **text**)
    if (line.includes('**')) {
      const boldParts = line.split('**');
      return (
        <Text key={i} style={{ fontSize: 13, lineHeight: 20, color: colors.text, marginVertical: 4 }}>
          {boldParts.map((part, index) => {
            const isBold = index % 2 === 1;
            return (
              <Text key={index} style={isBold ? { fontWeight: 'bold' } : {}}>
                {part}
              </Text>
            );
          })}
        </Text>
      );
    }
    // 4. Standard paragraph
    if (line.trim() === '') return <View key={i} style={{ height: 8 }} />;
    return (
      <Text key={i} style={{ fontSize: 13, lineHeight: 20, color: colors.text, marginVertical: 4 }}>
        {line}
      </Text>
    );
  });
};

const matchesVocabFocus = (word: any, focus: string): boolean => {
  const catLower = (word.category || '').toLowerCase();
  if (focus === 'KPPSC & ETEA') {
    return catLower.includes('kppsc') || catLower.includes('etea') || catLower.includes('general') || catLower.includes('acronym');
  }
  if (focus === 'FIA Inspector') {
    return catLower.includes('fia') || catLower.includes('fpsc') || catLower.includes('general') || catLower.includes('acronym');
  }
  if (focus === 'CSS Descriptive') {
    return catLower.includes('css') || catLower.includes('fpsc') || catLower.includes('general') || catLower.includes('acronym');
  }
  if (focus === 'All Punjab/Sindh Boards') {
    return catLower.includes('pms') || catLower.includes('nts') || catLower.includes('general') || catLower.includes('acronym');
  }
  return true;
};

export default function DashboardScreen() {
  const {
    stats,
    vocab,
    mcqs,
    currentTheme,
    daySeed,
    autoDownloadWallpaper,
    setAutoDownloadWallpaper,
    user,
    profile,
    isNewDayDetected,
    setIsNewDayDetected,
  } = useApp();

  const isDark = currentTheme === 'dark';
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>([]);
  const [examFocus, setExamFocus] = useState<string>('General');
  const [isGeminiActive, setIsGeminiActive] = useState(false);
  const [aiCoachLoading, setAiCoachLoading] = useState(false);
  const [coachAnalysisText, setCoachAnalysisText] = useState('');
  const [showCoachModal, setShowCoachModal] = useState(false);

  // ── Analytics & Recommendations ──────────────────────────────────────────
  const {
    weakAreas,
    performanceTrend,
    summary: analyticsSummary,
    loading: analyticsLoading,
    refresh: refreshAnalytics,
  } = useAnalytics();

  const { suggested } = useRecommendations(mcqs, stats);

  // Load completed note topics, exam focus, and Gemini status on focus
  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;
      const loadData = async () => {
        try {
          const savedCompleted = await AsyncStorage.getItem('smart_prep_completed_notes');
          if (savedCompleted && isMounted) {
            setCompletedTopicIds(JSON.parse(savedCompleted));
          }
          const savedFocus = await AsyncStorage.getItem('smart_prep_focus');
          if (savedFocus && isMounted) {
            setExamFocus(savedFocus || 'General');
          }
          const key = await GeminiService.getApiKey();
          if (isMounted) {
            setIsGeminiActive(!!key);
          }
        } catch (_) {}
      };
      loadData();
      return () => {
        isMounted = false;
      };
    }, [])
  );

  // Compute today's focus topic based on daySeed and examFocus
  const todayFocusTopic = useMemo(() => {
    const allTopics: { topic: any; subject: string }[] = [];
    SUBJECT_NOTEBOOKS.forEach(notebook => {
      notebook.topics.forEach(topic => {
        const matchesFocus =
          !examFocus ||
          examFocus === 'General' ||
          !topic.examTargets ||
          topic.examTargets.includes(examFocus);

        if (matchesFocus) {
          allTopics.push({ topic, subject: notebook.subject });
        }
      });
    });
    
    // Fallback to all topics if filter leaves nothing
    if (allTopics.length === 0) {
      SUBJECT_NOTEBOOKS.forEach(notebook => {
        notebook.topics.forEach(topic => {
          allTopics.push({ topic, subject: notebook.subject });
        });
      });
    }

    if (allTopics.length === 0) return null;
    const idx = daySeed % allTopics.length;
    return allTopics[idx];
  }, [daySeed, examFocus]);

  // Compute progress for each subject
  const subjectProgress = useMemo(() => {
    const progress: Record<string, { completed: number; total: number; percent: number }> = {};
    SUBJECT_NOTEBOOKS.forEach(notebook => {
      const sub = notebook.subject;
      const topics = notebook.topics;
      const total = topics.length;
      const completed = topics.filter(t => completedTopicIds.includes(t.id)).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      progress[sub] = { completed, total, percent };
    });
    return progress;
  }, [completedTopicIds]);

  const colors = {
    bg: isDark ? '#0E1117' : '#f9fafb',
    card: isDark ? '#161B27' : '#ffffff',
    text: isDark ? '#e1e2eb' : '#1f2937',
    textMuted: isDark ? '#c8c4d6' : '#6b7280',
    border: isDark ? '#2A2D3A' : '#f3f4f6',
    borderAccent: isDark ? '#2A2D3A' : '#e5e7eb',
    primary: '#7C6FF0',
    primaryDark: '#594aca',
    accent: '#F59E0B',
    success: '#10B981',
    danger: '#ef4444',
  };

  // Compile today's 3 deterministic learning words
  const todayDraftWords = useMemo(() => {
    if (vocab.length === 0) return [];
    const englishWords = vocab.filter(w => w.category !== 'Exam Acronym' && w.id.startsWith('vocab'));
    const acronyms = vocab.filter(w => w.category === 'Exam Acronym' || w.id.startsWith('acronym'));
    if (englishWords.length === 0 || acronyms.length === 0) {
      return vocab.slice(0, 3);
    }
    const selected = [];
    for (let i = 0; i < 2; i++) {
      const idx = (daySeed + i) % englishWords.length;
      selected.push(englishWords[idx]);
    }
    const aIdx = daySeed % acronyms.length;
    selected.push(acronyms[aIdx]);
    return selected.filter(Boolean);
  }, [vocab, daySeed]);

  const accuracyText = useMemo(() => {
    if (stats.totalQuestionsAnswered === 0) return '0%';
    const pct = (stats.correctAnswersCount / stats.totalQuestionsAnswered) * 100;
    return `${Math.round(pct)}%`;
  }, [stats]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleQuickStartQuiz = () => {
    router.push({
      pathname: '/quiz-session',
      params: { category: 'mixed', limit: 10, difficulty: 'All' },
    });
  };

  const handleCategoryStart = (category: string) => {
    router.push({
      pathname: '/quiz-session',
      params: { category, limit: 10, difficulty: 'All' },
    });
  };

  const handleSuggestedQuiz = (category: string, _mcqIds: string[]) => {
    const target = category === 'mixed' ? 'mixed' : category;
    router.push({
      pathname: '/quiz-session',
      params: { category: target, limit: 10, difficulty: 'All' },
    });
  };

  const handlePracticeWeakArea = (category: string) => {
    router.push({
      pathname: '/quiz-session',
      params: { category, limit: 10, difficulty: 'All' },
    });
  };

  // Compile today's 2 deterministic wallpaper vocabulary words
  const todayWallpaperWords = useMemo(() => {
    const englishWords = vocab.filter(w => w.category !== 'Exam Acronym' && w.id.startsWith('vocab'));
    if (englishWords.length === 0) {
      return vocab.slice(0, 2);
    }
    const selected = [];
    for (let i = 0; i < 2; i++) {
      const idx = (daySeed + i) % englishWords.length;
      selected.push(englishWords[idx]);
    }
    return selected.filter(Boolean);
  }, [vocab, daySeed]);

  const [isQuickDownloading, setIsQuickDownloading] = useState(false);
  const quickDownloadRef = useRef<ViewShot>(null);

  const handleQuickDownload = async () => {
    if (Platform.OS === 'web') {
      setIsQuickDownloading(true);
      const success = triggerWebDownload(todayWallpaperWords, 0, 'sans-serif', true, true, 'mobile');
      setIsQuickDownloading(false);
      if (success) {
        showToast("Mobile Lockscreen Wallpaper downloaded! 📱");
      }
    } else {
      setIsQuickDownloading(true);
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'We need access to your photos to save the daily wallpaper.'
          );
          setIsQuickDownloading(false);
          return;
        }

        if (quickDownloadRef.current) {
          const uri = await captureRef(quickDownloadRef, {
            format: 'png',
            quality: 1.0,
          });
          await MediaLibrary.saveToLibraryAsync(uri);
          showToast("Daily Lockscreen Wallpaper saved to gallery! 🎉");
        }
      } catch (e) {
        console.error(e);
        Alert.alert('Download Error', 'Could not save today\'s wallpaper.');
      } finally {
        setIsQuickDownloading(false);
      }
    }
  };

  // Daily Auto-Download & Notification Alert
  React.useEffect(() => {
    if (isNewDayDetected) {
      if (autoDownloadWallpaper) {
        showToast("New Day! Auto-downloading today's Vocabulary Wallpaper... 📥");
        setTimeout(() => {
          handleQuickDownload();
        }, 1500);
      } else {
        Alert.alert(
          '📅 New Vocabulary Drop!',
          "A new day has started! Today's high-yield vocabulary words are available. Would you like to check out the Wallpaper Studio to preview and download today's wallpapers?",
          [
            { text: 'Skip' },
            {
              text: 'Open Studio',
              onPress: () => router.push('/wallpaper'),
            },
          ]
        );
      }
      setIsNewDayDetected(false);
    }
  }, [isNewDayDetected]);
  const handleAnalyzeProgress = async () => {
    if (aiCoachLoading) return;
    setAiCoachLoading(true);
    try {
      const text = await GeminiService.analyzeProgress(stats, examFocus, weakAreas);
      setCoachAnalysisText(text);
      setShowCoachModal(true);
    } catch (e: any) {
      console.error(e);
      Alert.alert('AI Coach Offline', e.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setAiCoachLoading(false);
    }
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

  return (
    <ScrollView style={[styles.container, dynamicStyles.container]} contentContainerStyle={styles.content}>
      
      {/* Toast Notification Alert */}
      {toastMsg && (
        <View style={styles.toast}>
          <CheckCircle2 size={14} color="#a5b4fc" />
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      )}

      {/* Top App Bar Header Row */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 4,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 9, fontWeight: '700', color: colors.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>
            EXAM TOPPER
          </Text>
          <Text style={{ fontSize: 22, fontWeight: '700', color: colors.primary, marginTop: 2 }}>
            Hey, {profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Aspirant'}! 👋
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => showToast("No new notifications")}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 0.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bell size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Status Pills Horizontal Row */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ gap: 10, paddingBottom: 4 }}
      >
        {/* Streak Pill */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderColor: 'rgba(245, 158, 11, 0.2)',
          borderWidth: 1,
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 6,
        }}>
          <Flame size={12} color="#F59E0B" fill="#F59E0B" />
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#F59E0B' }}>
            {stats.streak}d Streak
          </Text>
        </View>

        {/* Live Sync / Offline Toggle Pill */}
        <TouchableOpacity
          onPress={() => {
            setSimulatedOffline(!simulatedOffline);
            showToast(
              simulatedOffline
                ? 'Connected to online KPPSC mock engine!'
                : 'Offline Mode Active! Loaded directly from local SQLite block.'
            );
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: simulatedOffline ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            borderColor: simulatedOffline ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <View style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: simulatedOffline ? '#F59E0B' : '#10B981',
          }} />
          <Text style={{ fontSize: 11, fontWeight: '600', color: simulatedOffline ? '#F59E0B' : '#10B981' }}>
            {simulatedOffline ? 'Offline Mode' : 'Live Sync'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Stats Row Card */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 0.5,
        borderRadius: 16,
        padding: 16,
        marginBottom: 4,
      }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text }}>
            {stats.totalQuestionsAnswered}
          </Text>
          <Text style={{ fontSize: 8, fontWeight: '600', color: colors.textMuted, marginTop: 4, letterSpacing: 0.5 }}>
            PRACTICED
          </Text>
        </View>
        <View style={{ width: 0.5, height: 40, backgroundColor: colors.border }} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary }}>
            {accuracyText}
          </Text>
          <Text style={{ fontSize: 8, fontWeight: '600', color: colors.textMuted, marginTop: 4, letterSpacing: 0.5 }}>
            ACCURACY
          </Text>
        </View>
        <View style={{ width: 0.5, height: 40, backgroundColor: colors.border }} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text }}>
            {mcqs.length}
          </Text>
          <Text style={{ fontSize: 8, fontWeight: '600', color: colors.textMuted, marginTop: 4, letterSpacing: 0.5 }}>
            MCQS READY
          </Text>
        </View>
      </View>

      {/* Today's Focus Card */}
      {todayFocusTopic && (
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/notes',
              params: { focusTopicId: todayFocusTopic.topic.id, subject: todayFocusTopic.subject },
            });
          }}
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 0.5,
            borderRadius: 16,
            padding: 16,
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 4,
          }}
        >
          {/* Accent vertical line on the left edge */}
          <View style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: '#F59E0B',
          }} />

          {/* Top header row inside card */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 8,
            marginBottom: 10,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} color={colors.textMuted} />
              <Text style={{ fontSize: 9, fontWeight: '700', color: colors.textMuted, letterSpacing: 1 }}>
                TODAY'S FOCUS
              </Text>
            </View>
            <View style={{
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderColor: 'rgba(245, 158, 11, 0.2)',
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}>
              <Text style={{ fontSize: 8, fontWeight: '700', color: '#F59E0B' }}>
                {todayFocusTopic.topic.importance?.toUpperCase() || 'HIGH'}
              </Text>
            </View>
          </View>

          {/* Content details */}
          <View style={{ paddingLeft: 8, marginBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 }} numberOfLines={1}>
              {todayFocusTopic.topic.title}
            </Text>
            <Text style={{ fontSize: 11, color: colors.textMuted }}>
              {todayFocusTopic.subject} · {todayFocusTopic.topic.estimatedReadTime || 7} min read
            </Text>
          </View>

          {/* Read button container */}
          <View style={{ paddingLeft: 8, flexDirection: 'row', justifyContent: 'flex-end' }}>
            <View style={{
              backgroundColor: 'rgba(124, 111, 240, 0.15)',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 6,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary }}>
                Read
              </Text>
              <ChevronRight size={12} color={colors.primary} />
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Practice by Subject Header */}
      <Text style={{
        fontSize: 10,
        fontWeight: '700',
        color: colors.textMuted,
        letterSpacing: 1.5,
        marginBottom: 8,
        marginTop: 12,
        paddingLeft: 4,
      }}>
        PRACTICE BY SUBJECT
      </Text>

      {/* 2-Column Grid for the first 4 subjects */}
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
      }}>
        {SUBJECT_NOTEBOOKS.slice(0, 4).map((notebook) => {
          const sub = notebook.subject;
          const config = SUBJECT_CONFIGS[sub] || { label: sub.substring(0, 3).toUpperCase(), color: colors.primary };
          const progress = subjectProgress[sub] || { completed: 0, total: 0, percent: 0 };
          return (
            <TouchableOpacity
              key={sub}
              onPress={() => handleCategoryStart(sub)}
              style={{
                width: '48%',
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 0.5,
                borderRadius: 12,
                padding: 12,
                minHeight: 100,
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <View style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 3,
                backgroundColor: config.color,
              }} />

              <View style={{ paddingLeft: 6 }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 4,
                }}>
                  <Text style={{ fontSize: 9, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.5 }}>
                    {config.label}
                  </Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, lineHeight: 18 }} numberOfLines={2}>
                  {sub}
                </Text>
              </View>

              <View style={{ paddingLeft: 6, marginTop: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ fontSize: 8, color: colors.textMuted }}>
                    {progress.completed}/{progress.total} done
                  </Text>
                  <Text style={{ fontSize: 8, fontWeight: '700', color: config.color }}>
                    {progress.percent}%
                  </Text>
                </View>
                <View style={{ height: 3, backgroundColor: 'rgba(128,128,128,0.15)', borderRadius: 1.5, overflow: 'hidden' }}>
                  <View style={{ height: '100%', backgroundColor: config.color, width: `${progress.percent}%` }} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Full-width Cards for remaining subjects (e.g. CS, Islamiat) */}
      <View style={{ gap: 10, marginTop: 10 }}>
        {SUBJECT_NOTEBOOKS.slice(4).map((notebook) => {
          const sub = notebook.subject;
          const config = SUBJECT_CONFIGS[sub] || { label: sub.substring(0, 3).toUpperCase(), color: colors.primary };
          const progress = subjectProgress[sub] || { completed: 0, total: 0, percent: 0 };
          return (
            <TouchableOpacity
              key={sub}
              onPress={() => handleCategoryStart(sub)}
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 0.5,
                borderRadius: 12,
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <View style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 3,
                backgroundColor: config.color,
              }} />

              <View style={{ paddingLeft: 8, flex: 1, marginRight: 16 }}>
                <Text style={{ fontSize: 8, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.5, marginBottom: 2 }}>
                  {config.label}
                </Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }} numberOfLines={1}>
                  {sub}
                </Text>
              </View>

              <View style={{ width: 120 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ fontSize: 8, color: colors.textMuted }}>
                    {progress.completed}/{progress.total} done
                  </Text>
                  <Text style={{ fontSize: 8, fontWeight: '700', color: config.color }}>
                    {progress.percent}%
                  </Text>
                </View>
                <View style={{ height: 3, backgroundColor: 'rgba(128,128,128,0.15)', borderRadius: 1.5, overflow: 'hidden' }}>
                  <View style={{ height: '100%', backgroundColor: config.color, width: `${progress.percent}%` }} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Prominent Full-Width Purple Quiz CTA Banner */}
      <TouchableOpacity
        onPress={handleQuickStartQuiz}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
          borderRadius: 16,
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
          marginVertical: 4,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Play size={18} color="#ffffff" fill="#ffffff" />
          </View>
          <View>
            <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '700' }}>
              Start Quick Quiz Challenge
            </Text>
            <Text style={{ color: '#e0e7ff', fontSize: 11, marginTop: 2 }}>
              10 mixed MCQs · 15s timer per question
            </Text>
          </View>
        </View>
        <ChevronRight size={20} color="#ffffff" />
      </TouchableOpacity>

      {/* ── AI STUDY COACH WIDGET ── */}
      <Card isDark={isDark} style={{ padding: 18, marginBottom: 4, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 0.5, borderRadius: 16 }}>
        <SectionHeader
          isDark={isDark}
          icon={<Sparkles size={13} color={colors.primary} />}
          title="GEMINI STUDY COACH"
        />
        {isGeminiActive ? (
          <View style={{ marginTop: 8, gap: 10 }}>
            <Text style={{ fontSize: 12, color: colors.textMuted, lineHeight: 18 }}>
              Your Gemini AI Coach is online. Click below to analyze your local error rates and study notebook completions to get a custom roadmap for the **{examFocus}** competitive exam.
            </Text>
            <TouchableOpacity
              onPress={handleAnalyzeProgress}
              disabled={aiCoachLoading}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: colors.primary,
                padding: 12,
                borderRadius: 12,
                marginTop: 4,
                minHeight: 44,
                opacity: aiCoachLoading ? 0.75 : 1,
              }}
            >
              <View style={{ gap: 8, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                {aiCoachLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Sparkles size={16} color="#ffffff" />
                )}
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>
                  {aiCoachLoading ? 'Generating Diagnostic Plan...' : 'Analyze My Progress'}
                </Text>
              </View>
              <ChevronRight size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ marginTop: 8, gap: 10 }}>
            <Text style={{ fontSize: 12, color: colors.textMuted, lineHeight: 18 }}>
              Get personal study guidance, negative marking minimization tips, and custom 20-question mock tests. Add your Gemini API Key in settings.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/settings')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: isDark ? '#1c1c1f' : '#f3f4f6',
                padding: 12,
                borderRadius: 12,
                marginTop: 4,
                minHeight: 44,
                borderWidth: 0.5,
                borderColor: colors.border,
              }}
            >
              <View style={{ gap: 8, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Sparkles size={16} color={colors.primary} />
                <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700' }}>
                  Activate AI Coach (Add API Key)
                </Text>
              </View>
              <ChevronRight size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        )}
      </Card>

      <View style={styles.analyticsSectionHeader}>
        <BarChart3 size={14} color={colors.primary} />
        <Text style={[styles.analyticsSectionTitle, { color: colors.textMuted }]}>YOUR ANALYTICS</Text>
        <View style={{ backgroundColor: colors.primary + '20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 6 }}>
          <Text style={{ fontSize: 9, fontWeight: '800', color: colors.primary }}>COMING SOON</Text>
        </View>
        {analyticsLoading && <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 'auto' }} />}
      </View>

      {/* Analytics Coming Soon Placeholder */}
      <View style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 0.5, borderRadius: 16, padding: 16, marginBottom: 4 }}>
        <View style={{ alignItems: 'center', padding: 20, backgroundColor: isDark ? '#0E1117' : '#f3f4f6', borderRadius: 12 }}>
          <BarChart3 size={24} color={colors.primary} />
          <Text style={{ marginTop: 8, fontSize: 14, fontWeight: '700', color: colors.text }}>Coming Soon</Text>
          <Text style={{ marginTop: 4, fontSize: 12, color: colors.textMuted, textAlign: 'center' }}>Deep analytics, performance trends, and weak area analysis are currently being calibrated.</Text>
        </View>
      </View>

      {/* Competitive Leaderboard */}
      <View style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 0.5, borderRadius: 16, padding: 16, marginBottom: 4 }}>
        <View style={styles.leaderboardHeader}>
          <View>
            <Text style={{ fontSize: 11, fontWeight: '500', color: '#f59e0b', textTransform: 'capitalize' }}>Competitive Aspirants Lobby</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginTop: 4, marginBottom: 14 }}>Live Leaderboard</Text>
          </View>
          <Award size={18} color="#f59e0b" />
        </View>

        {/* Coming Soon Overlay */}
        <View style={{ alignItems: 'center', padding: 20, backgroundColor: isDark ? '#0E1117' : '#f3f4f6', borderRadius: 12 }}>
          <Sparkles size={24} color={colors.primary} />
          <Text style={{ marginTop: 8, fontSize: 14, fontWeight: '700', color: colors.text }}>Coming Soon</Text>
          <Text style={{ marginTop: 4, fontSize: 12, color: colors.textMuted, textAlign: 'center' }}>Compete with thousands of aspirants nationwide. Leaderboards are currently being calibrated.</Text>
        </View>
      </View>

      {/* Achievements section */}
      <View style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 0.5, borderRadius: 16, padding: 16, marginBottom: 4 }}>
        <Text style={{ fontSize: 11, fontWeight: '500', color: colors.primary, textTransform: 'capitalize' }}>Personal Progression Hub</Text>
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginTop: 4, marginBottom: 14 }}>Aspirant Competency Badges</Text>

        {/* Coming Soon Overlay */}
        <View style={{ alignItems: 'center', padding: 20, backgroundColor: isDark ? '#0E1117' : '#f3f4f6', borderRadius: 12 }}>
          <Trophy size={24} color={colors.accent} />
          <Text style={{ marginTop: 8, fontSize: 14, fontWeight: '700', color: colors.text }}>Coming Soon</Text>
          <Text style={{ marginTop: 4, fontSize: 12, color: colors.textMuted, textAlign: 'center' }}>Aspirant competency badges and achievements will be unlocked soon.</Text>
        </View>
      </View>

      {/* Vocabulary Wallpaper Link Strip */}
      <TouchableOpacity
        onPress={() => router.push('/wallpaper')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 12,
          borderRadius: 14,
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 0.5,
          marginBottom: 4,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 8 }}>
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: isDark ? 'rgba(124, 111, 240, 0.15)' : '#e0e7ff',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ImageIcon size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>Daily Vocabulary Wallpaper</Text>
            <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }} numberOfLines={1}>
              Customize and set today's lockscreen: {todayWallpaperWords.map(w => w.word.toUpperCase()).join(' & ')}
            </Text>
          </View>
        </View>
        <ChevronRight size={18} color={colors.textMuted} />
      </TouchableOpacity>

      {/* Offscreen ViewShot for Quick Download (Mobile Only) */}
      {Platform.OS !== 'web' && (
        <View style={{ position: 'absolute', left: -9999, top: -9999, opacity: 0 }} pointerEvents="none">
          <ViewShot ref={quickDownloadRef} options={{ format: 'png', quality: 1.0 }} style={{ width: 1080, height: 1920 }}>
            <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
              <Svg style={StyleSheet.absoluteFillObject}>
                <Defs>
                  <SvgGradient id="gradQD" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#312e81" />
                    <Stop offset="100%" stopColor="#0f172a" />
                  </SvgGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#gradQD)" />
              </Svg>

              <View style={{ position: 'absolute', left: 40, top: 40, right: 40, bottom: 40, borderWidth: 10, borderColor: 'rgba(255,255,255,0.03)' }} />

              <View style={{ flex: 1, padding: 80, justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 22, fontWeight: '600', letterSpacing: 2, marginTop: 20 }}>
                  📅 DAILY VOCABULARY LOCKSCREEN
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#a5b4fc', marginTop: -20 }}>
                  EXAM TOPPER PREP • {new Date().toDateString().toUpperCase()}
                </Text>

                <View style={{ width: '100%', gap: 60, marginVertical: 40 }}>
                  {todayWallpaperWords.map((item, idx) => (
                    <View key={item.id} style={{ alignItems: 'center' }}>
                      {idx > 0 && <View style={{ width: 250, height: 2, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 40 }} />}
                      <Text style={{ fontSize: 56, fontWeight: 'bold', color: '#ffffff', letterSpacing: -1 }}>
                        {item.word.toUpperCase()}
                      </Text>
                      {item.urduMeaning && (
                        <Text style={{ fontSize: 32, fontWeight: '500', color: '#a5b4fc', marginTop: 6 }}>
                          {item.urduMeaning}
                        </Text>
                      )}
                      <Text style={{ fontSize: 24, color: '#f3f4f6', textAlign: 'center', marginTop: 14, lineHeight: 34, paddingHorizontal: 40 }}>
                        {item.meaning}
                      </Text>
                    </View>
                  ))}
                </View>

                <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 15, fontWeight: '700', letterSpacing: 1, marginBottom: 20 }}>
                  WWW.EXAMTOPPER.PK • MASTER YOUR SYLLABUS
                </Text>
              </View>
            </View>
          </ViewShot>
        </View>
      )}

      {/* ── AI COACH MODAL ── */}
      <Modal
        visible={showCoachModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowCoachModal(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            backgroundColor: colors.card
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Sparkles size={16} color={colors.primary} />
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>AI Study Coach Diagnostic</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowCoachModal(false)}
              style={{
                backgroundColor: isDark ? '#27272a' : '#e4e4e7',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text }}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            {renderMarkdownText(coachAnalysisText, colors)}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    gap: 16,
  },
  analyticsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: -4,
    marginTop: 4,
  },
  analyticsSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  toast: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    zIndex: 999,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  toastText: {
    color: '#f9fafb',
    fontSize: 13,
    fontWeight: '500',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'none',
  },
  syncBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  syncBadgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  heroCardContainer: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 4,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroGreeting: {
    fontSize: 20,
    fontWeight: '700',
  },
  heroSubText: {
    fontSize: 12,
    marginTop: 4,
  },
  heroStreakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  heroStreakText: {
    fontSize: 12,
    fontWeight: '600',
  },
  heroDivider: {
    height: 1,
    marginVertical: 16,
    opacity: 0.5,
  },
  heroStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  heroStatVal: {
    fontSize: 20,
    fontWeight: '700',
  },
  heroStatLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  focusStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    marginBottom: 4,
  },
  focusStripLeft: {
    flex: 1,
    marginRight: 12,
  },
  focusLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  focusLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  focusImportanceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  focusTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  focusMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  focusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  focusBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  subjectGrid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 4,
  },
  subjectCard2: {
    width: '48%',
    borderRadius: 14,
    padding: 12,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  subjectHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectLabel2: {
    fontSize: 10,
    fontWeight: '700',
  },
  subjectProgressText: {
    fontSize: 10,
    fontWeight: '500',
  },
  subjectTitle2: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(128,128,128,0.15)',
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  quizCtaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 4,
  },
  quizCtaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  quizCtaIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizCtaTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  quizCtaSubtitle: {
    color: '#e0e7ff',
    fontSize: 11,
    marginTop: 2,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    marginBottom: 10,
    marginTop: 8,
    textTransform: 'capitalize',
  },
  cardSubText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 14,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leaderboardList: {
    gap: 10,
  },
  leaderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.1)',
  },
  leaderRank: {
    width: 20,
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
  },
  leaderName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  leaderScore: {
    fontSize: 12,
  },
  leaderItemSelf: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderBottomWidth: 0,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  compactBadge: {
    flex: 1,
    alignItems: 'center',
  },
  badgeMuted: {
    opacity: 0.4,
  },
  compactBadgeCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactBadgeText: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
  wallpaperStripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    marginBottom: 4,
  },
  wallpaperStripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  wallpaperStripIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wallpaperStripTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  wallpaperStripSub: {
    fontSize: 11,
    marginTop: 2,
  },
});

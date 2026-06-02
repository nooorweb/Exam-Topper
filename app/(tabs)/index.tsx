import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Share,
  Platform,
  Alert,
} from 'react-native';
import { useApp } from '../../src/context/AppContext';
import {
  Award,
  Flame,
  Play,
  BookOpen,
  AlertTriangle,
  Sparkles,
  Download,
  CheckCircle2,
  Trophy,
  Shield,
  Wifi,
  WifiOff,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { ProfileStats } from '../../src/components/ProfileStats';

export default function DashboardScreen() {
  const {
    stats,
    vocab,
    currentTheme,
    daySeed,
    autoDownloadWallpaper,
    setAutoDownloadWallpaper,
    user,
  } = useApp();

  const isDark = currentTheme === 'dark';
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [simulatedOffline, setSimulatedOffline] = useState(false);

  const colors = {
    bg: isDark ? '#09090b' : '#f9fafb',
    card: isDark ? '#121214' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1f2937',
    textMuted: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#1f1f23' : '#f3f4f6',
    borderAccent: isDark ? '#2a2a32' : '#e5e7eb',
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    accent: '#fbbf24',
    success: '#10b981',
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
    // Navigate to Quiz Session with mixed questions config parameters
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

  // Mock Lockscreen Save/Share functionality
  const handleSaveWallpaper = async () => {
    const textContent = `SMART PREP DAILY MEMORY LOCKSCREEN\nDate: ${new Date().toDateString()}\n\n` +
      todayDraftWords.map((w, i) => `${i + 1}. ${w.word.toUpperCase()} (${w.category || 'Vocab'})\nMeaning: ${w.meaning}\nUrdu: ${w.urduMeaning || 'N/A'}`).join('\n\n');

    if (Platform.OS === 'web') {
      showToast("Lockscreen generated! Text copied to memory clipboard.");
      navigator.clipboard.writeText(textContent);
    } else {
      try {
        await Share.share({
          message: textContent,
          title: 'Daily Study Lockscreen Contents',
        });
      } catch (error) {
        Alert.alert('Sharing Error', 'Failed to share wallpaper text.');
      }
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

      {/* Online/Offline Status Indicator */}
      <View style={styles.statusHeader}>
        <View style={styles.statusLabelContainer}>
          <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.statusLabel, dynamicStyles.textMuted]}>
            Syllabus Sync: 2026 Core Live
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setSimulatedOffline(!simulatedOffline);
            showToast(
              simulatedOffline
                ? 'Connected to online KPPSC mock engine!'
                : 'Offline Mode Active! Loaded directly from local SQLite block.'
            );
          }}
          style={[
            styles.syncBadge,
            {
              backgroundColor: simulatedOffline ? '#fef3c7' : '#ecfdf5',
              borderColor: simulatedOffline ? '#fde047' : '#a7f3d0',
            },
          ]}
        >
          {simulatedOffline ? (
            <View style={styles.badgeFlex}>
              <WifiOff size={10} color="#b45309" />
              <Text style={[styles.syncBadgeText, { color: '#b45309' }]}>Offline Mode</Text>
            </View>
          ) : (
            <View style={styles.badgeFlex}>
              <Wifi size={10} color="#047857" />
              <Text style={[styles.syncBadgeText, { color: '#047857' }]}>Live Sync</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Hero Banner Area */}
      <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroSub}>COMPETITIVE EDGE</Text>
          <Text style={styles.heroTitle}>Smart Prep MCQs</Text>
          <Text style={styles.heroDescription}>
            Master KPPSC, ETEA, FIA, and CSS Exams with high fidelity tests & vocabulary.
          </Text>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>PRACTICED</Text>
              <Text style={styles.statVal}>{stats.totalQuestionsAnswered} Q</Text>
            </View>
            <View style={[styles.statCol, styles.statColBorder]}>
              <Text style={styles.statLabel}>ACCURACY</Text>
              <Text style={[styles.statVal, { color: '#a5b4fc' }]}>{accuracyText}</Text>
            </View>
            <View style={[styles.statCol, styles.statColBorder]}>
              <Text style={styles.statLabel}>STREAK</Text>
              <View style={styles.streakRow}>
                <Flame size={14} color="#f59e0b" fill="#f59e0b" />
                <Text style={styles.statVal}> {stats.streak}d</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Learning Dashboard Stats */}
      <ProfileStats />

      {/* Daily Lockscreen Study Service Card */}
      <View style={[styles.card, dynamicStyles.card]}>
        <View style={[styles.cardHeader, { borderBottomColor: colors.border }]}>
          <View style={styles.cardHeaderTitleRow}>
            <Sparkles size={14} color={colors.primary} />
            <Text style={[styles.cardHeaderTitle, dynamicStyles.text]}>TODAY'S FOCUS</Text>
          </View>
          <Text style={[styles.activeTag, { backgroundColor: '#e0e7ff', color: colors.primary }]}>Active</Text>
        </View>

        <Text style={[styles.cardBodyText, dynamicStyles.textMuted]}>
          Subconsciously memorize synonyms and key acronyms every time you unlock your screen! Generate your today's study block:
        </Text>

        <View style={styles.vocabTagsContainer}>
          {todayDraftWords.map((item) => (
            <View key={item.id} style={[styles.vocabTag, { backgroundColor: isDark ? '#27272a' : '#f3f4f6' }]}>
              <Text style={[styles.vocabTagText, dynamicStyles.text]}>{item.word}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            onPress={() => router.push('/vocab')}
            style={[styles.btnPrimary, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.btnPrimaryText}>See Full Deck</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSaveWallpaper}
            style={[styles.btnSecondary, { backgroundColor: isDark ? '#27272a' : '#f3f4f6', flexDirection: 'row', alignItems: 'center', gap: 6 }]}
          >
            <Download size={14} color={colors.text} />
            <Text style={[styles.btnSecondaryText, dynamicStyles.text]}>Share Text</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Primary Action Button: Quick Start Timed mixed quiz */}
      <TouchableOpacity
        onPress={handleQuickStartQuiz}
        style={[styles.quickStartButton, { backgroundColor: colors.primary }]}
      >
        <View style={styles.quickStartFlex}>
          <View style={styles.quickStartIconBg}>
            <Play size={16} color="#fff" fill="#fff" />
          </View>
          <View style={styles.quickStartTextContainer}>
            <Text style={styles.quickStartTitle}>Start Quick Quiz</Text>
            <Text style={styles.quickStartSubtitle}>10 Questions • 15 seconds each</Text>
          </View>
        </View>
        <Award size={18} color="#ffffff" />
      </TouchableOpacity>

      {/* Practice by Subject Header */}
      <Text style={[styles.sectionTitle, dynamicStyles.textMuted]}>Practice by Subject</Text>

      {/* Subject Selection Grid */}
      <View style={styles.subjectGrid}>
        {/* English */}
        <TouchableOpacity
          onPress={() => handleCategoryStart('English')}
          style={[styles.subjectCard, dynamicStyles.card, { borderLeftColor: '#3b82f6', borderLeftWidth: 4 }]}
        >
          <Text style={[styles.subjectLabel, { color: '#3b82f6' }]}>ENG</Text>
          <Text style={[styles.subjectTitle, dynamicStyles.text]}>English Prep</Text>
          <Text style={[styles.subjectProgress, dynamicStyles.textMuted]}>Grammar & Vocab</Text>
        </TouchableOpacity>

        {/* General Knowledge */}
        <TouchableOpacity
          onPress={() => handleCategoryStart('General Knowledge')}
          style={[styles.subjectCard, dynamicStyles.card, { borderLeftColor: '#f97316', borderLeftWidth: 4 }]}
        >
          <Text style={[styles.subjectLabel, { color: '#f97316' }]}>GK</Text>
          <Text style={[styles.subjectTitle, dynamicStyles.text]}>General Knowledge</Text>
          <Text style={[styles.subjectProgress, dynamicStyles.textMuted]}>Pakistan & World</Text>
        </TouchableOpacity>

        {/* Pakistan Studies */}
        <TouchableOpacity
          onPress={() => handleCategoryStart('Pakistan Studies')}
          style={[styles.subjectCard, dynamicStyles.card, { borderLeftColor: '#ef4444', borderLeftWidth: 4 }]}
        >
          <Text style={[styles.subjectLabel, { color: '#ef4444' }]}>PAK</Text>
          <Text style={[styles.subjectTitle, dynamicStyles.text]}>Pakistan Studies</Text>
          <Text style={[styles.subjectProgress, dynamicStyles.textMuted]}>History & Geography</Text>
        </TouchableOpacity>

        {/* Computer Science */}
        <TouchableOpacity
          onPress={() => handleCategoryStart('Computer Science')}
          style={[styles.subjectCard, dynamicStyles.card, { borderLeftColor: '#a855f7', borderLeftWidth: 4 }]}
        >
          <Text style={[styles.subjectLabel, { color: '#a855f7' }]}>CS</Text>
          <Text style={[styles.subjectTitle, dynamicStyles.text]}>Computer Science</Text>
          <Text style={[styles.subjectProgress, dynamicStyles.textMuted]}>IT & Networking</Text>
        </TouchableOpacity>
      </View>

      {/* Badge Showcase & Leaderboard Showcase */}
      <Text style={[styles.sectionTitle, dynamicStyles.textMuted]}>Achievements & Leaderboard</Text>

      <View style={[styles.card, dynamicStyles.card, { padding: 16 }]}>
        <Text style={[styles.cardSubText, { color: '#3b82f6' }]}>Personal Progression Hub</Text>
        <Text style={[styles.cardTitle, dynamicStyles.text]}>Aspirant Competency Badges</Text>

        <View style={styles.badgeShowcaseRow}>
          {/* Badge 1: First Attempt */}
          <View style={styles.badgeContainer}>
            <View style={[styles.badgeCircle, { backgroundColor: stats.totalQuestionsAnswered > 0 ? colors.primary : '#27272a' }]}>
              <Trophy size={16} color="#fff" />
            </View>
            <Text style={[styles.badgeText, dynamicStyles.text]}>First Step</Text>
          </View>

          {/* Badge 2: Streak */}
          <View style={styles.badgeContainer}>
            <View style={[styles.badgeCircle, { backgroundColor: stats.streak >= 1 ? '#f59e0b' : '#27272a' }]}>
              <Flame size={16} color="#fff" />
            </View>
            <Text style={[styles.badgeText, dynamicStyles.text]}>Consistent</Text>
          </View>

          {/* Badge 3: Accuracy */}
          <View style={styles.badgeContainer}>
            <View style={[styles.badgeCircle, { backgroundColor: stats.totalQuestionsAnswered >= 5 ? '#10b981' : '#27272a' }]}>
              <Shield size={16} color="#fff" />
            </View>
            <Text style={[styles.badgeText, dynamicStyles.text]}>Sniper</Text>
          </View>

          {/* Badge 4: Notes */}
          <View style={styles.badgeContainer}>
            <View style={[styles.badgeCircle, { backgroundColor: '#eab308' }]}>
              <BookOpen size={16} color="#fff" />
            </View>
            <Text style={[styles.badgeText, dynamicStyles.text]}>Scholar</Text>
          </View>
        </View>
      </View>

      {/* Competitive Leaderboard */}
      <View style={[styles.card, dynamicStyles.card, { padding: 16, marginTop: 12 }]}>
        <Text style={[styles.cardSubText, { color: '#f59e0b' }]}>Competitive Aspirants Lobby</Text>
        <Text style={[styles.cardTitle, dynamicStyles.text]}>Live Leaderboard</Text>

        <View style={styles.leaderboardList}>
          <View style={styles.leaderItem}>
            <Text style={styles.leaderRank}>1.</Text>
            <Text style={[styles.leaderName, dynamicStyles.text]}>Kashif Afridi (Peshawar)</Text>
            <Text style={[styles.leaderScore, dynamicStyles.textMuted]}>96% • 14d</Text>
          </View>

          <View style={styles.leaderItem}>
            <Text style={styles.leaderRank}>2.</Text>
            <Text style={[styles.leaderName, dynamicStyles.text]}>Ayesha Khattak (Kohat)</Text>
            <Text style={[styles.leaderScore, dynamicStyles.textMuted]}>92% • 11d</Text>
          </View>

          <View style={[styles.leaderItem, styles.leaderItemSelf]}>
            <Text style={[styles.leaderRank, { color: '#fff' }]}>3.</Text>
            <Text style={[styles.leaderName, { color: '#fff', fontWeight: 'bold' }]}>You (Aspirant)</Text>
            <Text style={[styles.leaderScore, { color: '#e0e7ff', fontWeight: 'bold' }]}>
              {stats.totalQuestionsAnswered > 0 ? accuracyText : '0%'} • {stats.streak}d
            </Text>
          </View>
        </View>
      </View>

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
    marginBottom: 16,
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
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  heroOverlay: {
    padding: 24,
  },
  heroSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#e0e7ff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
  },
  heroDescription: {
    fontSize: 14,
    color: '#e0e7ff',
    marginTop: 8,
    lineHeight: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  statCol: {
    flex: 1,
  },
  statColBorder: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.2)',
    paddingLeft: 14,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#c7d2fe',
    textTransform: 'capitalize',
  },
  statVal: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 4,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 12,
    marginBottom: 14,
  },
  cardHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  activeTag: {
    fontSize: 11,
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
  },
  cardBodyText: {
    fontSize: 13,
    lineHeight: 18,
  },
  vocabTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 14,
  },
  vocabTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  vocabTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  btnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  btnSecondary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnSecondaryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickStartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 14,
    marginBottom: 24,
  },
  quickStartFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  quickStartIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStartTextContainer: {
    justifyContent: 'center',
  },
  quickStartTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  quickStartSubtitle: {
    color: '#e0e7ff',
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    marginBottom: 14,
    marginTop: 8,
    textTransform: 'capitalize',
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  subjectCard: {
    width: '48%',
    borderRadius: 14,
    padding: 16,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  subjectLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  subjectTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },
  subjectProgress: {
    fontSize: 11,
    marginTop: 4,
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
  badgeShowcaseRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  badgeContainer: {
    alignItems: 'center',
  },
  badgeCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
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
});

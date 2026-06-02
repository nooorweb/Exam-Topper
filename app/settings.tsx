import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../src/context/AppContext';
import {
  Sun,
  Moon,
  Trash2,
  Bell,
  GraduationCap,
  Smartphone,
  Image as ImageIcon,
  CheckCircle,
  Shield,
  ChevronRight,
  Info,
  WifiOff,
  Database,
  HeartHandshake,
} from 'lucide-react-native';

const EXAM_FOCUSES = [
  { key: 'KPPSC & ETEA', label: 'KPPSC & ETEA', sub: 'Khyber Pakhtunkhwa boards' },
  { key: 'FIA Inspector', label: 'FIA Inspector', sub: 'Federal Investigation Agency' },
  { key: 'CSS Descriptive', label: 'CSS', sub: 'Civil Service Examination' },
  { key: 'All Punjab/Sindh Boards', label: 'All Boards', sub: 'Mixed General Practice' },
];

export default function SettingsScreen() {
  const {
    currentTheme,
    toggleTheme,
    resetStats,
    autoDownloadWallpaper,
    setAutoDownloadWallpaper,
  } = useApp();

  const isDark = currentTheme === 'dark';

  const [examFocus, setExamFocus] = useState('KPPSC & ETEA');
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    const load = async () => {
      const focus = await AsyncStorage.getItem('smart_prep_focus');
      if (focus) setExamFocus(focus);
      const push = await AsyncStorage.getItem('smart_prep_push');
      setPushEnabled(push === 'true');
    };
    load();
  }, []);

  const handleExamFocusSelect = async (key: string) => {
    setExamFocus(key);
    await AsyncStorage.setItem('smart_prep_focus', key);
  };

  const handlePushToggle = async () => {
    const val = !pushEnabled;
    setPushEnabled(val);
    await AsyncStorage.setItem('smart_prep_push', String(val));
    if (val) {
      Alert.alert(
        '🔔 Notifications Enabled',
        'You will receive daily vocabulary word reminders at 8:00 AM! (Requires device notification permissions)'
      );
    }
  };

  const handleStatsFlush = () => {
    Alert.alert(
      '⚠️ Confirm Data Reset',
      'This will permanently wipe your learning streaks, quiz histories, and all bookmarked vocabulary. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: () => {
            resetStats();
            Alert.alert('✅ Done', 'All student progress has been reset successfully.');
          },
        },
      ]
    );
  };

  const colors = {
    bg: isDark ? '#09090b' : '#f9fafb',
    card: isDark ? '#121214' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1f2937',
    textMuted: isDark ? '#6b7280' : '#9ca3af',
    border: isDark ? '#1f1f23' : '#e5e7eb',
    primary: '#6366f1',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
  };

  const Card = ({ children, style }: any) => (
    <View style={[
      styles.card,
      { backgroundColor: colors.card, borderColor: colors.border },
      style,
    ]}>
      {children}
    </View>
  );

  const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <View style={styles.sectionHeader}>
      {icon}
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{title}</Text>
    </View>
  );

  const ToggleRow = ({
    label,
    sub,
    value,
    onToggle,
    separator = true,
  }: {
    label: string;
    sub: string;
    value: boolean;
    onToggle: () => void;
    separator?: boolean;
  }) => (
    <View style={[styles.toggleRow, separator && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.toggleLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.toggleSub, { color: colors.textMuted }]}>{sub}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#374151', true: '#a5b4fc' }}
        thumbColor={value ? colors.primary : '#9ca3af'}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* ── EXAM FOCUS ── */}
        <Card>
          <SectionTitle
            icon={<GraduationCap size={14} color={colors.primary} />}
            title="COMPETITIVE EXAM FOCUS"
          />
          <Text style={[styles.focusDesc, { color: colors.textMuted }]}>
            Adjusting this filters default MCQ sequences, timer presets, and question priority to suit your exam board.
          </Text>
          <View style={styles.focusGrid}>
            {EXAM_FOCUSES.map((ef) => {
              const selected = examFocus === ef.key;
              return (
                <TouchableOpacity
                  key={ef.key}
                  onPress={() => handleExamFocusSelect(ef.key)}
                  style={[
                    styles.focusChip,
                    {
                      backgroundColor: selected ? `${colors.primary}1A` : (isDark ? '#1c1c1f' : '#f3f4f6'),
                      borderColor: selected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  {selected && <CheckCircle size={11} color={colors.primary} />}
                  <View>
                    <Text style={[styles.focusChipLabel, { color: selected ? colors.primary : colors.text }]}>
                      {ef.label}
                    </Text>
                    <Text style={[styles.focusChipSub, { color: colors.textMuted }]}>{ef.sub}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* ── DISPLAY THEME ── */}
        <Card>
          <SectionTitle
            icon={isDark ? <Moon size={14} color={colors.primary} /> : <Sun size={14} color={colors.warning} />}
            title="INTERFACE & DISPLAY"
          />
          <View style={styles.themeRow}>
            <View>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>Theme Appearance</Text>
              <Text style={[styles.toggleSub, { color: colors.textMuted }]}>
                Currently: {isDark ? 'Dark Mode (Eye Friendly)' : 'Light Mode'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={toggleTheme}
              style={[styles.themeBtn, { backgroundColor: isDark ? '#1c1c1f' : '#f3f4f6', borderColor: colors.border }]}
            >
              {isDark
                ? <Moon size={13} color="#f59e0b" />
                : <Sun size={13} color="#f59e0b" />}
              <Text style={[styles.themeBtnText, { color: colors.text }]}>
                Switch to {isDark ? 'Light' : 'Dark'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* ── NOTIFICATIONS & WALLPAPER ── */}
        <Card>
          <SectionTitle
            icon={<Bell size={14} color={colors.primary} />}
            title="NOTIFICATIONS & EXTRAS"
          />
          <ToggleRow
            label="Daily Vocabulary Reminders"
            sub="Receive a new word-of-the-day notification at 8 AM"
            value={pushEnabled}
            onToggle={handlePushToggle}
          />
          <ToggleRow
            label="Auto-Download Daily Wallpaper"
            sub="Saves today's high-yield lockscreen wallpaper PNG automatically"
            value={autoDownloadWallpaper}
            onToggle={() => setAutoDownloadWallpaper(!autoDownloadWallpaper)}
          />
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>Offline Database Mode</Text>
              <Text style={[styles.toggleSub, { color: colors.textMuted }]}>All practice data is stored locally on your device</Text>
            </View>
            <View style={[styles.badgeGreen, { borderColor: `${colors.success}33` }]}>
              <WifiOff size={10} color={colors.success} />
              <Text style={[styles.badgeText, { color: colors.success }]}>Always On</Text>
            </View>
          </View>
        </Card>

        {/* ── DANGER ZONE ── */}
        <Card>
          <SectionTitle
            icon={<Shield size={14} color={colors.danger} />}
            title="SYSTEM CONTROL"
          />
          <Text style={[styles.dangerDesc, { color: colors.textMuted }]}>
            Flush all locally stored learning metrics. This does not remove default seeded MCQs from the database.
          </Text>
          <TouchableOpacity
            onPress={handleStatsFlush}
            style={[
              styles.dangerBtn,
              {
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
                borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : '#fca5a5',
              },
            ]}
          >
            <Trash2 size={13} color={isDark ? '#f87171' : '#991b1b'} />
            <Text style={[styles.dangerBtnText, { color: isDark ? '#f87171' : '#991b1b' }]}>WIPE ALL LEARNING PROGRESS</Text>
          </TouchableOpacity>
        </Card>

        {/* ── FOOTER ── */}
        <View style={styles.footer}>
          <HeartHandshake size={16} color={colors.textMuted} />
          <Text style={[styles.footerTitle, { color: colors.textMuted }]}>Smart Prep MCQs</Text>
          <Text style={[styles.footerSub, { color: colors.textMuted }]}>
            Designed for ETEA, KPPSC & Competitive Exam Candidates
          </Text>
          <View style={[styles.versionBadge, { backgroundColor: isDark ? '#1c1c1f' : '#f3f4f6' }]}>
            <Text style={[styles.versionText, { color: colors.textMuted }]}>
              v2.0.0 • Expo Mobile Build
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: 16, paddingBottom: 50, gap: 14 },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.1)',
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  focusDesc: { fontSize: 10.5, lineHeight: 14 },
  focusGrid: { gap: 8 },
  focusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  focusChipLabel: { fontSize: 11.5, fontWeight: 'bold' },
  focusChipSub: { fontSize: 9, marginTop: 1 },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  themeBtnText: { fontSize: 11, fontWeight: 'bold' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  toggleLabel: { fontSize: 11.5, fontWeight: 'bold' },
  toggleSub: { fontSize: 9, marginTop: 2, lineHeight: 13 },
  badgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: { fontSize: 9, fontWeight: 'bold' },
  storageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statBox: {
    width: '30.5%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
  },
  statVal: { fontSize: 18, fontWeight: '900' },
  statLabel: { fontSize: 8, marginTop: 2, textAlign: 'center' },
  dangerDesc: { fontSize: 10.5, lineHeight: 14 },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1,
  },
  dangerBtnText: { fontSize: 10.5, fontWeight: '900', letterSpacing: 0.5 },
  footer: {
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    paddingBottom: 16,
  },
  footerTitle: { fontSize: 13, fontWeight: '900' },
  footerSub: { fontSize: 10, textAlign: 'center' },
  versionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 4,
  },
  versionText: { fontSize: 9, fontWeight: 'bold' },
});

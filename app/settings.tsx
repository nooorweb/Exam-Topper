import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../src/context/AppContext';
import {
  Sun,
  Moon,
  Trash2,
  Bell,
  GraduationCap,
  Image as ImageIcon,
  CheckCircle,
  Shield,
  Info,
  WifiOff,
  HeartHandshake,
  Sparkles,
  ChevronLeft,
  Users,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Card, SectionHeader, ToggleRow, Button, Badge, Text, Input } from '../src/components/common';

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
    user,
    signIn,
    signUp,
    signOut,
  } = useApp();

  const isDark = currentTheme === 'dark';

  const [examFocus, setExamFocus] = useState('KPPSC & ETEA');
  const [pushEnabled, setPushEnabled] = useState(false);

  // Auth local states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const colors = {
    bg: isDark ? '#09090b' : '#f9fafb',
    text: isDark ? '#f4f4f5' : '#1f2937',
    textMuted: isDark ? '#6b7280' : '#9ca3af',
    border: isDark ? '#1f1f23' : '#e5e7eb',
    primary: '#6366f1',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
  };

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
        'Notifications Enabled',
        'You will receive daily vocabulary word reminders at 8:00 AM!'
      );
    }
  };

  const handleStatsFlush = () => {
    Alert.alert(
      'Confirm Data Reset',
      'This will permanently wipe your learning streaks, quiz histories, and all bookmarked vocabulary. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: () => {
            resetStats();
            Alert.alert('Done', 'All student progress has been reset successfully.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>

        {/* ── PROFILE & AUTH SECTION ── */}
        <Card isDark={isDark} style={styles.cardGap}>
          <SectionHeader
            isDark={isDark}
            icon={<Users size={13} color={colors.primary} />}
            title={user ? "ACCOUNT PROFILE" : "GUEST MODE"}
          />
          {user ? (
            <View style={{ gap: 8 }}>
              <Text style={[styles.desc, { color: colors.text }]}>
                Logged in as: <Text style={{ fontWeight: 'bold' }}>{user.email}</Text>
              </Text>
              <Text style={[styles.desc, { color: colors.textMuted, fontSize: 10 }]}>
                Your progress, history, and generated AI quizzes are synced automatically.
              </Text>
              <Button
                label="SIGN OUT OF ACCOUNT"
                onPress={async () => {
                  setAuthLoading(true);
                  try {
                    await signOut();
                    Alert.alert('Signed Out', 'You have been logged out successfully.');
                  } catch (e: any) {
                    Alert.alert('Error', e.message || 'Failed to sign out.');
                  } finally {
                    setAuthLoading(false);
                  }
                }}
                isDark={isDark}
                variant="outline"
                style={{ marginTop: 6 }}
              />
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              <Text style={[styles.desc, { color: colors.textMuted }]}>
                Register a free account to unlock **AI Custom Quiz Builder**, sync progress across devices, and secure your learning statistics.
              </Text>
              {authError && (
                <Text style={{ color: colors.danger, fontSize: 11, fontWeight: 'bold' }}>
                  {authError}
                </Text>
              )}
              <Input
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                isDark={isDark}
              />
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                isDark={isDark}
              />
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                <Button
                  label={authLoading ? "Processing..." : (isSignUpMode ? "Register" : "Sign In")}
                  onPress={async () => {
                    if (!email.trim() || !password.trim()) {
                      setAuthError('Please fill in both fields.');
                      return;
                    }
                    setAuthLoading(true);
                    setAuthError(null);
                    try {
                      const res = isSignUpMode 
                        ? await signUp(email.trim(), password) 
                        : await signIn(email.trim(), password);
                      if (res.error) {
                        setAuthError(res.error.message);
                      } else {
                        Alert.alert('Success', isSignUpMode ? 'Account registered!' : 'Logged in successfully!');
                        setEmail('');
                        setPassword('');
                      }
                    } catch (e: any) {
                      setAuthError(e.message || 'Auth action failed.');
                    } finally {
                      setAuthLoading(false);
                    }
                  }}
                  isDark={isDark}
                  variant="primary"
                  style={{ flex: 1 }}
                  disabled={authLoading}
                />
                <Button
                  label={isSignUpMode ? "Use Sign In" : "Use Register"}
                  onPress={() => {
                    setIsSignUpMode(!isSignUpMode);
                    setAuthError(null);
                  }}
                  isDark={isDark}
                  variant="outline"
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          )}
        </Card>

        {/* ── EXAM FOCUS ── */}
        <Card isDark={isDark} style={styles.cardGap}>
          <SectionHeader
            isDark={isDark}
            icon={<GraduationCap size={13} color={colors.primary} />}
            title="COMPETITIVE EXAM FOCUS"
          />
          <Text style={[styles.desc, { color: colors.textMuted }]}>
            Adjusting this filters default MCQ sequences, timer presets, and question priority to suit your exam board.
          </Text>
          <View style={styles.focusGrid}>
            {EXAM_FOCUSES.map((ef) => {
              const selected = examFocus === ef.key;
              return (
                <TouchableOpacity
                  key={ef.key}
                  onPress={() => handleExamFocusSelect(ef.key)}
                  accessibilityRole="radio"
                  accessibilityLabel={ef.label}
                  accessibilityState={{ selected }}
                  style={[
                    styles.focusChip,
                    {
                      backgroundColor: selected
                        ? `${colors.primary}1A`
                        : isDark ? '#1c1c1f' : '#f3f4f6',
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
        <Card isDark={isDark} style={styles.cardGap}>
          <SectionHeader
            isDark={isDark}
            icon={isDark
              ? <Moon size={13} color={colors.primary} />
              : <Sun size={13} color={colors.warning} />
            }
            title="INTERFACE & DISPLAY"
          />
          <View style={styles.themeRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>Theme Appearance</Text>
              <Text style={[styles.toggleSub, { color: colors.textMuted }]}>
                Currently: {isDark ? 'Dark Mode (Eye Friendly)' : 'Light Mode'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={toggleTheme}
              accessibilityRole="button"
              accessibilityLabel={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              style={[
                styles.themeBtn,
                { backgroundColor: isDark ? '#1c1c1f' : '#f3f4f6', borderColor: colors.border },
              ]}
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
        <Card isDark={isDark} style={styles.cardGap}>
          <SectionHeader
            isDark={isDark}
            icon={<Bell size={13} color={colors.primary} />}
            title="NOTIFICATIONS & EXTRAS"
          />
          <ToggleRow
            label="Daily Vocabulary Reminders"
            sub="Receive a new word-of-the-day notification at 8 AM"
            value={pushEnabled}
            onToggle={handlePushToggle}
            isDark={isDark}
          />
          <ToggleRow
            label="Auto-Download Daily Wallpaper"
            sub="Saves today's high-yield lockscreen wallpaper PNG automatically"
            value={autoDownloadWallpaper}
            onToggle={() => setAutoDownloadWallpaper(!autoDownloadWallpaper)}
            isDark={isDark}
          />
          <ToggleRow
            label="Offline Database Mode"
            sub="All practice data is stored locally on your device"
            value={true}
            onToggle={() => {}}
            isDark={isDark}
            separator={false}
            rightElement={
              <Badge
                label="Always On"
                color={colors.success}
                icon={<WifiOff size={10} color={colors.success} />}
              />
            }
          />
        </Card>

        {/* ── DANGER ZONE ── */}
        <Card isDark={isDark} style={styles.cardGap}>
          <SectionHeader
            isDark={isDark}
            icon={<Shield size={13} color={colors.danger} />}
            title="SYSTEM CONTROL"
          />
          <Text style={[styles.desc, { color: colors.textMuted }]}>
            Flush all locally stored learning metrics. This does not remove default seeded MCQs from the database.
          </Text>
          <Button
            label="WIPE ALL LEARNING PROGRESS"
            onPress={handleStatsFlush}
            isDark={isDark}
            variant="danger"
            icon={<Trash2 size={13} color={isDark ? '#f87171' : '#991b1b'} />}
            textStyle={styles.dangerBtnText}
          />
        </Card>

        {/* ── FOOTER ── */}
        <View style={styles.footer}>
          <HeartHandshake size={16} color={colors.textMuted} />
          <Text style={[styles.footerTitle, { color: colors.textMuted }]}>Exam Topper</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: { padding: 16, paddingBottom: 50, gap: 14 },
  cardGap: { gap: 12 },
  desc: { fontSize: 11, lineHeight: 15 },
  focusGrid: { gap: 8 },
  focusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    // Minimum touch target
    minHeight: 48,
  },
  focusChipLabel: { fontSize: 12, fontWeight: '700' },
  focusChipSub: { fontSize: 9, marginTop: 1 },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: { fontSize: 12, fontWeight: '700' },
  toggleSub: { fontSize: 10, marginTop: 2, lineHeight: 13 },
  themeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 44,
  },
  themeBtnText: { fontSize: 11, fontWeight: '700' },
  dangerBtnText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
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
  versionText: { fontSize: 9, fontWeight: '700' },
});

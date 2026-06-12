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
import { UserService } from '../src/services/user.service';
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
  Gavel,
  Landmark,
  FlaskConical,
  Mail,
  Lock,
  BookOpen,
  Briefcase,
  Monitor,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Card, SectionHeader, ToggleRow, Button, Badge, Text, Input } from '../src/components/common';

const EXAM_FOCUSES = [
  { key: 'Teaching', label: 'Teaching / SST / PST', sub: 'Subject Specialist, Primary Teacher', icon: BookOpen },
  { key: 'Computer Operator', label: 'Computer Operator', sub: 'Data Entry, IT Assistant, NTS', icon: Monitor },
  { key: 'KPPSC', label: 'KPPSC Officer', sub: 'Tehsildar, Patwari, Naib Tehsildar', icon: Briefcase },
  { key: 'Police', label: 'Police / ASI / Sub-Inspector', sub: 'KP Police, FIA, Anti-Corruption', icon: Shield },
  { key: 'CSS', label: 'CSS / PMS', sub: 'Central Superior Services, Provincial', icon: GraduationCap },
  { key: 'ETEA', label: 'ETEA Admission', sub: 'Medical, Engineering, BBA, BCS', icon: GraduationCap },
  { key: 'General', label: 'General Competitive', sub: 'Mixed boards, NTS, OTS, PTS', icon: Sparkles },
];

export default function SettingsScreen() {
  const {
    currentTheme,
    toggleTheme,
    resetStats,
    autoDownloadWallpaper,
    setAutoDownloadWallpaper,
    user,
    profile,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    examFocus,
    setExamFocus,
    examSubFocus,
    setExamSubFocus,
  } = useApp();

  const isDark = currentTheme === 'dark';

  const [pushEnabled, setPushEnabled] = useState(false);

  // Auth local states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);



  const colors = {
    bg: isDark ? '#0E1117' : '#f9fafb',
    card: isDark ? '#121214' : '#ffffff',
    text: isDark ? '#e1e2eb' : '#1f2937',
    textMuted: isDark ? '#c8c4d6' : '#9ca3af',
    border: isDark ? '#2A2D3A' : '#e5e7eb',
    primary: '#7C6FF0',
    success: '#10B981',
    danger: '#ef4444',
    warning: '#F59E0B',
  };

  useEffect(() => {
    const load = async () => {
      const push = await AsyncStorage.getItem('smart_prep_push');
      setPushEnabled(push === 'true');
    };
    load();
  }, []);

  const handleExamFocusSelect = async (key: string) => {
    await setExamFocus(key);
    if (key !== 'ETEA') {
      await setExamSubFocus('General');
    }
  };

  const handleExamSubFocusSelect = async (subKey: string) => {
    await setExamSubFocus(subKey);
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
      {/* Redesigned Premium Sticky Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
        backgroundColor: colors.bg,
      }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── PROFILE & AUTH SECTION ── */}
        <Card isDark={isDark} style={styles.cardGap}>
          <SectionHeader
            isDark={isDark}
            icon={<Users size={13} color={colors.primary} />}
            title={user ? "ACCOUNT PROFILE" : "GUEST MODE"}
          />
          {user ? (
            <View style={{ gap: 10 }}>
              <Text style={{ fontSize: 12, color: colors.text, lineHeight: 18 }}>
                Logged in as: <Text style={{ fontWeight: 'bold' }}>{user.email}</Text>
              </Text>
              <Text style={{ fontSize: 10, color: colors.textMuted, lineHeight: 15 }}>
                Your progress, history, and generated AI quizzes are synced automatically.
              </Text>
              {profile?.display_name && (
                <Text style={{ fontSize: 12, color: colors.text, lineHeight: 18 }}>
                  Display Name: <Text style={{ fontWeight: 'bold' }}>{profile.display_name}</Text>
                </Text>
              )}
              <View style={{ borderTopWidth: 0.5, borderTopColor: colors.border, marginVertical: 6 }} />
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
                style={{ marginTop: 2, borderColor: colors.primary }}
                textStyle={{ color: colors.primary }}
              />
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              <Text style={{ fontSize: 12, color: colors.textMuted, lineHeight: 18 }}>
                Register a free account to unlock **AI Custom Quiz Builder**, sync progress across devices, and secure your learning statistics.
              </Text>
              {authError && (
                <Text style={{ color: colors.danger, fontSize: 11, fontWeight: 'bold' }}>
                  {authError}
                </Text>
              )}
              {isSignUpMode && (
                <Input
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  isDark={isDark}
                  icon={<Users size={16} color={colors.textMuted} />}
                />
              )}
              <Input
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                isDark={isDark}
                icon={<Mail size={16} color={colors.textMuted} />}
              />
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                isDark={isDark}
                icon={<Lock size={16} color={colors.textMuted} />}
              />
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                <View style={{ flex: 1 }}>
                  <Button
                    label={authLoading ? "Processing..." : (isSignUpMode ? "Register" : "Sign In")}
                    onPress={async () => {
                      if (!email.trim() || !password.trim()) {
                        setAuthError('Please fill in both email and password.');
                        return;
                      }
                      if (isSignUpMode && !fullName.trim()) {
                        setAuthError('Please enter your full name.');
                        return;
                      }
                      setAuthLoading(true);
                      setAuthError(null);
                      try {
                        const res = isSignUpMode 
                          ? await signUp(email.trim(), password, fullName.trim()) 
                          : await signIn(email.trim(), password);
                        if (res.error) {
                          setAuthError(res.error.message);
                        } else {
                          Alert.alert('Success', isSignUpMode ? 'Account registered!' : 'Logged in successfully!');
                          setEmail('');
                          setPassword('');
                          setFullName('');
                        }
                      } catch (e: any) {
                        setAuthError(e.message || 'Auth action failed.');
                      } finally {
                        setAuthLoading(false);
                      }
                    }}
                    isDark={isDark}
                    variant="primary"
                    disabled={authLoading}
                    style={{ backgroundColor: colors.primary }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    label={isSignUpMode ? "Use Sign In" : "Use Register"}
                    onPress={() => {
                      setIsSignUpMode(!isSignUpMode);
                      setAuthError(null);
                    }}
                    isDark={isDark}
                    variant="outline"
                    style={{ borderColor: colors.primary }}
                    textStyle={{ color: colors.primary }}
                  />
                </View>
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
          <Text style={{ fontSize: 11, color: colors.textMuted, lineHeight: 15 }}>
            Adjusting this filters default MCQ sequences, timer presets, and question priority to suit your exam board.
          </Text>
          <View style={styles.focusGrid}>
            {EXAM_FOCUSES.map((ef) => {
              const selected = examFocus === ef.key;
              const IconComp = ef.icon;
              return (
                <TouchableOpacity
                  key={ef.key}
                  onPress={() => handleExamFocusSelect(ef.key)}
                  accessibilityRole="radio"
                  accessibilityLabel={ef.label}
                  accessibilityState={{ selected }}
                  style={{
                    backgroundColor: selected ? 'rgba(124, 111, 240, 0.1)' : colors.card,
                    borderColor: selected ? colors.primary : colors.border,
                    borderWidth: 0.5,
                    borderRadius: 14,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: 52,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                    <View style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: selected ? 'rgba(124, 111, 240, 0.2)' : 'rgba(255,255,255,0.05)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <IconComp size={16} color={selected ? '#c6bfff' : colors.textMuted} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: selected ? '#c6bfff' : colors.text,
                      }}>
                        {ef.label}
                      </Text>
                      <Text style={{
                        fontSize: 10,
                        color: selected ? 'rgba(198, 191, 255, 0.7)' : colors.textMuted,
                        marginTop: 1,
                      }}>
                        {ef.sub}
                      </Text>
                    </View>
                  </View>
                  {selected && (
                    <CheckCircle size={18} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {examFocus === 'ETEA' && (
            <View style={{ marginTop: 16, padding: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb', borderRadius: 12, borderWidth: 0.5, borderColor: colors.border }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text, marginBottom: 4 }}>Select ETEA Admission Subcategory</Text>
              <Text style={{ fontSize: 10, color: colors.textMuted, marginBottom: 10 }}>Choose your specific academic focus to get tailored subjects.</Text>
              <View style={{ gap: 6 }}>
                {[
                  { key: 'Computer Science', label: 'Computer Science / BCS' },
                  { key: 'Engineering', label: 'Engineering (FSc Pre-Engineering)' },
                  { key: 'Medical', label: 'Medical (FSc Pre-Medical)' },
                  { key: 'General', label: 'General / BBA' },
                ].map((sub) => {
                  const subSelected = examSubFocus === sub.key;
                  return (
                    <TouchableOpacity
                      key={sub.key}
                      onPress={() => handleExamSubFocusSelect(sub.key)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        borderRadius: 10,
                        borderWidth: 0.5,
                        borderColor: subSelected ? colors.primary : colors.border,
                        backgroundColor: subSelected ? 'rgba(124, 111, 240, 0.1)' : (isDark ? '#121214' : '#ffffff'),
                        minHeight: 40,
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '600', color: subSelected ? '#c6bfff' : colors.text }}>{sub.label}</Text>
                      {subSelected && <CheckCircle size={14} color={colors.primary} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
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
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text }}>Theme Appearance</Text>
              <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 2, lineHeight: 13 }}>
                Currently: {isDark ? 'Dark Mode (Eye Friendly)' : 'Light Mode'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={toggleTheme}
              accessibilityRole="button"
              accessibilityLabel={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 0.5,
                borderColor: colors.border,
                backgroundColor: isDark ? '#0E1117' : '#f3f4f6',
                minHeight: 44,
              }}
            >
              {isDark
                ? <Moon size={13} color="#F59E0B" />
                : <Sun size={13} color="#F59E0B" />}
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.text }}>
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
          <Text style={{ fontSize: 11, color: colors.textMuted, lineHeight: 15 }}>
            Flush all locally stored learning metrics. This does not remove default seeded MCQs from the database.
          </Text>
          <Button
            label="WIPE ALL LEARNING PROGRESS"
            onPress={handleStatsFlush}
            isDark={isDark}
            variant="danger"
            icon={<Trash2 size={13} color={isDark ? '#f87171' : '#991b1b'} />}
            textStyle={styles.dangerBtnText}
            style={{ borderWidth: 0.5 }}
          />
        </Card>

        {/* ── FOOTER ── */}
        <View style={styles.footer}>
          <HeartHandshake size={16} color={colors.textMuted} />
          <Text style={{ fontSize: 13, fontWeight: '900', color: colors.textMuted }}>Exam Topper</Text>
          <Text style={{ fontSize: 10, textAlign: 'center', color: colors.textMuted }}>
            Designed for ETEA, KPPSC & Competitive Exam Candidates
          </Text>
          <View style={{
            paddingHorizontal: 12,
            paddingVertical: 5,
            borderRadius: 10,
            marginTop: 4,
            backgroundColor: isDark ? '#161B27' : '#f3f4f6',
            borderColor: colors.border,
            borderWidth: 0.5,
          }}>
            <Text style={{ fontSize: 9, fontWeight: '700', color: colors.textMuted }}>
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

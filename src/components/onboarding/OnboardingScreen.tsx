/**
 * OnboardingScreen.tsx
 * Step 0: Welcome (motivational full-screen)
 * Step 1: What are you preparing for? (job categories) — SKIPPABLE
 * Step 2: Daily goal — SKIPPABLE
 *
 * On first login this also seeds the local MCQ & vocab data into Supabase
 * so the user sees real content immediately without manual data entry.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  GraduationCap,
  Monitor,
  BookOpen,
  Users,
  Shield,
  Briefcase,
  Award,
  ChevronRight,
  CheckCircle,
  Sparkles,
  Clock,
  ArrowRight,
  Zap,
  Mail,
  Lock,
  ChevronLeft,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../../context/AppContext';
import { UserService } from '../../services/user.service';
import { supabase } from '../../lib/supabase';
import { DEFAULT_MCQS, DEFAULT_VOCAB } from '../../data/defaultData';
import { Button, Input, Text } from '../common';

const { width: SW } = Dimensions.get('window');

// ─── Job/Exam Categories ─────────────────────────────────────────────────────

const JOB_CATEGORIES = [
  {
    key: 'Teaching',
    label: 'Teaching / SST / PST',
    sub: 'Subject Specialist, Primary Teacher',
    icon: BookOpen,
    color: '#3b82f6',
    emoji: '📚',
  },
  {
    key: 'Computer Operator',
    label: 'Computer Operator',
    sub: 'Data Entry, IT Assistant, NTS',
    icon: Monitor,
    color: '#a855f7',
    emoji: '💻',
  },
  {
    key: 'KPPSC',
    label: 'KPPSC Officer',
    sub: 'Tehsildar, Patwari, Naib Tehsildar',
    icon: Briefcase,
    color: '#f97316',
    emoji: '🏛️',
  },
  {
    key: 'Police',
    label: 'Police / ASI / Sub-Inspector',
    sub: 'KP Police, FIA, Anti-Corruption',
    icon: Shield,
    color: '#ef4444',
    emoji: '🛡️',
  },
  {
    key: 'CSS',
    label: 'CSS / PMS',
    sub: 'Central Superior Services, Provincial',
    icon: Award,
    color: '#10b981',
    emoji: '⭐',
  },
  {
    key: 'ETEA',
    label: 'ETEA Admission',
    sub: 'Medical, Engineering, BBA, BCS',
    icon: GraduationCap,
    color: '#6366f1',
    emoji: '🎓',
  },
  {
    key: 'General',
    label: 'General Competitive',
    sub: 'Mixed boards, NTS, OTS, PTS',
    icon: Users,
    color: '#f59e0b',
    emoji: '🎯',
  },
];

const DAILY_GOALS = [
  { value: 10, label: '10 min', sub: 'Light — 1 quiz/day', emoji: '🌱' },
  { value: 20, label: '20 min', sub: 'Regular — 2 quizzes', emoji: '🔥' },
  { value: 40, label: '40 min', sub: 'Intensive — 4 quizzes', emoji: '⚡' },
  { value: 60, label: '60 min', sub: 'Champion — 6 quizzes', emoji: '🏆' },
];

// ─── Component ────────────────────────────────────────────────────────────────


// ScaleButton removed — using common Button component below

interface OnboardingScreenProps {
  onComplete: () => void;
}

type Step = 0 | 1 | 2;

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { currentTheme, user, signIn, signUp } = useApp();
  const isDark = currentTheme === 'dark';

  const [step, setStep] = useState<Step>(0);
  const [selectedJob, setSelectedJob] = useState('General');
  const [dailyGoal, setDailyGoal] = useState(20);
  const [saving, setSaving] = useState(false);

  // One-time Auth Option States
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<'signIn' | 'signUp'>('signUp');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const ring = useRef(new Animated.Value(0)).current;
  const authTransitionAnim = useRef(new Animated.Value(0)).current;

  const colors = {
    bg: isDark ? '#09090b' : '#f0f4ff',
    card: isDark ? '#121214' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1f2937',
    textMuted: isDark ? '#6b7280' : '#6b7280',
    border: isDark ? '#1f1f23' : '#e0e7ff',
    primary: '#6366f1',
    primaryDim: isDark ? 'rgba(99,102,241,0.15)' : '#e0e7ff',
  };

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
    ]).start();

    // Pulse logo on welcome screen
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // Spinning ring
    Animated.loop(
      Animated.timing(ring, { toValue: 1, duration: 3000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);

  // Animate panel slide horizontally when showAuthForm toggles
  useEffect(() => {
    Animated.timing(authTransitionAnim, {
      toValue: showAuthForm ? 1 : 0,
      duration: 380,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: true,
    }).start();
  }, [showAuthForm]);

  // Animate step transitions
  const animateStep = (nextStep: Step) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 20, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setStep(nextStep);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, easing: Easing.out(Easing.back(1.1)), useNativeDriver: true }),
      ]).start();
    });
  };

  const handleFinish = async (skipCustomization = false) => {
    setSaving(true);
    try {
      // Mark onboarding as completed locally so they are never prompted again
      await AsyncStorage.setItem('smart_prep_onboarding_complete', 'true');
      
      if (!skipCustomization) {
        await AsyncStorage.setItem('smart_prep_focus', selectedJob);
      } else {
        await AsyncStorage.setItem('smart_prep_focus', 'General');
      }

      if (user) {
        await UserService.completeOnboarding(user.id, {
          selectedSubjects: skipCustomization ? [] : [selectedJob],
          examTarget: skipCustomization ? 'General' : selectedJob,
          dailyGoalMinutes: skipCustomization ? 20 : dailyGoal,
        });
      }
    } catch (_) {
      // Non-fatal — continue to application anyway
    } finally {
      setSaving(false);
      onComplete();
    }
  };

  const handleAuthSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { error } = authMode === 'signIn'
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password);

      if (error) {
        setAuthError(error.message || 'Failed to authenticate.');
      } else {
        // User successfully signed in/registered!
        // Proceed directly to personalization customization slide
        setShowAuthForm(false);
        animateStep(1);
      }
    } catch (e: any) {
      setAuthError(e.message || 'Something went wrong.');
    } finally {
      setAuthLoading(false);
    }
  };

  const spinInterpolate = ring.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // ── Step 0: Welcome ─────────────────────────────────────────────────────────
  const renderWelcome = () => {
    const contentWidth = SW - 48; // Scrollview padding accounted for
    return (
      <Animated.View style={[styles.welcomeContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={{ overflow: 'hidden', width: contentWidth }}>
          <Animated.View
            style={{
              flexDirection: 'row',
              width: contentWidth * 2,
              transform: [{
                translateX: authTransitionAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -contentWidth],
                })
              }]
            }}
          >
            {/* Welcome Screen Panel */}
            <View style={{ width: contentWidth, alignItems: 'center', gap: 20 }}>
              {/* Animated logo */}
              <View style={styles.logoWrap}>
                <Animated.View style={[styles.ringOuter, { transform: [{ rotate: spinInterpolate }] }]} />
                <Animated.View style={[styles.logoInner, { backgroundColor: colors.primaryDim, transform: [{ scale: pulse }] }]}>
                  <GraduationCap size={36} color={colors.primary} />
                </Animated.View>
              </View>

              {/* Welcome copy */}
              <View style={styles.welcomeCopy}>
                <Text style={[styles.welcomeTag, { color: colors.primary }]}>SMART PREP — YOUR EXAM PARTNER</Text>
                <Text style={[styles.welcomeTitle, { color: colors.text }]}>
                  Your Dream Job{'\n'}Starts Here 🚀
                </Text>
                <Text style={[styles.welcomeSub, { color: colors.textMuted }]}>
                  Thousands of aspirants across KP are preparing daily with Smart Prep. With focused MCQs, vocab, notes and mock tests — you are already one step ahead.
                </Text>
              </View>

              {/* Feature pills */}
              <View style={styles.featurePills}>
                {[
                  { icon: Zap, label: '5000+ MCQs', color: '#f59e0b' },
                  { icon: Clock, label: 'Daily Streaks', color: '#10b981' },
                  { icon: Sparkles, label: 'Smart Hints', color: '#a855f7' },
                ].map(({ icon: Icon, label, color }) => (
                  <View key={label} style={[styles.featurePill, { backgroundColor: `${color}12`, borderColor: `${color}25` }]}>
                    <Icon size={12} color={color} />
                    <Text style={[styles.featurePillText, { color }]}>{label}</Text>
                  </View>
                ))}
              </View>

              {/* Option 1: Create Account / Sign In */}
              <Button
                label="Create Account / Sign In"
                onPress={() => { setShowAuthForm(true); setAuthMode('signUp'); }}
                isDark={isDark}
                variant="primary"
                iconRight={<ArrowRight size={18} color="#fff" />}
                style={{ marginTop: 12 }}
              />

              {/* Option 2: Proceed as Guest */}
              <Button
                label="Proceed as Guest"
                onPress={() => animateStep(1)}
                isDark={isDark}
                variant="outline"
                iconRight={<ChevronRight size={18} color={colors.primary} />}
              />

              {/* Skip all */}
              <TouchableOpacity onPress={() => handleFinish(true)} style={styles.skipAllBtn}>
                <Text style={[styles.skipAllText, { color: colors.textMuted }]}>
                  Skip — take me straight to the app
                </Text>
              </TouchableOpacity>
            </View>

            {/* Auth Form Panel — wrapped in KeyboardAvoidingView */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
              style={{ width: contentWidth }}
            >
              <View style={{ gap: 14 }}>
                {/* Back Button */}
                <TouchableOpacity
                  onPress={() => { setShowAuthForm(false); setAuthError(null); }}
                  style={styles.backLink}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <ChevronLeft size={16} color={colors.primary} />
                  <Text style={[styles.backLinkText, { color: colors.primary }]}>Back</Text>
                </TouchableOpacity>

                <View style={styles.welcomeCopy}>
                  <Text style={[styles.welcomeTitle, { color: colors.text, fontSize: 24 }]}>
                    {authMode === 'signIn' ? 'Welcome Back!' : 'Create Account'}
                  </Text>
                  <Text style={[styles.welcomeSub, { color: colors.textMuted, fontSize: 13 }]}>
                    {authMode === 'signIn'
                      ? 'Sign in to restore your stats and sync attempts to the cloud.'
                      : 'Create an account to backup streaks, weak areas, and attempts.'}
                  </Text>
                </View>

                {authError && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{authError}</Text>
                  </View>
                )}

                {/* Email input */}
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email Address"
                  isDark={isDark}
                  icon={<Mail size={16} color={colors.textMuted} />}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  accessibilityLabel="Email input field"
                />

                {/* Password input */}
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  isDark={isDark}
                  icon={<Lock size={16} color={colors.textMuted} />}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleAuthSubmit}
                  accessibilityLabel="Password input field"
                />

                {/* Submit */}
                <Button
                  label={authMode === 'signIn' ? 'Sign In' : 'Create Account'}
                  onPress={handleAuthSubmit}
                  isDark={isDark}
                  loading={authLoading}
                  variant="primary"
                  iconRight={<ArrowRight size={18} color="#fff" />}
                  style={{ marginTop: 4 }}
                />

                {/* Switch mode */}
                <TouchableOpacity
                  onPress={() => { setAuthMode(authMode === 'signIn' ? 'signUp' : 'signIn'); setAuthError(null); }}
                  style={styles.switchAuthBtn}
                >
                  <Text style={[styles.switchAuthText, { color: colors.primary }]}>
                    {authMode === 'signIn' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Animated.View>
    );
  };

  // ── Step 1: Job category ─────────────────────────────────────────────────────
  const renderJobPicker = () => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <View style={[styles.stepIconBg, { backgroundColor: colors.primaryDim }]}>
        <Briefcase size={26} color={colors.primary} />
      </View>
      <Text style={[styles.stepTitle, { color: colors.text }]}>What are you preparing for?</Text>
      <Text style={[styles.stepSub, { color: colors.textMuted }]}>
        We'll personalise your MCQ sets, difficulty, and focus areas.
      </Text>

      <View style={styles.jobGrid}>
        {JOB_CATEGORIES.map((job) => {
          const Icon = job.icon;
          const selected = selectedJob === job.key;
          return (
            <TouchableOpacity
              key={job.key}
              onPress={() => setSelectedJob(job.key)}
              style={[
                styles.jobCard,
                {
                  backgroundColor: selected ? `${job.color}12` : colors.card,
                  borderColor: selected ? job.color : colors.border,
                  borderWidth: selected ? 1.5 : 1,
                },
              ]}
            >
              <View style={styles.jobCardTop}>
                <View style={[styles.jobIconBg, { backgroundColor: `${job.color}18` }]}>
                  <Icon size={18} color={job.color} />
                </View>
                {selected && (
                  <View style={[styles.jobCheck, { backgroundColor: job.color }]}>
                    <CheckCircle size={10} color="#fff" />
                  </View>
                )}
              </View>
              <Text style={[styles.jobEmoji]}>{job.emoji}</Text>
              <Text style={[styles.jobLabel, { color: selected ? job.color : colors.text }]}>{job.label}</Text>
              <Text style={[styles.jobSub, { color: colors.textMuted }]} numberOfLines={1}>{job.sub}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );

  // ── Step 2: Daily goal ───────────────────────────────────────────────────────
  const renderGoalPicker = () => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <View style={[styles.stepIconBg, { backgroundColor: colors.primaryDim }]}>
        <Clock size={26} color={colors.primary} />
      </View>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Set your daily study goal</Text>
      <Text style={[styles.stepSub, { color: colors.textMuted }]}>
        Consistent daily practice is the single biggest predictor of exam success.
      </Text>

      <View style={styles.goalGrid}>
        {DAILY_GOALS.map((goal) => {
          const selected = dailyGoal === goal.value;
          return (
            <TouchableOpacity
              key={goal.value}
              onPress={() => setDailyGoal(goal.value)}
              style={[
                styles.goalCard,
                {
                  backgroundColor: selected ? colors.primaryDim : colors.card,
                  borderColor: selected ? colors.primary : colors.border,
                  borderWidth: selected ? 2 : 1,
                },
              ]}
            >
              <Text style={styles.goalEmoji}>{goal.emoji}</Text>
              <Text style={[styles.goalMinutes, { color: selected ? colors.primary : colors.text }]}>
                {goal.label}
              </Text>
              <Text style={[styles.goalSub, { color: colors.textMuted }]}>{goal.sub}</Text>
              {selected && (
                <View style={[styles.goalCheckBadge, { backgroundColor: colors.primary }]}>
                  <CheckCircle size={10} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );

  // ── Render ───────────────────────────────────────────────────────────────────

  if (step === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
        <ScrollView
          contentContainerStyle={styles.welcomeScroll}
          showsVerticalScrollIndicator={false}
        >
          {renderWelcome()}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Sparkles size={14} color={colors.primary} />
          <Text style={[styles.headerLabel, { color: colors.primary }]}>PERSONALIZATION</Text>
        </View>
        <Text style={[styles.headerStep, { color: colors.textMuted }]}>{step} / 2</Text>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${(step / 2) * 100}%` }]} />
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && renderJobPicker()}
        {step === 2 && renderGoalPicker()}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        {/* Skip this step */}
        <TouchableOpacity
          onPress={() => step === 2 ? handleFinish(false) : animateStep(2)}
          style={styles.skipBtn}
        >
          <Text style={[styles.skipBtnText, { color: colors.textMuted }]}>Skip</Text>
        </TouchableOpacity>

        {/* Continue / Finish */}
        <TouchableOpacity
          onPress={() => {
            if (step === 1) animateStep(2);
            else handleFinish(false);
          }}
          disabled={saving}
          style={[styles.nextBtn, { backgroundColor: colors.primary }]}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.nextBtnText}>{step === 2 ? 'Start Learning 🚀' : 'Continue'}</Text>
              {step < 2 && <ChevronRight size={16} color="#fff" />}
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // Welcome
  welcomeScroll: { flexGrow: 1, padding: 24, paddingTop: 40 },
  welcomeContainer: { alignItems: 'center', gap: 24 },
  logoWrap: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center' },
  ringOuter: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#6366f1',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  logoInner: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeCopy: { alignItems: 'center', gap: 10 },
  welcomeTag: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  welcomeTitle: { fontSize: 28, fontWeight: '900', textAlign: 'center', lineHeight: 36, letterSpacing: -0.5 },
  welcomeSub: { fontSize: 14, textAlign: 'center', lineHeight: 22, maxWidth: SW - 60 },
  featurePills: { flexDirection: 'row', gap: 8 },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  featurePillText: { fontSize: 11, fontWeight: '700' },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    paddingVertical: 17,
    borderRadius: 16,
  },
  ctaBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  ctaBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
  },
  ctaBtnSecondaryText: {
    fontSize: 15,
    fontWeight: '800',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 8,
  },
  backLinkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputWrapper: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  switchAuthBtn: {
    paddingVertical: 12,
    marginTop: 8,
  },
  switchAuthText: {
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    width: '100%',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  skipAllBtn: { paddingVertical: 8 },
  skipAllText: { fontSize: 12, fontWeight: '500', textDecorationLine: 'underline' },
  seedingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  seedingText: { fontSize: 11, fontWeight: '500' },

  // Shared step
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  headerStep: { fontSize: 12, fontWeight: '600' },
  progressTrack: { height: 3, marginHorizontal: 20, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  scrollContent: { padding: 20, paddingBottom: 40, gap: 16 },
  stepIconBg: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  stepTitle: { fontSize: 22, fontWeight: '800', lineHeight: 30, letterSpacing: -0.3 },
  stepSub: { fontSize: 13, lineHeight: 20 },

  // Job grid
  jobGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  jobCard: {
    width: (SW - 50) / 2,
    borderRadius: 16,
    padding: 14,
    gap: 6,
    position: 'relative',
  },
  jobCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobIconBg: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  jobCheck: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  jobEmoji: { fontSize: 22 },
  jobLabel: { fontSize: 12, fontWeight: '800', lineHeight: 16 },
  jobSub: { fontSize: 9, fontWeight: '500' },

  // Goal grid
  goalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 4 },
  goalCard: {
    width: (SW - 52) / 2,
    padding: 16,
    borderRadius: 16,
    gap: 4,
    position: 'relative',
  },
  goalEmoji: { fontSize: 24 },
  goalMinutes: { fontSize: 20, fontWeight: '900' },
  goalSub: { fontSize: 10, fontWeight: '500' },
  goalCheckBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  skipBtn: { paddingHorizontal: 16, paddingVertical: 15, borderRadius: 14 },
  skipBtnText: { fontSize: 13, fontWeight: '600' },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 15,
    borderRadius: 14,
  },
  nextBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});


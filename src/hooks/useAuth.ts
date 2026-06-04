import { useState, useEffect } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../services/auth.service';
import { UserService, type UserProfile } from '../services/user.service';

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  /** True when the user has not completed the onboarding flow yet (either guest or logged in) */
  needsOnboarding: boolean;
}

export const useAuth = (): AuthState & {
  refreshProfile: () => Promise<void>;
} => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [localOnboardingDone, setLocalOnboardingDone] = useState(false);

  const fetchProfile = async (userId: string) => {
    const p = await UserService.getProfile(userId);
    setProfile(p);
    return p;
  };

  const checkLocalOnboarding = async () => {
    try {
      const val = await AsyncStorage.getItem('smart_prep_onboarding_complete');
      setLocalOnboardingDone(val === 'true');
    } catch (_) {
      setLocalOnboardingDone(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      await checkLocalOnboarding();

      // 1. Hydrate session from secure storage on mount
      AuthService.getSession().then(async ({ data: { session } }) => {
        setSession(session);
        const u = session?.user ?? null;
        setUser(u);
        if (u) await fetchProfile(u.id);
        setLoading(false);
      });
    };

    initAuth();

    // 2. Listen for auth state changes (sign-in, sign-out, token refresh)
    const {
      data: { subscription },
    } = AuthService.onAuthStateChange(async (event, session) => {
      setSession(session);
      const u = session?.user ?? null;
      setUser(u);

      if (event === 'SIGNED_IN' && u) {
        await fetchProfile(u.id);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      } else if (event === 'TOKEN_REFRESHED' && u) {
        // Profile already loaded — nothing to do
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    user,
    session,
    profile,
    loading,
    needsOnboarding: !localOnboardingDone && (!user || (profile !== null && !profile.onboarding_done)),
    /** Call this after `UserService.completeOnboarding` or guest onboarding to update UI state */
    refreshProfile: async () => {
      await checkLocalOnboarding();
      if (user) await fetchProfile(user.id);
    },
  };
};


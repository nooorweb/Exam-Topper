import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../context/AppContext';

export const useAuth = () => {
  const { user, profile, loading, refreshProfile } = useApp();
  const [localOnboardingDone, setLocalOnboardingDone] = useState(false);

  const checkLocalOnboarding = async () => {
    try {
      const val = await AsyncStorage.getItem('smart_prep_onboarding_complete');
      setLocalOnboardingDone(val === 'true');
    } catch (_) {
      setLocalOnboardingDone(false);
    }
  };

  useEffect(() => {
    checkLocalOnboarding();
  }, [user, profile]);

  return {
    user,
    session: null, // session not used by layout, safe to return null
    profile,
    loading,
    needsOnboarding: !localOnboardingDone && (!user || (profile !== null && !profile.onboarding_done)),
    refreshProfile,
  };
};

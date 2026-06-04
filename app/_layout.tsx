import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { AppProvider } from '../src/context/AppContext';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useAuth } from '../src/hooks/useAuth';
import OnboardingScreen from '../src/components/onboarding/OnboardingScreen';
import SplashLoader from '../src/components/common/SplashLoader';

/** Inner component — has access to AppProvider context */
function AppShell() {
  const [loaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  const { loading, needsOnboarding, refreshProfile } = useAuth();

  useEffect(() => {
    if (Platform.OS === 'web') {
      const linkId = 'google-font-poppins';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
        document.head.appendChild(link);

        const style = document.createElement('style');
        style.innerHTML = `
          body, input, select, textarea, button {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  // Wait for fonts + auth
  if (!loaded || loading) {
    return <SplashLoader isDark message="Starting Smart Prep..." />;
  }

  // Onboarding gate for new signed-in users
  if (needsOnboarding) {
    return (
      <>
        <OnboardingScreen onComplete={refreshProfile} />
        <StatusBar style="auto" />
      </>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="admin" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
        <Stack.Screen name="wallpaper" options={{ presentation: 'modal' }} />
        <Stack.Screen name="quiz-session" options={{ presentation: 'card' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

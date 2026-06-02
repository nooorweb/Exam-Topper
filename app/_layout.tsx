import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { AppProvider } from '../src/context/AppContext';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

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
          /* Force Poppins as the default font family for standard elements */
          body, input, select, textarea, button {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="admin" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
        <Stack.Screen name="wallpaper" options={{ presentation: 'modal' }} />
        <Stack.Screen name="quiz-session" options={{ presentation: 'card' }} />
      </Stack>
      <StatusBar style="auto" />
    </AppProvider>
  );
}


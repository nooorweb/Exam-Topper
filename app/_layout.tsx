import React from 'react';
import { Stack } from 'expo-router';
import { AppProvider } from '../src/context/AppContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="admin" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
        <Stack.Screen name="quiz-session" options={{ presentation: 'card' }} />
      </Stack>
      <StatusBar style="auto" />
    </AppProvider>
  );
}

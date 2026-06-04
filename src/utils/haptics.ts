/**
 * Platform-aware haptics utility.
 * Wraps expo-haptics with no-op fallbacks for web/unsupported platforms.
 */
import { Platform } from 'react-native';

// Lazily import expo-haptics only on native platforms to avoid web errors
let Haptics: typeof import('expo-haptics') | null = null;

if (Platform.OS !== 'web') {
  try {
    Haptics = require('expo-haptics');
  } catch {
    // expo-haptics not available — silently fail
    Haptics = null;
  }
}

export async function impactLight(): Promise<void> {
  if (!Haptics) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // silently ignore
  }
}

export async function impactMedium(): Promise<void> {
  if (!Haptics) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // silently ignore
  }
}

export async function impactHeavy(): Promise<void> {
  if (!Haptics) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch {
    // silently ignore
  }
}

export async function notificationSuccess(): Promise<void> {
  if (!Haptics) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // silently ignore
  }
}

export async function notificationError(): Promise<void> {
  if (!Haptics) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {
    // silently ignore
  }
}

export async function notificationWarning(): Promise<void> {
  if (!Haptics) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch {
    // silently ignore
  }
}

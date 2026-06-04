/**
 * auth.service.ts
 * Single source of truth for all Supabase authentication calls.
 * No screen or context should import `supabase.auth.*` directly.
 */
import { supabase } from '../lib/supabase';

export const AuthService = {
  // ─── Email / Password ───────────────────────────────────────────────────────

  /** Sign in with email + password */
  signInWithEmail: async (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  /** Sign up with email + password, optional display name stored in metadata */
  signUpWithEmail: async (
    email: string,
    password: string,
    displayName?: string,
  ) =>
    supabase.auth.signUp({
      email,
      password,
      options: displayName ? { data: { full_name: displayName } } : undefined,
    }),

  // ─── Google Sign-In (Native) ────────────────────────────────────────────────
  // TODO: Run `npx expo install @react-native-google-signin/google-signin`
  // then uncomment this block.
  //
  // signInWithGoogle: async () => {
  //   const { GoogleSignin } = await import(
  //     '@react-native-google-signin/google-signin'
  //   );
  //   await GoogleSignin.hasPlayServices();
  //   const { idToken } = await GoogleSignin.signIn();
  //   return supabase.auth.signInWithIdToken({
  //     provider: 'google',
  //     token: idToken!,
  //   });
  // },

  // ─── Session ────────────────────────────────────────────────────────────────

  getSession: () => supabase.auth.getSession(),

  refreshSession: () => supabase.auth.refreshSession(),

  signOut: () => supabase.auth.signOut(),

  // ─── Auth state listener ────────────────────────────────────────────────────

  onAuthStateChange: (
    callback: Parameters<typeof supabase.auth.onAuthStateChange>[0],
  ) => supabase.auth.onAuthStateChange(callback),

  // ─── Password management ────────────────────────────────────────────────────

  /** Send a password-reset email to the given address */
  sendPasswordResetEmail: (email: string) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'smartprep://reset-password',
    }),

  /** Update password (must be called while the user is in a recovery session) */
  updatePassword: (newPassword: string) =>
    supabase.auth.updateUser({ password: newPassword }),
};

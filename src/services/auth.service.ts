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

  // ─── Google OAuth ───────────────────────────────────────────────────────────

  /**
   * Begin Google sign-in via Supabase OAuth.
   * Returns an auth URL that the caller should open with expo-web-browser.
   * Pass `redirectTo` so Supabase sends the user back to the app after auth.
   */
  signInWithGoogle: async (redirectTo: string) =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    }),

  /** Begin Google sign-in directly on web without opening a popup */
  signInWithGoogleWeb: async (redirectTo: string) =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    }),

  /**
   * After the browser redirect completes, exchange the access/refresh tokens
   * extracted from the callback URL fragment for a Supabase session.
   */
  setSessionFromTokens: async (accessToken: string, refreshToken: string) =>
    supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }),

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

/**
 * Standard Typography System
 * Following Material Design 3 guidelines
 */

export const typography = {
  // Display styles (largest, for page titles)
  displayLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
  displayMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
  },

  // Headline styles
  headlineLarge: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
  },
  headlineMedium: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  headlineSmall: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600' as const,
  },

  // Title styles
  titleLarge: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600' as const,
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },

  // Body styles
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400' as const,
  },

  // Label styles
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500' as const,
  },

  // Caption (smallest)
  caption: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '400' as const,
  },
};

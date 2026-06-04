/**
 * Standard Typography System
 * Following Material Design 3 guidelines
 */

export const typography = {
  // Display styles (largest, for page titles)
  displayLarge: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
  displayMedium: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
  },

  // Headline styles
  headlineLarge: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
  },
  headlineMedium: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  headlineSmall: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600' as const,
  },

  // Title styles
  titleLarge: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600' as const,
  },
  titleMedium: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  titleSmall: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },

  // Body styles
  bodyLarge: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400' as const,
  },

  // Label styles
  labelLarge: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  labelMedium: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  labelSmall: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500' as const,
  },

  // Caption (smallest)
  caption: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '400' as const,
  },
};

/**
 * Unified Spacing System
 * Based on Material Design 3 spacing scale
 * Ensures consistent whitespace and breathing room throughout the app
 */

export const spacing = {
  // Base unit: 4px
  xs: 4,      // Small gaps, tight spacing
  sm: 8,      // Small margins
  md: 12,     // Medium gaps
  base: 16,   // Standard padding/margin
  lg: 20,     // Large spacing
  xl: 24,     // Extra large spacing
  '2xl': 32,  // Double large spacing
  '3xl': 40,  // Triple large spacing
  '4xl': 48,  // Quadruple large spacing
} as const;

/**
 * Component Spacing Guidelines
 */
export const componentSpacing = {
  // Card & Container
  cardPadding: spacing.lg,          // 20px internal padding
  cardMargin: spacing.base,         // 16px between cards
  cardGap: spacing.md,              // 12px between elements in card
  
  // Section
  sectionPadding: spacing.lg,       // 20px padding
  sectionMargin: spacing.xl,        // 24px between sections
  sectionGap: spacing.md,           // 12px between items
  
  // Button & Touch Target
  buttonPadding: `${spacing.md} ${spacing.lg}`, // Vertical: 12px, Horizontal: 20px
  buttonMinHeight: 44,              // iOS minimum touch target
  buttonMinWidth: 44,
  buttonRadius: 12,                 // Subtle border radius
  
  // Input
  inputPadding: `${spacing.md} ${spacing.lg}`, // 12px vertical, 20px horizontal
  inputRadius: 12,
  
  // List Items
  listItemPadding: `${spacing.md} ${spacing.base}`, // 12px vertical, 16px horizontal
  listItemGap: spacing.base,        // 16px between items
  
  // Icon Spacing
  iconSize: 20,
  iconMargin: spacing.sm,           // 8px gap after icons
  
  // Text Spacing
  lineHeight: 1.5,                  // Default line height
  lineHeightTitle: 1.2,             // Compact for titles
  lineHeightBody: 1.6,              // Comfortable for body text
  
  // Screen
  screenPaddingVertical: spacing.lg,
  screenPaddingHorizontal: spacing.base,
  screenContentGap: spacing.xl,
} as const;

/**
 * Responsive Spacing Breakpoints
 * Note: React Native doesn't have true breakpoints, but you can use dimensions
 */
export const breakpoints = {
  xs: 0,      // Mobile
  sm: 375,
  md: 768,
  lg: 1024,
} as const;

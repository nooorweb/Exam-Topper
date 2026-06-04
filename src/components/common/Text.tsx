import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { typography } from '../../lib/typography';

export interface TextProps extends RNTextProps {
  variant?: keyof typeof typography;
  fontFamily?: 'Poppins-Regular' | 'Poppins-Medium' | 'Poppins-SemiBold' | 'Poppins-Bold';
}

export default function Text({ style, variant, fontFamily, ...props }: TextProps) {
  // Resolve base styles from variant if provided
  const variantStyle = variant ? typography[variant] : {};

  // Flatten the style props to inspect properties like fontWeight
  const flattenedStyle = (StyleSheet.flatten([variantStyle, style]) || {}) as TextStyle;

  // Infer fontFamily from fontWeight if not explicitly provided
  let resolvedFontFamily = fontFamily;
  if (!resolvedFontFamily) {
    const fontWeight = flattenedStyle.fontWeight;
    if (fontWeight === '700' || fontWeight === 'bold' || fontWeight === '900' || fontWeight === '800') {
      resolvedFontFamily = 'Poppins-Bold';
    } else if (fontWeight === '600') {
      resolvedFontFamily = 'Poppins-SemiBold';
    } else if (fontWeight === '500') {
      resolvedFontFamily = 'Poppins-Medium';
    } else {
      resolvedFontFamily = 'Poppins-Regular';
    }
  }

  const finalStyle: TextStyle = {
    ...variantStyle,
    ...flattenedStyle,
    fontFamily: resolvedFontFamily,
  };

  return <RNText style={finalStyle} {...props} />;
}

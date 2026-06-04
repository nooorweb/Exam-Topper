/**
 * Button — reusable animated press button with spring scale feedback.
 *
 * Variants:
 *   primary   — filled indigo (default)
 *   secondary — filled neutral
 *   outline   — transparent with border
 *   danger    — red destructive actions
 *   ghost     — no background, text-only
 *
 * Guarantees ≥44pt touch target per WCAG / iOS HIG.
 *
 * Usage:
 *   <Button label="Start Quiz" onPress={...} isDark={isDark} />
 *   <Button label="Delete" variant="danger" onPress={...} isDark={isDark} />
 *   <Button icon={<Play size={16} color="#fff" />} label="Play" onPress={...} isDark={isDark} />
 */
import React, { useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Text from './Text';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  isDark: boolean;
  variant?: Variant;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  fullWidth?: boolean;
}

export default function Button({
  label,
  onPress,
  isDark,
  variant = 'primary',
  icon,
  iconRight,
  disabled,
  loading,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
  fullWidth = true,
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 150,
      friction: 6,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 150,
      friction: 6,
    }).start();
  };

  // Resolve colours per variant
  const resolvedBg = (() => {
    if (disabled) return isDark ? '#27272a' : '#e5e7eb';
    switch (variant) {
      case 'primary':   return '#6366f1';
      case 'secondary': return isDark ? '#27272a' : '#f3f4f6';
      case 'outline':   return 'transparent';
      case 'danger':    return isDark ? 'rgba(239,68,68,0.15)' : '#fee2e2';
      case 'ghost':     return 'transparent';
    }
  })();

  const resolvedBorder = (() => {
    switch (variant) {
      case 'outline': return '#6366f1';
      case 'danger':  return isDark ? 'rgba(239,68,68,0.35)' : '#fca5a5';
      default:        return 'transparent';
    }
  })();

  const resolvedTextColor = (() => {
    if (disabled) return isDark ? '#52525b' : '#9ca3af';
    switch (variant) {
      case 'primary':   return '#ffffff';
      case 'secondary': return isDark ? '#f4f4f5' : '#1f2937';
      case 'outline':   return '#6366f1';
      case 'danger':    return isDark ? '#f87171' : '#991b1b';
      case 'ghost':     return '#6366f1';
    }
  })();

  return (
    <Animated.View
      style={[
        fullWidth && styles.fullWidth,
        { transform: [{ scale }] },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled || loading}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: !!(disabled || loading) }}
        testID={testID}
        style={[
          styles.btn,
          {
            backgroundColor: resolvedBg,
            borderColor: resolvedBorder,
            borderWidth: variant === 'outline' || variant === 'danger' ? 1.5 : 0,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={resolvedTextColor} size="small" />
        ) : (
          <>
            {icon && <View style={styles.iconLeft}>{icon}</View>}
            <Text style={[styles.label, { color: resolvedTextColor }, textStyle]}>
              {label}
            </Text>
            {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Minimum 44pt touch target
    minHeight: 44,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 13,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  iconLeft: {
    flexShrink: 0,
  },
  iconRight: {
    flexShrink: 0,
  },
});

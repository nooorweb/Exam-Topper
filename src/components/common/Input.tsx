/**
 * Input — reusable themed text input with leading icon support.
 *
 * Usage:
 *   <Input
 *     value={q}
 *     onChangeText={setQ}
 *     placeholder="Search..."
 *     icon={<Search size={14} color={colors.textMuted} />}
 *     isDark={isDark}
 *   />
 */
import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
} from 'react-native';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isDark: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
  testID?: string;
  multiline?: boolean;
  editable?: boolean;
}

export default function Input({
  value,
  onChangeText,
  placeholder,
  isDark,
  icon,
  iconRight,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  returnKeyType,
  onSubmitEditing,
  style,
  accessibilityLabel,
  testID,
  multiline,
  editable = true,
}: InputProps) {
  const bg = isDark ? '#0E1117' : '#ffffff';
  const borderColor = isDark ? '#2A2D3A' : '#e5e7eb';
  const textColor = isDark ? '#e1e2eb' : '#1f2937';
  const mutedColor = isDark ? '#c8c4d6' : '#6b7280';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bg, borderColor },
        style,
      ]}
    >
      {icon && <View style={styles.iconLeft}>{icon}</View>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={mutedColor}
        style={[styles.input, { color: textColor }]}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        multiline={multiline}
        editable={editable}
      />
      {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    // Minimum 44pt touch target height
    minHeight: 48,
    gap: 10,
  },
  iconLeft: {
    flexShrink: 0,
  },
  iconRight: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
});

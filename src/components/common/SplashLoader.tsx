/**
 * SplashLoader.tsx
 * Full-screen loading/skeleton component used across the app.
 * Shows a pulsing branded loader with optional message.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { GraduationCap } from 'lucide-react-native';

interface SplashLoaderProps {
  isDark: boolean;
  message?: string;
  size?: 'full' | 'inline';
}

export default function SplashLoader({
  isDark,
  message = 'Loading...',
  size = 'full',
}: SplashLoaderProps) {
  const pulse = useRef(new Animated.Value(0.6)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const shimmer1 = useRef(new Animated.Value(0)).current;
  const shimmer2 = useRef(new Animated.Value(0)).current;
  const shimmer3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(pulse, { toValue: 0.6, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();

    // Spin ring
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1400, useNativeDriver: true, easing: Easing.linear })
    ).start();

    // Staggered shimmer bars
    const shimmerAnim = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0.2, duration: 600, useNativeDriver: true }),
        ])
      );

    shimmerAnim(shimmer1, 0).start();
    shimmerAnim(shimmer2, 200).start();
    shimmerAnim(shimmer3, 400).start();
  }, []);

  const spinInterpolate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const colors = {
    bg: isDark ? '#09090b' : '#f9fafb',
    card: isDark ? '#121214' : '#ffffff',
    border: isDark ? '#1f1f23' : '#e5e7eb',
    text: isDark ? '#f4f4f5' : '#1f2937',
    textMuted: isDark ? '#6b7280' : '#9ca3af',
    shimmer: isDark ? '#1f1f23' : '#f3f4f6',
    primary: '#6366f1',
  };

  if (size === 'inline') {
    return (
      <View style={[styles.inlineContainer, { backgroundColor: colors.bg }]}>
        <Animated.View style={{ opacity: pulse }}>
          <View style={[styles.inlineIconBg, { backgroundColor: `${colors.primary}18` }]}>
            <GraduationCap size={20} color={colors.primary} />
          </View>
        </Animated.View>
        <Text style={[styles.inlineMsg, { color: colors.textMuted }]}>{message}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.fullContainer, { backgroundColor: colors.bg }]}>
      {/* Spinning ring */}
      <View style={styles.ringWrap}>
        <Animated.View
          style={[
            styles.ring,
            { borderTopColor: colors.primary, transform: [{ rotate: spinInterpolate }] },
          ]}
        />
        {/* Icon center */}
        <Animated.View style={[styles.iconCenter, { backgroundColor: `${colors.primary}15`, opacity: pulse }]}>
          <GraduationCap size={28} color={colors.primary} />
        </Animated.View>
      </View>

      {/* Brand text */}
      <Text style={[styles.brand, { color: colors.text }]}>Smart Prep</Text>
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>

      {/* Skeleton shimmer cards */}
      <View style={[styles.skeletonWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {[shimmer1, shimmer2, shimmer3].map((anim, i) => (
          <Animated.View
            key={i}
            style={[
              styles.shimmerBar,
              {
                backgroundColor: colors.shimmer,
                width: i === 0 ? '80%' : i === 1 ? '60%' : '70%',
                opacity: anim,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  ringWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  iconCenter: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 13,
    fontWeight: '500',
  },
  skeletonWrap: {
    width: 220,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
    marginTop: 8,
    alignItems: 'flex-start',
  },
  shimmerBar: {
    height: 10,
    borderRadius: 6,
  },
  inlineContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 40,
  },
  inlineIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineMsg: {
    fontSize: 12,
    fontWeight: '500',
  },
});

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../constants/colors';

const { width, height } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    StatusBar.setHidden(true);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, speed: 8, bounciness: 12, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      // Pulse the logo before leaving
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ]),
        { iterations: 2 }
      ).start(() => {
        StatusBar.setHidden(false);
        StatusBar.setBarStyle('light-content');
        setTimeout(onFinish, 400);
      });
    });
  }, []);

  return (
    <LinearGradient
      colors={[Colors.background, Colors.surface, '#001524']}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoWrapper,
            { opacity: logoOpacity, transform: [{ scale: Animated.multiply(logoScale, pulseAnim) }] },
          ]}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.logoHand}>🤟</Text>
          </LinearGradient>
          {/* Glow ring */}
          <View style={styles.glowRing} />
        </Animated.View>

        {/* App Name */}
        <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
          MotionSpeak
        </Animated.Text>

        <Animated.Text style={[styles.tagline, { opacity: subtitleOpacity }]}>
          Filipino Sign Language Interpreter
        </Animated.Text>

        <Animated.View style={[styles.badge, { opacity: subtitleOpacity }]}>
          <Text style={styles.badgeText}>🏥 Healthcare Edition</Text>
        </Animated.View>
      </View>

      {/* Bottom credits */}
      <Animated.Text style={[styles.credits, { opacity: subtitleOpacity }]}>
        Centro Escolar University – Makati
      </Animated.Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  logoHand: {
    fontSize: 48,
  },
  glowRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: Colors.primary + '20',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  badgeText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  credits: {
    position: 'absolute',
    bottom: 40,
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
});
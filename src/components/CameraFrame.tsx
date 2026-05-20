import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/colors';

interface CameraFrameProps {
  isActive: boolean;
  isDetecting: boolean;
}

export const CameraFrame: React.FC<CameraFrameProps> = ({ isActive, isDetecting }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isDetecting) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.02, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
          Animated.timing(glowAnim, { toValue: 0.3, duration: 800, useNativeDriver: false }),
        ])
      );
      pulse.start();
      glow.start();
      return () => { pulse.stop(); glow.stop(); };
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [isDetecting]);

  const cornerColor = isDetecting ? Colors.success : isActive ? Colors.primary : Colors.textMuted;
  const borderOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <Animated.View style={[styles.frame, { transform: [{ scale: pulseAnim }] }]}>
      {/* Top Left */}
      <View style={[styles.corner, styles.cornerTopLeft, { borderColor: cornerColor }]} />
      {/* Top Right */}
      <View style={[styles.corner, styles.cornerTopRight, { borderColor: cornerColor }]} />
      {/* Bottom Left */}
      <View style={[styles.corner, styles.cornerBottomLeft, { borderColor: cornerColor }]} />
      {/* Bottom Right */}
      <View style={[styles.corner, styles.cornerBottomRight, { borderColor: cornerColor }]} />

      {/* Center reticle */}
      <View style={styles.center}>
        <View style={[styles.reticleDot, { backgroundColor: cornerColor }]} />
      </View>
    </Animated.View>
  );
};

const CORNER_SIZE = 28;
const BORDER_W = 3;

const styles = StyleSheet.create({
  frame: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    bottom: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  cornerTopLeft: {
    top: 0, left: 0,
    borderTopWidth: BORDER_W, borderLeftWidth: BORDER_W,
    borderTopLeftRadius: 6,
  },
  cornerTopRight: {
    top: 0, right: 0,
    borderTopWidth: BORDER_W, borderRightWidth: BORDER_W,
    borderTopRightRadius: 6,
  },
  cornerBottomLeft: {
    bottom: 0, left: 0,
    borderBottomWidth: BORDER_W, borderLeftWidth: BORDER_W,
    borderBottomLeftRadius: 6,
  },
  cornerBottomRight: {
    bottom: 0, right: 0,
    borderBottomWidth: BORDER_W, borderRightWidth: BORDER_W,
    borderBottomRightRadius: 6,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
  },
});
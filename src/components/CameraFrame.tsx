import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../constants/theme';

interface Props {
  isActive: boolean;
  isDetecting: boolean;
}

export const CameraFrame: React.FC<Props> = ({ isActive, isDetecting }) => {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isDetecting) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.02, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isDetecting]);

  // Always white on camera — camera bg is always dark regardless of app theme
  const cornerColor = isDetecting
    ? '#10B981'
    : isActive
    ? '#FFFFFF'
    : 'rgba(255,255,255,0.4)';

  return (
    <Animated.View style={[styles.frame, { transform: [{ scale: pulseAnim }] }]}>
      <View style={[styles.corner, styles.cornerTopLeft, { borderColor: cornerColor }]} />
      <View style={[styles.corner, styles.cornerTopRight, { borderColor: cornerColor }]} />
      <View style={[styles.corner, styles.cornerBottomLeft, { borderColor: cornerColor }]} />
      <View style={[styles.corner, styles.cornerBottomRight, { borderColor: cornerColor }]} />
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
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  cornerTopLeft: {
    top: 0, left: 0,
    borderTopWidth: BORDER_W,
    borderLeftWidth: BORDER_W,
    borderTopLeftRadius: 6,
  },
  cornerTopRight: {
    top: 0, right: 0,
    borderTopWidth: BORDER_W,
    borderRightWidth: BORDER_W,
    borderTopRightRadius: 6,
  },
  cornerBottomLeft: {
    bottom: 0, left: 0,
    borderBottomWidth: BORDER_W,
    borderLeftWidth: BORDER_W,
    borderBottomLeftRadius: 6,
  },
  cornerBottomRight: {
    bottom: 0, right: 0,
    borderBottomWidth: BORDER_W,
    borderRightWidth: BORDER_W,
    borderBottomRightRadius: 6,
  },
});
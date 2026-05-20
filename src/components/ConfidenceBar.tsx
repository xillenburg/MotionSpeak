import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/colors';

interface ConfidenceBarProps {
  confidence: number; // 0 to 1
  label?: string;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ confidence, label }) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const pct = Math.round(confidence * 100);

  const barColor =
    pct >= 85 ? Colors.confidenceHigh :
    pct >= 60 ? Colors.confidenceMid :
    Colors.confidenceLow;

  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: confidence,
      useNativeDriver: false,
      speed: 12,
      bounciness: 3,
    }).start();
  }, [confidence]);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label ?? 'Confidence'}</Text>
        <Text style={[styles.pct, { color: barColor }]}>{pct}%</Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: barColor,
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pct: {
    fontSize: 11,
    fontWeight: '700',
  },
  track: {
    height: 4,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});
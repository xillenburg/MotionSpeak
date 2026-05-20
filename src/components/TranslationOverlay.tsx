import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../constants/colors';
import { ConfidenceBar } from './ConfidenceBar';
import { TranslationResult } from '../store/useAppStore';

interface TranslationOverlayProps {
  result: TranslationResult | null;
  isProcessing: boolean;
  displayLanguage: 'en' | 'fil' | 'both';
  onSpeakPress?: () => void;
  ttsEnabled: boolean;
}

export const TranslationOverlay: React.FC<TranslationOverlayProps> = ({
  result,
  isProcessing,
  displayLanguage,
  onSpeakPress,
  ttsEnabled,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (result) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1, duration: 250, useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0, speed: 14, bounciness: 6, useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0, duration: 200, useNativeDriver: true,
      }).start();
      slideAnim.setValue(30);
    }
  }, [result?.label]);

  if (!result && !isProcessing) {
    return (
      <View style={styles.idleContainer}>
        <View style={styles.idleIconRing}>
          <Icon name="hand-wave-outline" size={28} color={Colors.primary} />
        </View>
        <Text style={styles.idleText}>Start signing to translate</Text>
        <Text style={styles.idleSubtext}>Position your hands within the camera frame</Text>
      </View>
    );
  }

  if (isProcessing && !result) {
    return (
      <View style={styles.idleContainer}>
        <View style={styles.processingRing}>
          <Icon name="progress-clock" size={26} color={Colors.primary} />
        </View>
        <Text style={styles.idleText}>Analyzing gesture...</Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.resultContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.resultHeader}>
        <View style={styles.signBadge}>
          <Icon name="hand-right" size={14} color={Colors.primary} />
          <Text style={styles.signBadgeText}>FSL DETECTED</Text>
        </View>
        {ttsEnabled && (
          <TouchableOpacity
            style={styles.speakBtn}
            onPress={onSpeakPress}
            activeOpacity={0.7}
          >
            <Icon name="volume-high" size={18} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {(displayLanguage === 'en' || displayLanguage === 'both') && (
        <Text style={styles.translationText}>{result?.label}</Text>
      )}
      {(displayLanguage === 'fil' || displayLanguage === 'both') && (
        <Text style={styles.translationFilipino}>{result?.labelFil}</Text>
      )}

      <View style={styles.confidenceSection}>
        <ConfidenceBar confidence={result?.confidence ?? 0} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  idleContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  idleIconRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: Colors.primary + '60',
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  processingRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: Colors.warning + '60',
    backgroundColor: Colors.warning + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  idleText: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
    textAlign: 'center',
  },
  idleSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  resultContainer: {
    width: '100%',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  signBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  signBadgeText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  speakBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  translationText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
    lineHeight: 38,
  },
  translationFilipino: {
    fontSize: 18,
    fontWeight: '400',
    color: Colors.primary,
    marginTop: 2,
    marginBottom: 12,
  },
  confidenceSection: {
    marginTop: 8,
  },
});
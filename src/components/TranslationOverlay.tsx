import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TranslationResult } from '../store/useAppStore';
import { useTheme } from '../constants/theme';

interface Props {
  result: TranslationResult | null;
  isProcessing: boolean;
  displayLanguage: 'en' | 'fil';
  onSpeakPress?: () => void;
  ttsEnabled: boolean;
}

export const TranslationOverlay: React.FC<Props> = ({
  result,
  isProcessing,
  displayLanguage,
  onSpeakPress,
  ttsEnabled,
}) => {
  const { colors, fs } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (result) {
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1, duration: 200, useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0, speed: 18, bounciness: 4, useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0, duration: 150, useNativeDriver: true,
      }).start();
    }
  }, [result?.label]);

  if (!result && !isProcessing) {
    return (
      <View style={styles.idleContainer}>
        <View style={[styles.idleIcon, { backgroundColor: colors.primaryLight }]}>
          <Icon name="hand-wave-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.idleTextBlock}>
          <Text style={[styles.idleTitle, { color: colors.textPrimary, fontSize: fs(15) }]}>
            Ready to translate
          </Text>
          <Text style={[styles.idleSub, { color: colors.textSecondary, fontSize: fs(13) }]}>
            Position hands within the frame
          </Text>
        </View>
      </View>
    );
  }

  if (isProcessing && !result) {
    return (
      <View style={styles.idleContainer}>
        <View style={[styles.idleIcon, { backgroundColor: colors.warningLight }]}>
          <Icon name="motion-sensor" size={24} color={colors.warning} />
        </View>
        <View style={styles.idleTextBlock}>
          <Text style={[styles.idleTitle, { color: colors.textPrimary, fontSize: fs(15) }]}>
            Analyzing...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      <View style={styles.resultRow}>
        <View style={styles.resultTextBlock}>
          {displayLanguage === 'fil' ? (
            <>
              <Text
                style={[styles.mainLabel, { color: colors.textPrimary, fontSize: fs(30) }]}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {result?.labelFil}
              </Text>
              <Text style={[styles.subLabel, { color: colors.textSecondary, fontSize: fs(14) }]}>
                {result?.label}
              </Text>
            </>
          ) : (
            <>
              <Text
                style={[styles.mainLabel, { color: colors.textPrimary, fontSize: fs(30) }]}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {result?.label}
              </Text>
              <Text style={[styles.subLabel, { color: colors.textSecondary, fontSize: fs(14) }]}>
                {result?.labelFil}
              </Text>
            </>
          )}
        </View>

        {ttsEnabled && (
          <TouchableOpacity
            style={[
              styles.speakBtn,
              {
                backgroundColor: colors.primaryLight,
                borderColor: colors.primary + '30',
              },
            ]}
            onPress={onSpeakPress}
            activeOpacity={0.7}
          >
            <Icon name="volume-high" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  idleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  idleIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idleTextBlock: { flex: 1 },
  idleTitle: { fontWeight: '500' },
  idleSub: { marginTop: 2 },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  resultTextBlock: { flex: 1 },
  mainLabel: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subLabel: {
    marginTop: 4,
    fontWeight: '400',
  },
  speakBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
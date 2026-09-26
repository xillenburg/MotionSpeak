import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeCamera } from '../components/NativeCamera';
import { CameraFrame } from '../components/CameraFrame';
import { useAppStore } from '../store/useAppStore';
import { useTTS } from '../hooks/useTTS';
import { useTheme } from '../constants/theme';

const { height } = Dimensions.get('window');

interface Props {
  navigation: any;
}

export const CameraScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { colors, fs, darkMode } = useTheme();
  const [facingFront, setFacingFront] = useState<boolean>(true);

  const {
    isCameraActive,
    setCameraActive,
    ttsEnabled,
    setTtsEnabled,
    displayLanguage,
    showLandmarks,
    clearHistory,
    sentence,
    sentenceFil,
    processedSentence,
    processedSentenceFil,
    isLLMProcessed,
    appendToSentence,
    clearSentence,
  } = useAppStore();

  const { speak } = useTTS();

  useEffect(() => {
    StatusBar.setHidden(true);
    setCameraActive(true);
    return () => {
      StatusBar.setHidden(false);
      setCameraActive(false);
    };
  }, []);

  // What to display — LLM processed takes priority if available
  const displayText = isLLMProcessed
    ? (displayLanguage === 'fil' ? processedSentenceFil : processedSentence)
    : (displayLanguage === 'fil' ? sentenceFil : sentence);

  const hasText = displayText.trim().length > 0;

  const simulateDetection = () => {
    const mockSigns = [
      { label: 'Hello', labelFil: 'Kamusta', confidence: 0.94 },
      { label: 'Pain', labelFil: 'Sakit', confidence: 0.91 },
      { label: 'Where', labelFil: 'Saan', confidence: 0.88 },
      { label: 'Help', labelFil: 'Tulong', confidence: 0.97 },
      { label: 'Fever', labelFil: 'Lagnat', confidence: 0.89 },
      { label: 'Thank You', labelFil: 'Salamat Po', confidence: 0.95 },
    ];
    const random = mockSigns[Math.floor(Math.random() * mockSigns.length)];
    appendToSentence(random.label, random.labelFil);
    if (ttsEnabled) speak(random.label, random.labelFil);
  };

  const handleSpeak = () => {
    if (!hasText) return;
    speak(
      isLLMProcessed ? processedSentence : sentence,
      isLLMProcessed ? processedSentenceFil : sentenceFil,
    );
  };

  const handleClear = () => {
    Alert.alert(
      'Clear',
      'Clear the current sentence?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearSentence },
      ]
    );
  };

  // Theme-aware button styles
  const btnBg = darkMode ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.92)';
  const btnBorder = darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
  const btnIconColor = darkMode ? '#FFFFFF' : '#0F172A';
  const panelBg = darkMode ? 'rgba(15,23,42,0.97)' : 'rgba(255,255,255,0.98)';
  const panelBorder = darkMode ? 'rgba(255,255,255,0.08)' : colors.border;
  const handleColor = darkMode ? 'rgba(255,255,255,0.2)' : colors.border;

  // Language label shown on panel
  const languageLabel = displayLanguage === 'fil' ? '🇵🇭 Filipino' : '🇺🇸 English';
  const languageLabelColor = displayLanguage === 'fil' ? '#10B981' : '#3B82F6';

  return (
    <View style={styles.container}>
      {/* Camera Feed */}
      <NativeCamera style={styles.cameraFull} facingFront={facingFront} />

      {/* Dark mode overlays */}
      {darkMode && (
        <>
          <View style={styles.topGradient} pointerEvents="none" />
          <View style={styles.bottomGradient} pointerEvents="none" />
        </>
      )}

      {/* Camera Frame Guide */}
      {showLandmarks && (
        <CameraFrame
          isActive={isCameraActive}
          isDetecting={hasText}
        />
      )}

      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: btnBg, borderColor: btnBorder }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Icon name="close" size={20} color={btnIconColor} />
        </TouchableOpacity>

        <View style={[styles.liveChip, { backgroundColor: btnBg, borderColor: btnBorder }]}>
          <View style={[
            styles.liveDot,
            { backgroundColor: isCameraActive ? '#EF4444' : '#94A3B8' },
          ]} />
          <Text style={[styles.liveText, { color: btnIconColor, fontSize: fs(11) }]}>
            {isCameraActive ? 'LIVE' : 'STANDBY'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: btnBg, borderColor: btnBorder }]}
          onPress={() =>
            Alert.alert('Clear History', 'Remove all translation history?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: clearHistory },
            ])
          }
          activeOpacity={0.8}
        >
          <Icon name="delete-outline" size={20} color={btnIconColor} />
        </TouchableOpacity>
      </View>

      {/* Side Controls */}
      <View style={[styles.sideControls, { top: height * 0.3 }]}>
        <TouchableOpacity
          style={[
            styles.iconBtn,
            {
              backgroundColor: ttsEnabled ? colors.primary : btnBg,
              borderColor: ttsEnabled ? colors.primary : btnBorder,
            },
          ]}
          onPress={() => setTtsEnabled(!ttsEnabled)}
          activeOpacity={0.8}
        >
          <Icon
            name={ttsEnabled ? 'volume-high' : 'volume-mute'}
            size={18}
            color={ttsEnabled ? '#FFFFFF' : btnIconColor}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: btnBg, borderColor: btnBorder }]}
          onPress={() => setFacingFront(prev => !prev)}
          activeOpacity={0.8}
        >
          <Icon name="camera-flip-outline" size={18} color={btnIconColor} />
        </TouchableOpacity>
      </View>

      {/* Bottom Panel */}
      <View style={[
        styles.bottomPanel,
        {
          backgroundColor: panelBg,
          borderTopColor: panelBorder,
          paddingBottom: insets.bottom + 16,
        },
      ]}>
        <View style={[styles.panelHandle, { backgroundColor: handleColor }]} />

        {/* Language Indicator */}
        <View style={styles.panelTopRow}>
          <View style={[
            styles.languageBadge,
            { backgroundColor: languageLabelColor + '15', borderColor: languageLabelColor + '30' },
          ]}>
            <Text style={[styles.languageBadgeText, { color: languageLabelColor, fontSize: fs(11) }]}>
              {languageLabel}
            </Text>
          </View>

          {/* LLM badge — shown when sentence has been processed */}
          {isLLMProcessed && (
            <View style={[
              styles.languageBadge,
              { backgroundColor: colors.primaryLight, borderColor: colors.primary + '30' },
            ]}>
              <Icon name="creation" size={11} color={colors.primary} />
              <Text style={[styles.languageBadgeText, { color: colors.primary, fontSize: fs(11) }]}>
                AI Processed
              </Text>
            </View>
          )}
        </View>

        {/* Sentence Display Area */}
        <ScrollView
          style={styles.sentenceScroll}
          contentContainerStyle={styles.sentenceScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {hasText ? (
            <Text style={[
              styles.sentenceText,
              { color: colors.textPrimary, fontSize: fs(24) },
            ]}>
              {displayText}
            </Text>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="hand-wave-outline" size={28} color={colors.textMuted} />
              <Text style={[styles.emptyStateText, { color: colors.textMuted, fontSize: fs(14) }]}>
                Start signing
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.panelActions}>
          {hasText && ttsEnabled && (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: colors.primaryLight, borderColor: colors.primary + '30' },
              ]}
              onPress={handleSpeak}
              activeOpacity={0.8}
            >
              <Icon name="volume-high" size={15} color={colors.primary} />
              <Text style={[styles.actionBtnText, { color: colors.primary, fontSize: fs(13) }]}>
                Speak
              </Text>
            </TouchableOpacity>
          )}

          {hasText && (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: colors.errorLight, borderColor: colors.error + '25' },
              ]}
              onPress={handleClear}
              activeOpacity={0.8}
            >
              <Icon name="backspace-outline" size={15} color={colors.error} />
              <Text style={[styles.actionBtnText, { color: colors.error, fontSize: fs(13) }]}>
                Clear
              </Text>
            </TouchableOpacity>
          )}

          {/* Simulate. Remove when AI is injected */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: colors.primaryLight, borderColor: colors.primary + '35' },
            ]}
            onPress={simulateDetection}
            activeOpacity={0.8}
          >
            <Icon name="hand-wave-outline" size={15} color={colors.primary} />
            <Text style={[styles.actionBtnText, { color: colors.primary, fontSize: fs(13) }]}>
              Simulate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraFull: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topGradient: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 160,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 360,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 2,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveText: {
    fontWeight: '600',
    letterSpacing: 1,
  },
  sideControls: {
    position: 'absolute',
    right: 16,
    gap: 10,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  panelHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  panelTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  languageBadgeText: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sentenceScroll: {
    maxHeight: 110,
  },
  sentenceScrollContent: {
    paddingBottom: 4,
  },
  sentenceText: {
    fontWeight: '600',
    letterSpacing: -0.2,
    lineHeight: 34,
  },
  emptyState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  emptyStateText: {
    fontWeight: '400',
  },
  panelActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  actionBtnText: {
    fontWeight: '500',
  },
});
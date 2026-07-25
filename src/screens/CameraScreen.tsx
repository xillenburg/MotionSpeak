import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeCamera } from '../components/NativeCamera';
import { TranslationOverlay } from '../components/TranslationOverlay';
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
    currentTranslation,
    isProcessing,
    ttsEnabled,
    setTtsEnabled,
    displayLanguage,
    showLandmarks,
    clearHistory,
    setCurrentTranslation,
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

  const simulateDetection = () => {
    const mockSigns = [
      { label: 'Pain', labelFil: 'Sakit', confidence: 0.94 },
      { label: 'Fever', labelFil: 'Lagnat', confidence: 0.88 },
      { label: 'Thank You', labelFil: 'Salamat Po', confidence: 0.97 },
      { label: 'Headache', labelFil: 'Sakit ng Ulo', confidence: 0.91 },
    ];
    const random = mockSigns[Math.floor(Math.random() * mockSigns.length)];
    setCurrentTranslation({ ...random, timestamp: Date.now() });
    if (ttsEnabled) speak(random.label, random.labelFil);
  };

  const btnBg = darkMode ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.92)';
  const btnBorder = darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
  const btnIconColor = darkMode ? '#FFFFFF' : '#0F172A';
  const panelBg = darkMode ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.97)';
  const panelBorder = darkMode ? 'rgba(255,255,255,0.08)' : colors.border;
  const handleColor = darkMode ? 'rgba(255,255,255,0.2)' : colors.border;

  return (
    <View style={styles.container}>
      {/* Camera Feed */}
      <NativeCamera style={styles.cameraFull} facingFront={facingFront} />

      {/* Dark mode overlays only */}
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
          isDetecting={isProcessing || !!currentTranslation}
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
            Alert.alert(
              'Clear History',
              'Remove all translation history?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: clearHistory },
              ]
            )
          }
          activeOpacity={0.8}
        >
          <Icon name="delete-outline" size={20} color={btnIconColor} />
        </TouchableOpacity>
      </View>

      {/* Side Controls */}
      <View style={[styles.sideControls, { top: height * 0.3 }]}>
        {/* TTS toggle — mute/unmute */}
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

        {/* Camera flip */}
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

        <TranslationOverlay
          result={currentTranslation}
          isProcessing={isProcessing}
          displayLanguage={displayLanguage}
          onSpeakPress={() => {
            if (currentTranslation) {
              speak(currentTranslation.label, currentTranslation.labelFil);
            }
          }}
          ttsEnabled={ttsEnabled}
        />

        <TouchableOpacity
          style={[
            styles.simulateBtn,
            {
              backgroundColor: colors.primaryLight,
              borderColor: colors.primary + '35',
            },
          ]}
          onPress={simulateDetection}
          activeOpacity={0.8}
        >
          <Icon name="hand-wave-outline" size={16} color={colors.primary} />
          <Text style={[styles.simulateBtnText, { color: colors.primary, fontSize: fs(13) }]}>
            Simulate Detection
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
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
    height: 320,
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
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveText: { fontWeight: '600', letterSpacing: 1 },
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
    padding: 20,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  panelHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  simulateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    borderRadius: 10,
    paddingVertical: 12,
    borderWidth: 1,
  },
  simulateBtnText: { fontWeight: '500' },
});
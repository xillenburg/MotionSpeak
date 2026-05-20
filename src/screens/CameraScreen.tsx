import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../constants/colors';
import { TranslationOverlay } from '../components/TranslationOverlay';
import { CameraFrame } from '../components/CameraFrame';
import { NativeCamera } from '../components/NativeCamera';
import { useAppStore } from '../store/useAppStore';
import { useTTS } from '../hooks/useTTS';

const { height } = Dimensions.get('window');

interface Props {
  navigation: any;
}

export const CameraScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const {
    isCameraActive,
    setCameraActive,
    currentTranslation,
    isProcessing,
    ttsEnabled,
    displayLanguage,
    showLandmarks,
    clearHistory,
    setCurrentTranslation,
  } = useAppStore();

  const { speak } = useTTS();

  useEffect(() => {
    setCameraActive(true);
    return () => setCameraActive(false);
  }, []);

  // ──────────────────────────────────────────────────────────────────────────── REMOVE IF AI IS READY
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
  // ──────────────────────────────────────────────────────────────────────────── REMOVE IF AI IS READY

  const handleSpeakPress = () => {
    if (currentTranslation) {
      speak(currentTranslation.label, currentTranslation.labelFil);
    }
  };

  return (
    <View style={styles.container}>

      {/* Real Native Camera Feed */}
      <NativeCamera style={styles.cameraFull} />

      {/* Mock trigger button — remove when Kotlin bridge is ready */}
      <View style={styles.mockOverlay}>
        <TouchableOpacity
          style={styles.mockBtn}
          onPress={simulateDetection}
          activeOpacity={0.8}
        >
          <Icon name="hand-wave" size={18} color={Colors.primary} />
          <Text style={styles.mockBtnText}>Simulate Sign Detection</Text>
        </TouchableOpacity>
      </View>

      {/* Camera Frame Guides */}
      {showLandmarks && (
        <CameraFrame
          isActive={isCameraActive}
          isDetecting={isProcessing || !!currentTranslation}
        />
      )}

      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.topBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Icon name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.liveBadge}>
          <View style={[
            styles.liveDot,
            { backgroundColor: isCameraActive ? Colors.error : Colors.textMuted },
          ]} />
          <Text style={styles.liveText}>
            {isCameraActive ? 'LIVE' : 'STANDBY'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.topBtn}
          onPress={() => {
            Alert.alert('Clear History', 'Remove all translation history?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: clearHistory },
            ]);
          }}
          activeOpacity={0.8}
        >
          <Icon name="delete-sweep" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Translation Panel */}
      <View style={[styles.bottomPanel, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.panelHandle} />
        <TranslationOverlay
          result={currentTranslation}
          isProcessing={isProcessing}
          displayLanguage={displayLanguage}
          onSpeakPress={handleSpeakPress}
          ttsEnabled={ttsEnabled}
        />
      </View>

      {/* Side Quick Controls */}
      <View style={[styles.sideControls, { top: height * 0.35 }]}>
        <TouchableOpacity
          style={styles.sideBtn}
          onPress={() => navigation.navigate('Dictionary')}
          activeOpacity={0.7}
        >
          <Icon name="book-open-variant" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideBtn} activeOpacity={0.7}>
          <Icon
            name={ttsEnabled ? 'volume-high' : 'volume-off'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
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
  mockOverlay: {
    position: 'absolute',
    bottom: 220,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  mockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary + '20',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  mockBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    position: 'absolute',
    top: 0, left: 0, right: 0,
  },
  topBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#00000060',
    alignItems: 'center', justifyContent: 'center',
  },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#00000070', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  liveDot: {
    width: 7, height: 7, borderRadius: 4,
  },
  liveText: {
    fontSize: 11, fontWeight: '700', color: '#fff', letterSpacing: 1,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(13, 17, 23, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  panelHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.textMuted,
    alignSelf: 'center', marginBottom: 16,
  },
  sideControls: {
    position: 'absolute',
    right: 12,
    gap: 10,
  },
  sideBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#00000070',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#ffffff20',
  },
});
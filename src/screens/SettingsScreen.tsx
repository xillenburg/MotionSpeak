import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import type { SliderProps } from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../constants/colors';
import { Header } from '../components/Header';
import { useAppStore } from '../store/useAppStore';

interface Props {
  navigation: any;
}

const SettingRow: React.FC<{
  icon: string;
  label: string;
  sub?: string;
  right: React.ReactNode;
  color?: string;
}> = ({ icon, label, sub, right, color = Colors.primary }) => (
  <View style={styles.settingRow}>
    <View style={[styles.settingIcon, { backgroundColor: color + '20' }]}>
      <Icon name={icon} size={18} color={color} />
    </View>
    <View style={styles.settingText}>
      <Text style={styles.settingLabel}>{label}</Text>
      {sub && <Text style={styles.settingSub}>{sub}</Text>}
    </View>
    {right}
  </View>
);

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    confidenceThreshold, setConfidenceThreshold,
    ttsEnabled, setTtsEnabled,
    ttsLanguage, setTtsLanguage,
    showLandmarks, setShowLandmarks,
    displayLanguage, setDisplayLanguage,
    clearHistory, translationHistory,
  } = useAppStore();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Header title="Settings" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Recognition */}
        <Text style={styles.sectionTitle}>Recognition</Text>
        <View style={styles.card}>
          <SettingRow
            icon="target"
            label="Confidence Threshold"
            sub={`Current: ${Math.round(confidenceThreshold * 100)}% — only show results above this`}
            color={Colors.primary}
            right={null}
          />
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={0.99}
            step={0.01}
            value={confidenceThreshold}
            onValueChange={(val: number) => setConfidenceThreshold(val)}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={Colors.border}
            thumbTintColor={Colors.primary}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>50% (Relaxed)</Text>
            <Text style={styles.sliderLabel}>99% (Strict)</Text>
          </View>
        </View>

        {/* Display */}
        <Text style={styles.sectionTitle}>Display</Text>
        <View style={styles.card}>
          <SettingRow
            icon="hand-wave"
            label="Show Camera Guide Frame"
            sub="Corner guides while signing"
            color={Colors.info}
            right={
              <Switch
                value={showLandmarks}
                onValueChange={setShowLandmarks}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor="#fff"
              />
            }
          />
          <View style={styles.divider} />
          <Text style={styles.subSectionLabel}>Translation Language</Text>
          {(['en', 'fil', 'both'] as const).map(lang => (
            <TouchableOpacity
              key={lang}
              style={styles.radioRow}
              onPress={() => setDisplayLanguage(lang)}
            >
              <View style={[styles.radio, displayLanguage === lang && styles.radioActive]}>
                {displayLanguage === lang && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>
                {lang === 'en' ? 'English only' : lang === 'fil' ? 'Filipino only' : 'Both (English + Filipino)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Text-to-Speech */}
        <Text style={styles.sectionTitle}>Text-to-Speech</Text>
        <View style={styles.card}>
          <SettingRow
            icon="volume-high"
            label="Enable TTS"
            sub="Auto-speak recognized signs"
            color={Colors.success}
            right={
              <Switch
                value={ttsEnabled}
                onValueChange={setTtsEnabled}
                trackColor={{ false: Colors.border, true: Colors.success }}
                thumbColor="#fff"
              />
            }
          />
          <View style={styles.divider} />
          <Text style={styles.subSectionLabel}>TTS Language</Text>
          {(['en', 'fil'] as const).map(lang => (
            <TouchableOpacity
              key={lang}
              style={styles.radioRow}
              onPress={() => setTtsLanguage(lang)}
            >
              <View style={[styles.radio, ttsLanguage === lang && styles.radioActive]}>
                {ttsLanguage === lang && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>
                {lang === 'en' ? '🇺🇸 English (en-US)' : '🇵🇭 Filipino (fil-PH)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Data */}
        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.card}>
          <SettingRow
            icon="history"
            label="Clear Translation History"
            sub={`${translationHistory.length} entries stored`}
            color={Colors.error}
            right={
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={clearHistory}
              >
                <Text style={styles.clearBtnText}>Clear</Text>
              </TouchableOpacity>
            }
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, marginTop: 16,
  },
  card: {
    backgroundColor: Colors.card, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, gap: 12,
  },
  settingIcon: {
    width: 36, height: 36, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  settingText: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  settingSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 14 },
  slider: { marginHorizontal: 14 },
  sliderLabels: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingBottom: 14,
  },
  sliderLabel: { fontSize: 11, color: Colors.textMuted },
  subSectionLabel: {
    fontSize: 12, fontWeight: '600', color: Colors.textSecondary,
    paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  radioRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: Colors.textMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: Colors.primary },
  radioDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  radioLabel: { fontSize: 14, color: Colors.textPrimary },
  clearBtn: {
    backgroundColor: Colors.error + '20', borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: Colors.error + '40',
  },
  clearBtnText: { fontSize: 13, fontWeight: '600', color: Colors.error },
});
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';

interface Props { navigation: any; }

const SectionHeader: React.FC<{ title: string; colors: any; fs: any }> = ({ title, colors, fs }) => (
  <Text style={[styles.sectionHeader, { color: colors.textSecondary, fontSize: fs(12) }]}>
    {title}
  </Text>
);

const SettingRow: React.FC<{
  icon: string;
  iconColor: string;
  label: string;
  sub?: string;
  right: React.ReactNode;
  colors: any;
  fs: any;
  onPress?: () => void;
  isLast?: boolean;
}> = ({ icon, iconColor, label, sub, right, colors, fs, onPress, isLast }) => (
  <>
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
    >
      <View style={[styles.rowIcon, { backgroundColor: iconColor + '15' }]}>
        <Icon name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: colors.textPrimary, fontSize: fs(15) }]}>
          {label}
        </Text>
        {sub && (
          <Text style={[styles.rowSub, { color: colors.textSecondary, fontSize: fs(12) }]}>
            {sub}
          </Text>
        )}
      </View>
      {right}
    </TouchableOpacity>
    {!isLast && (
      <View style={[styles.divider, { backgroundColor: colors.divider, marginLeft: 60 }]} />
    )}
  </>
);

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { colors, fs } = useTheme();
  const {
    darkMode, setDarkMode,
    fontScale, setFontScale,
    ttsEnabled, setTtsEnabled,
    ttsSpeed, setTtsSpeed,
    ttsLanguage, setTtsLanguage,
    displayLanguage, setDisplayLanguage,
    showLandmarks, setShowLandmarks,
    clearHistory, translationHistory,
  } = useAppStore();

  const fontScaleOptions = [
    { label: 'Small', value: 0.85 },
    { label: 'Normal', value: 1.0 },
    { label: 'Large', value: 1.15 },
    { label: 'X-Large', value: 1.3 },
  ];

  const ttsSpeedOptions = [
    { label: 'Slow', value: 0.3 },
    { label: 'Normal', value: 0.5 },
    { label: 'Fast', value: 0.75 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[
        styles.header,
        { backgroundColor: colors.surface, borderBottomColor: colors.border, paddingTop: insets.top + 12 },
      ]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontSize: fs(20) }]}>
          Settings
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Appearance */}
        <SectionHeader title="APPEARANCE" colors={colors} fs={fs} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="weather-night"
            iconColor="#326392"
            label="Dark Mode"
            sub={darkMode ? 'On — using dark theme' : 'Off — using light theme'}
            colors={colors} fs={fs}
            right={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: colors.border, true: '#442f50' }}
                thumbColor="#fff"
              />
            }
          />
          <View style={[styles.divider, { backgroundColor: colors.divider, marginLeft: 60 }]} />
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#3B82F615' }]}>
              <Icon name="format-size" size={18} color="#3B82F6" />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: colors.textPrimary, fontSize: fs(15) }]}>
                Font Size
              </Text>
              <View style={styles.segmentRow}>
                {fontScaleOptions.map(opt => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.segment,
                      {
                        backgroundColor: fontScale === opt.value
                          ? colors.primary
                          : colors.surfaceElevated,
                        borderColor: fontScale === opt.value
                          ? colors.primary
                          : colors.border,
                      },
                    ]}
                    onPress={() => setFontScale(opt.value)}
                    activeOpacity={0.75}
                  >
                    <Text style={[
                      styles.segmentText,
                      {
                        color: fontScale === opt.value ? '#FFFFFF' : colors.textSecondary,
                        fontSize: fs(11),
                      },
                    ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Translation Display */}
        <SectionHeader title="TRANSLATION DISPLAY" colors={colors} fs={fs} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#36b59515' }]}>
              <Icon name="translate" size={18} color="#36b595" />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: colors.textPrimary, fontSize: fs(15) }]}>
                Translation Language
              </Text>
              <Text style={[styles.rowSub, { color: colors.textSecondary, fontSize: fs(12) }]}>
                Language shown on camera screen
              </Text>
              <View style={styles.segmentRow}>
                {([
                  { key: 'fil', label: '🇵🇭 Filipino' },
                  { key: 'en', label: '🇺🇸 English' },
                ] as const).map(opt => (
                  <TouchableOpacity
                    key={opt.key}
                    style={[
                      styles.segment,
                      {
                        backgroundColor: displayLanguage === opt.key
                          ? '#36b595'
                          : colors.surfaceElevated,
                        borderColor: displayLanguage === opt.key
                          ? '#36b595'
                          : colors.border,
                      },
                    ]}
                    onPress={() => setDisplayLanguage(opt.key)}
                    activeOpacity={0.75}
                  >
                    <Text style={[
                      styles.segmentText,
                      {
                        color: displayLanguage === opt.key ? '#FFFFFF' : colors.textSecondary,
                        fontSize: fs(12),
                      },
                    ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider, marginLeft: 60 }]} />
          <SettingRow
            icon="camera-outline"
            iconColor="#06B6D4"
            label="Show Camera Frame"
            sub="Guide corners on camera screen"
            colors={colors} fs={fs}
            isLast
            right={
              <Switch
                value={showLandmarks}
                onValueChange={setShowLandmarks}
                trackColor={{ false: colors.border, true: '#06B6D4' }}
                thumbColor="#fff"
              />
            }
          />
        </View>

        {/* Text-to-Speech */}
        <SectionHeader title="TEXT-TO-SPEECH" colors={colors} fs={fs} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="volume-high"
            iconColor="#a91fbc"
            label="Enable TTS"
            sub="Automatically speak recognized signs"
            colors={colors} fs={fs}
            right={
              <Switch
                value={ttsEnabled}
                onValueChange={setTtsEnabled}
                trackColor={{ false: colors.border, true: '#a91fbc' }}
                thumbColor="#fff"
              />
            }
          />
          <View style={[styles.divider, { backgroundColor: colors.divider, marginLeft: 60 }]} />
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#a91fbc15' }]}>
              <Icon name="speedometer" size={18} color="#a91fbc" />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: colors.textPrimary, fontSize: fs(15) }]}>
                Speech Speed
              </Text>
              <View style={styles.segmentRow}>
                {ttsSpeedOptions.map(opt => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.segment,
                      {
                        backgroundColor: ttsSpeed === opt.value
                          ? '#a91fbc'
                          : colors.surfaceElevated,
                        borderColor: ttsSpeed === opt.value
                          ? '#a91fbc'
                          : colors.border,
                      },
                    ]}
                    onPress={() => setTtsSpeed(opt.value)}
                    activeOpacity={0.75}
                  >
                    <Text style={[
                      styles.segmentText,
                      {
                        color: ttsSpeed === opt.value ? '#FFFFFF' : colors.textSecondary,
                        fontSize: fs(11),
                      },
                    ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider, marginLeft: 60 }]} />
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#a91fbc15' }]}>
              <Icon name="earth" size={18} color="#a91fbc" />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: colors.textPrimary, fontSize: fs(15) }]}>
                TTS Language
              </Text>
              <View style={styles.segmentRow}>
                {([
                  { key: 'fil', label: '🇵🇭 Filipino' },
                  { key: 'en', label: '🇺🇸 English' },
                ] as const).map(opt => (
                  <TouchableOpacity
                    key={opt.key}
                    style={[
                      styles.segment,
                      {
                        backgroundColor: ttsLanguage === opt.key
                          ? '#a91fbc'
                          : colors.surfaceElevated,
                        borderColor: ttsLanguage === opt.key
                          ? '#a91fbc'
                          : colors.border,
                      },
                    ]}
                    onPress={() => setTtsLanguage(opt.key)}
                    activeOpacity={0.75}
                  >
                    <Text style={[
                      styles.segmentText,
                      {
                        color: ttsLanguage === opt.key ? '#FFFFFF' : colors.textSecondary,
                        fontSize: fs(11),
                      },
                    ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Data */}
        <SectionHeader title="DATA" colors={colors} fs={fs} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="delete-outline"
            iconColor="#EF4444"
            label="Clear History"
            sub={`${translationHistory.length} translation entries stored`}
            colors={colors} fs={fs}
            isLast
            onPress={() =>
              Alert.alert('Clear History', 'This will remove all translation history.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: clearHistory },
              ])
            }
            right={<Icon name="chevron-right" size={18} color={colors.textMuted} />}
          />
        </View>

        <TouchableOpacity
          style={[styles.aboutRow, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => navigation.navigate('About')}
          activeOpacity={0.7}
        >
          <Icon name="information-outline" size={18} color={colors.primary} />
          <Text style={[styles.aboutText, { color: colors.primary, fontSize: fs(14) }]}>
            About MotionSpeak
          </Text>
          <Icon name="chevron-right" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontWeight: '700', letterSpacing: -0.3 },
  scroll: { padding: 16, gap: 8 },
  sectionHeader: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 4,
    marginLeft: 4,
  },
  card: { borderRadius: 6, borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, gap: 6 },
  rowLabel: { fontWeight: '500' },
  rowSub: {},
  divider: { height: 1 },
  segmentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  segment: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  segmentText: { fontWeight: '500' },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 8,
  },
  aboutText: { flex: 1, fontWeight: '500' },
});
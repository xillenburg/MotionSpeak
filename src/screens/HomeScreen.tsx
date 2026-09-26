import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Platform, Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import { FSL_SIGNS, SIGN_CATEGORIES } from '../constants/signs';

interface Props { navigation: any; }

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { colors, fs } = useTheme();
  const { translationHistory } = useAppStore();

  const recentHistory = translationHistory.slice(0, 3);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.textPrimary === '#0F172A' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.surface}
      />

      {/* Header */}
      <View style={[
        styles.header,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          paddingTop: insets.top + 12,
        },
      ]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary, fontSize: fs(22) }]}>
            MotionSpeak
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.aboutBtn, { backgroundColor: colors.primaryLight }]}
          onPress={() => navigation.navigate('About')}
        >
          <Icon name="information-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: 32 }]}
      >
{/* Hero Card */}
        <TouchableOpacity
          style={[styles.heroCard, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Camera')}
          activeOpacity={0.9}
        >
          <View style={styles.heroLeft}>
            <Text style={[styles.heroLabel, { fontSize: fs(12) }]}>LIVE TRANSLATION</Text>
            <Text style={[styles.heroTitle, { fontSize: fs(22) }]}>
              Start Signing
            </Text>
            <Text style={[styles.heroSub, { fontSize: fs(13) }]}>
              Point camera at signer to begin
            </Text>
            <View style={styles.heroBtn}>
              <Text style={[styles.heroBtnText, { fontSize: fs(13) }]}>Open Camera</Text>
              <Icon name="arrow-right" size={14} color="#fff" />
            </View>
          </View>
          <Image
            source={require('../assets/hand_ms.png')}
            style={styles.heroLogo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { icon: 'hand-wave-outline', label: 'Signs', value: FSL_SIGNS.length, color: colors.primary },
            { icon: 'tag-multiple-outline', label: 'Categories', value: SIGN_CATEGORIES.length, color: colors.warning },
            { icon: 'history', label: 'Translated', value: translationHistory.length, color: colors.success },
          ].map(stat => (
            <View
              key={stat.label}
              style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Icon name={stat.icon} size={20} color={stat.color} />
              <Text style={[styles.statValue, { color: colors.textPrimary, fontSize: fs(20) }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary, fontSize: fs(11) }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: fs(12) }]}>
          QUICK ACTIONS
        </Text>
        <View style={[styles.actionsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            {
              icon: 'book-open-outline',
              label: 'Sign Dictionary',
              sub: `${FSL_SIGNS.length} medical FSL signs`,
              color: colors.primary,
              action: () => navigation.navigate('Dictionary'),
            },
            {
              icon: 'hospital-box-outline',
              label: 'MediSIGN Reference',
              sub: 'Based on UP Manila handbook',
              color: colors.success,
              action: () => navigation.navigate('Dictionary'),
            },
            {
              icon: 'cog-outline',
              label: 'App Settings',
              sub: 'Font, language, TTS & more',
              color: colors.warning,
              action: () => navigation.navigate('Settings'),
            },
          ].map((item, index, arr) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity
                style={styles.actionRow}
                onPress={item.action}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: item.color + '15' }]}>
                  <Icon name={item.icon} size={20} color={item.color} />
                </View>
                <View style={styles.actionText}>
                  <Text style={[styles.actionLabel, { color: colors.textPrimary, fontSize: fs(15) }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.actionSub, { color: colors.textSecondary, fontSize: fs(12) }]}>
                    {item.sub}
                  </Text>
                </View>
                <Icon name="chevron-right" size={18} color={colors.textMuted} />
              </TouchableOpacity>
              {index < arr.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.divider }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Recent Translations */}
        {recentHistory.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: fs(12) }]}>
              RECENT TRANSLATIONS
            </Text>
            <View style={[styles.actionsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {recentHistory.map((item, index) => (
              <React.Fragment key={item.timestamp}>
                <View style={styles.historyRow}>
                  <View style={[styles.historyDot, { backgroundColor: colors.primaryLight }]}>
                    <Icon name="translate" size={14} color={colors.primary} />
                  </View>
                  <View style={styles.actionText}>
                    <Text style={[styles.actionLabel, { color: colors.textPrimary, fontSize: fs(15) }]}>
                      {item.label}
                    </Text>
                    <Text style={[styles.actionSub, { color: colors.textSecondary, fontSize: fs(12) }]}>
                      {item.labelFil}
                    </Text>
                  </View>
                </View>
                {index < recentHistory.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: colors.divider }]} />
                )}
              </React.Fragment>
            ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerGreeting: { fontWeight: '400', marginBottom: 2 },
  headerTitle: { fontWeight: '700', letterSpacing: -0.3 },
  aboutBtn: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { padding: 20, gap: 16 },
  heroCard: {
    borderRadius: 6,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroLeft: { flex: 1, gap: 6 },
  heroLabel: { color: '#BFDBFE', fontWeight: '600', letterSpacing: 1 },
  heroTitle: { color: '#FFFFFF', fontWeight: '700', letterSpacing: -0.3 },
  heroSub: { color: '#BFDBFE' },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  heroBtnText: { color: '#fff', fontWeight: '600' },
  heroEmoji: { fontSize: 56, marginLeft: 16 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    borderRadius: 6,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
  },
  statValue: { fontWeight: '700' },
  statLabel: { textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionTitle: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: -8,
  },
  actionsCard: {
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  actionIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  actionText: { flex: 1, gap: 2 },
  actionLabel: { fontWeight: '500' },
  actionSub: {},
  divider: { height: 1, marginLeft: 70 },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  historyDot: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
heroLogo: {
  width: 80,
  height: 80,
  marginLeft: 16,
  opacity: 0.92,
},
});
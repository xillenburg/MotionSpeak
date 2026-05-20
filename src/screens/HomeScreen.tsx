import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../constants/colors';
import { FSL_SIGNS, SIGN_CATEGORIES } from '../constants/signs';
import { useAppStore } from '../store/useAppStore';

const { width } = Dimensions.get('window');

interface Props {
  navigation: any;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { translationHistory } = useAppStore();

  const stats = [
    { label: 'Signs', value: FSL_SIGNS.length, icon: 'hand-wave', color: Colors.primary },
    { label: 'Categories', value: SIGN_CATEGORIES.length, icon: 'tag-multiple', color: Colors.warning },
    { label: 'Translated', value: translationHistory.length, icon: 'translate', color: Colors.success },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Top Banner */}
        <LinearGradient
          colors={[Colors.primary + '25', Colors.background]}
          style={styles.banner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.bannerContent}>
            <View>
              <Text style={styles.bannerTitle}>MotionSpeak</Text>
              <Text style={styles.bannerSub}>Filipino Sign Language Interpreter</Text>
              <View style={styles.bannerBadge}>
                <Icon name="hospital-box" size={12} color={Colors.primary} />
                <Text style={styles.bannerBadgeText}> Healthcare Edition</Text>
              </View>
            </View>
            <Text style={styles.bannerEmoji}>🤟</Text>
          </View>
        </LinearGradient>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {stats.map(s => (
            <View key={s.label} style={styles.statCard}>
              <Icon name={s.icon} size={22} color={s.color} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Main CTA — Start Translating */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Camera')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Icon name="camera" size={24} color="#fff" />
            <View style={styles.ctaTextBlock}>
              <Text style={styles.ctaTitle}>Start Translating</Text>
              <Text style={styles.ctaSub}>Open camera for live FSL recognition</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#ffffff80" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {[
            { icon: 'book-open-variant', label: 'Sign Dictionary', sub: '60 medical signs', color: Colors.info, screen: 'Dictionary' },
            { icon: 'history', label: 'History', sub: `${translationHistory.length} recent`, color: Colors.warning, screen: 'History' },
            { icon: 'cog', label: 'Settings', sub: 'Configure app', color: Colors.textSecondary, screen: 'Settings' },
            { icon: 'information', label: 'About', sub: 'MotionSpeak info', color: '#BC8CFF', screen: 'About' },
          ].map(item => (
            <TouchableOpacity
              key={item.label}
              style={styles.quickCard}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.75}
            >
              <View style={[styles.quickIcon, { backgroundColor: item.color + '20' }]}>
                <Icon name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={styles.quickLabel}>{item.label}</Text>
              <Text style={styles.quickSub}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Translation */}
        {translationHistory.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Last Translation</Text>
            <View style={styles.lastTranslation}>
              <Icon name="translate" size={18} color={Colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.lastLabel}>{translationHistory[0].label}</Text>
                <Text style={styles.lastFil}>{translationHistory[0].labelFil}</Text>
              </View>
              <Text style={styles.lastConf}>
                {Math.round(translationHistory[0].confidence * 100)}%
              </Text>
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 16, paddingTop: 16 },
  banner: {
    borderRadius: 16, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.primary + '30',
  },
  bannerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  bannerSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  bannerBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primary + '20', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginTop: 8,
  },
  bannerBadgeText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  bannerEmoji: { fontSize: 52 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: Colors.card, borderRadius: 12, padding: 14,
    alignItems: 'center', gap: 4, borderWidth: 1, borderColor: Colors.border,
  },
  statValue: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  statLabel: { fontSize: 11, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  ctaButton: { borderRadius: 16, marginBottom: 24, overflow: 'hidden', elevation: 6 },
  ctaGradient: {
    flexDirection: 'row', alignItems: 'center', padding: 18,
    gap: 14,
  },
  ctaTextBlock: { flex: 1 },
  ctaTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  ctaSub: { fontSize: 12, color: '#ffffff90', marginTop: 2 },
  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
  },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  quickCard: {
    width: (width - 44) / 2,
    backgroundColor: Colors.card, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.border, gap: 8,
  },
  quickIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  quickSub: { fontSize: 11, color: Colors.textSecondary },
  lastTranslation: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.card, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  lastLabel: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  lastFil: { fontSize: 12, color: Colors.primary, marginTop: 2 },
  lastConf: { fontSize: 14, fontWeight: '700', color: Colors.success },
});
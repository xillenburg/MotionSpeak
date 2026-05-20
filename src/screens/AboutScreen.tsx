import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../constants/colors';
import { Header } from '../components/Header';

interface Props {
  navigation: any;
}

export const AboutScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const team = [
    'Alca, Donnel Jan C.',
    'Flores, Marc Vincent R.',
    'Icalla, Charvie T.',
    'Layo, Emmanuel James',
    'Quinia, Vida Marie',
    'Tamani, Ralph Nelson T.',
  ];

  const techStack = [
    { icon: 'react', label: 'React Native', sub: 'Frontend UI', color: '#61DAFB' },
    { icon: 'language-kotlin', label: 'Kotlin', sub: 'Native Android modules', color: '#7F52FF' },
    { icon: 'brain', label: 'TensorFlow Lite', sub: 'On-device AI inference', color: '#FF6F00' },
    { icon: 'hand-wave', label: 'MediaPipe', sub: 'Landmark detection', color: Colors.success },
    { icon: 'camera', label: 'Vision Camera', sub: 'Live video capture', color: Colors.primary },
    { icon: 'volume-high', label: 'React Native TTS', sub: 'Text-to-Speech output', color: Colors.warning },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Header title="About MotionSpeak" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Hero */}
        <LinearGradient
          colors={[Colors.primary + '20', Colors.background]}
          style={styles.hero}
        >
          <Text style={styles.heroEmoji}>🤟</Text>
          <Text style={styles.heroTitle}>MotionSpeak</Text>
          <Text style={styles.heroSub}>Filipino Sign Language Interpreter</Text>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>v1.0 · Healthcare Edition</Text>
          </View>
        </LinearGradient>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.cardText}>
            MotionSpeak is a camera-based Filipino Sign Language (FSL) recognition system
            that employs Deep Learning to enhance inclusive communication by translating
            hand gestures and facial expressions into real-time text and speech for Deaf or
            hard-of-hearing individuals and non-signers in healthcare settings.
          </Text>
        </View>

        {/* Research Info */}
        <Text style={styles.sectionTitle}>Research Information</Text>
        <View style={styles.infoCard}>
          {[
            { label: 'Institution', value: 'Centro Escolar University – Makati' },
            { label: 'Department', value: 'CS & Information Technology' },
            { label: 'Adviser', value: 'Engr. Ma. Christina A. Florentino' },
            { label: 'Signs Covered', value: '60 Medical FSL Signs' },
            { label: 'Platform', value: 'Android (API 24+)' },
            { label: 'Legal Basis', value: 'Republic Act No. 11106 (FSL Act)' },
          ].map(item => (
            <View key={item.label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Team */}
        <Text style={styles.sectionTitle}>Research Team</Text>
        <View style={styles.card}>
          {team.map((member, i) => (
            <View key={member} style={[styles.teamRow, i < team.length - 1 && styles.teamDivider]}>
              <View style={styles.teamAvatar}>
                <Text style={styles.teamInitial}>{member[0]}</Text>
              </View>
              <Text style={styles.teamName}>{member}</Text>
            </View>
          ))}
        </View>

        {/* Tech Stack */}
        <Text style={styles.sectionTitle}>Technology Stack</Text>
        <View style={styles.card}>
          {techStack.map((tech, i) => (
            <View key={tech.label} style={[styles.techRow, i < techStack.length - 1 && styles.teamDivider]}>
              <View style={[styles.techIcon, { backgroundColor: tech.color + '20' }]}>
                <Icon name={tech.icon} size={18} color={tech.color} />
              </View>
              <View>
                <Text style={styles.techLabel}>{tech.label}</Text>
                <Text style={styles.techSub}>{tech.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  hero: {
    borderRadius: 16, padding: 28,
    alignItems: 'center', gap: 8, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.primary + '30',
  },
  heroEmoji: { fontSize: 52 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  heroSub: { fontSize: 13, color: Colors.textSecondary },
  heroBadge: {
    backgroundColor: Colors.primary + '20', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 5,
    borderWidth: 1, borderColor: Colors.primary + '40',
  },
  heroBadgeText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  card: {
    backgroundColor: Colors.card, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border, padding: 16,
    marginBottom: 8,
  },
  cardText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1.2,
    marginBottom: 8, marginTop: 16,
  },
  infoCard: {
    backgroundColor: Colors.card, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, borderBottomWidth: 1, borderColor: Colors.border,
  },
  infoLabel: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
  infoValue: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500', flex: 1.5, textAlign: 'right' },
  teamRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10,
  },
  teamDivider: { borderBottomWidth: 1, borderColor: Colors.border },
  teamAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center', justifyContent: 'center',
  },
  teamInitial: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  teamName: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  techRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10,
  },
  techIcon: {
    width: 36, height: 36, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  techLabel: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  techSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
});
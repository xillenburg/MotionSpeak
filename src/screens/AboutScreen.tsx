import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/theme';

interface Props { navigation: any; }

export const AboutScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { colors, fs } = useTheme();

  const team = [
    { name: 'Alca, Donnel Jan C.', initial: '' },
    { name: 'Flores, Marc Vincent R.', initial: '' },
    { name: 'Icalla, Charvie T.', initial: '' },
    { name: 'Layo, Emmanuel James', initial: '' },
    { name: 'Quinia, Vida Marie', initial: '' },
    { name: 'Tamani, Ralph Nelson T.', initial: '' },
  ];

  const infoRows = [
    { label: 'Institution', value: 'Centro Escolar University – Makati' },
    { label: 'Department', value: 'CS & Information Technology' },
    { label: 'Adviser', value: 'Engr. Ma. Christina A. Florentino' },
    { label: 'Platform', value: 'Android (API 24+)' },
    { label: 'Legal Basis', value: 'Republic Act No. 11106' },
    { label: 'Signs Covered', value: '60 Medical FSL Signs' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[
        styles.header,
        { backgroundColor: colors.surface, borderBottomColor: colors.border, paddingTop: insets.top + 12 },
      ]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontSize: fs(18) }]}>
          About
        </Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {/* App Identity */}
        <View style={[styles.identityCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.appIconBox, { backgroundColor: colors.primaryLight }]}>
            <Image
              source={require('../assets/hand_ms.png')}
              style={styles.appIconImage}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.appName, { color: colors.textPrimary, fontSize: fs(22) }]}>
            MotionSpeak
          </Text>
          <Text style={[styles.appTagline, { color: colors.textSecondary, fontSize: fs(13) }]}>
            Filipino Sign Language Interpreter
          </Text>
          <View style={[styles.versionBadge, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.versionText, { color: colors.primary, fontSize: fs(12) }]}>
              v1.0 · Healthcare Edition
            </Text>
          </View>
          <Text style={[styles.appDesc, { color: colors.textSecondary, fontSize: fs(13) }]}>
            A camera-based FSL recognition system using deep learning to enhance inclusive communication between Deaf patients and healthcare professionals.
          </Text>
        </View>

        {/* Research Info */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: fs(12) }]}>
          RESEARCH INFORMATION
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {infoRows.map((row, i) => (
            <React.Fragment key={row.label}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary, fontSize: fs(13) }]}>
                  {row.label}
                </Text>
                <Text style={[styles.infoValue, { color: colors.textPrimary, fontSize: fs(13) }]}>
                  {row.value}
                </Text>
              </View>
              {i < infoRows.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.divider }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Team */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: fs(12) }]}>
          RESEARCH TEAM
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {team.map((member, i) => (
            <React.Fragment key={member.name}>
              <View style={styles.teamRow}>
                <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.avatarText, { color: colors.primary, fontSize: fs(15) }]}>
                    {member.initial}
                  </Text>
                </View>
                <Text style={[styles.memberName, { color: colors.textPrimary, fontSize: fs(14) }]}>
                  {member.name}
                </Text>
              </View>
              {i < team.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.divider, marginLeft: 58 }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1,
  },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontWeight: '600' },
  scroll: { padding: 16, gap: 8 },
  identityCard: {
    borderRadius: 14, borderWidth: 1,
    padding: 24, alignItems: 'center', gap: 8, marginBottom: 8,
  },
  appIconBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  appName: { fontWeight: '700', letterSpacing: -0.3 },
  appTagline: {},
  versionBadge: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  versionText: { fontWeight: '600' },
  appDesc: { textAlign: 'center', lineHeight: 20, marginTop: 4 },
  sectionTitle: {
    fontWeight: '600', textTransform: 'uppercase',
    letterSpacing: 0.8, marginTop: 8, marginBottom: 4, marginLeft: 4,
  },
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 14, gap: 8,
  },
  infoLabel: {},
  infoValue: { fontWeight: '500', textAlign: 'right', flex: 1 },
  divider: { height: 1 },
  teamRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12 },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontWeight: '700' },
  memberName: { fontWeight: '400' },
  techRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12 },
  techIcon: { width: 38, height: 38, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  techLabel: { fontWeight: '500' },
  techSub: {},
  appIconImage: {
    width: 60,
    height: 60,
  },
});
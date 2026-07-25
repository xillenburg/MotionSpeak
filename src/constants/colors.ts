export const LightColors = {
  primary: '#3B82F6',
  primaryDark: '#1D4ED8',
  primaryLight: '#EFF6FF',
  accent: '#06B6D4',

  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#F1F5F9',
  card: '#FFFFFF',

  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  success: '#10B981',
  successLight: '#ECFDF5',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  info: '#3B82F6',
  infoLight: '#EFF6FF',

  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#E2E8F0',

  shadow: '#00000015',
  overlay: 'rgba(15, 23, 42, 0.5)',
  cameraOverlay: 'rgba(15, 23, 42, 0.85)',

  tabBar: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
  tabActive: '#3B82F6',
  tabInactive: '#94A3B8',

  categorySymptoms: '#EF4444',
  categoryBody: '#3B82F6',
  categoryProcedures: '#F59E0B',
  categoryHistory: '#8B5CF6',
  categoryConversational: '#10B981',
};

export const DarkColors = {
  primary: '#60A5FA',
  primaryDark: '#3B82F6',
  primaryLight: '#1E3A5F',
  accent: '#22D3EE',

  background: '#0F172A',
  surface: '#1E293B',
  surfaceElevated: '#334155',
  card: '#1E293B',

  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0F172A',

  success: '#34D399',
  successLight: '#064E3B',
  warning: '#FCD34D',
  warningLight: '#451A03',
  error: '#F87171',
  errorLight: '#450A0A',
  info: '#60A5FA',
  infoLight: '#1E3A5F',

  border: '#334155',
  borderLight: '#1E293B',
  divider: '#334155',

  shadow: '#00000040',
  overlay: 'rgba(0, 0, 0, 0.7)',
  cameraOverlay: 'rgba(0, 0, 0, 0.9)',

  tabBar: '#1E293B',
  tabBarBorder: '#334155',
  tabActive: '#60A5FA',
  tabInactive: '#64748B',

  categorySymptoms: '#F87171',
  categoryBody: '#60A5FA',
  categoryProcedures: '#FCD34D',
  categoryHistory: '#A78BFA',
  categoryConversational: '#34D399',
};

export type ColorScheme = typeof LightColors;
export const Colors = LightColors;
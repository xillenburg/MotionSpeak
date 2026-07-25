import { LightColors, DarkColors, ColorScheme } from './colors';
import { useAppStore } from '../store/useAppStore';

export const getColors = (darkMode: boolean): ColorScheme =>
  darkMode ? DarkColors : LightColors;

export const getFontSize = (base: number, scale: number): number => {
  // scale: 0.85 = small, 1.0 = normal, 1.15 = large, 1.3 = xlarge
  return Math.round(base * scale);
};

export const useTheme = () => {
  const { darkMode, fontScale } = useAppStore();
  const colors = getColors(darkMode);
  const fs = (base: number) => getFontSize(base, fontScale);

  return { colors, fs, darkMode, fontScale };
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};
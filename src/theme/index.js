import { Platform } from 'react-native';

export const colors = {
  background: '#FFFFFF',
  surface: '#F6F6F8',
  surfaceAlt: '#EFEFF2',
  border: '#E4E4E9',

  text: '#131316',
  textMuted: '#7A7A85',
  textInverse: '#FFFFFF',

  primary: '#131316',
  primaryPressed: '#000000',
  accent: '#C9973A',
  accentMuted: '#F3E6CD',

  success: '#22A559',
  danger: '#E5484D',
  warning: '#F5A524',

  overlay: 'rgba(19, 19, 22, 0.5)',
  skeleton: '#E7E7EA',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 999,
};

export const typography = {
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  android: {
    elevation: 3,
  },
  default: {
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
  },
});

const theme = { colors, spacing, radius, typography, shadow };

export default theme;

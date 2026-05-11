// src/theme/colors.js — Nord Theme

export const LIGHT_THEME = {
  background: '#ECEFF4',
  surface: '#FFFFFF',
  surfaceAlt: '#E5E9F0',
  primary: '#5E81AC',
  primaryLight: '#81A1C1',
  accent: '#88C0D0',
  accentLight: '#8FBCBB',
  text: '#2E3440',
  textSecondary: '#3B4252',
  textMuted: '#9099A8',
  border: '#D8DEE9',
  cardShadow: 'rgba(46, 52, 64, 0.10)',
  inputBackground: '#FFFFFF',
  switchTrackOff: '#D8DEE9',
  switchThumb: '#FFFFFF',
  headerGradientStart: '#5E81AC',
  headerGradientEnd: '#81A1C1',
  tagBackground: '#E5E9F0',
  tagText: '#5E81AC',
  danger: '#BF616A',
  success: '#A3BE8C',
  fab: '#5E81AC',
};

export const DARK_THEME = {
  background: '#2E3440',
  surface: '#3B4252',
  surfaceAlt: '#373E4C',
  primary: '#88C0D0',
  primaryLight: '#8FBCBB',
  accent: '#81A1C1',
  accentLight: '#5E81AC',
  text: '#ECEFF4',
  textSecondary: '#D8DEE9',
  textMuted: '#616E88',
  border: '#434C5E',
  cardShadow: 'rgba(0,0,0,0.4)',
  inputBackground: '#3B4252',
  switchTrackOff: '#434C5E',
  switchThumb: '#ECEFF4',
  headerGradientStart: '#2E3440',
  headerGradientEnd: '#3B4252',
  tagBackground: '#434C5E',
  tagText: '#88C0D0',
  danger: '#BF616A',
  success: '#A3BE8C',
  fab: '#88C0D0',
};

export const CARD_COLORS_LIGHT = [
  '#E5E9F0', '#EAF0E8', '#F0E8EA', '#E8EEF5',
  '#EAE8F0', '#F0EDE8', '#E8F0EE', '#EDF0E8',
];

export const CARD_COLORS_DARK = [
  '#3B4252', '#3D4A3E', '#4A3B3C', '#394252',
  '#3D3B4A', '#4A443B', '#3B4A46', '#414A3B',
];

export const TAG_COLORS = {
  Personal: { bg: '#DDEAF5', text: '#5E81AC' },
  Work:     { bg: '#E8F0E0', text: '#4C6E2A' },
  Reading:  { bg: '#F5EFE0', text: '#9E7A30' },
  Recipes:  { bg: '#F5E0E2', text: '#9A3A40' },
  Travel:   { bg: '#DFF0F2', text: '#2E7A85' },
  Health:   { bg: '#E0F2E8', text: '#2E7A50' },
  Default:  { bg: '#E5E9F0', text: '#5E81AC' },
};

export const TAG_COLORS_DARK = {
  Personal: { bg: '#3A4A5E', text: '#88C0D0' },
  Work:     { bg: '#3A4A3A', text: '#A3BE8C' },
  Reading:  { bg: '#4A433A', text: '#EBCB8B' },
  Recipes:  { bg: '#4A3A3B', text: '#BF616A' },
  Travel:   { bg: '#3A4A4E', text: '#8FBCBB' },
  Health:   { bg: '#3A4A40', text: '#A3BE8C' },
  Default:  { bg: '#434C5E', text: '#88C0D0' },
};

export const TYPOGRAPHY = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 26,
    xxxl: 32,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

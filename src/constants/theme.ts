import '@/global.css';

import { Platform } from 'react-native';

/**
 * Monochromatic Design System
 * All color definitions across the entire application are centralized here.
 * Pure monochromatic spectrum: obsidian, carbon, charcoal, slate, ash, silver, and stark white.
 */
export const Colors = {
  light: {
    // Canvas & backgrounds
    background: '#F9F9FB',
    backgroundElement: '#EFEFF3',
    backgroundSelected: '#E0E0E6',
    card: '#FFFFFF',
    cardElevated: '#F5F5F8',

    // Borders & dividers
    border: '#E2E2E8',
    borderSubtle: '#EEEEF2',
    borderStrong: '#A0A0AA',

    // Text hierarchy
    text: '#0A0A0C',
    textSecondary: '#6A6A74',
    textMuted: '#9B9BA5',

    // Digits & display counters
    digitBackground: '#F0F0F5',
    digitBorder: '#D8D8E0',
    digitText: '#0A0A0C',

    // Progress & indicator
    progressTrack: '#E6E6EC',
    progressFill: '#0A0A0C',

    // Interactive & Accents (Monochromatic)
    accent: '#0A0A0C',
    accentInverted: '#FFFFFF',
    badgeBackground: '#E8E8ED',
    badgeText: '#232328',

    // Status / subtle feedback (monochrome tint)
    activeGlow: '#000000',
    danger: '#2C2C30',
    success: '#1A1A1D',
  },
  dark: {
    // Canvas & backgrounds
    background: '#000000',
    backgroundElement: '#141416',
    backgroundSelected: '#242428',
    card: '#111114',
    cardElevated: '#1A1A1E',

    // Borders & dividers
    border: '#27272D',
    borderSubtle: '#1B1B1F',
    borderStrong: '#50505A',

    // Text hierarchy
    text: '#FFFFFF',
    textSecondary: '#9A9AA4',
    textMuted: '#585862',

    // Digits & display counters
    digitBackground: '#17171B',
    digitBorder: '#2B2B32',
    digitText: '#FFFFFF',

    // Progress & indicator
    progressTrack: '#202025',
    progressFill: '#FFFFFF',

    // Interactive & Accents (Monochromatic)
    accent: '#FFFFFF',
    accentInverted: '#000000',
    badgeBackground: '#1E1E23',
    badgeText: '#ECECF0',

    // Status / subtle feedback (monochrome tint)
    activeGlow: '#FFFFFF',
    danger: '#E5E5EA',
    success: '#F2F2F7',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  full: 9999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const colors = {
  // Brand — deep travel teal
  primary: '#0F9B8E',
  primaryDark: '#0B7268',
  primaryLight: '#D9F2EF',
  primaryMuted: '#5FBFB5',

  // Surfaces
  background: '#F6F5F1',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF5F4',
  border: '#E4E9E7',

  // Ink
  ink: '#12211F',
  inkSoft: '#445552',
  textPrimary: '#12211F',
  textSecondary: '#5B6B68',
  textMuted: '#93A3A0',

  // Accent — warm sunset amber
  accent: '#F59E0B',
  accentSoft: '#FEF3DC',

  // Status
  success: '#16A34A',
  successSoft: '#E4F6EA',
  warning: '#EA8C00',
  warningSoft: '#FDF0DC',
  danger: '#DC2626',
  dangerSoft: '#FCE9E9',

  // Dark hero
  heroFrom: '#0B3B36',
  heroTo: '#0F5A52',
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  full: 999,
};

export const spacing = (n: number) => n * 8;

export const shadows = {
  sm: {
    shadowColor: '#12211F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#12211F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0B7268',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 6,
  },
} as const;

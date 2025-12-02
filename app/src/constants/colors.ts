export const Colors = {
  light: {
    background: '#F5F5F7',
    surface: '#FFFFFF',
    text: '#1D1D1F',
    textSecondary: '#86868B',
    border: '#E5E5EA',
    accent: '#007AFF',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
  },
  dark: {
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#98989D',
    border: '#38383A',
    accent: '#0A84FF',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
  },
} as const;

export const StatusColors = {
  open: {
    light: '#86868B',
    dark: '#98989D',
    bg: {
      light: '#F2F2F7',
      dark: '#2C2C2E',
    },
  },
  in_progress: {
    light: '#007AFF',
    dark: '#0A84FF',
    bg: {
      light: '#E5F1FF',
      dark: '#0A3D7A',
    },
  },
  done: {
    light: '#34C759',
    dark: '#30D158',
    bg: {
      light: '#E8F8ED',
      dark: '#0D3D1F',
    },
  },
} as const;

export type ThemeType = 'light' | 'dark';
export type StatusType = 'open' | 'in_progress' | 'done';


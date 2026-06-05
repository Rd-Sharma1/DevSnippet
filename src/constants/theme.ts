/**
 * DevSnippet Theme System
 * Dark-mode first design inspired by VSCode, Linear, and Clerk
 * Centralized styling for modern developer utilities
 */

import '@/global.css';
import { Platform } from 'react-native';

/**
 * Core color palette - Dark mode optimized
 * Accent: Cool blue for developer tools aesthetic
 */
export const Colors = {
  // Dark mode (primary)
  dark: {
    // Base layers
    background: '#0D1117', // GitHub dark - true black-near
    surface: '#161B22',    // Elevated surface
    surfaceAlt: '#21262D', // Alternative surface (cards, inputs)
    
    // Text hierarchy
    text: '#E6EDEF',       // Primary text - high contrast
    textSecondary: '#8B949E', // Secondary text - code comments tone
    textTertiary: '#6E7681', // Tertiary - disabled, subtle
    
    // Interactive elements
    accent: '#58A6FF',     // VSCode-like blue
    accentHover: '#79C0FF', // Accent hover state
    accentActive: '#1F6FEB', // Accent pressed state
    
    // Semantic colors
    success: '#3FB950',    // Green - success states
    warning: '#D29922',    // Amber - warnings
    danger: '#F85149',     // Red - destructive actions
    
    // Borders & dividers
    border: '#30363D',     // Subtle borders
    borderLight: '#21262D', // Lighter borders
    divider: '#21262D',    // Divider lines
    
    // Backgrounds
    backgroundElement: '#0D1117', // Button/card backgrounds
    backgroundSelected: '#1F6FEB', // Selected state
    backgroundHover: '#21262D',    // Hover state
  },
  
  // Light mode (secondary)
  light: {
    background: '#FFFFFF',
    surface: '#F9FAFB',
    surfaceAlt: '#F3F4F6',
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    accent: '#2563EB',
    accentHover: '#1D4ED8',
    accentActive: '#1E40AF',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    divider: '#F3F4F6',
    backgroundElement: '#F9FAFB',
    backgroundSelected: '#DBEAFE',
    backgroundHover: '#F3F4F6',
  },
} as const;

/**
 * Typography system
 * Clean, readable fonts for code and UI
 */
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',      // UI text
    mono: 'Menlo',          // Code display
    serif: 'ui-serif',
    rounded: 'ui-rounded',
  },
  android: {
    sans: 'Roboto',
    mono: 'JetBrains Mono', // Preferred monospace for dev tools
    serif: 'serif',
    rounded: 'normal',
  },
  web: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
    serif: 'ui-serif',
    rounded: 'normal',
  },
});

/**
 * Typography scale
 * Consistent sizing for all text elements
 */
export const Typography = {
  // Headings
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600', lineHeight: 26 },
  
  // Body text
  bodyLarge: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  body: { fontSize: 14, fontWeight: '400', lineHeight: 21 },
  bodySmall: { fontSize: 13, fontWeight: '400', lineHeight: 20 },
  
  // Labels & code
  label: { fontSize: 12, fontWeight: '600', lineHeight: 16 },
  labelSmall: { fontSize: 11, fontWeight: '600', lineHeight: 14 },
  code: { fontSize: 12, fontWeight: '500', lineHeight: 18 },
  
  // UI elements
  button: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
} as const;

/**
 * Spacing system (8px base unit)
 * Consistent gaps and padding throughout the app
 */
export const Spacing = {
  xs: 2,    // 2px - minimal
  sm: 4,    // 4px - tight
  md: 8,    // 8px - base unit
  lg: 12,   // 12px - comfortable
  xl: 16,   // 16px - breathing room
  xxl: 24,  // 24px - section padding
  xxxl: 32, // 32px - major sections
  huge: 48, // 48px - large gaps
} as const;

/**
 * Border radius system
 * Card-based layout with modern rounded corners
 */
export const Radius = {
  none: 0,
  sm: 4,    // Subtle - inputs, small elements
  md: 6,    // Standard - buttons, small cards
  lg: 8,    // Cards - typical card radius
  xl: 12,   // Large cards - expanded components
  full: 9999, // Pills - badges, fully rounded
} as const;

/**
 * Shadow system (elevation)
 * Subtle depth for card-based layouts
 */
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.20,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

/**
 * Component presets
 * Reusable style definitions for common UI patterns
 */
export const Components = {
  card: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.dark.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  
  button: {
    primary: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: Radius.md,
      backgroundColor: Colors.dark.accent,
    },
    secondary: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: Radius.md,
      backgroundColor: Colors.dark.surfaceAlt,
      borderWidth: 1,
      borderColor: Colors.dark.border,
    },
    ghost: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: Radius.md,
      backgroundColor: 'transparent',
    },
  },
  
  input: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.sm,
    backgroundColor: Colors.dark.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    color: Colors.dark.text,
    fontSize: 14,
  },
  
  badge: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.dark.accent,
  },
} as const;

/**
 * Utility values
 */
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

/**
 * Export a type-safe theme getter
 */
export type ThemeColor = keyof typeof Colors.dark & keyof typeof Colors.light;
export type ThemeMode = 'dark' | 'light';

export const getTheme = (mode: ThemeMode = 'dark') => {
  return Colors[mode];
};


// JS values for the --color-* tokens in src/global.css. Use these only where a color must be
// a JS value (icon color props, placeholder color, native tab tints). Everything else uses
// className. `npm run check:tokens` fails if this file drifts from global.css.
export const colors = {
  primary: '#FFC629',
  'primary-soft': '#FFF4D6',
  lavender: '#C9B4FF',
  'lavender-soft': '#F1EDFF',
  ink: '#0B0B1A',
  muted: '#6B7280',
  surface: '#FFFFFF',
  canvas: '#F4F5F7',
  border: '#E5E7EB',
  glass: 'rgba(255, 255, 255, 0.7)',
  success: '#2E9E5B',
  'success-soft': '#E6F6EC',
  danger: '#D93D4B',
  'danger-soft': '#FDECEE',
  info: '#2F6FEB',
  'info-soft': '#E8F0FE',
  'track-off': '#D1D5DB',
  'ink-scrim': 'rgba(11, 11, 26, 0.7)',
} as const;

export type ColorToken = keyof typeof colors;

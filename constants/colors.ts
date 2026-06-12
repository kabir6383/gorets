// ── Design Tokens ─────────────────────────────────────────────────────────────
export const C = {
  bg:           '#0A0A0A',
  surface:      '#141414',
  surfaceHigh:  '#1E1E1E',
  border:       '#2A2A2A',
  accent:       '#F59E0B',
  accentDark:   '#D97706',
  accentLight:  '#FEF3C7',
  white:        '#FFFFFF',
  text:         '#F5F5F5',
  textSec:      '#A3A3A3',
  textMuted:    '#6B6B6B',
  success:      '#10B981',
  error:        '#EF4444',
} as const;

export type ColorKey = keyof typeof C;

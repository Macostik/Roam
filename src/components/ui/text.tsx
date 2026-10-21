import { Text as NativeText, type TextProps } from 'react-native';

export type TextVariant = 'display' | 'heading' | 'title' | 'body' | 'caption' | 'button';
export type TextTone = 'ink' | 'muted' | 'surface' | 'success' | 'danger' | 'info';

const variants: Record<TextVariant, string> = {
  display: 'font-spline-bold text-display',
  heading: 'font-spline-bold text-heading',
  title: 'font-spline-bold text-title',
  body: 'font-spline text-body',
  caption: 'font-spline-medium text-caption',
  button: 'font-spline-medium text-button',
};

// A tone is a single class, so a caller can't pass two competing color classes.
const tones: Record<TextTone, string> = {
  ink: 'text-ink',
  muted: 'text-muted',
  surface: 'text-surface',
  success: 'text-success',
  danger: 'text-danger',
  info: 'text-info',
};

export function Text({
  variant = 'body',
  tone = 'ink',
  className,
  ...props
}: TextProps & { variant?: TextVariant; tone?: TextTone; className?: string }) {
  return (
    <NativeText
      className={[variants[variant], tones[tone], className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}

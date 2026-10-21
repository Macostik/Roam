import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';

import { colors } from '@/theme/colors';

import { Text } from './text';

type ButtonProps = Omit<PressableProps, 'children' | 'className'> & {
  title: string;
  variant?: 'primary' | 'secondary';
  leading?: ReactNode;
  trailing?: ReactNode;
  loading?: boolean;
  className?: string;
};

const variants = {
  primary: 'bg-primary',
  secondary: 'border border-border bg-surface',
};

export function Button({
  title,
  variant = 'primary',
  leading,
  trailing,
  loading = false,
  disabled = false,
  className,
  ...props
}: ButtonProps) {
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      className={[
        'h-14 flex-row items-center justify-center gap-2 rounded-full px-6 active:opacity-70 disabled:opacity-40',
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}>
      {leading}
      <Text variant="button">{title}</Text>
      {loading ? <ActivityIndicator color={colors.ink} /> : trailing}
    </Pressable>
  );
}

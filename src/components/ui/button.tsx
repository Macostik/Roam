import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, View, type PressableProps } from 'react-native';

import { colors } from '@/theme/colors';

import { Text } from './text';

type ButtonProps = Omit<PressableProps, 'children' | 'className'> & {
  title: string;
  variant?: 'primary' | 'secondary';
  size?: 'lg' | 'md';
  leading?: ReactNode;
  trailing?: ReactNode;
  loading?: boolean;
  // edge: the title stays centered and the trailing icon is pinned to the right edge (auth screens).
  iconPlacement?: 'inline' | 'edge';
  className?: string;
};

const variants = {
  primary: 'bg-primary',
  secondary: 'border border-border bg-surface',
};

// lg keeps the board's 56pt button. md is the estimated 48pt height from the onboarding design.
const sizes = {
  lg: 'h-14',
  md: 'h-12',
};

export function Button({
  title,
  variant = 'primary',
  size = 'lg',
  leading,
  trailing,
  loading = false,
  iconPlacement = 'inline',
  disabled = false,
  className,
  ...props
}: ButtonProps) {
  const inactive = disabled || loading;
  const edge = iconPlacement === 'edge';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      className={[
        'flex-row items-center justify-center gap-2 rounded-full px-6 active:opacity-70 disabled:opacity-40',
        sizes[size],
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}>
      {leading}
      <Text variant="button">{title}</Text>
      {edge ? (
        <View className="absolute right-6">{loading ? <ActivityIndicator color={colors.ink} /> : trailing}</View>
      ) : (
        <>{loading ? <ActivityIndicator color={colors.ink} /> : trailing}</>
      )}
    </Pressable>
  );
}

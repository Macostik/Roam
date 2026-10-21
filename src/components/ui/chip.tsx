import type { ReactNode } from 'react';
import { Pressable, type PressableProps } from 'react-native';

import { Text } from './text';

type ChipProps = Omit<PressableProps, 'children' | 'className'> & {
  label: string;
  // filter: selected is lavender (Cabins, Quiet). category: selected is yellow (All Stays).
  variant?: 'filter' | 'category';
  selected?: boolean;
  icon?: ReactNode;
  className?: string;
};

const selectedVariants = {
  filter: 'bg-lavender',
  category: 'bg-primary',
};

export function Chip({
  label,
  variant = 'filter',
  selected = false,
  icon,
  className,
  ...props
}: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      className={[
        'h-10 flex-row items-center gap-2 rounded-full px-4 active:opacity-70',
        selected ? selectedVariants[variant] : 'bg-canvas',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}>
      {icon}
      <Text variant="caption">{label}</Text>
    </Pressable>
  );
}

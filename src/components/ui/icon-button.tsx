import type { LucideIcon } from 'lucide-react-native';
import { Pressable, type PressableProps } from 'react-native';

import { Icon, type IconTone } from './icon';

type IconButtonProps = Omit<PressableProps, 'children' | 'className'> & {
  icon: LucideIcon;
  // Required: an icon-only control has no visible text, so it needs a label for screen readers.
  label: string;
  variant?: 'canvas' | 'surface' | 'plain';
  iconTone?: IconTone;
  filled?: boolean;
  className?: string;
};

const variants = {
  canvas: 'bg-canvas',
  surface: 'bg-surface shadow-card',
  plain: 'bg-transparent',
};

export function IconButton({
  icon,
  label,
  variant = 'canvas',
  iconTone = 'ink',
  filled = false,
  className,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      className={[
        'h-11 w-11 items-center justify-center rounded-full active:opacity-70 disabled:opacity-40',
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}>
      <Icon icon={icon} tone={iconTone} filled={filled} />
    </Pressable>
  );
}

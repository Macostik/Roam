import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon, type IconTone } from './icon';
import { Text, type TextTone } from './text';

export type BadgeVariant = 'guest-favorite' | 'new' | 'discount' | 'superhost' | 'amenity';

const variants: Record<BadgeVariant, { container: string; text: TextTone; icon: IconTone }> = {
  'guest-favorite': { container: 'bg-primary-soft', text: 'ink', icon: 'primary' },
  new: { container: 'bg-success-soft', text: 'success', icon: 'success' },
  discount: { container: 'bg-danger-soft', text: 'danger', icon: 'danger' },
  superhost: { container: 'bg-info-soft', text: 'info', icon: 'info' },
  amenity: { container: 'border border-border bg-surface', text: 'ink', icon: 'ink' },
};

export function Badge({
  variant,
  label,
  icon,
}: {
  variant: BadgeVariant;
  label: string;
  icon?: LucideIcon;
}) {
  const style = variants[variant];

  return (
    <View className={`flex-row items-center gap-1 rounded-full px-3 py-1 ${style.container}`}>
      {icon && <Icon icon={icon} tone={style.icon} size={14} />}
      <Text variant="caption" tone={style.text}>
        {label}
      </Text>
    </View>
  );
}

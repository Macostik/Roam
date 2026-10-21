import type { LucideIcon } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from './icon';
import { Text } from './text';

type PolicyCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  onPress?: () => void;
};

export function PolicyCard({ icon, title, description, onPress }: PolicyCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      className="flex-row items-center gap-4 rounded-xl bg-lavender-soft p-4 active:opacity-70">
      <View className="h-12 w-12 items-center justify-center rounded-lg bg-surface">
        <Icon icon={icon} />
      </View>
      <View className="flex-1 gap-1">
        <Text variant="button">{title}</Text>
        <Text variant="caption" tone="muted">
          {description}
        </Text>
      </View>
      <Icon icon={ChevronRight} />
    </Pressable>
  );
}

import type { LucideIcon } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { Icon } from './icon';
import { Text } from './text';

// A row inside a grouped surface. Group rows in one container with hairline dividers,
// not one card per row.
export function ListRow({ icon, label, onPress }: { icon: LucideIcon; label: string; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="h-14 flex-row items-center gap-4 px-4 active:opacity-70">
      <Icon icon={icon} />
      <Text variant="button" className="flex-1">
        {label}
      </Text>
      <Icon icon={ChevronRight} tone="muted" />
    </Pressable>
  );
}

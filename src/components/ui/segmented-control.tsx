import type { LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from './icon';
import { Text } from './text';

type Option<T extends string> = { value: T; label: string; icon?: LucideIcon };

type SegmentedControlProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onValueChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
}: SegmentedControlProps<T>) {
  return (
    <View accessibilityRole="tablist" className="flex-row rounded-full bg-canvas p-1">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            onPress={() => onValueChange(option.value)}
            className={[
              'h-10 flex-row items-center gap-2 rounded-full px-4 active:opacity-70',
              selected ? 'bg-ink' : '',
            ].join(' ')}>
            {option.icon && (
              <Icon icon={option.icon} tone={selected ? 'surface' : 'ink'} size={18} />
            )}
            <Text variant="caption" tone={selected ? 'surface' : 'ink'}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

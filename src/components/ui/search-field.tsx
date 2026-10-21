import { SlidersHorizontal, Search } from 'lucide-react-native';
import { TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/theme/colors';

import { Icon } from './icon';
import { IconButton } from './icon-button';

type SearchFieldProps = Omit<TextInputProps, 'className'> & {
  onFilterPress?: () => void;
};

export function SearchField({ onFilterPress, placeholder = 'Search', ...props }: SearchFieldProps) {
  return (
    <View className="h-14 flex-row items-center gap-3 rounded-lg bg-canvas px-4">
      <Icon icon={Search} />
      <TextInput
        className="flex-1 font-spline text-body text-ink"
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        accessibilityLabel={placeholder}
        {...props}
      />
      <IconButton
        icon={SlidersHorizontal}
        label="Filters"
        variant="plain"
        onPress={onFilterPress}
      />
    </View>
  );
}

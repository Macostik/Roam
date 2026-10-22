import { View } from 'react-native';

import { Text } from './text';

// Two rules around a centered "or", between the form and the social buttons.
export function OrDivider({ className }: { className?: string }) {
  return (
    <View className={['flex-row items-center gap-4 py-5', className].filter(Boolean).join(' ')}>
      <View className="h-px flex-1 bg-border" />
      <Text variant="caption" tone="muted">
        or
      </Text>
      <View className="h-px flex-1 bg-border" />
    </View>
  );
}

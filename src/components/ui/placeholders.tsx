import { View } from 'react-native';

import { Text } from './text';

// TODO(asset): replace with the official "roam" wordmark SVG when it is provided.
export function Wordmark() {
  return <Text variant="display">roam</Text>;
}

// TODO(asset): replace with the official Google "G" SVG when it is provided.
export function GoogleMark() {
  return (
    <View className="h-5 w-5 items-center justify-center rounded-full border border-border bg-surface">
      <Text variant="caption">G</Text>
    </View>
  );
}

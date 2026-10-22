import { Apple } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from './icon';
import { Text } from './text';

// TODO(asset): replace with the official "roam" wordmark SVG when it is provided.
export function Wordmark() {
  return <Text variant="display">roam</Text>;
}

// TODO(asset): replace with the Apple logo SVG when it is provided. The lucide glyph is a stand-in.
export function AppleMark() {
  return <Icon icon={Apple} filled size={20} />;
}

// TODO(asset): replace with the official Google "G" SVG when it is provided.
export function GoogleMark() {
  return (
    <View className="h-5 w-5 items-center justify-center rounded-full border border-border bg-surface">
      <Text variant="caption">G</Text>
    </View>
  );
}

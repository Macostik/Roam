import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { View } from 'react-native';

import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';

// Back control on the left and the roam wordmark on the right, shared by the three auth screens.
// TODO(asset): the wordmark is text until the official SVG is provided (see Wordmark in placeholders).
export function AuthHeader() {
  return (
    <View className="flex-row items-center justify-between px-6">
      <IconButton icon={ArrowLeft} label="Back" variant="canvas" onPress={() => router.back()} />
      <Text variant="heading">roam</Text>
    </View>
  );
}

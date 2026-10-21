import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

export default function SearchScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center gap-2 bg-canvas p-4">
        <Text variant="heading">Search</Text>
        <Text variant="caption" tone="muted">
          Coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}

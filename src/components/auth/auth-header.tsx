import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { View } from 'react-native';

import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';

type AuthHeaderProps = {
  // Replaces the default Back action (verify uses it to drop the pending attempt first).
  onBack?: () => void;
};

// After sign-out the auth screen is the stack root, so Back falls back to onboarding.
function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/onboarding');
}

// Back control on the left and the roam wordmark on the right, shared by the three auth screens.
// TODO(asset): the wordmark is text until the official SVG is provided (see Wordmark in placeholders).
export function AuthHeader({ onBack = goBack }: AuthHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6">
      <IconButton icon={ArrowLeft} label="Back" variant="canvas" onPress={onBack} />
      <Text variant="heading">roam</Text>
    </View>
  );
}

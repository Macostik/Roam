import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { GoogleMark } from '@/components/ui/placeholders';
import { Text } from '@/components/ui/text';

// TODO(auth): placeholder until Clerk sign-in is set up (plan 05). Replace this screen then.
export default function SignInScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 px-6 pt-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full bg-canvas active:opacity-70">
          <Icon icon={ArrowLeft} size={20} />
        </Pressable>

        <View className="mt-8 gap-4">
          <Text variant="hero">Sign in to roam</Text>
          <Text variant="body" tone="muted">
            Sign-in arrives with Clerk.
          </Text>
        </View>
      </View>

      <View className="gap-3 px-6 pb-6">
        <Button
          title="Continue with Google"
          size="md"
          variant="secondary"
          leading={<GoogleMark />}
          disabled
        />
        {__DEV__ ? (
          // TODO(auth): remove when Clerk lands. Lets the tabs be reached while auth is pending.
          <Button title="Continue to app (dev)" size="md" onPress={() => router.replace('/(tabs)')} />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

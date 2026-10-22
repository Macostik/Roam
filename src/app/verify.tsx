import { ArrowRight } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { Button } from '@/components/ui/button';
import { CodeInput } from '@/components/ui/code-input';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

const CODE_LENGTH = 6;

// TODO(auth): replace the mock with Clerk's email code check. Until then, any six digits pass.
export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState('');
  const complete = code.length === CODE_LENGTH;

  const verify = () => {
    if (!complete) return;
    // Clear the auth screens, so the back gesture from the tabs can't return to them.
    router.dismissAll();
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-surface pt-safe pb-safe">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerClassName="grow pb-6" keyboardShouldPersistTaps="handled">
          <AuthHeader />

          <View className="mt-8 gap-4 px-6">
            <Text variant="hero">{'Check your\nemail'}</Text>
            <Text variant="body" tone="muted">
              {`Enter the 6-digit code we sent to ${email || 'your email'}.`}
            </Text>
          </View>

          <View className="mt-8 px-6">
            <CodeInput value={code} onChangeText={setCode} length={CODE_LENGTH} />
          </View>

          <View className="mt-6 px-6">
            <Button
              title="Verify email"
              size="md"
              iconPlacement="edge"
              trailing={<Icon icon={ArrowRight} />}
              disabled={!complete}
              onPress={verify}
            />
          </View>

          <View className="mt-auto items-center gap-3 pt-6">
            <View className="flex-row flex-wrap items-center justify-center gap-1">
              <Text variant="caption" tone="muted">
                {"Didn't get a code?"}
              </Text>
              {/* TODO(auth): resend is visual only until Clerk lands. */}
              <Pressable accessibilityRole="button">
                <Text variant="caption" className="underline">
                  Resend code
                </Text>
              </Pressable>
            </View>
            <Pressable accessibilityRole="link" onPress={() => router.back()}>
              <Text variant="caption" className="underline">
                Use a different email
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

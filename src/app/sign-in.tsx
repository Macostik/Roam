import { ArrowRight, Lock, Mail } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { OrDivider } from '@/components/ui/or-divider';
import { AppleMark, GoogleMark } from '@/components/ui/placeholders';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { isValidEmail } from '@/utils/validation';

type SignInErrors = { email?: string; password?: string };

// TODO(auth): replace the mock with Clerk sign-in. Until then, any valid-looking email and a password open the app.
export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<SignInErrors>({});

  // Clearing an error as soon as its field changes keeps the message from outliving the fix.
  const change = (field: keyof SignInErrors, set: (value: string) => void) => (value: string) => {
    set(value);
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = () => {
    const next: SignInErrors = {
      email: isValidEmail(email) ? undefined : 'Enter a valid email address',
      password: password ? undefined : 'Enter your password',
    };
    setErrors(next);
    if (next.email || next.password) return;
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
            <Text variant="hero">Welcome back</Text>
            <Text variant="body" tone="muted">
              Sign in to see your saved stays and recommendations.
            </Text>
          </View>

          <View className="mt-8 gap-3 px-6">
            <TextField
              icon={Mail}
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChangeText={change('email', setEmail)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
            />
            <TextField
              icon={Lock}
              label="Password"
              placeholder="Your password"
              value={password}
              onChangeText={change('password', setPassword)}
              error={errors.password}
              secure
              textContentType="password"
              onSubmitEditing={submit}
            />
          </View>

          <View className="mt-6 px-6">
            <Button
              title="Sign in"
              size="md"
              iconPlacement="edge"
              trailing={<Icon icon={ArrowRight} />}
              onPress={submit}
            />
          </View>

          <OrDivider className="px-6" />

          <View className="gap-3 px-6">
            {/* TODO(auth): OAuth is visual only until Clerk lands. These buttons do nothing. */}
            <Button title="Continue with Google" variant="secondary" size="md" leading={<GoogleMark />} />
            <Button title="Continue with Apple" variant="secondary" size="md" leading={<AppleMark />} />
          </View>

          <View className="mt-auto flex-row flex-wrap items-center justify-center gap-1 pt-6">
            <Text variant="caption" tone="muted">
              {"Don't have an account?"}
            </Text>
            <Pressable accessibilityRole="link" onPress={() => router.push('/sign-up')}>
              <Text variant="caption" className="underline">
                Create account
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

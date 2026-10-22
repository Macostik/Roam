import { ArrowRight, Lock, Mail, User } from 'lucide-react-native';
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

type SignUpErrors = { name?: string; email?: string; password?: string };

// TODO(auth): replace the mock with Clerk sign-up. Until then, valid input only moves on to verification.
export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<SignUpErrors>({});

  // Clearing an error as soon as its field changes keeps the message from outliving the fix.
  const change = (field: keyof SignUpErrors, set: (value: string) => void) => (value: string) => {
    set(value);
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = () => {
    const next: SignUpErrors = {
      name: name.trim() ? undefined : 'Enter your full name',
      email: isValidEmail(email) ? undefined : 'Enter a valid email address',
      password: password.length >= 8 ? undefined : 'Use at least 8 characters',
    };
    setErrors(next);
    if (next.name || next.email || next.password) return;
    router.push({ pathname: '/verify', params: { email: email.trim() } });
  };

  return (
    <View className="flex-1 bg-surface pt-safe pb-safe">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerClassName="grow pb-6" keyboardShouldPersistTaps="handled">
          <AuthHeader />

          <View className="mt-8 gap-4 px-6">
            <Text variant="hero">{'Create\nyour account'}</Text>
            <Text variant="body" tone="muted">
              Join roam to save your stays, get personalized recommendations and access them across all your devices.
            </Text>
          </View>

          <View className="mt-8 gap-3 px-6">
            <TextField
              icon={User}
              label="Full name"
              placeholder="e.g. Adrian Hajdin"
              value={name}
              onChangeText={change('name', setName)}
              error={errors.name}
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
            />
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
              placeholder="At least 8 characters"
              value={password}
              onChangeText={change('password', setPassword)}
              error={errors.password}
              secure
              textContentType="newPassword"
              onSubmitEditing={submit}
            />
          </View>

          <View className="mt-6 px-6">
            <Button
              title="Create account"
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
              Already have an account?
            </Text>
            <Pressable accessibilityRole="link" onPress={() => router.push('/sign-in')}>
              <Text variant="caption" className="underline">
                Sign in
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

import { useSignUp } from '@clerk/expo';
import { ArrowRight, Lock, Mail, User } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { OrDivider } from '@/components/ui/or-divider';
import { AppleMark, GoogleMark } from '@/components/ui/placeholders';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { clerkErrors, finishAuth, splitFullName } from '@/utils/auth';
import { isValidEmail } from '@/utils/validation';

type SignUpErrors = { name?: string; email?: string; password?: string };

export default function SignUpScreen() {
  const { signUp, fetchStatus } = useSignUp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [formError, setFormError] = useState<string>();

  // Clearing an error as soon as its field changes keeps the message from outliving the fix.
  const change = (field: keyof SignUpErrors, set: (value: string) => void) => (value: string) => {
    set(value);
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  // Clerk's messages land under the field they're about; anything else shows in the alert.
  const showClerkError = (error: Parameters<typeof clerkErrors>[0]) => {
    const { fields, form } = clerkErrors(error);
    const nameError = fields.first_name ?? fields.last_name;
    setErrors({ name: nameError, email: fields.email_address, password: fields.password });
    const shown = [nameError, fields.email_address, fields.password].some(Boolean);
    setFormError(form ?? (shown ? undefined : Object.values(fields)[0]));
  };

  const submit = async () => {
    const next: SignUpErrors = {
      name: name.trim() ? undefined : 'Enter your full name',
      email: isValidEmail(email) ? undefined : 'Enter a valid email address',
      password: password.length >= 8 ? undefined : 'Use at least 8 characters',
    };
    setErrors(next);
    setFormError(undefined);
    if (next.name || next.email || next.password) return;

    const emailAddress = email.trim();
    const created = await signUp.password({ emailAddress, password, ...splitFullName(name) });
    if (created.error) return showClerkError(created.error);

    if (signUp.status === 'complete') {
      const finalized = await signUp.finalize({ navigate: finishAuth });
      if (finalized.error) showClerkError(finalized.error);
      return;
    }

    const sent = await signUp.verifications.sendEmailCode();
    if (sent.error) return showClerkError(sent.error);

    if (signUp.unverifiedFields.includes('email_address')) {
      router.push({ pathname: '/verify', params: { flow: 'sign-up', email: emailAddress } });
    }
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

          {/* Mount point for Clerk's bot protection, which needs it whenever it is turned on. */}
          <View nativeID="clerk-captcha" />

          <View className="mt-6 gap-3 px-6">
            {formError ? <Alert variant="error" message={formError} onDismiss={() => setFormError(undefined)} /> : null}
            <Button
              title="Create account"
              size="md"
              iconPlacement="edge"
              trailing={<Icon icon={ArrowRight} />}
              loading={fetchStatus === 'fetching'}
              onPress={submit}
            />
          </View>

          <OrDivider className="px-6" />

          <View className="gap-3 px-6">
            {/* TODO(auth): Google and Apple sign-in aren't wired to Clerk yet. These buttons do nothing. */}
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

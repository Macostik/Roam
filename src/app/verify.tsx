import { useSignIn, useSignUp } from '@clerk/expo';
import { ArrowRight } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CodeInput } from '@/components/ui/code-input';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { UNSUPPORTED_STEP, clerkErrors, finishAuth } from '@/utils/auth';

const CODE_LENGTH = 6;

type Notice = { variant: 'success' | 'error'; message: string };

// Serves both email-code steps: confirming a new account's email (flow=sign-up) and Clerk's
// new-device check on sign-in (flow=sign-in). The pending attempt lives in Clerk's client state;
// `email` is only for display.
export default function VerifyScreen() {
  const params = useLocalSearchParams<{ flow?: string; email?: string }>();
  const flow = params.flow === 'sign-in' ? 'sign-in' : 'sign-up';
  const { signUp, fetchStatus: signUpFetch } = useSignUp();
  const { signIn, fetchStatus: signInFetch } = useSignIn();
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string>();
  const [notice, setNotice] = useState<Notice>();
  const [finishing, setFinishing] = useState(false);

  const fetching = (flow === 'sign-up' ? signUpFetch : signInFetch) === 'fetching';
  // An empty sign-up also reports missing_requirements, so a live attempt needs an id too.
  const pending =
    flow === 'sign-up'
      ? Boolean(signUp.id) && signUp.status === 'missing_requirements'
      : Boolean(signIn.id) && signIn.status === 'needs_client_trust';
  // Opened without a live attempt (a deep link, or the attempt was reset): nothing to verify.
  const expired = !pending && !finishing;
  const complete = code.length === CODE_LENGTH;

  const showError = (error: Parameters<typeof clerkErrors>[0]) => {
    const { fields, form } = clerkErrors(error);
    setCodeError(fields.code);
    setNotice(form ? { variant: 'error', message: form } : undefined);
    if (fields.code) setCode('');
  };

  const changeCode = (value: string) => {
    setCode(value);
    setCodeError(undefined);
  };

  const verify = async () => {
    if (!complete || expired) return;
    setNotice(undefined);

    if (flow === 'sign-up') {
      const checked = await signUp.verifications.verifyEmailCode({ code });
      if (checked.error) return showError(checked.error);
      if (signUp.status !== 'complete') return setNotice({ variant: 'error', message: UNSUPPORTED_STEP });
      setFinishing(true);
      const finalized = await signUp.finalize({ navigate: finishAuth });
      if (finalized.error) {
        setFinishing(false);
        showError(finalized.error);
      }
      return;
    }

    const checked = await signIn.mfa.verifyEmailCode({ code });
    if (checked.error) return showError(checked.error);
    if (signIn.status !== 'complete') return setNotice({ variant: 'error', message: UNSUPPORTED_STEP });
    setFinishing(true);
    const finalized = await signIn.finalize({ navigate: finishAuth });
    if (finalized.error) {
      setFinishing(false);
      showError(finalized.error);
    }
  };

  const resend = async () => {
    if (expired) return;
    setNotice(undefined);
    const sent = flow === 'sign-up' ? await signUp.verifications.sendEmailCode() : await signIn.mfa.sendEmailCode();
    if (sent.error) return showError(sent.error);
    setNotice({ variant: 'success', message: 'We sent a new code.' });
  };

  // Drops the pending attempt, so the previous screen starts fresh.
  const startOver = async () => {
    await (flow === 'sign-up' ? signUp.reset() : signIn.reset());
    if (router.canGoBack()) router.back();
    else router.replace(flow === 'sign-up' ? '/sign-up' : '/sign-in');
  };

  return (
    <View className="flex-1 bg-surface pt-safe pb-safe">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerClassName="grow pb-6" keyboardShouldPersistTaps="handled">
          <AuthHeader onBack={startOver} />

          <View className="mt-8 gap-4 px-6">
            <Text variant="hero">{'Check your\nemail'}</Text>
            <Text variant="body" tone="muted">
              {`Enter the 6-digit code we sent to ${params.email || 'your email'}.`}
            </Text>
          </View>

          <View className="mt-8 px-6">
            <CodeInput value={code} onChangeText={changeCode} length={CODE_LENGTH} error={codeError} />
          </View>

          <View className="mt-6 gap-3 px-6">
            {expired ? (
              <Alert variant="error" message="This code has expired. Start again." />
            ) : notice ? (
              <Alert variant={notice.variant} message={notice.message} onDismiss={() => setNotice(undefined)} />
            ) : null}
            <Button
              title="Verify email"
              size="md"
              iconPlacement="edge"
              trailing={<Icon icon={ArrowRight} />}
              disabled={!complete || expired}
              loading={fetching || finishing}
              onPress={verify}
            />
          </View>

          <View className="mt-auto items-center gap-3 pt-6">
            <View className="flex-row flex-wrap items-center justify-center gap-1">
              <Text variant="caption" tone="muted">
                {"Didn't get a code?"}
              </Text>
              <Pressable accessibilityRole="button" disabled={fetching || expired} onPress={resend}>
                <Text variant="caption" className="underline">
                  Resend code
                </Text>
              </Pressable>
            </View>
            <Pressable accessibilityRole="link" onPress={startOver}>
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

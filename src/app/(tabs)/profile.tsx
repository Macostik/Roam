import { useClerk, useUser } from '@clerk/expo';
import { router } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { clerkErrors } from '@/utils/auth';

// No design exists for Profile yet: a minimal layout with the account and Sign out.
export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string>();

  const email = user?.primaryEmailAddress?.emailAddress;

  const handleSignOut = async () => {
    setSigningOut(true);
    setError(undefined);
    try {
      await signOut();
      router.replace('/sign-in');
    } catch (cause) {
      const { form } = clerkErrors(cause instanceof Error ? cause : null);
      setError(form ?? "Couldn't sign out. Try again.");
      setSigningOut(false);
    }
  };

  return (
    <View className="flex-1 bg-canvas px-6 pt-safe pb-safe">
      <View className="mt-8 gap-2">
        <Text variant="heading">{user?.fullName || email || 'Your account'}</Text>
        {email ? (
          <Text variant="body" tone="muted">
            {email}
          </Text>
        ) : null}
      </View>

      <View className="mt-8 gap-3">
        {error ? <Alert variant="error" message={error} onDismiss={() => setError(undefined)} /> : null}
        <Button
          title="Sign out"
          variant="secondary"
          leading={<Icon icon={LogOut} />}
          loading={signingOut}
          onPress={handleSignOut}
        />
      </View>
    </View>
  );
}

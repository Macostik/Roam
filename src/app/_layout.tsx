import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import {
  SplineSans_400Regular,
  SplineSans_500Medium,
  SplineSans_700Bold,
  useFonts,
} from '@expo-google-fonts/spline-sans';
import * as SplashScreen from 'expo-splash-screen';

import '../global.css';

import { Stack } from 'expo-router';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

if (!publishableKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Run `npx clerk@latest env pull`, then restart the dev server.',
  );
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // The splash stays up until the fonts are ready, so no screen renders in the system font.
  const [fontsLoaded, fontError] = useFonts({
    SplineSans_400Regular,
    SplineSans_500Medium,
    SplineSans_700Bold,
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <AnimatedSplashOverlay />
      <RootStack />
    </ClerkProvider>
  );
}

// Tabs need a session; onboarding and the auth screens need none. index and design-system are
// open to both. When the session changes, Expo Router drops the screens that just became
// unreachable, so signing in or out never leaves a back gesture into the other side.
function RootStack() {
  const { isLoaded, isSignedIn } = useAuth();

  // Clerk restores the session from the token cache first, so signed-in guests never see onboarding.
  if (!isLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="verify" />
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}

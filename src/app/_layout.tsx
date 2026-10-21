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
    <>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

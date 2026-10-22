import { useAuth } from '@clerk/expo';
import { Redirect } from 'expo-router';

// Entry: signed-in guests go to the tabs, everyone else to onboarding (shown on every signed-out launch).
// The root layout only renders this once Clerk has loaded, so isSignedIn is settled here.
export default function Index() {
  const { isSignedIn } = useAuth();
  return <Redirect href={isSignedIn ? '/(tabs)' : '/onboarding'} />;
}

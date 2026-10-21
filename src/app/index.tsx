import { Redirect } from 'expo-router';

// First-run entry. Onboarding shows on every launch until Clerk sign-in exists (plan 05).
export default function Index() {
  return <Redirect href="/onboarding" />;
}

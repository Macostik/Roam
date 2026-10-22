import { isClerkAPIResponseError, type useSignIn } from '@clerk/expo';
import { router } from 'expo-router';

type FinalizeParams = NonNullable<Parameters<ReturnType<typeof useSignIn>['signIn']['finalize']>[0]>;

// Errors from a Clerk call, split into per-field messages (keyed by Clerk's snake_case param
// name, e.g. email_address, identifier, password, code) and one message for everything else.
export type ClerkFormErrors = { fields: Record<string, string>; form?: string };

type ClerkCallError = { message: string; longMessage?: string } | null;

export function clerkErrors(error: ClerkCallError): ClerkFormErrors {
  const result: ClerkFormErrors = { fields: {} };
  if (!error) return result;

  if (isClerkAPIResponseError(error) && error.errors.length > 0) {
    for (const item of error.errors) {
      const text = item.longMessage ?? item.message;
      const param = item.meta?.paramName;
      if (param && !result.fields[param]) result.fields[param] = text;
      else if (!param && !result.form) result.form = text;
    }
    return result;
  }

  result.form = error.longMessage ?? error.message;
  return result;
}

export const UNSUPPORTED_STEP = "This account needs a sign-in step the app doesn't support yet.";

// "Adrian Hajdin" → first word is the first name, the rest the last name (left out when empty).
export function splitFullName(name: string) {
  const [firstName = '', ...rest] = name.trim().split(/\s+/);
  const lastName = rest.join(' ');
  return lastName ? { firstName, lastName } : { firstName };
}

// Passed to signIn/signUp.finalize. The Stack.Protected guards in the root layout also drop the
// auth screens once the session is active, so the back gesture can't return to them.
export const finishAuth: FinalizeParams['navigate'] = ({ session }) => {
  if (session?.currentTask) {
    // TODO(auth): no session tasks are configured for this instance, so there is no task UI yet.
    console.warn(`Clerk session task "${session.currentTask.key}" is not handled.`);
    return;
  }
  router.replace('/(tabs)');
};

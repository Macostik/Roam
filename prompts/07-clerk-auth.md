# 07 · Clerk auth (email + password, email code, protected routes, sign out)

Status: approved

## Goal
Guests create an account and sign in for real, through Clerk, on our own sign-up, verify, and sign-in screens. Sign-up confirms the email with a 6-digit code. Sign-in uses email and password, and asks for an emailed code on a new device. The session survives app restarts. Signed-out guests can't reach the tabs, signed-in guests skip onboarding and auth. Profile has a Sign out button.

## Decisions
From your answers:
- Sign-in is email + password. The emailed code is used for sign-up verification and for Clerk's new-device check (`needs_client_trust`, Device Trust is on for the instance). No "sign in with code" link.
- Full name is stored in Clerk's First/Last name. Enable both (not required) in the instance. Code splits the field: first word → `firstName`, the rest → `lastName` (omitted if empty).
- Clerk MCP: the plan is written from the `clerk-expo` skill and the installed SDK types. The build runs in a new session where the Clerk MCP is loaded: before Steps 2–5, ask it for the current `@clerk/expo` custom email/password + email-code flow and Expo Router protection pattern, and follow it where it differs from this plan (say so if it does).

Facts checked in this session:
- `@clerk/expo` is 4.14.0 (newer than the skill's 3.6). The installed types (`@clerk/shared/dist/types/signInFuture.d.mts`, `signUpFuture.d.mts`) have the method API used below: `signUp.password`, `signUp.verifications.sendEmailCode/verifyEmailCode`, `signUp.finalize/reset`, `signIn.password`, `signIn.mfa.sendEmailCode/verifyEmailCode`, `signIn.finalize/reset`, `signIn.status` including `needs_client_trust`. Never use the legacy `prepareFirstFactor`/`setActive` API.
- Instance "Roam" (dev, `musical-duck-1093.clerk.accounts.dev`): email required, verified by `email_code`. Password required, `min_length: 15`. First/last name off. MFA off. Bot protection off. Google OAuth on (unused here).
- `expo-router` v57 has `Stack.Protected` (`node_modules/expo-router/build/layouts/StackClient.d.ts`).
- `tokenCache` from `@clerk/expo/token-cache` is already on `ClerkProvider` (from `clerk init`), so sessions persist in the secure store.

Defaults I picked (change if wrong):
- Clerk instance changes, applied with the Clerk CLI (`npx clerk@latest config patch --json ...`, `--dry-run` first): `user_model.first_name.enabled: true`, `user_model.last_name.enabled: true` (both `required: false`), and `auth_password.min_length: 8`, so the design copy "At least 8 characters" matches what Clerk enforces. Nothing else changes.
- Protection uses `Stack.Protected` in the root layout, not `(auth)`/`(home)` group folders, so no screen files move and URLs stay the same. Guard `isSignedIn` covers `(tabs)`. Guard `!isSignedIn` covers `onboarding`, `sign-up`, `sign-in`, `verify`. `index` and `design-system` are unguarded.
- While Clerk restores the session (`!isLoaded`), the root renders `null` with the splash still up (same as while fonts load), so signed-in guests never see a flash of onboarding.
- `index.tsx` redirects: signed in → `/(tabs)`, signed out → `/onboarding`. Onboarding still shows on every signed-out launch (remembering "seen" is out of scope).
- `verify.tsx` serves both flows with a `flow` param: `sign-up` (verify the new email) or `sign-in` (new-device code). The pending attempt lives in Clerk's client state (`useSignUp`/`useSignIn`), not in route params. `email` stays a display-only param.
- After a `complete` status: `finalize({ navigate })`. `navigate` skips routing if `session.currentTask` is set (none expected with this config; logged as a `TODO(auth)`), else `router.replace('/(tabs)')`. Guards then remove auth screens from reach.
- Errors: client checks stay as they are (empty name, email format, password length 8, empty sign-in password). Clerk field errors show under their field: `errors.fields.emailAddress`/`identifier` → email, `password` → password, `code` → under the code input. Any other Clerk error shows in the existing `Alert` (`variant="error"`) above the primary button, using the error's `longMessage ?? message`. Text is Clerk's own English message.
- Buttons show `loading` while `fetchStatus === 'fetching'`.
- Resend code: sign-up `signUp.verifications.sendEmailCode()`, sign-in `signIn.mfa.sendEmailCode()`. On success a `success` `Alert` "We sent a new code." No cooldown timer.
- "Use a different email" and the header Back on verify: `reset()` the attempt, then go back.
- `AuthHeader` Back: `router.back()` if `router.canGoBack()`, else `router.replace('/onboarding')` (after sign-out the auth screen is the stack root).
- Sign-up renders `<View nativeID="clerk-captcha" />` (bot protection is off now, but Clerk needs the mount point if it is turned on).
- `needs_second_factor` (MFA is off) and any other unexpected status: show the error `Alert` "This account needs a sign-in step the app doesn't support yet." and stay on the screen.
- Sign out lives on the Profile tab: the guest's name (`user.fullName`, falls back to the email) as `heading`, the email as `body` `muted`, and a `secondary` `Button` "Sign out" with a `LogOut` leading icon. It calls `signOut()`, then `router.replace('/sign-in')`. Profile also switches from `SafeAreaView` to `View` with `pt-safe pb-safe` (AGENTS.md styling rule). No design exists for Profile, so this is a minimal derived layout.
- Google and Apple buttons stay visual-only no-ops (`TODO(auth)` kept).
- No new dependencies (`@clerk/expo` and `expo-secure-store` are already installed). No new tokens.
- No API routes yet, so no server-side session check in this plan.

## Out of scope
- Google/Apple OAuth, forgot password, email links, passkeys, biometrics, MFA.
- Session tasks UI (`session.currentTask`).
- Remembering that onboarding was seen.
- A designed Profile screen; account editing.
- PostHog identify on sign-in (PostHog isn't installed).
- Production Clerk instance and EAS secrets.
- Android, web, dark mode visuals (iOS only).

## Steps

### 1. Clerk instance settings
- Check the session: `npx clerk@latest whoami` shows the linked app "Roam".
- Write the patch to the scratchpad: `{"user_model":{"first_name":{"enabled":true,"required":false},"last_name":{"enabled":true,"required":false}},"auth_password":{"min_length":8}}`.
- Run `npx clerk@latest config patch --file <patch> --dry-run`, show the diff, then apply without `--dry-run`.
- Re-check `https://musical-duck-1093.clerk.accounts.dev/v1/environment?_is_native=true`: `first_name` and `last_name` enabled, password min length 8.

Done when the environment endpoint shows the new values.

### 2. Root layout guards and entry
- `src/app/_layout.tsx`: keep `ClerkProvider` + `tokenCache`. Move the stack into a `RootStack` component rendered inside the provider. It reads `useAuth()`; while `!isLoaded` it returns `null`. Otherwise:
  ```tsx
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
  ```
  Before writing, read the v57 Expo Router protected routes page (`https://docs.expo.dev/versions/v57.0.0/` → router → protected routes) and confirm how unlisted routes (`index`, `design-system`) behave.
- `src/app/index.tsx`: `useAuth()`; redirect to `/(tabs)` when signed in, else `/onboarding`. Update the comment (plan 05 note is no longer true).

Done when type check passes, a cold start signed out lands on onboarding, and `roam://(tabs)` while signed out lands on onboarding.

### 3. Sign-up with Clerk
`src/app/sign-up.tsx`:
- `const { signUp, errors, fetchStatus } = useSignUp()` from `@clerk/expo`.
- `submit`: run the current client checks. If they pass, split the name, then `await signUp.password({ emailAddress, password, firstName, lastName })`. On `error`, show field/global errors and stop. Then `await signUp.verifications.sendEmailCode()`. If `signUp.unverifiedFields` includes `email_address`, `router.push({ pathname: '/verify', params: { flow: 'sign-up', email } })`. If `signUp.status === 'complete'`, finalize (shared helper).
- Merge Clerk field errors into the existing `errors` state shape so each field shows one message. Add a `formError` for the `Alert`.
- Primary button `loading={fetchStatus === 'fetching'}`.
- Render `<View nativeID="clerk-captcha" />` just above the primary button.
- Remove the mock `TODO(auth)` line. Keep the OAuth `TODO(auth)`.
- New `src/utils/auth.ts`: `splitFullName(name)`, `clerkErrorMessage(error)` (first error's `longMessage ?? message`), and `finishAuth` (the `finalize` `navigate` callback). Update the comment in `src/utils/validation.ts` (no longer mock-only: these are pre-checks before Clerk).

Done when a new email reaches `/verify` and a real code email arrives; a taken email shows Clerk's error under Email.

### 4. Verify screen
`src/app/verify.tsx`:
- Read `flow` (`'sign-up' | 'sign-in'`, default `'sign-up'`) and `email`.
- `verify`: sign-up → `signUp.verifications.verifyEmailCode({ code })`, then `signUp.status === 'complete'` → `signUp.finalize({ navigate: finishAuth })`. Sign-in → `signIn.mfa.verifyEmailCode({ code })`, then `signIn.status === 'complete'` → `signIn.finalize(...)`. Wrong code: show `errors.fields.code` under the code input and clear the code.
- Resend calls the flow's send method and shows the success `Alert`.
- "Use a different email": `reset()` then `router.back()`.
- If there is no pending attempt (opened by deep link, `signUp.status` is not `missing_requirements` / `signIn.status` is not `needs_client_trust`), show the error `Alert` "This code has expired. Start again." with the Back control.
- `CodeInput` gains an optional `error` prop (caption `danger` under the boxes, boxes `border-danger`), following `TextField`.
- Primary button `loading` while fetching. Remove the mock `TODO(auth)` comment and the mock `dismissAll` path (guards handle it).

Done when the right code signs in and opens the tabs; a wrong code shows Clerk's error.

### 5. Sign-in with Clerk
`src/app/sign-in.tsx`:
- `const { signIn, errors, fetchStatus } = useSignIn()`.
- `submit`: client checks, then `await signIn.password({ emailAddress: email, password })`. On error show it. Then by `signIn.status`: `complete` → finalize; `needs_client_trust` → `await signIn.mfa.sendEmailCode()` then push `/verify` with `flow: 'sign-in'`; anything else → unsupported-step `Alert`.
- Wrong password / unknown email: Clerk's message under the matching field (`identifier` → email, `password` → password).
- `loading` while fetching. Remove the mock comment and the `dismissAll` path.

Done when an existing account signs in (via the code step on the first device) and opens the tabs.

### 6. Profile and sign out
`src/app/(tabs)/profile.tsx`:
- Root `View` `flex-1 bg-canvas pt-safe pb-safe px-6`, content `gap-2` then a `mt-8` button.
- `useUser()` for `fullName` and `primaryEmailAddress.emailAddress`; `useClerk()`/`useAuth()` for `signOut`.
- `Button variant="secondary" title="Sign out" leading={<Icon icon={LogOut} />}`, `loading` while signing out. `await signOut()` then `router.replace('/sign-in')`. A failure shows the error `Alert`.
- `src/components/auth/auth-header.tsx`: Back falls back to `router.replace('/onboarding')` when `!router.canGoBack()`.

Done when Sign out returns to sign-in, and Back there opens onboarding.

### 7. Device check
- `npx expo run:ios` (dev build; `expo-secure-store` is native).
- Run the Verification flows with a real inbox. Take simulator screenshots of sign-up with a Clerk error, verify with a wrong code, and Profile.

## Verification
- `npx tsc --noEmit` and `npx expo lint` pass.
- `grep -rn "prepareFirstFactor\|attemptFirstFactor\|setActive\|useOAuth\|@clerk/expo/legacy" src` returns nothing.
- `grep -rn "CLERK_SECRET_KEY\|sk_test" src` returns nothing.
- Sign-up: empty submit → three local errors. Existing email → Clerk error under Email. Password under 8 → local error. Breached-password (`password1234`) → Clerk error under Password. Valid → code email arrives → `/verify`.
- Verify: wrong code → error, code cleared. Resend → success alert, new email. Right code → tabs. Back gesture from tabs doesn't return to auth.
- Sign-in: wrong password → error. Right password on a new client → code step → tabs.
- Persistence: kill and relaunch the app signed in → tabs, no onboarding flash.
- Guards: signed in, `xcrun simctl openurl booted roam://sign-in` doesn't show sign-in. Signed out, `roam://profile` doesn't show Profile.
- Sign out → sign-in; relaunch → onboarding.
- Clerk dashboard: the new user has first and last name filled.
- End-to-end: fresh install → onboarding → Get started → sign-up → verify → tabs → Profile shows name/email → Sign out → sign-in with the same account → tabs → relaunch → tabs.
- Not checked: Android, web, OAuth, MFA.

## AGENTS.md updates
- Auth (Who owns what): custom flows use the `@clerk/expo` method API (`useSignUp`/`useSignIn` → `password`, `verifications`/`mfa` email code, `finalize`); never the legacy API. Sign-in is email + password; the email code is for sign-up and new-device checks. Name is stored in Clerk First/Last name. Instance password min length is 8.
- Expo routes: auth is enforced with `Stack.Protected` in `src/app/_layout.tsx` (tabs need a session; onboarding/sign-up/verify/sign-in need none). `verify` takes `flow` and `email` params.
- Replaces the 06 mock notes: auth screens are real; sign-out is on Profile.

## Result
Code for Steps 2–6 is built; type check and lint pass; the dev build runs.
- Clerk MCP wasn't authenticated in the build session, so the patterns were checked against the official Clerk email/password guide, the Expo Router protected-routes page, and the installed `@clerk/expo` 4.14 types. No differences from this plan.
- Field errors are mapped from the error each Clerk call returns (`meta.paramName`), not read from the hook's `errors` object, which is stale inside the same handler. Same data, same placement.
- `verify` treats an attempt as pending only when it has an `id`: an empty sign-up also reports `missing_requirements`.
- Step 1 was applied through the Clerk MCP (`patch_instance_config`, dry run first) after the CLI call was blocked. The environment endpoint shows `first_name`/`last_name` enabled and password min length 8.
- Checked on the simulator: signed-out cold start → onboarding; `roam://profile` signed out → onboarding; `roam://verify` with no attempt → "This code has expired" alert.
- Not yet checked: sign-up, verify, sign-in, sign-out, persistence, and signed-in guards with real input (the session can't type into the simulator).

# 06 · Sign up, verification, and sign in (mock)

Status: approved

## Goal
Three auth screens that match the attached sign-up design: Create your account, a 6-digit email verification step, and Sign in. Guests move between them with links and back navigation. Submitting valid input goes to the tabs. There is no real auth yet, so the screens run on a mock. Clerk replaces the mock later (AGENTS.md: Auth).

## Decisions
From your answers:
- Verification and sign-in have no design attached. They are derived from the sign-up design (same header, fields, buttons, spacing). Every value taken from the design is an estimate and is listed in Notes for checking.
- Entry point: onboarding's last Get started and Skip go to `/sign-up`. This replaces the 05 plan's `/sign-in` destination.
- Mock code: any 6 digits pass verification. The code is not checked.
- After a successful mock sign-up or sign-in, the stack is cleared and the tabs open. The dev-only "Continue to app" button in `sign-in.tsx` is removed, because this path replaces it.

Defaults I picked (change if wrong):
- Mock auth keeps no session and stores nothing. Pressing a valid form always succeeds immediately. No loading state is needed, since nothing is fetched.
- Validation runs on submit, not while typing. Errors show under the field in `danger` caption text, and the field border turns `danger`. Messages: "Enter your full name", "Enter a valid email address", "Use at least 8 characters" (sign-up password only), "Enter your password" (sign-in), "Enter the 6-digit code".
- Verify button is enabled only when all six digits are typed.
- Sign-up passes the email to `/verify` as a route param (`email`). If it is missing, the verify screen shows "your email".
- Continue with Google and Continue with Apple are visual only. They are not disabled (a disabled style would not match the design), and they do nothing when tapped. Both keep `TODO(auth)` comments.
- "Resend code" is visual only. "Use a different email" goes back.
- No "Forgot password?" link. No design shows one, and it belongs with Clerk.
- The hidden-password icon matches the design: when the password is hidden, the toggle shows `EyeOff`. The current `TextField` shows `Eye` in that state, so the icon mapping is swapped. This changes the behavior of an existing component.
- No new color or spacing tokens. The existing `danger`, `lavender`, `canvas`, `border`, and `primary` tokens cover the design.
- No new dependencies. `KeyboardAvoidingView` and `ScrollView` come from `react-native`.
- No analytics. PostHog is not installed.

Estimates from the design image (the screen is about 702 px wide in the image for 393 pt, so about 1.79 px per pt):
- Heading uses `hero` (32). The width of "your account" fits 32 pt bold. Line spacing measured about 34 pt, and the token is 36. Keep the token.
- Header wordmark "roam" uses `heading` (28 bold, est.). Its width is about 68 pt.
- Subtitle uses `body` (16). Measured line spacing is about 22 pt, and the token is 24. Keep the token.
- Field height 56 (`h-14`), with a 12 pt gap, measured about 58. Radius `rounded-lg`.
- Field content: icon 24, then 16 gap, then the label. The label text starts about 60 pt from the field's left edge (est.).
- Primary button about 50 pt tall, so `size="md"` (48) is used. It is the closest existing size. Check on device.
- Social buttons about 45 pt tall, `size="md"` (48).
- Primary button: the label is centered and the arrow is pinned to the right edge (new `iconPlacement="edge"`, see Step 1).
- Back control: circle of 44, `bg-canvas`, left edge at `px-6`, same as the placeholder sign-in.

## Out of scope
- Clerk: sessions, real sign-up and sign-in, Google and Apple OAuth, email code delivery, and password reset.
- Storing a "signed in" state, and skipping auth screens for returning users.
- Analytics events.
- Dark mode, Android, and web visuals (verified on iOS only).
- Final brand assets: the official roam wordmark SVG, the Google "G" SVG, and the Apple logo SVG stay `TODO(asset)`.
- Changing `app.json`, dependencies, or the Sanity schema.

## Steps

### 1. Shared primitives
- `src/components/ui/text-field.tsx`:
  - Add a `label` prop. It renders a `Text variant="label"` above the input. The placeholder stays as the example text.
  - Add an `error` prop (string). When set, the border is `border-danger` and a `caption` `tone="danger"` line shows below the field.
  - Swap the icons: hidden password shows `EyeOff`, shown password shows `Eye`. Label: `Show password` and `Hide password` as they are now.
  - Pass `accessibilityLabel` as the label when one is given, otherwise the placeholder (current behavior).
- `src/components/ui/text.tsx`: add a `label` variant, `font-spline-medium text-body`.
- `src/components/ui/button.tsx`: add `iconPlacement?: 'inline' | 'edge'` (default `inline`, so no existing caller changes). With `edge`, the title stays centered and `trailing` is pinned to the right with `px-6`, using absolute positioning in the flex row.
- `src/components/ui/placeholders.tsx`: add `AppleMark`. Use `Icon icon={Apple} filled` from `lucide-react-native`. Add `// TODO(asset): replace with the Apple logo SVG when it is provided.`
- New `src/components/ui/or-divider.tsx`: two `border` lines with a centered `caption` `muted` "or". Vertical padding 20.
- New `src/components/ui/code-input.tsx`: six boxes, each `flex-1 h-14 rounded-lg bg-canvas`, with `border-2`. The active box gets `border-lavender bg-surface`, as in the focused field. Digits are `font-spline-bold text-title`, centered. Use one hidden `TextInput` with `maxLength={6}`, `keyboardType="number-pad"`, `textContentType="oneTimeCode"`, and `autoFocus`. Tapping the boxes focuses the input. Props: `value`, `onChangeText`, `length` (6).
- New `src/components/auth/auth-header.tsx`: the back control (`IconButton`-style circle, label "Back", calls `router.back()`), with the `heading` wordmark "roam" on the right. Layout: row, `justify-between`, `px-6`, and safe-area top.

Done when `npx tsc --noEmit`, `npx expo lint`, and `npm run check:tokens` pass, and the design-system showcase (`src/app/design-system.tsx`) still renders the existing `TextField` and `Button` variants.

### 2. Sign-up screen
Create `src/app/sign-up.tsx`:
- `SafeAreaView` with `bg-surface`. A `KeyboardAvoidingView` (`behavior="padding"` on iOS) wraps a `ScrollView` so fields stay visible above the keyboard.
- `AuthHeader`.
- Heading `hero`: "Create\nyour account". Body `body` `muted`: "Join roam to save your stays, get personalized recommendations and access them across all your devices."
- Three `TextField`s, 12 gap, with labels and placeholders:
  - Full name, placeholder "e.g. Adrian Hajdin", icon `User`.
  - Email address, placeholder "you@example.com", icon `Mail`, `keyboardType="email-address"`, `autoCapitalize="none"`, `autoComplete="email"`.
  - Password, placeholder "At least 8 characters", icon `Lock`, `secure`, `textContentType="newPassword"`.
- Primary `Button` size `md`, `iconPlacement="edge"`, title "Create account", trailing `ArrowRight` (size 20, `surface` or `ink` per the design: ink). Pressing it runs validation. If valid, it calls `router.push({ pathname: '/verify', params: { email } })`.
- `OrDivider`, then two `Button variant="secondary" size="md"`: "Continue with Google" (leading `GoogleMark`) and "Continue with Apple" (leading `AppleMark`). Both are no-op.
- Footer `caption`: "Already have an account? " then a `Pressable` "Sign in" (underlined, `font-spline-medium`, ink) that calls `router.push('/sign-in')`.
- Layout: fields start after the subtitle with a 32 gap. The footer sits at the bottom with `pb-6` plus safe-area bottom.

Done when the screen matches the design (checked in Step 6), empty and invalid input shows the error messages above, and a valid form opens `/verify` with the email param.

### 3. Verification screen
Create `src/app/verify.tsx`:
- Read `email` with `useLocalSearchParams` from `expo-router`. Fall back to "your email".
- `AuthHeader`.
- Heading `hero`: "Check your\nemail". Body `body` `muted`: "Enter the 6-digit code we sent to {email}." Derived copy: confirm in review.
- `CodeInput`, length 6. State: a six-character string.
- Primary `Button` size `md`, `iconPlacement="edge"`, title "Verify email", trailing `ArrowRight`. Disabled (`disabled` prop, `opacity-40`) until six digits are typed.
- Below the button, centered `caption`: "Didn't get a code? " and "Resend code" (inert, underlined). A second link "Use a different email" calls `router.back()`.
- On press, with six digits: `router.dismissAll()` then `router.replace('/(tabs)')`. Before writing this, read the Expo Router v57 docs for `router.dismissAll`, `router.replace`, and `useLocalSearchParams` (`https://docs.expo.dev/versions/v57.0.0/`, then the router pages it links to). The same check applies to `KeyboardAvoidingView` in Steps 2 and 4.

Done when a 6-digit code opens the tabs, and the back gesture from the tabs does not return to the auth screens.

### 4. Sign-in screen
Rewrite `src/app/sign-in.tsx` (replaces the placeholder and removes the dev button):
- Same frame as sign-up: `KeyboardAvoidingView`, `ScrollView`, `AuthHeader`.
- Heading `hero`: "Welcome back". Body `body` `muted`: "Sign in to see your saved stays and recommendations." Derived copy: confirm in review.
- Two `TextField`s: Email address (`Mail`, email keyboard, `autoComplete="email"`), and Password (`Lock`, `secure`, `textContentType="password"`, placeholder "Your password").
- Primary `Button` size `md`, `iconPlacement="edge"`, title "Sign in", trailing `ArrowRight`. Validation: email format and a non-empty password. Valid input calls `router.dismissAll()` then `router.replace('/(tabs)')`.
- `OrDivider`, then the same two social buttons as sign-up (no-op).
- Footer `caption`: "Don't have an account? " and "Create account" (underlined, ink), which calls `router.push('/sign-up')`.
- Remove `__DEV__` button and its `TODO(auth)` comment. Keep one `TODO(auth): replace with Clerk sign-in` comment at the top of the file.

Done when a valid email and password open the tabs, and the footer link opens sign-up.

### 5. Navigation
- `src/app/_layout.tsx`: no change. The root `Stack` already has `headerShown: false`, and the new routes are picked up automatically.
- `src/app/onboarding.tsx`: rename `toSignIn` to `toSignUp` and point it at `router.push('/sign-up')`. It runs for the last Get started and for Skip. Update the comment to say sign-up is the mock entry until Clerk lands.
- `src/app/index.tsx`: no change.
- The route list is: `/onboarding` → `/sign-up` ⇄ `/sign-in`, and `/sign-up` → `/verify` → `/(tabs)`, with success on sign-in going to `/(tabs)`.

Done when, in the simulator, Skip and the last Get started reach sign-up. The sign-up footer reaches sign-in and back. Verify reached from sign-up, and Back from verify returns to sign-up.

### 6. Verify and match the design
- Open the simulator. Deep link `roam://sign-up`, `roam://sign-in`, and `roam://verify?email=adrian%40example.com`.
- Take a screenshot of each with `xcrun simctl io booted screenshot`. Compare sign-up to the attached design, and sign-in and verify to the derived layout.
- Use the estimates in Decisions as the first pass. List every difference, fix it, and repeat. Mark which values were estimated from the image.

## Verification
- `npx tsc --noEmit` passes.
- `npx expo lint` passes.
- `npm run check:tokens` passes.
- `grep -rn "StyleSheet\|#[0-9a-fA-F]\{3,6\}" src/app/sign-up.tsx src/app/sign-in.tsx src/app/verify.tsx src/components/auth src/components/ui/or-divider.tsx src/components/ui/code-input.tsx` returns nothing.
- Sign-up: empty submit shows three errors. A bad email shows the email error. A short password shows the length error. A valid form opens `/verify?email=...`.
- Verify: the Verify button stays disabled until six digits. Six digits open the tabs. Hardware back does not return to the auth screens.
- Sign-in: empty and bad input shows errors. A valid form opens the tabs. The footer link opens sign-up.
- Hidden-password toggle changes the icon and the label on sign-up and sign-in.
- The design-system showcase still renders `TextField` and `Button` (the no-label, `iconPlacement="inline"` case).
- Simulator screenshots of all three screens, with differences listed.
- End-to-end: cold launch → onboarding → Get started ×3 → Get started → `/sign-up` → invalid submit → valid submit → `/verify` → Back → Sign in → valid → tabs.
- Not checked: Android, web, dark mode, VoiceOver, and keyboard behavior on small phones (reported as not checked in the final report).

## AGENTS.md updates
- Expo / routes: auth routes are `sign-up`, `verify`, and `sign-in` in `src/app/`. After success they clear the stack and open `/(tabs)`.
- Auth placeholder (replaces the 05 entry): the mock has no session. Mock sign-up and sign-in always succeed for valid input. The dev-only "Continue to app" button is removed. Clerk replaces all three screens.
- Design system: `TextField` gets `label` and `error` props. `Button` gets `iconPlacement`. New components: `OrDivider`, `CodeInput`, and `AuthHeader` (in `src/components/auth/`). `AppleMark` is a placeholder.
- Icon rule: hidden passwords show `EyeOff`.
- Replaces the 05 plan's sign-in destination: onboarding opens sign-up.

## Result
Not started. Awaiting approval.

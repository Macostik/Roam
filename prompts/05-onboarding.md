# 05 · Onboarding and auth entry

Status: approved

## Goal
A first-run flow of three full-screen slides that match the design (1/3, 2/3, 3/3): a full-bleed Unsplash photo, progress bars, a location pill, a headline, body copy, and the actions Get started and Continue with Google. Get started moves through the slides. On the last slide, and from any slide via Skip, the user lands on a placeholder sign-in route that Clerk replaces later.

## Decisions
From your answers:
- Photos: the three Unsplash photos you pick (see Photo URLs below). They are downloaded into `assets/onboarding/` and bundled. Unsplash License allows this. Credit goes in Notes.
- Launch: onboarding is the first screen on every launch until sign-in exists. Once Clerk sign-in exists, a signed-in user skips it (not in this plan). Remembering "seen" needs a storage package, which is a separate approval.
- Auth target: a placeholder `/sign-in` route. Continue with Google is visual only, with the `GoogleMark` placeholder (`TODO(asset)`).

Defaults I picked (change if wrong):
- Get started advances slide 1 to 2 to 3. On slide 3 it opens `/sign-in`. Skip opens `/sign-in` from any slide.
- Slides change by swipe (horizontal paging list, built into React Native) or by Get started. No animations beyond the paging motion (no motion tokens exist yet).
- Copy is exact from the design. Location pills: Whistler, BC / Aqaba, Jordan / Skykomish, WA.
- Headline line breaks follow the design (see Slide copy), so each headline is written with an explicit `\n`.
- Sign-in placeholder: heading "Sign in to roam", body "Sign-in arrives with Clerk.", a back control, the Google button (inert), and a dev-only "Continue to app" button (`__DEV__` only, `TODO(auth)`, removed when Clerk lands) so the tabs stay reachable while auth is pending.
- Routing: the root layout becomes a `Stack` with `headerShown: false`. The four tabs move into a `(tabs)` group. `src/app/index.tsx` redirects to `/onboarding`. The current Home screen moves to `(tabs)/index.tsx` unchanged.
- No analytics. PostHog is not installed, so this plan adds no events.
- No new dependencies. `expo-image`, `expo-router`, `lucide-react-native`, and `react-native-svg` are already installed.

## Photo URLs (pending)
The user supplies these before Step 1. Each must be a unsplash.com/photos/... page link.

| Slide | Design subject | Unsplash URL |
|---|---|---|
| 1 | Lake cabin at dusk, mountains, warm windows | TBD |
| 2 | Palm trees silhouetted at sunset over water | TBD |
| 3 | A-frame cabin with string lights in a forest | TBD |

Download each at width 1200 with `https://images.unsplash.com/photo-<id>?w=1200&q=80&fm=jpg`, and save as `assets/onboarding/lake-cabin.jpg`, `palm-beach.jpg`, `a-frame.jpg`.

## Slide copy (exact)
1. Pill: "Whistler, BC". Headline: "Find a stay that fits\nyour story". Body: "From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip."
2. Pill: "Aqaba, Jordan". Headline: "Just say what\nyou're after". Body: "Describe your trip in one sentence, like a quiet cabin with a hot tub, and roam ranks the stays that fit."
3. Pill: "Skykomish, WA". Headline: "Answers straight\nfrom the stay". Body: "Ask about check-in, pets or cancellations and see the stay's own rules, word for word, with their source."

Button labels: "Get started" (with an arrow-right trailing icon), "Continue with Google" (with the G placeholder leading).

## Measured layout (est.)
Measured from the design screenshots, which are about 2x a 393pt-wide phone. Check each on device.
- Photo: full-bleed, under the status bar. `contentFit="cover"`.
- Top bar: wordmark at left, `px-6`, safe-area top. Skip pill at right, `px-6`. The wordmark is the existing `Wordmark` (display, 56), which matches the design width.
- Skip pill: `bg-glass`, `rounded-full`, height 36 (est.), `px-4`, text `button` in ink. Accessible label "Skip onboarding".
- Location pill: bottom edge about 22pt above the sheet top, left at `px-6`. Background `ink-scrim` (new token). Height 36 (est.), `px-4`, MapPin icon 16 in surface, text `caption` in surface.
- Sheet: white, full width, covering the bottom 40% of the screen. Top-left radius 24 (`rounded-2xl`). Top-right radius 96 (est.). The design's top edge is elliptical and steeper at the right. A circular corner is a known approximation. If it looks wrong on device, draw the sheet with `react-native-svg`.
- Sheet content, top to bottom, `px-6`:
  - Progress: 3 segments, 32 wide, 4 tall, 8 apart (est.). Active `bg-lavender`, inactive `bg-border`. Top padding 24.
  - 20 gap, headline `hero` (32 / 36, Bold, ink, new variant).
  - 16 gap, body `body` (16 / 24, muted). The design's body line spacing is about 18pt. This is a known difference, kept on the token.
  - 16 gap, Get started: `Button` `size="md"` (48 tall, est.), primary, trailing arrow.
  - 12 gap, Continue with Google: `Button` `size="md"`, secondary, leading `GoogleMark`.
  - Bottom padding 24 plus the safe-area bottom.

## Tokens (proposed new, est.)
Add to `src/global.css` `@theme` and mirror in `src/theme/colors.ts` where JS needs them:
- `--color-ink-scrim: rgba(11, 11, 26, 0.7)`. Location pill background over photos. Mirror as `ink-scrim` in `colors.ts`.
- `--text-hero: 32px` with `--text-hero--line-height: 36px`. Used for the onboarding headline. Font `font-spline-bold`. The board's heading range is 28 to 32, so 32 is inside it. Add as variant `hero` in `text.tsx`.
- `--radius-sheet: 96px` (est.). Top-right corner of the onboarding sheet.

Also add a `size` prop to `Button`: `lg` (current `h-14`, default, so existing callers don't change) and `md` (`h-12`, est.).

## Out of scope
- Custom slide animations and transitions (swipe paging is in scope; see Decisions).
- Remembering that onboarding was seen (needs a storage package, separate approval).
- Clerk: sign-in, sessions, Google OAuth, and skipping onboarding for signed-in users.
- Analytics events.
- The official wordmark SVG and the Google G SVG (both stay `TODO(asset)`).
- Dark mode, Android, and web visuals (verified on iOS only).
- Changing `app.json`.

## Steps

### 1. Bundle the three photos
Once the user gives the three Unsplash URLs, download each with `curl` at the size above into `assets/onboarding/`. Open each file with the Read tool and confirm it shows the design's subject. If one doesn't match, stop and ask for a replacement. Done when the three files exist and each one matches its slide.

### 2. Tokens and Button size
Add the three tokens above to `src/global.css` and `src/theme/colors.ts` (`ink-scrim`). Add the `hero` text variant in `src/components/ui/text.tsx`. Add `size` (`lg` default, `md`) to `src/components/ui/button.tsx`, keeping the current classes for `lg`. Done when `npm run check:tokens`, `npx tsc --noEmit`, and `npx expo lint` pass.

### 3. Routing: root Stack and tabs group
- `src/app/_layout.tsx`: keep the font loading and `AnimatedSplashOverlay`. Replace the `AppTabs` child with `<Stack screenOptions={{ headerShown: false }} />`.
- Move `src/app/index.tsx`, `search.tsx`, `trips.tsx`, `profile.tsx` into `src/app/(tabs)/` with `git mv`. Keep their contents unchanged.
- Create `src/app/(tabs)/_layout.tsx` that renders `<AppTabs />` from `@/components/app-tabs`. Its trigger names (`index`, `search`, `trips`, `profile`) stay the same.
- Create `src/app/index.tsx` as `<Redirect href="/onboarding" />` (from `expo-router`).
- Create a placeholder `src/app/sign-in.tsx` (see Step 5).
Done when `roam://` opens onboarding, and the tabs still render after `roam://(tabs)`. Check the typed routes in `expo-env.d.ts` after the Expo dev server regenerates them.

### 4. Onboarding screen
- `src/components/onboarding/onboarding-slides.ts`: the three slides (copy, pill, and a static `require()` of each bundled photo).
- `src/components/ui/location-pill.tsx` and `src/components/ui/progress-segments.tsx`: primitives with `className` merged last. The segments take `count` and `index`, and have `accessibilityLabel` "Step n of 3".
- `src/components/onboarding/onboarding-sheet.tsx`: the sheet, using the measured layout above and the `md` buttons.
- `src/app/onboarding.tsx`: keeps `index` in state, renders the photo with `expo-image` (`contentFit="cover"`), the top bar (Wordmark and the Skip pill), the location pill, and the sheet. Get started increments `index`. On slide 3 it calls `router.push('/sign-in')`. Skip calls `router.push('/sign-in')` too. Use `push` so the back gesture works.
Done when the three slides render with the copy, and tapping Get started cycles 1 to 2 to 3 and then opens `/sign-in`.

### 5. Placeholder sign-in
Create `src/app/sign-in.tsx`: heading "Sign in to roam" (`hero`), body "Sign-in arrives with Clerk.", the inert Continue with Google button, a back control with an icon-only label "Back", and under `__DEV__` only a "Continue to app" button that calls `router.replace('/(tabs)')` and carries `TODO(auth)`. Done when Skip and the last Get started both land here, Back returns to onboarding, and in dev "Continue to app" opens the tabs.

### 6. Verify and match the design
Open the simulator, deep link `roam://onboarding`, and take a screenshot of each slide with `xcrun simctl io booted screenshot`. Compare each to its design image, list every difference, fix it, and repeat. Mark the estimated values as estimates. Confirm that the Skip path and the Get started path reach sign-in, and that a cold launch of `roam://` opens onboarding.

## Verification
- `npx expo lint` passes.
- `npx tsc --noEmit` passes.
- `npm run check:tokens` passes.
- `grep -rn "StyleSheet\|#[0-9a-fA-F]\{3,6\}" src/app src/components/onboarding src/components/ui/location-pill.tsx src/components/ui/progress-segments.tsx` returns nothing.
- Each bundled photo was viewed and matches its design subject.
- Simulator screenshots of slides 1, 2, and 3 compared to the design, with differences listed.
- End-to-end: cold launch `roam://` → slide 1 → Get started → slide 2 → slide 3 → Get started → `/sign-in` → Back → Skip → `/sign-in` → dev Continue → tabs.
- Not checked: Android, web, and offline loading of the bundled photos (reported as not checked in the final report).

## AGENTS.md updates
- Routes (Expo section): the root is a `Stack`. Tabs live in `src/app/(tabs)/`. `src/app/index.tsx` redirects to `/onboarding`. Onboarding shows on every launch until Clerk sign-in exists.
- Assets: onboarding photos are bundled in `assets/onboarding/` (Unsplash License). The "remote placeholder images" rule applies to listing photos only.
- Design system: new tokens `ink-scrim`, `hero` text, `radius-sheet`, and the Button `size` prop.
- Auth placeholder: `/sign-in` is replaced by Clerk. Until then, the `__DEV__` "Continue to app" button is the only way into the tabs.

## Result
Not started. Awaiting approval.

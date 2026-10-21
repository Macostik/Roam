# 04 · Roam design system

Status: approved

## Goal
Roam has one design system built from the reference board: tokens (color, type, radius, spacing, shadow), a shared icon set, and the reusable components shown on the board. The Home screen and the four tabs use it, and a dev-only showcase route shows every component. Verified with lint, type check, and simulator screenshots compared against the reference.

## Decisions
From your answers:
- Font: Spline Sans (already named as `--font-display` in `src/global.css`). Installed with `@expo-google-fonts/spline-sans` and loaded with `expo-font`. Weights: 400 Regular, 500 Medium, 700 Bold. Confirm it matches the reference wordmark on device; if not, stop and ask for a font file.
- Icons: `lucide-react-native` with `react-native-svg` (outline style, close to the board). Installed with `npx expo install`.
- Tokens: Tailwind `@theme` variables in `src/global.css` are the one source. `src/constants/theme.ts` (`Colors`, `Fonts`, `Spacing`, `MaxContentWidth`, `BottomTabInset`) and `src/hooks/use-theme.ts` are removed once nothing imports them. `ThemedText`/`ThemedView` are rewritten on tokens and keep their current props.
- Template screens move to the tokens now (index, explore).
- Navigation: tabs become Home, Search, Trips, Profile with `NativeTabs`. Search, Trips, and Profile are placeholder screens. `explore.tsx` is renamed to `search.tsx`, since its template content is replaced.

Defaults I picked (change if wrong):
- Light only. The board shows no dark mode. `app.json` gets `"userInterfaceStyle": "light"` so the system dark setting does not show light tokens on dark backgrounds.
- Components live in `src/components/ui/`, the folder that already holds `collapsible.tsx`. Composed cards (ListingCard, PolicyCard) live there too.
- Dev showcase at `src/app/design-system.tsx`. It is not a tab, reachable only by deep link `roam://design-system`. Kept after this plan, for review.
- Home (`src/app/index.tsx`) shows the search field, the category chips, and one ListingCard with hardcoded sample data. No data fetching yet, so the loading/error/empty states do not apply. Revisit when real data exists.
- Filter chips use two variants: `filter` (selected = lavender) and `category` (selected = yellow), following the two chip rows on the board.
- Non-token values (see Tokens below) are marked "est." and get a check on device.

## Source values (from the board)

Exact values from the board's palette text:

| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#FFC629` | Primary buttons, selected category chip, active tab, toggle on |
| `--color-lavender` | `#C9B4FF` | Selected filter chip, icon tile tint, highlights |
| `--color-ink` | `#0B0B1A` | Headings, primary text, selected segment fill |
| `--color-muted` | `#6B7280` | Body and secondary text, placeholder text |
| `--color-surface` | `#FFFFFF` | Cards, sheets, modals, inputs (focused) |
| `--color-canvas` | `#F4F5F7` | App background, input fields |
| `--color-border` | `#E5E7EB` | Dividers, borders |
| `--color-glass` | `rgba(255,255,255,0.7)` | Tab bar and glass surfaces |

Estimated from the board (est., no value given; check on device):
- `--color-primary-soft` `#FFF4D6` (est.): yellow tint, Guest favorite badge background.
- `--color-lavender-soft` `#F1EDFF` (est.): policy card and icon tile background.
- `--color-success` `#2E9E5B` with `--color-success-soft` `#E6F6EC` (est.): success alert and New badge.
- `--color-danger` `#D93D4B` with `--color-danger-soft` `#FDECEE` (est.): error alert and 20% off badge.
- `--color-info` `#2F6FEB` with `--color-info-soft` `#E8F0FE` (est.): Superhost badge.
- `--color-track-off` `#D1D5DB` (est.): toggle off.
- `--color-star` `#FFC629` (est.): the star uses primary yellow.

Typography (board, Font: Geometric Sans, so Spline Sans is used). Ranges on the board are given as min–max; the chosen value is the first number in each range, so the sizes fit a phone:
- `display`: 56 / line height 56 (1.0), Bold 700. Board range 56–64. Phone width limits it.
- `heading`: 28 / 34 (1.2), Bold 700. Board range 28–32.
- `body`: 16 / 24 (1.5), Regular 400.
- `caption`: 14 / 20, Medium 500. Board has a caption at 14.
- `button`: 17 / 22, Medium 500. Board range 17–18.

Radius (est.): `full` 9999 (buttons, chips, icon buttons, tab bar), `lg` 16 (inputs, alerts, tiles), `xl` 20 (policy card), `2xl` 24 (listing card). Use `borderCurve: "continuous"` on non-full radii, per expo-native-ui.

Spacing (est.): use Tailwind's default 4-point scale (`--spacing: 4px`, so `p-4` = 16). Board paddings snap to the nearest step: 8, 12, 16, 20, 24, 32. Set `--spacing: 4px` explicitly in `@theme` so the value is visible in the token file.

Shadow (est.): `--shadow-card: 0 1px 2px rgba(11,11,26,0.06), 0 4px 12px rgba(11,11,26,0.08)`. Used on listing card and policy card.

## Assets not in the repo
- Wordmark "roam" (board section 01). No SVG exists, so a text placeholder in the display style is used, marked `TODO(asset)`. The user must provide the SVG.
- Google "G" for the Continue with Google button. Placeholder: a 20px circle with the letter "G", marked `TODO(asset)`. The user must provide the official SVG.
- Listing photo. A remote placeholder image URL (chosen at build), marked `TODO(asset)`.
- Icons come from lucide, not screenshots.

## Out of scope
- Dark mode tokens.
- Real search, booking, auth, or data fetching. Home and Search use hardcoded data.
- Google sign-in logic (the button is visual only).
- Animations and motion tokens (the board shows none). Add when a feature needs them.
- Android and web visual checks beyond launch (verified: iOS only; see Verification).
- Changing `app.json` beyond `userInterfaceStyle`.

## Steps

### 1. Install dependencies
Run `npx expo install @expo-google-fonts/spline-sans react-native-svg lucide-react-native`. Check with `npx expo-doctor`. If Expo Go shows a missing native module (react-native-svg), run `npx expo run:ios` per AGENTS.md, and report it. Before writing code, read the current docs for the installed Expo major (57): https://docs.expo.dev/versions/v57.0.0/ and the expo-font and NativeWind V5 pages (the Tailwind `@theme` syntax and the `useCSSVariable` API, if present in react-native-css 3.1.0-rc.0). Done when `npm ls` shows the three packages and `npx expo-doctor` has no new errors.

### 2. Tokens in global.css
Rewrite `src/global.css`. Keep the four `--font-*` variables and the import order from plan 03. Add an `@theme` block with the color, font-family, radius, spacing, and shadow tokens above. Use `--font-sans` for Spline Sans with the platform fallback, and `--font-display` (used today) as an alias. Done when `npx expo start --clear` bundles and a `bg-primary` class renders yellow in the simulator.

### 3. Fonts
In `src/app/_layout.tsx`, call `useFonts` from `expo-font` with the three Spline Sans weights. Hold the splash (`SplashScreen.preventAutoHideAsync` is already set) until fonts load, and render nothing until then. Done when the simulator shows Spline Sans, not the system font, on a test string.

### 4. Icon map and token access
Create `src/components/ui/icon.tsx`: a wrapper that takes a lucide icon and a token name (`ink`, `muted`, `primary`, `surface`) and resolves the hex. Get the hex from `useCSSVariable` in react-native-css if the docs confirm it exists; otherwise export a static `colorValues` object from `src/theme/colors.ts` and add a test that it matches `global.css`, and report this deviation. Icon names to use (verify each exists in the installed lucide package): House (Home), Search, Heart, Share2, Bookmark, CalendarDays, User, Settings, MapPin, SlidersHorizontal, Eye, EyeOff, Lock, ArrowRight, ChevronRight, X, Check, CircleAlert, Star, PawPrint, Bed. Done when `npx tsc --noEmit` passes and each icon renders in the showcase.

### 5. Text and template theming
Rewrite `src/components/themed-text.tsx` and `themed-view.tsx` on tokens, keeping their props. Map the old `type` names to the new text variants: `title`→`display`, `subtitle`→`heading`, `default`→`body`, `small`→`caption`, `smallBold`→`caption` with Bold, `link`/`linkPrimary`→`caption` with ink color, `code`→`caption` (mono font). Create `src/components/ui/text.tsx` with a `variant` prop (`display`, `heading`, `body`, `caption`, `button`) and `color` tokens. Move `explore.tsx`, `index.tsx`, `hint-row.tsx`, `collapsible.tsx`, `external-link.tsx`, and `web-badge.tsx` off `Colors`, `Spacing`, `Fonts`, `useTheme`. Then delete `src/constants/theme.ts`, `src/hooks/use-theme.ts`, and `src/hooks/use-color-scheme.web.ts` if nothing imports them. Run `npx expo lint` and `npx tsc --noEmit` to find leftover imports. Done when `grep -rn "constants/theme\|use-theme" src` returns nothing.

### 6. Primitives (src/components/ui/)
Each takes `variant`, `size` where it applies, and `style` (merged last), per expo-design-system. Pressed feedback on every tappable item. Accessibility labels on icon-only controls.
- `button.tsx`: `primary` (yellow, ink text, arrow icon option), `secondary` (white, border, optional Google "G" placeholder left). Size `md` (height ~56, est.), radius `full`, font `button`.
- `icon-button.tsx`: circle, `canvas` background, icon 20. Used for favorite, share, search, bookmark.
- `chip.tsx`: `variant` `filter` | `category`, `selected`, optional icon. Pill, radius `full`, height ~40 (est.).
- `search-field.tsx`: icon left, text, trailing SlidersHorizontal button. Background `canvas`, radius `lg`, height ~56 (est.).
- `text-field.tsx`: leading icon, label placeholder in `muted`, states `default`, `focused` (border lavender, est.), `filled`. Includes `secure` mode with the Eye/EyeOff toggle (`PasswordField` is this with `secure`).
- `toggle.tsx`: on = primary, off = `track-off`. Use the RN `Switch` only if it matches; otherwise a custom Pressable with `accessibilityRole="switch"` and `accessibilityState`.
- `stepper.tsx`: minus, value, plus. Minus and plus are icon buttons; the value is `heading`.
- `segmented-control.tsx`: two or more segments. Selected = ink fill with surface text; unselected = muted text.

### 7. Composed components (src/components/ui/)
These are used in two or more places (Home, showcase, Trips), so they follow the promotion rule in expo-design-system.
- `listing-card.tsx`: image (expo-image, placeholder URL, `TODO(asset)`), favorite icon button overlay, title (`heading` size 20 est. or `body` bold), location line with MapPin, star rating with count, amenity badges (Hot Tub, Pet Friendly with icons), price line "$280 / night" (price bold ink, "/ night" muted). Radius `2xl`, `shadow-card`.
- `policy-card.tsx`: lavender-soft tile with an icon (MessageSquare or similar, est.), title, description, ChevronRight. Radius `xl`.
- `list-row.tsx`: grouped row with an icon, label, and ChevronRight. Rows sit inside one surface container with `border` hairlines, not one card per row (native-slop rule).
- `alert.tsx`: `success` | `error`, icon, message, dismiss X. Radius `lg`, soft background.
- `badge.tsx`: `guest-favorite` (primary-soft, star), `new` (success-soft), `discount` (danger-soft, text "20% off"), `superhost` (info-soft). Radius `full`.
- `wordmark.tsx`: text placeholder for "roam" (display style), `TODO(asset)`.

### 8. Tabs and routes
In `src/components/app-tabs.tsx`, replace the `NativeTabs` triggers with Home (`index`), Search (`search`), Trips (`trips`), Profile (`profile`). Tint selected items with `primary` yellow and the bar with `glass`. Icons: House, Search, CalendarDays, User, through the icon map. Rename `src/app/explore.tsx` to `src/app/search.tsx` with a placeholder screen, and add `trips.tsx` and `profile.tsx` placeholders. Create `src/app/design-system.tsx` (showcase; a `Stack`-free screen; not in the tab triggers). Set `userInterfaceStyle` to `light` in `app.json`. If `NativeTabs` cannot match the board's selected-state highlight (a yellow glow pill under the icon), stop and explain, don't force a custom bar.

### 9. Home screen
Rewrite `src/app/index.tsx`: wordmark placeholder at the top, search field, the "Cabins / Under $300 / Pet Friendly / Quiet" filter chips, then the category row ("All Stays" selected, Cabins, Beach, City, Villas), then one ListingCard with the sample data (Modern Cabin with Hot Tub, Lake Arrowhead, CA, 4.9 (342), $280 / night). Screen padding `p-4`, section gap `gap-4`. Use the tokens only, no literals outside `global.css`.

### 10. Showcase
In `src/app/design-system.tsx`, render each board section (01–15) in order with its heading, using the components above. Use the exact copy from the board. This page is the one the screenshot comparison uses.

### 11. Verify
Run the Verification commands. Open the simulator (`npx expo start`, press `i`). Screenshot Home (`xcrun simctl io booted screenshot`), then deep link the showcase (`xcrun simctl openurl booted roam://design-system`) and screenshot it. Compare each section against the board. List every difference, fix it, and repeat until the differences are in the "Notes" list only. Estimated values stay marked est.

## Verification
- `npx expo lint` passes.
- `npx tsc --noEmit` passes.
- `npx expo-doctor` has no new errors.
- `grep -rn "constants/theme\|use-theme\|StyleSheet.create" src/app src/components/ui` returns nothing for template-only imports. StyleSheet may remain in untouched template components.
- Home screenshot: yellow/lavender chips, Spline Sans, listing card layout match the board.
- Showcase screenshots: each of sections 01–15 present, with the board's copy, colors, and states.
- Deep link `roam://design-system` opens the showcase; the tab bar shows Home, Search, Trips, Profile.
- Not checked: Android and web visuals. Reported as not checked in the final report. Light mode only.

## AGENTS.md updates
- Styling section: tokens in `src/global.css` `@theme` are the single source. Font: Spline Sans. Icons: lucide-react-native via `src/components/ui/icon.tsx`. Light mode only (`userInterfaceStyle: light`). New UI uses `className`. Replace the line "New styling via `className` only after the design-token plan is written" with this.
- Remove the "`src/constants/theme.ts`" reference from the template notes, because the file is deleted.
- Components: primitives and composed cards in `src/components/ui/`. The design-system showcase is at `src/app/design-system.tsx`.
- Tab names: Home, Search, Trips, Profile.

## Result
Not started. Awaiting approval.

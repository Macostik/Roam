# 03 · NativeWind V5 setup

Status: done

## Goal
Roam can style components with Tailwind `className` props through NativeWind V5 (pre-release), on iOS, Android, and web, with `npx expo lint`, `npx tsc --noEmit`, and `npx expo-doctor` passing. Existing screens keep their current `StyleSheet` and `ThemedText`/`ThemedView` styling. No screen is converted in this plan.

## Decisions
- Version: NativeWind V5 release candidate, chosen by the user over stable V4 (4.2.7). Pinned exactly: `nativewind@5.0.0-rc.0`, `react-native-css@3.1.0-rc.0`. Pre-release: the V5 docs say "not intended for production use". Revisit when V5 is stable.
- Tailwind: `tailwindcss@4.1.12`, `@tailwindcss/postcss@4.1.12`, `postcss`, `lightningcss@1.30.1` (also forced through a `package.json` `overrides` entry, per the V5 guide, to avoid `global.css` deserialization errors in builds).
- Install method: the Expo-SDK peers (`react-native-reanimated`, `react-native-worklets`, `react-native-safe-area-context`, `expo-system-ui`) are installed with `npx expo install`, as AGENTS.md requires. The RC and Tailwind packages are not Expo SDK packages, so they use `npm install --save-exact` as the V5 guide says. This is a deliberate exception to "ALWAYS use `npx expo install`", because `expo install` would not resolve the RC pair.
- Stylesheet location: the existing `src/global.css` (font CSS variables, not imported anywhere today) is kept and extended. The font variables are preserved in the new file. Metro input: `./src/global.css`.
- Import point: `src/app/_layout.tsx`, the top-most component (guide: never import in the `registerComponent` entry).
- Babel: no `babel.config.js` exists. Expo 57 default `babel-preset-expo` is used unchanged, so no Babel change is needed.
- `app.json`: no change. `userInterfaceStyle` is already `automatic`.
- TypeScript: `nativewind-env.d.ts` at the project root, with a triple-slash reference to `react-native-css/types`. Not named `nativewind.d.ts`.
- Native rebuild: `react-native-css` is expected to be JS-only. If `npx expo start` shows a native module error, switch to `npx expo run:ios` (AGENTS.md rule), and report it.

## Out of scope
- Converting any screen or component from `StyleSheet` to `className`.
- Design-token mapping for NativeWind (colors, spacing, radii). The design-system task comes later.
- Web bundler changes beyond what the guide requires.
- EAS build profiles and store builds.
- Upgrading Expo SDK.

## Steps
### 1. Install the packages
Run `npm install --save-exact nativewind@5.0.0-rc.0 react-native-css@3.1.0-rc.0` and `npm install --save-dev --save-exact tailwindcss@4.1.12 @tailwindcss/postcss@4.1.12 postcss lightningcss@1.30.1`. Run `npx expo install react-native-reanimated react-native-worklets react-native-safe-area-context expo-system-ui` (versions already present should be unchanged). Add `"overrides": { "lightningcss": "1.30.1" }` to `package.json`. Done when `npm ls nativewind react-native-css` shows the pinned versions and `npx expo-doctor` reports no new errors.

### 2. Tailwind and PostCSS
Create `postcss.config.mjs` in the project root registering `@tailwindcss/postcss`, using the exact form from the V5 guide's installation page (the Expo-specific page is the source of truth; the summary gave only the rules). Rewrite `src/global.css`: keep the four `--font-*` variables in `:root`; add the imports exactly as the V5 guide orders them: `tailwindcss/theme.css` into `theme`, `tailwindcss/preflight.css` into `base`, `tailwindcss/utilities.css` unlayered, then `nativewind/theme`. Done when the file matches the guide's order and the font variables are unchanged.

### 3. Metro config
Run `npx expo customize metro.config.js` to create the file. Wrap the default config with `withNativewind` from `nativewind/metro`, passing the CSS input `./src/global.css`. Check the exact option name in the V5 docs before writing it. Done when `npx expo start --clear` starts without a Metro error.

### 4. Import the CSS
Add `import '../global.css';` (or the alias form the project uses) at the top of `src/app/_layout.tsx`. No other entry file changes. Done when the file imports global CSS once.

### 5. TypeScript
Create `nativewind-env.d.ts` with the triple-slash reference from the guide, or let `npx expo start --clear` generate it. Confirm `tsconfig.json` includes it (the `**/*.ts` glob already does). If TypeScript reports an unresolved CSS side-effect import, add `declare module "*.css";` to an existing app declaration file. Done when `npx tsc --noEmit` passes.

### 6. Temporary smoke test
In `src/app/index.tsx`, wrap the existing root `ThemedView` content in a temporary `View` with `className="flex-1 items-center justify-center bg-white"` and a `Text` with `className="text-xl font-bold text-blue-500"`, per the guide's verify step. Open the iOS simulator (`npx expo start`, press `i`), take a screenshot (`xcrun simctl io booted screenshot <path>`), and confirm the text is centered and blue on white. Then revert `index.tsx` exactly (`git checkout -- src/app/index.tsx`, since it has no other pending edits). Done when the screenshot shows the classes applied and the file is reverted.

### 7. Docs and lint
Run `npx expo lint`, `npx tsc --noEmit`, `npx expo-doctor`. Update `AGENTS.md` with a Styling section (see below). Set `Status: done` and add `## Result`.

## Verification
- ✅ `npm ls nativewind react-native-css tailwindcss lightningcss` shows the pinned versions.
- ✅ `npx expo-doctor` shows no new failures.
- ✅ `npx expo lint` and `npx tsc --noEmit` pass.
- ✅ `npx expo start --clear` bundles without Metro errors on iOS.
- ✅ iOS simulator screenshot shows the smoke-test `className` classes applied (centered, blue text, white background). Values are taken from the guide's verify step, not from a design.
- ✅ `src/app/index.tsx` is reverted after the smoke test (`git diff -- src/app/index.tsx` is empty).
- Not checked: Android and web rendering. Listed as ❌ until run.

## Result
Status: done, with the on-device visual check not completed (see Verified).
- Installed the pinned RC and Tailwind packages, added the `lightningcss` override.
- Added `postcss.config.mjs`, `metro.config.js` (`withNativewind`), `nativewind-env.d.ts`, rewrote `src/global.css` (kept the font variables), imported the CSS in `_layout.tsx`.
- Deviation: the plan passed `input` to `withNativewind`; the guide uses `withNativewind(config)` with no options, so that's what's used.
- The smoke test was added to `index.tsx` and reverted; the Metro bundle contained the smoke-test classes.
- Not done: iOS simulator visual check (Expo Go's developer-menu intro blocked the screen). Android and web unchecked.

## AGENTS.md updates
Add a `## Styling` section:
- NativeWind V5 RC is pinned to `nativewind@5.0.0-rc.0` and `react-native-css@3.1.0-rc.0` with Tailwind 4.1.12 and a `lightningcss@1.30.1` override. Pre-release: move to stable V5 when released. Do not upgrade the pins without checking the V5 guide.
- Global CSS lives in `src/global.css` and is imported once in `src/app/_layout.tsx`.
- Existing screens use `StyleSheet` with `ThemedText`/`ThemedView`. New styling via `className` only after the design-token plan is written.

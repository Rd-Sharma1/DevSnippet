# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v55.0.0/ before writing any code.

## Project focus
- This is an Expo SDK 55 app using `expo-router` with file-based routing.
- The main source tree is under `src/`; edits should focus on `src/app`, `src/components`, `src/hooks`, and `src/constants`.
- `src/app` contains route files and layout components, including the root `src/app/_layout.tsx` and tab layout `src/app/(tabs)/_layout.tsx`.

## Important conventions
- TypeScript path aliases are defined in `tsconfig.json`: `@/*` → `./src/*`, `@/assets/*` → `./assets/*`.
- The app uses cross-platform React Native code with platform-specific overrides where needed (`.web.tsx`, `.module.css`).
- Navigation is handled by Expo Router and `NativeTabs`; follow the existing file-based route structure when adding screens.
- Keep styling and shared UI in `src/components`; custom hooks live in `src/hooks`.

## Useful commands
- `npm install`
- `npm start`
- `npm run android`
- `npm run ios`
- `npm run web`
- `npm run reset-project`
- `npm run lint`

## Agent guidance
- Prefer source changes under `src/`; do not treat the generated Expo template text in `README.md` as project-specific guidance.
- Preserve Expo Router conventions and ensure new routes and screens work with file-based routing.
- Use the project alias imports when referencing source files or assets.

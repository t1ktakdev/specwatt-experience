# SpecWATT Experience V3 — isolated native UI kit

Actual React Native source adapted for the existing application's React 19.3 / React Native 0.88 / Expo 58 stack. This is **not an Android app or APK**, and has not been integrated into the original repository.

## Implemented source

- `NativeWelcome`, `NativeHome`, `NativeLighting`, `NativeEnergy`, `NativeProtected` in `screens.tsx`.
- `ScreenShell` with SafeAreaView and real StatusBar, scrollable content, keyboard tap handling.
- `NativeDeviceTile`, `NativePower`, `NativeButton`, SVG icons and controlled connection states.
- Native Switch, 48 dp touch containers, Pressable feedback, text scaling enabled, wrapping card rows. No fixed screen height or CSS conversion.
- `useNativeDemo`: shared `requestSwitch` / nominal values / protected CH3 / load rejection. Local in-memory demonstration only.
- Generated `tokens.ts` derives from the same `../design-tokens.json` as the web CSS.

## Host integration contract

The host Expo app must provide `SafeAreaProvider`, register bundled Manrope with `expo-font` before rendering, and pass local image sources (for example `require('./assets/welcome-architecture.webp')` and `require('./assets/lighting-bedroom.webp')`) via `SceneAssets`. The images are the same files in `../public/assets/`.

Mount these components in **isolated Expo Router routes** and supply `onNavigate` from the real router. The kit intentionally does not replace the original app's routing, transport, consent or persistence systems. Keep hardware transport separate from the local demo hook. Never infer controller acknowledgements from hook state.

The host owns font loading, back behavior, native route focus, app lifecycle, keyboard avoidance for future forms, permissions and transport. These screens require no camera, location or Bluetooth permission. Scene presets affect only the picture. Native planner, journal, setup, settings and full device detail remain future adaptations; those working interactions currently live in the web app.

## Validation

```sh
npm ci --prefix native --ignore-scripts
npm run typecheck --prefix native
```

TypeScript checks these sources against the installed real React Native 0.88, SVG and safe-area definitions, not mock declarations. This does **not** prove Android rendering, screen-reader behavior, performance, fontScale 1.0 / 1.3 / 1.5 or visual parity on a device. Those require an isolated Expo host, Metro export and emulator/device checks. No APK build or device test is claimed.

The first local install encountered a certificate-chain error. Enabling Node's system CA store (`NODE_OPTIONS=--use-system-ca`) completed installation without disabling certificate validation.

API references consulted: [Expo 58 safe areas](https://docs.expo.dev/versions/v58.0.0/sdk/safe-area-context/), [React Native Pressable](https://reactnative.dev/docs/pressable), [React Native Text](https://reactnative.dev/docs/text).

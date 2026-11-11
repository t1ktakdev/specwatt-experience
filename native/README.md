# Android preview V4.1

Самостоятельные нативные экраны React Native/Expo, не WebView. Отдельное имя и пакет `dev.specwatt.experience.v41.preview` сохраняют установленные приложения. Системный шрифт не блокируется: проверяются масштабы 1.0, 1.3, 1.5. Фото и Manrope включены в пакет. Состояние этой нативной демонстрации хранится в памяти до перезапуска, без ESP32-команд и фоновых расписаний.

Проверенная сборка: Expo 58.0.19, React Native 0.88.0, JDK 17, Android SDK 37, NDK 27.1.12297006, x86_64. На Windows нужен короткий **физический** путь (например `D:\e41`); junction не сокращает пути CMake после canonicalization. Копировать только эту изолированную Experience-ветку.

В `native/host`: `npm ci --ignore-scripts`, `npx expo prebuild --platform android --no-install`. Затем из `native/host/android`:

```powershell
.\gradlew.bat :app:assembleDebug --no-daemon --max-workers=1 '-Dorg.gradle.jvmargs=-Xmx1024m -XX:MaxMetaspaceSize=384m' '-Pkotlin.compiler.execution.strategy=in-process' '-PreactNativeArchitectures=x86_64' '-Pspecwatt.embeddedPreview=true' -I ../../../tools/android-low-memory.gradle
```

`specwatt.embeddedPreview` включает JS и ресурсы в debug APK и отключает ожидание Metro через локальный config plugin; сервер разработки не нужен. При обычном запуске без этого флага режим разработки сохраняется. Ограничение числа сборочных процессов помогает на ноутбуке с 16 ГБ памяти. Готовый APK расположен в `app/build/outputs/apk/debug/app-debug.apk`. Это APK для x86_64-эмулятора; ARM-телефон и iOS не проверялись.

После установки: `adb shell am start -a android.intent.action.VIEW -d specwatt-experience-v41://home`. Ссылки меняют только маршрут, команды в них не принимаются. `python tools/android-screenshots-v41.py` из корня сохраняет 42 снимка (12 маршрутов + два дополнительных шага × три масштаба), XML доступности и восстанавливает прежний масштаб шрифта. [Реальные кадры](../docs/v41/review.html).

Ниже сохранена документация исходного V4.

# Experience V4 · isolated native UI and Expo host

All twelve routes and three setup steps are implemented using React Native primitives, shared tokens/assets and the same guarded switch/planner model as the web app. `Experience.tsx` assembles the screens with four tabs, back navigation, notices, system reduced-motion handling and route transitions. `host/` supplies Expo 58.0.19, React Native 0.88.0, Manrope loading and the original interior assets.

Implemented: Welcome, Home, Lighting, Energy, Devices, Device Detail, Protected CH3, Autopilot, Planner, Journal, Setup (three steps), Settings. Native controls have labelled touch areas, text scaling and scrollable content. The planner uses a real native modal/editor and the shared overlap validator; it never exposes CH3 as an option. Journal entries follow actual local actions. Connection choices are explicit UI previews.

```sh
npm ci --prefix native --ignore-scripts
npm run typecheck --prefix native
npm ci --prefix native/host --ignore-scripts
npm run typecheck --prefix native/host
npm run export:android --prefix native/host
npm start --prefix native/host
```

The Android export writes a Hermes bundle, two original images and Manrope to `artifacts/native-android/`. It has been produced with the actual Expo/Metro toolchain. Local validation reused an installed compatible dependency tree; the host has its own reproducible lockfile and CI installs it independently.

The first clean CI export exposed a nested `pretty-format` → `react-is` resolution failure hidden by the reused tree. Metro now allows hierarchical lookup inside host dependencies while keeping shared source and React/RN singletons on the host tree. This follows [Metro's resolution context](https://metrobundler.dev/docs/resolution/); no extra application dependency was added to mask the failure.

This is an isolated preview host, not integration into the original SpecWATT application. State persists in memory during the session; native disk persistence, transport, controller acknowledgements and timed execution are absent. Web persistence remains localStorage. There is no APK, physical-device render, native screen-reader or fontScale 1.0/1.3/1.5 verification. No Android visual-parity claim is made.

Official references: [Expo 58](https://docs.expo.dev/versions/v58.0.0/), [safe areas](https://docs.expo.dev/versions/v58.0.0/sdk/safe-area-context/), [React Native AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo), [Animated](https://reactnative.dev/docs/animated), [TextInput](https://reactnative.dev/docs/textinput).

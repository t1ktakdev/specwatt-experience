// Android 15 can restore light-bar flags after Expo's initial theme/module update.
// Reapply the appearance after activity focus; keep edge-to-edge and real insets.
function patchMainActivity(contents) {
  const marker = "private fun applySpecwattSystemBars()";
  if (contents.includes(marker)) return contents;
  const anchor = "class MainActivity : ReactActivity() {";
  if (!contents.includes(anchor))
    throw new Error("Expected Expo Kotlin MainActivity");
  return contents.replace(
    anchor,
    `${anchor}
  private fun applySpecwattSystemBars() {
    androidx.core.view.WindowCompat.getInsetsController(window, window.decorView).apply {
      isAppearanceLightNavigationBars = false
      isAppearanceLightStatusBars = false
    }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      // The OS contrast scrim avoids the API 35 emulator's transparent-bar tint bug.
      window.isNavigationBarContrastEnforced = true
    }
  }

  override fun onResume() {
    super.onResume()
    window.decorView.post { applySpecwattSystemBars() }
  }

  override fun onWindowFocusChanged(hasFocus: Boolean) {
    super.onWindowFocusChanged(hasFocus)
    if (hasFocus) window.decorView.post { applySpecwattSystemBars() }
  }
`,
  );
}

function patchSplashTheme(styles) {
  const theme = styles.resources.style.find(
    (s) => s.$.name === "Theme.App.SplashScreen",
  );
  if (!theme) throw new Error("Expected Expo launch theme");
  const values = {
    "android:windowBackground": "@color/activityBackground",
    "android:windowSplashScreenBackground": "@color/activityBackground",
    "android:windowSplashScreenAnimatedIcon": "@android:color/transparent",
    "android:windowLightNavigationBar": "false",
    "android:windowLightStatusBar": "false",
  };
  for (const [name, value] of Object.entries(values)) {
    theme.item = theme.item.filter((i) => i.$.name !== name);
    theme.item.push({ $: { name }, _: value });
  }
  return styles;
}

module.exports = function withDarkSystemBars(config) {
  const {
    withMainActivity,
    withAndroidStyles,
  } = require("expo/config-plugins");
  config = withAndroidStyles(config, (mod) => {
    mod.modResults = patchSplashTheme(mod.modResults);
    return mod;
  });
  return withMainActivity(config, (mod) => {
    if (mod.modResults.language !== "kt")
      throw new Error("Expected Kotlin activity");
    mod.modResults.contents = patchMainActivity(mod.modResults.contents);
    return mod;
  });
};
module.exports.patchMainActivity = patchMainActivity;
module.exports.patchSplashTheme = patchSplashTheme;

const {
  withAppBuildGradle,
  withMainApplication,
} = require("expo/config-plugins");

// Embedded preview builds must never wait for, or load code from, Metro.
module.exports = function withEmbeddedPreview(config) {
  config = withAppBuildGradle(config, (mod) => {
    if (
      !mod.modResults.contents.includes(
        'buildConfigField "boolean", "SPECWATT_EMBEDDED_PREVIEW"',
      )
    ) {
      const anchor = "defaultConfig {";
      if (!mod.modResults.contents.includes(anchor)) {
        throw new Error(
          "SpecWATT preview: Android defaultConfig was not found",
        );
      }
      mod.modResults.contents = mod.modResults.contents.replace(
        anchor,
        `${anchor}\n        buildConfigField "boolean", "SPECWATT_EMBEDDED_PREVIEW", (findProperty('specwatt.embeddedPreview') ?: 'false')`,
      );
    }
    return mod;
  });
  return withMainApplication(config, (mod) => {
    if (
      !mod.modResults.contents.includes(
        "useDevSupport = BuildConfig.DEBUG && !BuildConfig.SPECWATT_EMBEDDED_PREVIEW",
      )
    ) {
      const anchor = "context = applicationContext,";
      if (
        mod.modResults.language !== "kt" ||
        !mod.modResults.contents.includes(anchor)
      ) {
        throw new Error(
          "SpecWATT preview: expected Expo Kotlin ReactHost template",
        );
      }
      mod.modResults.contents = mod.modResults.contents.replace(
        anchor,
        `${anchor}\n      useDevSupport = BuildConfig.DEBUG && !BuildConfig.SPECWATT_EMBEDDED_PREVIEW,`,
      );
    }
    return mod;
  });
};

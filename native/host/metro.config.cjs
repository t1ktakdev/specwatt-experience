const path = require("path");
const fs = require("fs");
const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
const modules = fs.realpathSync(path.join(__dirname, "node_modules"));
config.watchFolders = [path.resolve(__dirname, "../.."), modules];
config.resolver.nodeModulesPaths = [modules];
config.resolver.disableHierarchicalLookup = true;
config.resolver.resolveRequest = (context, name, platform) => {
  const relative = path.relative(modules, context.originModulePath);
  const insideDependencies =
    relative !== ".." &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative);
  const singleton = /^(react|react-native)(\/|$)/.test(name);
  // Allow packages' nested dependencies, while shared source uses the host's
  // React/RN pair rather than either sibling package's node_modules.
  return context.resolveRequest(
    {
      ...context,
      disableHierarchicalLookup: singleton || !insideDependencies,
    },
    name,
    platform,
  );
};
config.resolver.extraNodeModules = {
  react: path.join(__dirname, "node_modules/react"),
  "react-native": path.join(__dirname, "node_modules/react-native"),
};
module.exports = config;

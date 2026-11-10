const path = require("path");
const fs = require("fs");
const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
const modules = fs.realpathSync(path.join(__dirname, "node_modules"));
config.watchFolders = [path.resolve(__dirname, "../.."), modules];
config.resolver.nodeModulesPaths = [modules];
config.resolver.disableHierarchicalLookup = true;
config.resolver.extraNodeModules = {
  react: path.join(__dirname, "node_modules/react"),
  "react-native": path.join(__dirname, "node_modules/react-native"),
};
module.exports = config;

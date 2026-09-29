const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const lookdevRoot = path.resolve(projectRoot, '../../docs/reference/ui/lookdev');

const config = getDefaultConfig(projectRoot);

// Lookdev art lives outside apps/mobile. Metro only indexes it when this
// folder is a watch root. Expo's on-demand filesystem (app.json) must be
// off, or those parent-directory files are never crawled.
config.watchFolders = [lookdevRoot];
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer/expo');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];
// The lookdev junction realpaths into docs/, so SVG components resolve
// bare imports from that folder. Keep them on the app's node_modules.
config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  'react-native-svg': path.resolve(projectRoot, 'node_modules/react-native-svg'),
};

module.exports = config;

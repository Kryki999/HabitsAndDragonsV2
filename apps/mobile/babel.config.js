module.exports = function (api) {
  api.cache(true);
  return {
    // Preset auto-adds worklets/reanimated; disable so the plugin is listed once and last.
    presets: [['babel-preset-expo', { reanimated: false, worklets: false }]],
    plugins: ['react-native-reanimated/plugin'],
  };
};

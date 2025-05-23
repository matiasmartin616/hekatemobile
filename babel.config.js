module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@shared': './app/modules/shared',
            '@assets': './assets',
            '@modules': './app/modules',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};

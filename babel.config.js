module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current', // For Jest
          browsers: 'defaults', // For Webpack
        },
      },
    ],
  ],
};

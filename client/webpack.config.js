const webpack = require('webpack');

module.exports = {
  // Your existing config
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      os: require.resolve('os-browserify/browser'),
      fs: false, // Can't polyfill fs for frontend
      path: require.resolve('path-browserify'),
      util: require.resolve('util/'),
      events: require.resolve('events/'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};

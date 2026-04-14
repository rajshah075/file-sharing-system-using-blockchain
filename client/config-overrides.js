const webpack = require("webpack");

module.exports = function override(config) {
  config.node = {
    ...config.node,
    fs: "empty",
    net: "empty",
    tls: "empty",
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ]);

  return config;
};

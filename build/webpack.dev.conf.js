const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtensionReloader = require('webpack-extension-reloader');

const baseWebpackConfig = require('./webpack.base.conf');

const devWebpackConfig = merge(baseWebpackConfig, {
  watch: true,
  module: {
    rules: [
      { // enable eslint + fix
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          emitWarning: true, // set false if you want eslint errors shown in browser overlay
          fix: true, // autofix eslint errors that are autofixable
        },
      }
    ],
  },
  devtool: 'inline-source-map',
  plugins: [
    new ExtensionReloader({
      reloadPage: true,
      entries: {
        background: 'background',
        contentScript: ['injector'],
        extensionPage: ['popup', 'options', 'devtools', 'devtools-panel']
      }
    }),
    // new webpack.NoEmitOnErrorsPlugin(),
    // new FriendlyErrorsPlugin(),
  ],
});

module.exports = devWebpackConfig;


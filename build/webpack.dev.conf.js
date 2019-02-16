'use strict'
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.conf');

const devWebpackConfig = merge(baseWebpackConfig, {
  // cheap-module-eval-source-map быстрее для разработки
  watch: true,
  module: {
    // eslint webpack config
    rules: [{
      enforce: 'pre',
      test: /\.(js|vue)$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,
      options: {
        emitWarning: true, // set false if you want eslint errors shown in browser overlay
        fix: true, // autofix eslint errors that are autofixable
      },
    }],
  },
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin(),
  ],
});

module.exports = devWebpackConfig;


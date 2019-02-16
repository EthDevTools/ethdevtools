'use strict'
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const BUILD_PATH = path.resolve(__dirname, '../dist');

const prodWebpackConfig = merge(baseWebpackConfig, {
  devtool: '#cheap-module-eval-source-map',
  optimization: {
    minimizer: [
      // uglify is default and built-in, but currently having issues
      new TerserPlugin({
        sourceMap: true, // for sentry error handling
      }),
      new OptimizeCssAssetsPlugin({}),
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
  },
  plugins: [
    new CleanWebpackPlugin(BUILD_PATH, {
      allowExternal: true,
      verbose: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'static/style.css',
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
  ],
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  },
})

module.exports = prodWebpackConfig;

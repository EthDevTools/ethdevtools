const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const { VueLoaderPlugin } = require('vue-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GenerateJsonFromJsPlugin = require('generate-json-from-js-webpack-plugin');

const { publicEnv } = require('../config/env');

const isDevelopment = process.env.NODE_ENV === 'development';

function resolveSrc(more = '') {
  return path.join(__dirname, '..', 'src', more);
}

module.exports = {
  mode: 'development',
  context: resolveSrc(),
  entry: {
    background: resolveSrc('background'),
    popup: resolveSrc('popup'),
    options: resolveSrc('options'),

    // inject into page
    injector: resolveSrc('injector'),
    injected: resolveSrc('injected'),

    // devtools
    devtools: resolveSrc('devtools'),
    'devtools-panel': resolveSrc('devtools-panel'),
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    publicPath: '/',
    filename: 'js/[name].js',
    // chunkFilename: 'js/[id].[name].js?[hash]',
    // library: '[name]'
    // path: path.resolve(__dirname, '../dist'),
    // filename: '[name].js',
    // publicPath: '/',
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.vue', '.json', '.mjs'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolveSrc(),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // isDevelopment ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'vue-style-loader',
          { loader: 'css-loader', options: { sourceMap: isDevelopment } },
          { loader: 'postcss-loader' },
        ],
      },
      {
        test: /\.less$/,
        use: [
          // isDevelopment ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'vue-style-loader',
          { loader: 'css-loader',
            options: {
              /* uncomment for css-modules */
              // modules: true,
              // localIdentName: '[local]__[hash:base64:5]',
              sourceMap: isDevelopment,
            },
          },
          { loader: 'postcss-loader' },
          { loader: 'less-loader',
            options: { sourceMap: isDevelopment },
          },
          // "sass-resources-loader" name is deceiving - also works for less
          // makes files automatically included so we dont have to copy/paste in each component
          { loader: 'sass-resources-loader',
            options: {
              resources: [
                resolveSrc('/style/_variables.less'),
                resolveSrc('/style/_colors.less'),
                resolveSrc('/style/_mixins.less'),
              ],
            }
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: resolveSrc(),
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 3000,
          name: path.join('static', 'img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(ico)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: path.join('static', 'img/[name].[ext]'),
        },
      },
      {
        test: /\.svg(\?.*)?$/,
        loader: 'svg-inline-loader',
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.join('static', 'media/[name].[hash:7].[ext]'),
        },
      },
    ],
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({'process.env': publicEnv}),

    // generate an html page for each entrypoint that is not just a script
    ..._.map({
      'devtools-panel': ['devtools-panel'],
      'devtools': ['devtools'],
      'popup': ['popup'],
      'options': ['options'],
      'newtab': ['newtab'],
    }, (chunks, filename) => new HtmlWebpackPlugin({
      inject: false,
      template: HtmlWebpackTemplate,
      appMountId: 'app',

      title: filename,
      cache: true,
      filename: `./${filename}.html`,
      chunks
    })),

    // create manifest.json from a js file
    // so we can add comments, not worry about quotes/commas, generate dynamically
    new GenerateJsonFromJsPlugin({
      path: resolveSrc('manifest.js'),
      filename: 'manifest.json',
    }),

    new CopyWebpackPlugin([
      // copy all static files - used for icons/images/etc
      { from: path.join(__dirname, '..', 'static') },
    ]),
  ],
};

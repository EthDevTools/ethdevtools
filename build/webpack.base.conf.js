'use strict'
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const ChromeReloadPlugin  = require('wcer');

const isDevelopment = process.env.NODE_ENV === 'development';

const htmlPage = (title, filename, chunks, template) => new HtmlWebpackPlugin({
  title,
  hash: true,
  cache: true,
  inject: 'body',
  filename: './pages/' + filename + '.html',
  // template: template || path.resolve(__dirname, './page.ejs'),
  appMountId: 'app',
  chunks
});

let resolve = dir => path.join(__dirname, '..', 'src', dir)
module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  context: path.resolve(__dirname, '../'),
  entry: {
    popup: resolve('./popup'),
    background: resolve('./background'),
    // devtools
    devtoolsbg: resolve('./devtools-background'),
    devtools: resolve('./devtools'),
    // inject: resolve('./inject'),
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    publicPath: '/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].[name].js?[hash]',
    library: '[name]'
    // path: path.resolve(__dirname, '../dist'),
    // filename: '[name].js',
    // publicPath: '/',
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.vue', '.json', '.mjs'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src'),
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
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.flow/,
        include: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
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
                path.resolve(__dirname, '../src/style/_variables.less'),
                path.resolve(__dirname, '../src/style/_colors.less'),
                path.resolve(__dirname, '../src/style/_mixins.less'),
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
        include: path.resolve(__dirname, '../src'),
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
    // new webpack.DefinePlugin({'process.env': publicEnv}),
    htmlPage('home', 'app', ['tab']),
    htmlPage('popup', 'popup', ['popup']),
    htmlPage('devtools', 'devtools', ['devtools']),
    htmlPage('devtoolsbg', 'devtoolsbg', ['devtoolsbg']),
    htmlPage('options', 'options', ['options']),
    htmlPage('background', 'background', ['background']),
    new CopyWebpackPlugin([
      { from: path.join(__dirname, '..', 'static') },
      {
        from: path.join(__dirname, '..', 'src', 'manifest.json' ),
      },
      // getting webpack errors if inject is a proper entry point
      {
        from: path.join(__dirname, '..', 'src', 'inject.js' ),
        to: 'js',
      },
    ]),
  ],
};

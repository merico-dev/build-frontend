// DEVELOPMENT ONLY WEBPACK CONFIG
const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = (env = {}) => {
  const optionalPlugins = []

  // Only appends bundle analyzer when forced via env
  if (env.ANALYZE_BUILD === 1) {
    optionalPlugins.push(new BundleAnalyzerPlugin())
  }

  return {
    entry: path.resolve(__dirname, './src/index.js'),
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            plugins: [
              require.resolve('react-refresh/babel'),
            ],
          }
        },
        {
          test: /\.js$/,
          use: ['babel-loader'],
          exclude: [/node_modules/, /packages/, /cypress/, /config/],
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.html$/,
          use: ['html-loader']
        },
        {
          test: /\.(?:png|jpe?g|gif|ttf|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            limit: 10 * 1024,
          },
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack', 'url-loader'],
        },
        {
          test: /\.po$/,
          use: ['@lingui/loader']
        }
      ]
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/'),
        '@config': path.resolve(__dirname, './config/'),
      },
      extensions: ['*', '.js', '.jsx']
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'bundle.js',
      publicPath: '/'
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.html'),
        filename: 'index.html',
        favicon: path.resolve(__dirname, './src/favicon.png'),
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.ejs'),
        filename: 'index.ejs',
        favicon: path.resolve(__dirname, './src/favicon.png'),
      }),
      new webpack.EnvironmentPlugin({ ...process.env }),
      new CopyPlugin({
        patterns: [
          { from: 'src/images/logo-beta.svg', to: 'logo-beta.svg' },
        ],
      }),
      new ESLintPlugin({
        context: path.resolve(__dirname, './'),
        exclude: ['dist', 'packages', 'cypress', 'config', 'node_modules']
      }),
      ...optionalPlugins
    ],
    devServer: {
      hot: true,
      port: 3000,
      host: '0.0.0.0',
      historyApiFallback: true
    },
    devtool: 'source-map'
  }
}

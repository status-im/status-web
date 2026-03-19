/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const webpack = require('webpack')

module.exports = () => {
  const environment = process.env.ENV ?? 'development'

  if (!['development', 'preview', 'production'].includes(environment)) {
    throw new Error('Unsupported environment')
  }

  return {
    entry: './src/main.tsx',
    output: {
      filename: 'index.[fullhash].js',
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
      clean: true,
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      fallback: {
        buffer: require.resolve('buffer/'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        process: require.resolve('process/browser.js'),
        zlib: false,
        fs: false,
        path: false,
      },
    },
    externals: {
      'protobufjs-cli': 'commonjs protobufjs-cli',
    },
    module: {
      rules: [
        {
          test: /\.m?[jt]sx?$/,
          resolve: {
            fullySpecified: false,
          },
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: false,
              presets: [
                '@babel/preset-typescript',
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'entry',
                    targets: { browsers: 'chrome 77' },
                    corejs: { version: '3.26' },
                  },
                ],
                '@babel/preset-react',
              ],
              plugins: ['babel-plugin-styled-components'],
            },
          },
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'source-map-loader',
        },
        {
          test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf|ico)$/,
          use: ['file-loader'],
        },
      ],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: 'index.html',
      }),
      new webpack.DefinePlugin({
        'process.env.ENV': JSON.stringify(environment),
        'process.env.VOTING_CONTRACT': JSON.stringify(process.env.VOTING_CONTRACT),
        'process.env.DIRECTORY_CONTRACT': JSON.stringify(process.env.DIRECTORY_CONTRACT),
        'process.env.MULTICALL_CONTRACT': JSON.stringify(process.env.MULTICALL_CONTRACT),
        'process.env.TOKEN_CONTRACT': JSON.stringify(process.env.TOKEN_CONTRACT),
        'process.env.FEATURED_VOTING_CONTRACT': JSON.stringify(process.env.FEATURED_VOTING_CONTRACT),
        'process.env.INFURA_API_KEY': JSON.stringify(process.env.INFURA_API_KEY),
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser.js',
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
    devServer: {
      historyApiFallback: true,
      host: '0.0.0.0',
      hot: true,
      server: 'https',
      client: {
        overlay: true,
      },
    },
    snapshot: {
      managedPaths: [path.resolve(__dirname, 'node_modules')],
      immutablePaths: [],
    },
    stats: 'minimal',
  }
}

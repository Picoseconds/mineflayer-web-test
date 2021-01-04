const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const config = {
  devtool: 'inline-source-map',
  mode: 'development',
  // mode: 'production',
  entry: path.resolve(__dirname, './index.js'),
  output: {
    path: path.resolve(__dirname, './public'),
    filename: './index.js'
  },
  resolve: {
    alias: {
      "minecraft-protocol": path.resolve(
        __dirname,
        "node_modules/minecraft-protocol/src/index.js"
      ), // Hack to allow creating the client in a browser
      "express": false,
      "net": "net-browserify",
      "fs": "memfs"
    },
    fallback: {
      zlib: require.resolve('browserify-zlib'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      events: require.resolve('events/'),
      assert: require.resolve('assert/'),
      crypto: require.resolve("crypto-browserify"),
      path: require.resolve("path-browserify"),
      constants: require.resolve("constants-browserify"),
      os: require.resolve("os-browserify/browser"),
      http: require.resolve("http-browserify"),
      https: require.resolve("https-browserify"),
      timers: require.resolve("timers-browserify"),
      // fs: require.resolve("fs-memory/singleton"),
      child_process: false,
      perf_hooks: path.resolve(__dirname, "perf_hooks_replacement.js"),
      dns: path.resolve(__dirname, "dns.js")
  }
  },
  plugins: [
    // fix "process is not defined" error:
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.NormalModuleReplacementPlugin(
      /prismarine-viewer[/|\\]viewer[/|\\]lib[/|\\]utils/,
      './utils.web.js'
    ),
    new CopyPlugin({
      patterns: [
        { from: './node_modules/prismarine-viewer/public/blocksStates/', to: './blocksStates/' },
        { from: './node_modules/prismarine-viewer/public/textures/', to: './textures/' },
        { from: './node_modules/prismarine-viewer/public/worker.js', to: './' },
        { from: './node_modules/prismarine-viewer/public/supportedVersions.json', to: './' }
      ]
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new LodashModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './public'),
    compress: true,
    inline: true,
    // open: true,
    hot: true,
    watchOptions: {
      ignored: /node_modules/
    }
  },
  module: {
    rules: [
            {
        test: /\.html$/i,
        use: ['file-loader'],
      },
    ],
  },
}

module.exports = config

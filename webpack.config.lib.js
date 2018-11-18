/* eslint-disable no-undefined */
const { join } = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const { argv } = require('yargs').options({
  production: {
    alias: 'p',
    'default': false,
    type: 'boolean'
  }
});

const projectPath = __dirname;
const sourcePath = join(projectPath, 'src');
const buildPath = join(projectPath, 'dist');

module.exports = {
  mode: argv.production ? 'production' : 'development',
  entry: join(projectPath, 'index.js'),
  devtool: '(none)',
  output: {
    path: buildPath,
    libraryTarget: 'umd',
    filename: `index.js`,
    pathinfo: false
  },
  resolve: {
    extensions: ['.js'],
    modules: [sourcePath, 'node_modules']
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015'],
        plugins: ['transform-object-rest-spread']
      }
    }]
  },
  plugins: [
    new CleanWebpackPlugin([join('dist', '*')], {
      root: projectPath,
      verbose: false,
      dry: false
    }),
    argv.production ? new UglifyJsPlugin({
      sourceMap: false
    }) : undefined
  ].filter((plugin) => plugin !== undefined),
  stats: {
    assetsSort: 'size',
    children: false,
    entrypoints: false,
    hash: false,
    version: false
  }
};

const path = require('path');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  entry: path.resolve('./src/index.js'),
  output: {
    path: path.resolve('./public'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react']
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'REST_SERVER_LOCAL_HOST': JSON.stringify(process.env.REST_SERVER_LOCAL_HOST),
        'REST_SERVER_AWS_HOST': JSON.stringify(process.env.REST_SERVER_AWS_HOST)
      }
    })
  ]
};
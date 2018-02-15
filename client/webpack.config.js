require('dotenv').config();
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

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
      },
      {
        test: /\.(scss|css)$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: 65,
              },
              svggo: {},
              webp: {
                quality: 65
              }
            }
          },
        ],
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
        'REST_SERVER_AWS_HOST': JSON.stringify(process.env.REST_SERVER_AWS_HOST),
        'SOCKET_SERVER_LOCAL_HOST': JSON.stringify(process.env.SOCKET_SERVER_LOCAL_HOST),
        'SOCKET_SERVER_AWS_HOST': JSON.stringify(process.env.SOCKET_SERVER_AWS_HOST),
        'SMTP_SERVER_LOCAL_HOST': JSON.stringify(process.env.SMTP_SERVER_LOCAL_HOST),
        'SMTP_SERVER_AWS_HOST': JSON.stringify(process.env.SMTP_SERVER_AWS_HOST)
      }
    })
  ]
};

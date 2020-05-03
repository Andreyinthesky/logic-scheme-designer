const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  devtool: `source-map`,
  devServer: {
    port: 8020
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.svg$/,
        loader: "file-loader",
        options: {
          name: "[name].[contenthash].[ext]",
          outputPath: "assets/images/svg"
        },
      },
      {
        test: /[\.eot|\.ttf|\.woff|\.woff2]$/,
        loader: "file-loader",
        options: {
          name: "[name].[contenthash].[ext]",
          outputPath: "assets/fonts"
        },
      }
    ]
  },
  resolve: {
    alias: {
      '@assets': path.join(__dirname, './assets'),
    },
    modules: ['node_modules'],
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
  ]
}
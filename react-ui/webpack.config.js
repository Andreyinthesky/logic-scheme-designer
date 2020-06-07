const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpack = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require("path");

const isDev = process.env.NODE_ENV === "development";

const optimization = () => {
  return isDev
    ? false
    : {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    };
}

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "bundle.js"
  },
  devtool: isDev ? `source-map` : false,
  devServer: {
    port: 8020
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|lib)/,
        use: ["babel-loader", "eslint-loader"]
      },
      {
        test: /\.css$/,
        use: [isDev ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.svg$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "assets/images/svg"
        },
      },
      {
        test: /[\.eot|\.ttf|\.woff|\.woff2]$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
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
  optimization: optimization(),
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new CopyWebpack([
      { from: 'assets/favicon', to: 'favicon' },
      { from: 'src/serviceWorker.js' },
    ]),
    new MiniCssExtractPlugin({
      filename: "index.css",
    })
  ]
}
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // eslint-disable-line import/no-extraneous-dependencies
const CleanWebpackPlugin = require("clean-webpack-plugin"); // eslint-disable-line import/no-extraneous-dependencies

const buildDirectory = "dist";
const outputDirectory = `${buildDirectory}/client`;
module.exports = {
  mode: "development",
  entry: "./src/client/index.js",
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  devServer: {
    port: 3000,
    open: true
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPattern: [path.join(__dirname, buildDirectory)]
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ]
};

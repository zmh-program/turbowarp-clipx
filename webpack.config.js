const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  resolve: {
    extensions : [ ".js", ".ts", ".json" ],
    alias: { fs: false },
  },
  plugins: [],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "extension.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node-modules/,
      }
    ]
  },
}

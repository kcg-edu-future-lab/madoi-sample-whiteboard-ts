module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: [
      '.ts', '.js',
    ],
  },
  output: {
    filename: 'index.js'
  },
  devServer: {
    contentBase: "dist",
    watchContentBase: true,
    open: true,
    port: 9000
  }
};

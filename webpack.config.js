module.exports = {
  entry: './demo.js',
  output: {
    path: './demo',
    filename: 'demo.js',
  },
  module: {
    loaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }],
  }
};

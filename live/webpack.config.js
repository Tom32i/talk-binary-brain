const server = {
  target: 'node',
  entry: './server.js',
  output: {
    path: './dist',
    filename: 'server.js',
  },
  module: {
    loaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }],
  },
};

const client = {
  entry: './client.js',
  output: {
    path: './dist',
    filename: 'client.js',
  },
  module: {
    loaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }],
  }
};

module.exports = [ server, client ];

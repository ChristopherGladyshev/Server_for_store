const nodeExternals = require('webpack-node-externals');


exports.default = {
  target: 'node',
  externals: [nodeExternals()],
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  }
};

console.log(__dirname);

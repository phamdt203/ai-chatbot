const path = require('path');

module.exports = {
  entry: './src/index.js', // Change this to your actual entry point
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"), // if you also want to handle crypto
    },
  },
  // Add any other configuration options as needed
};


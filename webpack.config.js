var path = require('path');

module.exports = {
  entry: [
    path.resolve(__dirname, "build/index.js")
  ],
  output: {
    filename: 'redux-reducer-toolkit.js',
    path: path.resolve(__dirname, 'dist/'),
    library: 'redux-reducer-toolkit',
    libraryTarget: 'umd'
  }
};

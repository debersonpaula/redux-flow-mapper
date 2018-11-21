const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const options = {
    production: {
      minimizer: [
        new UglifyJsPlugin({
          parallel: true,
          uglifyOptions: {
            compress: true,
            mangle: true,
          },
          sourceMap: true
        })
      ]
    },
    development: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          uglifyOptions: {
            compress: false,
            mangle: false,
            beautify: true
          },
          sourceMap: true
        })
      ]
    }
}

module.exports = options[process.env.NODE_ENV];

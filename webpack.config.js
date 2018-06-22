const path = require('path')
const autoprefixer = require('autoprefixer')
const config = require('./config')

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'index.js',
    publicPath: '/dist/',
    path: path.resolve(__dirname, 'dist'),
    library: 'area-picker',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(css|less)$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1
            }
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9' // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009'
                })
              ]
            }
          },

          {
            loader: require.resolve('less-loader')
          }
        ]
      }
    ]
  },
  devtool: 'source-map',

  resolve: {
    modules: ['node_modules', path.resolve(__dirname, './src')],
    extensions: ['.js', '.jsx']
  },

  externals: _externals()
}

function _externals() {
  const exs = {}
  config.externals.forEach(ex => {
    exs[ex] = {
      commonjs: ex,
      commonjs2: ex,
      amd: ex
    }
  })

  return exs
}

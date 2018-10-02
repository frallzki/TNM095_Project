const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.ts',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
          test: /\.ts$/,
          enforce: 'pre',
          loader: 'tslint-loader',
          options: {
            formatter: 'codeFrame'
          },
          exclude: /node_modules/
      },
      {
        test: /\.(tsx?|js)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
    alias: {
      '@': path.resolve(__dirname, 'src/game')
    }
  },
  output: {
    filename: 'js/[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: "js/[name].[chunkhash].js",
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: /node_modules/,
          enforce: true
        },
      }
    },
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    quiet: true
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
    }),
    new CopyWebpackPlugin([
      {
        context: './public/',
        from: '**/*',
        to: './',
      },
      {
        context: './src/assets/',
        from: '**/*',
        to: 'assets/',
      }
    ]),
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['Your application is running on http://localhost:8080']
      },
    })
  ]
};
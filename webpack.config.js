const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (env = {}, argv = {}) => {
  return {
    mode: env.production ? 'production' : 'development',
    entry: ['./src/index.tsx'],
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist/')
    },
    devtool: env.production ? 'cheap-source-map' : 'inline-source-map',
    devServer: {
      port: 9001
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: false,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      browsers: '> 0.5% in US, not dead',
                      node: 'current'
                    }
                  }
                ],
                '@babel/preset-typescript',
                '@babel/preset-react'
              ],
              plugins: [
                ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
                'react-hot-loader/babel'
              ]
            }
          }
        }
      ]
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Simple React Forms',
        template: 'src/root-node.html'
      })
    ],
    resolve: {
      alias: {
        'react-dom': argv['hot'] ? '@hot-loader/react-dom' : 'react-dom'
      },
      extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
    optimization: {
      moduleIds: 'hashed',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    }
  };
};

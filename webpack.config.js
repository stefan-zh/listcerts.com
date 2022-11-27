import * as path from 'path';
import HtmlWebPackPlugin from 'html-webpack-plugin';

const distDir = path.resolve('dist');
export default {
  entry: './src/index.tsx',
  module: {
    rules: [
      { 
        test: /\.css$/, 
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
      filename: 'index.html'
    })
  ],
  output: {
    filename: 'client.bundle.js',
    path: distDir,
  },
  devServer: {
    static: {
      directory: distDir
    },
    compress: true,
    port: 3000
  }
};

const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin')
require("@babel/register");
const CopyPlugin = require('copy-webpack-plugin');

// Webpack Configuration
const config = {

    entry: ['babel-polyfill', './src/index.js'],

    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
    },

    module: {
        rules : [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.png$/,
                use: ['file-loader'],
            }
        ]
    },

    plugins: [
        new htmlWebpackPlugin({
            title: 'Ceros Ski'
        }),
        new CopyPlugin([
          { from: 'img', to: 'img' },
          { from: 'css', to: 'css' },
        ])
    ],
};

module.exports = config;
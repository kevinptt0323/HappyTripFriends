var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'app');
var CSS_DIR = path.resolve(__dirname, 'css');

var config = {
    entry: [
        APP_DIR+'/index.jsx',
    ],
    output: {
        path: BUILD_DIR,
        filename: '/bundle.js'
    },
    module : {
        loaders: [
            {
                test : /\jsx?$/,
                include: APP_DIR,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                include: CSS_DIR,
                exclude: /node_modules/,
                loader: 'style!css!sass'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    devtool: "cheap-module-eval-source-map",
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};

module.exports = config;

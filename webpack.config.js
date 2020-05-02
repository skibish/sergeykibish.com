const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './index.js',
    context: __dirname + "/assets",
    output: {
        path: __dirname + "/static",
        filename: "js/app.js"
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/app.css",
        }),
        new OptimizeCSSAssetsPlugin({}),
        new TerserPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }, {
                    loader: 'css-loader?-url', // translates CSS into CommonJS modules
                }, {
                    loader: 'postcss-loader', // Run post css actions
                    options: {
                        plugins: function () { // post css plugins, can be exported to postcss.config.js
                            return [
                                require('precss'),
                                require('autoprefixer')
                            ];
                        }
                    }
                }, {
                    loader: 'sass-loader' // compiles Sass to CSS
                }]
            },
        ]
    }
};

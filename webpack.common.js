// @flow
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const loader = require('sass-loader');

// const {version} = require("./package.json");

// const browserslist = require('browserslist')();
// const caniuse = require('caniuse-lite');

// from the least supported to the most supported
// const fonts = ['woff2', 'woff', 'ttf'];

/*::
type Target = {|
    name: string, // the name of output JS/CSS
    entry: string, // the path to the entry point
    library?: string // the name of the exported module
|};
*/

/**
 * List of targets to build
 */
const targets /*: Array<Target> */ = [
    {
        name: 'lazy-update',
        entry: ['@babel/polyfill', './src/index.js'], // polyfill for some code such as async function. 
        library: 'lazyUpdate',
    },
];

/**
 * Create a webpack config for given target
 */
function createConfig(target, dev, minimize, server) /*: Object */ {
    const cssLoaders /*: Array<Object> */ = [{loader: 'css-loader'}];
    if (minimize) {
        cssLoaders[0].options = {importLoaders: 1};
        cssLoaders.push({
            loader: 'postcss-loader',
            options: {plugins: [require('cssnano')()]},
        });
    }

    // const lessOptions = {modifyVars: {
    //     version: `"${version}"`,
    // }};

    // // use only necessary fonts, overridable by environment variables
    // let isCovered = false;
    // for (const font of fonts) {
    //     const override = process.env[`USE_${font.toUpperCase()}`];
    //     const useFont = override === "true" || override !== "false" && !isCovered;
    //     lessOptions.modifyVars[`use-${font}`] = useFont;

    //     const support = caniuse.feature(caniuse.features[font]).stats;
    //     isCovered = isCovered || useFont && browserslist.every(browser => {
    //         const [name, version] = browser.split(' ');
    //         return !support[name] || support[name][version] === 'y';
    //     });
    // }

    return {
        mode: dev ? 'development' : 'production',
        context: __dirname,
        entry: {
            [target.name]: target.entry,
        },
        output: {
            filename: minimize ? '[name].min.js' : '[name].js',
            library: target.library,
            libraryTarget: 'umd',
            libraryExport: 'default',
            // Enable output modules to be used in browser or Node.
            // See: https://github.com/webpack/webpack/issues/6522
            globalObject: "(typeof self !== 'undefined' ? self : this)",
            path: path.resolve(__dirname, 'dist'),
            // publicPath: dev ? '/' : '',
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        dev ? 'style-loader' : MiniCssExtractPlugin.loader,
                        ...cssLoaders,
                    ],
                },
                
                {
                    test: /\.sass$/,
                    use: [
                        dev ? 'style-loader' : MiniCssExtractPlugin.loader,
                        ...cssLoaders,
                        {
                            loader: 'sass-loader',
                            // options: lessOptions,
                        },
                    ],
                },

                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: 'babel-loader',
                },

                {
                    test: /\.?worker\.(:?js|mjs|ejs|cjs)$/,
                    exclude: /node_modules/,
                    use: [
                        { loader: 'worker-loader' },
                        'babel-loader'
                    ],
                }
                
                // {
                //     test: /\.(ttf|woff|woff2)$/,
                //     use: [{
                //         loader: 'file-loader',
                //         options: {
                //             name: 'fonts/[name].[ext]',
                //         },
                //     }],
                // },
            ],
        },
        // externals: 'katex',
        plugins: [
            !server && new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: 'lazy drawings update',
                template: './index.html'
            }),
            !dev && new MiniCssExtractPlugin({
                filename: minimize ? '[name].min.css' : '[name].css',
            }),
        ].filter(Boolean),
        devtool: dev && 'inline-source-map',
        optimization: {
            minimize,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        output: {
                            // ascii_only: true,
                        },
                    },
                }),
            ],
        },
        performance: {
            hints: false,
        },
    };
}

module.exports = {
    targets,
    createConfig,
};

/**
 *    here is two main things for webpack:
 * the targets which will produce different packages
 * the second one is createConfig function inside this
 * function we are triming and modifiying the passed
 * options then do throw generation of the configuration.
 * You can find therwe two other helper functions: getRules
 * and getPlugins. In these two helper function a lot of
 * consideration are directed to "options.mode".
 *
 *    At the end you can find a devServer property is specified
 * to the configuration object "config", putting the
 * webpack-dev-server options: host, port, hot, etc...
 */

const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
    name: "lazyUpdate",

    // entry: './src/index.js', // polyfill for some code such as async function.
    entry: ["@babel/polyfill", "./src/index.js"], // polyfill for some code such as async function.
    library: "lazyUpdate",
  },
];

/**
 * dev, minimize, devServer
 * Create a webpack config for given target
 */
function createConfig(target, options) /*: Object */ {
  let dev = options.mode === "development" || options.mode === "dev-server",
    devServer = options.mode === "dev-server",
    analyze = options.mode === "analyze";

  void (function prepareOptions() {
    if (dev) {
      // for webpack-dev-server
      let devServerPort =
        process.argv.indexOf("--port") > -1
          ? process.argv[process.argv.indexOf("--port") + 1]
          : 7936;
      let devServerHost =
        process.argv.indexOf("--host") > -1
          ? process.argv[process.argv.indexOf("--host") + 1]
          : "localhost";

      // for browser-sync
      let devServerHot = process.argv.indexOf("--hot") > -1;
      let port = process.env.PORT || 8080;
      let host = process.env.HOST || "localhost";

      options = {
        host,
        port,
        devServerPort,
        devServerHost,
        devServerHot,
        ...options,
      };
    }
  })();

  let minimize = !dev;

  function getPlugins() {
    var plugins = [];

    if (dev) {
      if (devServer) {
        let BrowserSyncPlugin = require("browser-sync-webpack-plugin");
        plugins.push(
          new BrowserSyncPlugin(
            {
              host: options.host,
              port: options.port,
              proxy: `http://${options.devServerHost}:${options.devServerPort}/`,
            },
            {
              reload: false,
            }
          )
        );

        if (options.hot) {
          const webpack = require("webpack");
          plugins.concat([
            new webpack.HotModuleReplacementPlugin(),
          ]);
        }
      }
    }

    if (analyze) {
      plugins.push(
        new (require("webpack-bundle-analyzer").BundleAnalyzerPlugin)(),
      );
    }

    plugins.push(
      new HtmlWebpackPlugin({
        title: "lazy drawings update",
        template: "./index.html"
      }),
      
        new MiniCssExtractPlugin({
          filename: minimize ? "[name]-[hash].min.css" : "[name]-[hash].css",
        }),
      !devServer && new CleanWebpackPlugin(),
    );

    return plugins.filter(Boolean);
  }

  function getRules() {
    // // use only necessary fonts, overridable by environment variables
    // // from the least supported to the most supported
    // const browserslist = require('browserslist')();
    // const caniuse = require('caniuse-lite');
    // const fonts = ['woff2', 'woff', 'ttf'];
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

    const cssLoaders /*: Array<Object> */ = [{ loader: "css-loader" }];
    if (minimize) {
      cssLoaders[0].options = { importLoaders: 1 };
      cssLoaders.push({
        loader: "postcss-loader",
        options: { plugins: [require("cssnano")()] },
      });
    }

    return [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          ...cssLoaders,
        ],
      },

      {
        test: /\.sass$/,
        use: [
          dev ? "style-loader" : MiniCssExtractPlugin.loader,
          ...cssLoaders,
          {
            loader: "sass-loader",
            // options: lessOptions,
          },
        ],
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },

      {
        test: /\.?worker\.(:?js|mjs|ejs|cjs)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "worker-loader",
            options: {
              filename: minimize ? "[name]-[hash].min.js" : "[name]-[hash].js",
            },
          },
          'babel-loader'
        ],
      },

      // {
      //     test: /\.(ttf|woff|woff2)$/,
      //     use: [{
      //         loader: 'file-loader',
      //         options: {
      //             name: 'fonts/[name].[ext]',
      //         },
      //     }],
      // },
    ];
  }

  let config = {
    mode: dev ? "development" : "production",
    context: __dirname,
    entry: {
      [target.name]: target.entry,
    },
    output: {
      filename: minimize ? "[name]-[hash].min.js" : "[name]-[hash].js",
      library: target.library,
      libraryTarget: "umd",
      libraryExport: "default",
      // Enable output modules to be used in browser or Node.
      // See: https://github.com/webpack/webpack/issues/6522
      globalObject: "(typeof self !== 'undefined' ? self : this)",
      path: path.resolve(__dirname, "dist"),
    },
    module: {
      rules: getRules(),
    },
    // externals: 'katex',
    plugins: getPlugins(),
    devtool: dev && "source-map",
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
      namedModules: true,
    },
    performance: {
      hints: false,
    },
  };

  if (devServer) {
    config.devServer = {
      contentBase: [__dirname],
      // Allow server to be accessed from anywhere, which is useful for
      // testing.  This potentially reveals the source code to the world,
      // but this should not be a concern for testing open-source software.
      disableHostCheck: true,
      host: options.devServerHost,
      port: options.devServerPort,
      hot: options.devServerHot,
      stats: {
        colors: true,
      },
    };
  }

  return config;
}

module.exports = {
  targets,
  createConfig,
};

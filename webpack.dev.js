// @flow
const {targets, createConfig} = require('./webpack.common');
const path = require('path');
const PORT = 7936;

//                                            dev  minify  server
const serverConfig = createConfig(targets[0], true, false, true);

serverConfig.devServer = {
    contentBase: [__dirname],
    // Allow server to be accessed from anywhere, which is useful for
    // testing.  This potentially reveals the source code to the world,
    // but this should not be a concern for testing open-source software.
    disableHostCheck: true,
    // host: '0.0.0.0',
    port: PORT,
    hot: true,
    stats: {
        colors: true,
    },
};

if(serverConfig.devServer.hot){
    const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
    const webpack = require('webpack');
    serverConfig.plugins = serverConfig.plugins || [];
    serverConfig.plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            // proxy: 'http://localhost:8080/',
            server: { baseDir: ['dist'] },
            files: ['./dist/*'],
        })
    ]);
}


module.exports = [
    serverConfig,
    // ...targets.map(target => createConfig(target, true, false)),
];

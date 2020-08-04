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
    // hot: true,
    stats: {
        colors: true,
    },
};

module.exports = [
    serverConfig,
    // ...targets.map(target => createConfig(target, true, false)),
];

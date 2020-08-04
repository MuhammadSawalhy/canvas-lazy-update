// @flow
const {targets, createConfig} = require('./webpack.common');

let dev = false, minify = true; //process.argv.findIndex('-p') > -1;

module.exports = [ //                              dev   minify
    // ...targets.map(target => createConfig(target, false, false)),
    ...targets.map(target => createConfig(target, dev, minify)),
];

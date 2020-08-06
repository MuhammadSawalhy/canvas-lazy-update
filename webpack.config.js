// @flow
const {targets, createConfig} = require('./webpack.common');

let mode = require('./package.json').mode; 
let dev = mode === "development" ? true: false;
let minify = !dev;

module.exports = [ //                              dev   minify
    // ...targets.map(target => createConfig(target, false, false)),
    ...targets.map(target => createConfig(target, dev, minify)),
];

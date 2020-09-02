// @flow
const {targets, createConfig} = require('./webpack.common');

const mode = process.env.MODE || require('./package.json').mode || 'production'; 

let configs = [
    ...targets.map(target => createConfig(target, {mode})),
];

module.exports = configs;

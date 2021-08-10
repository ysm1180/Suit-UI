'use strict';

const babelJest = require('babel-jest').default;

module.exports = babelJest.createTransformer({
    presets: [[require.resolve('babel-preset-react-app')]],
    plugins: [['@emotion']],
    babelrc: false,
    configFile: false,
});

const path = require('path');

const resolvePath = (_path) => path.join(process.cwd(), _path);

/**
 *  @callback StorybookWebpackConfig
 *  @param {import("webpack").Configuration} config
 *  @param {{configType: 'DEVELOPMENT' | 'PRODUCTION'}} options - change the build configuration. 'PRODUCTION' is used when building the static version of storybook.
 *  @returns {import("webpack").Configuration}
 */

/**
 *  @typedef {{check:boolean; checkOptions: Record<string,unknown>; reactDocgen: string | boolean; reactDocgenTypescriptOptions: Record<string,unknown>}} StorybookTsConfig
 */

/**
 * @typedef {{stories: string[] ; addons: string[]; typescript: StorybookTsConfig; babel: (options:Record<string,unknown>)=>Promise<Record<string,unknown>>; webpackFinal: StorybookWebpackConfig}} StorybookConfig
 */
module.exports = {
    stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-a11y',
    ],
    webpackFinal: (config) => {
        config.module.rules[0].use[0].options.presets[2][1].runtime = 'classic';
        config.module.rules[0].use[0].options.plugins.push(['@emotion', { sourceMap: true }]);

        config.module.rules.push({
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
            include: path.resolve(__dirname, '../'),
        });

        config.resolve.alias = {
            ...config.resolve.alias,
            '@emotion/core': resolvePath('./node_modules/@emotion/react'),
            '@emotion/styled': resolvePath('./node_modules/@emotion/styled'),
            'emotion-theming': resolvePath('./node_modules/@emotion/react'),
        };
        return { ...config };
    },
};

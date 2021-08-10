module.exports = {
    verbose: true,
    roots: ['<rootDir>'],
    setupFiles: ['react-app-polyfill/jsdom', './tests/setup.js'],
    setupFilesAfterEnv: ['./tests/setupAfterEnv.js'],
    testMatch: ['<rootDir>/test/**/*.{spec,test}.{js,jsx,ts,tsx}'],
    testEnvironment: 'jsdom',
    testRunner: 'jest-circus/runner',
    transform: {
        '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/tests/jest/babelTransform.js',
        '^.+\\.css$': '<rootDir>/tests/jest/cssTransform.js',
        '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': '<rootDir>/tests/jest/fileTransform.js',
    },
    transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!(lodash-es|react-virtualized))',
        '^.+\\.module\\.(css|sass|scss)$',
    ],
    modulePaths: [],
    moduleNameMapper: {
        '^react-native$': 'react-native-web',
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    },
    moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'jsx', 'node'],
    watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
    snapshotSerializers: ['@emotion/jest/serializer'],
    resetMocks: true,
};

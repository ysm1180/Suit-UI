module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'react-app',
        'prettier',
    ],
    rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
    plugins: ['react', '@typescript-eslint'],
    ignorePatterns: ['*.stories.tsx', 'tests', 'test', '.eslintrc.js', '*.config.ts'],
};

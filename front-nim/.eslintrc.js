module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
    ],
    overrides: [
        {
            files: ['*.jsx', '*.js'],
        },
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
    ],
    rules: {
        indent: ['error', 4],

        // JSX
        'react/jsx-indent': ['error', 4, { checkAttributes: true, indentLogicalExpressions: true }],
        'react/jsx-indent-props': ['error', 4],
    },
};

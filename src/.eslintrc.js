module.exports = {
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  settings: { react: { version: 'detect' } },
  plugins: ['import', 'react'],
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  root: true,
  env: {
    browser: true,
    jest: true
  },
  overrides: [
    {
      files: ['**/*.jsx'],
      rules: {
        'react/prop-types': 'off'
      }
    }
  ],
  rules: {
    'import/newline-after-import': ['warn'],
    'import/no-default-export': ['warn'],
    'import/order': [
      'warn',
      {
        groups: ['external', 'builtin'],
        'newlines-between': 'never',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
    'max-len': ['warn', { code: 120 }],
    'no-duplicate-imports': 'warn',
    'no-import-assign': 'warn',
    'no-multiple-empty-lines': ['warn', { max: 1 }],
    'no-useless-rename': 'warn',
    'object-shorthand': 'warn',
    'react/react-in-jsx-scope': 'off',
    semi: ['error', 'never']
  }
}

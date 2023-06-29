const rules = {
  // General Rules
  'no-unused-vars': 'warn',
  'no-use-before-define': 'error',
  'no-console': 'off',

  // TypeScript-Specific Rules
  '@typescript-eslint/explicit-function-return-type': 'warn',
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-unused-vars': 'warn',

  // Code Style and Formatting Rules
  'indent': ['error', 2],
  'quotes': ['error', 'single'],
  'semi': ['error', 'always'],
};


// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['/dist/**/*.js'],
  rules
};
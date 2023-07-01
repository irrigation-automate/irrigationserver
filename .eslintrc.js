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

  // Example rule for enforcing space around operators
  'space-infix-ops': 'error',

  // Example rule for enforcing space inside parentheses
  'space-in-parens': ['error', 'never'],
  
  // Example rule for enforcing space inside braces
  'object-curly-spacing': ['error', 'always'],
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
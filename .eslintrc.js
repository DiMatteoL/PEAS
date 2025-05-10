module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the TypeScript parser
  parserOptions: {
    ecmaVersion: 2020, // Use modern ECMAScript features
    sourceType: 'module', // Enable ES modules
  },
  extends: [
    'eslint:recommended', // Use recommended rules
    'plugin:@typescript-eslint/recommended', // Use recommended rules from @typescript-eslint
  ],
  rules: {
    // Customize additional rules or override defaults here
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};

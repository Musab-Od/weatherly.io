// eslint.config.js
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'prettier/prettier': 'error', // Treat Prettier formatting issues as ESLint errors
      'no-unused-vars': 'warn', // Warn about unused variables
      'no-console': 'off', // Allow console logs
    },
  },
  eslintConfigPrettier,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];

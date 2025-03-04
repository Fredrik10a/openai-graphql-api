// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import parser from '@typescript-eslint/parser';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-undef': 'error',
      'no-magic-numbers': 'off', // Allows for numbers without restrictions
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }], // Ignore unused arguments with `_`
      'space-in-parens': ['error', 'always'], // Enforce spaces inside parentheses
      'spaced-comment': ['error', 'always'], // Enforce spaces after comments
    },
  }
);

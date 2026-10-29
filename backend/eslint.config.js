import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    'dist',
    'node_modules',
  ]),

  {
    files: ['**/*.ts'],

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
    ],

    languageOptions: {
      ecmaVersion: 'latest',

      sourceType: 'module',
    },

    rules: {
      /*
       * TypeScript already resolves identifiers,
       * so no-undef produces false positives for
       * Node.js globals (process, Buffer, ...).
       */
      'no-undef': 'off',

      'no-console': 'warn',

      '@typescript-eslint/no-explicit-any': 'warn',

      '@typescript-eslint/no-empty-object-type': 'warn',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
]);

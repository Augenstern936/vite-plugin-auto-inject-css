import eslint from '@eslint/js'
import importPlugin from 'eslint-plugin-import-x'
import nodePlugin from 'eslint-plugin-n'
import * as regexpPlugin from 'eslint-plugin-regexp'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  nodePlugin.configs['flat/recommended'],
  regexpPlugin.configs['flat/recommended'],
  {
    ignores: [
      '**/dist',
      '**/playground-temp',
      '**/temp',
      '**/es',
      '**/lib',
      '**/dist',
    ],
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      eqeqeq: ['warn', 'always', { null: 'never' }],
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-useless-escape': 'off',
      'prefer-const': ['warn', { destructuring: 'all' }],

      'n/no-process-exit': 'off',
      'n/no-missing-import': [
        'error',
        {
          allowModules: ['types', 'estree', 'stylus'],
          tryExtensions: ['.ts', '.js', '.d.ts'],
        },
      ],
      'n/no-missing-require': [
        'error',
        {
          // for try-catching yarn pnp
          allowModules: ['pnpapi', 'vite'],
          tryExtensions: ['.ts', '.js', '.d.ts'],
        },
      ],
      'n/no-extraneous-import': ['error', { allowModules: ['vitest'] }],
      'n/no-deprecated-api': 'off',
      'n/no-unpublished-import': 'off',
      'n/no-unpublished-require': 'off',
      'n/no-unsupported-features/es-syntax': 'off',

      '@typescript-eslint/ban-ts-comment': 'off', // TODO: we should turn this on in a new PR
      '@typescript-eslint/explicit-module-boundary-types': [
        'error',
        { allowArgumentsExplicitlyTypedAsAny: false },
      ],
      '@typescript-eslint/no-empty-function': [
        'error',
        { allow: ['arrowFunctions'] },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off', // maybe we should turn this on in a new PR
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off', // maybe we should turn this on in a new PR
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
      'import/no-duplicates': 'error',
      'import/order': 'error',
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: false,
        },
      ],

      'regexp/no-contradiction-with-assertion': 'error',
    },
  },
  {
    files: ['*.spec.ts'],
    rules: {
      'n/no-extraneous-import': 'off',
    },
  },
  {
    files: ['playground/**'],
    rules: {
      'n/no-extraneous-import': 'off',
      'n/no-extraneous-require': 'off',
      'n/no-missing-import': 'off',
      'n/no-missing-require': 'off',
      // engine field doesn't exist in playgrounds
      'n/no-unsupported-features/es-builtins': [
        'error',
        {
          version: '^18.0.0 || >=20.0.0',
        },
      ],
      'n/no-unsupported-features/node-builtins': [
        'error',
        {
          version: '^18.0.0 || >=20.0.0',
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    files: ['playground/**'],
    ignores: ['**/__tests__/**'],
    rules: {
      'no-undef': 'off',
      'no-empty': 'off',
      'no-constant-condition': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
  {
    files: ['*.js', '*.mjs', '*.cjs'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    files: ['*.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
)

import antfu from '@antfu/eslint-config'

/**
 * Haven's shared ESLint configuration
 * Based on @antfu/eslint-config with React + TypeScript + Node.js support
 *
 * Features:
 * - Auto-detects React and TypeScript
 * - Includes stylistic/formatting rules (no Prettier needed)
 * - Respects .gitignore by default
 * - Sorted imports, single quotes, no semicolons
 * - Monorepo-specific rules for NestJS and React SSR patterns
 */
export default function havenEslintConfig(options = {}, ...userConfigs) {
  return antfu(
    {
      // Type of project - affects which rules are enabled
      type: 'app', // Use 'lib' for library packages

      // Framework support (auto-detected but explicit is better)
      react: true,
      typescript: true,

      // Enable stylistic rules for formatting
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: false,
      },

      // Enable JSONC for package.json, tsconfig.json
      jsonc: true,

      // Enable YAML for docker-compose, GitHub workflows
      yaml: true,

      // Enable markdown linting
      markdown: true,

      // Respect .gitignore by default
      gitignore: true,

      // Custom ignores beyond .gitignore
      ignores: [
        '**/dist/**',
        '**/build/**',
        '**/.next/**',
        '**/coverage/**',
        '**/.turbo/**',
        '**/pnpm-lock.yaml',
        '**/node_modules/**',
        '**/.changeset/**',
        '**/.claude/**',
      ],

      // Merge with user-provided options
      ...options,
    },

    // Monorepo-specific overrides
    {
      name: 'haven/monorepo-rules',
      rules: {
        // Enforce consistent imports across monorepo
        'perfectionist/sort-imports': ['error', {
          type: 'natural',
          order: 'asc',
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
          ],
          newlinesBetween: 'always',
        }],

        // Disable console in production code (allow in dev)
        'no-console': ['warn', { allow: ['warn', 'error'] }],
      },
    },

    // TypeScript-specific overrides (only for TS files)
    {
      name: 'haven/typescript-rules',
      files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
      rules: {
        'ts/consistent-type-imports': ['error', {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        }],
        'ts/no-unused-vars': ['warn', {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        }],
      },
    },

    // NestJS-specific rules for API and dispatcher
    {
      name: 'haven/nestjs-overrides',
      files: ['apps/api/**/*.ts', 'apps/dispatcher/**/*.ts'],
      rules: {
        // NestJS uses decorators extensively
        'ts/no-extraneous-class': 'off',

        // NestJS dependency injection pattern
        'no-useless-constructor': 'off',
        'ts/no-useless-constructor': 'off',

        // Allow parameter properties
        'ts/parameter-properties': 'off',

        // NestJS controllers often have empty constructors for DI
        'ts/no-empty-function': 'off',

        // NestJS requires runtime class imports for dependency injection
        // Services, providers, etc. must be imported as values, not types
        'ts/consistent-type-imports': 'off',
      },
    },

    // React-specific rules for web app
    {
      name: 'haven/react-overrides',
      files: ['apps/web/**/*.tsx', 'apps/web/**/*.ts'],
      rules: {
        // TanStack Start SSR patterns
        'react-refresh/only-export-components': 'off',

        // Allow unnamed default exports for route files
        'import/no-anonymous-default-export': 'off',
      },
    },

    // Test files overrides
    {
      name: 'haven/test-overrides',
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: {
        'ts/no-explicit-any': 'off',
        'no-console': 'off',
      },
    },

    // Allow user configs to override everything
    ...userConfigs,
  )
}

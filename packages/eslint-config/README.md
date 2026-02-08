# @haven/eslint-config

Shared ESLint configuration for the Haven monorepo.

## Features

- Based on [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- TypeScript + React + Node.js support
- Built-in formatting rules (no Prettier needed)
- Opinionated: single quotes, no semicolons, sorted imports
- Monorepo-aware rules for NestJS and TanStack Start

## Usage

### In workspace packages

```javascript
// eslint.config.mjs
import havenEslint from '@haven/eslint-config'

export default havenEslint()
```

### With custom overrides

```javascript
// eslint.config.mjs
import havenEslint from '@haven/eslint-config'

export default havenEslint(
  {
    // Override antfu defaults
    stylistic: { indent: 4 },
  },
  {
    // Additional custom rules
    rules: {
      'no-console': 'off',
    },
  },
)
```

## Formatting Philosophy

This config includes stylistic/formatting rules. **Do not install Prettier** — ESLint handles both linting and formatting.

## VSCode Setup

Add to `.vscode/settings.json`:

```json
{
  // Disable the default formatter, use eslint instead
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // Silent the stylistic rules in your IDE, but still auto fix them
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off", "fixable": true },
    { "rule": "format/*", "severity": "off", "fixable": true },
    { "rule": "*-indent", "severity": "off", "fixable": true },
    { "rule": "*-spacing", "severity": "off", "fixable": true },
    { "rule": "*-spaces", "severity": "off", "fixable": true },
    { "rule": "*-order", "severity": "off", "fixable": true },
    { "rule": "*-dangle", "severity": "off", "fixable": true },
    { "rule": "*-newline", "severity": "off", "fixable": true },
    { "rule": "*quotes", "severity": "off", "fixable": true },
    { "rule": "*semi", "severity": "off", "fixable": true }
  ],

  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml",
    "toml",
    "xml",
    "gql",
    "graphql",
    "astro",
    "svelte",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
  ]
}
```

## Monorepo Support

This config automatically applies framework-specific rules based on file patterns:

- `apps/api/**/*.ts` and `apps/dispatcher/**/*.ts` → NestJS rules
- `apps/web/**/*.tsx` → React SSR rules
- `**/*.{test,spec}.ts` → Test file rules

No per-app configuration needed — just import and use!

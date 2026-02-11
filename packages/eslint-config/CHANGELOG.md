# @haven/eslint-config

## 0.0.2

### Patch Changes

- 4b9cf8a: Scaffold NestJS API application with monorepo integration

  **Features:**

  - Create `apps/api` using NestJS CLI with Fastify adapter
  - Configure API to use shared `@haven/eslint-config` from monorepo
  - Add `dev:api` convenience script to root package.json
  - Remove Prettier in favor of ESLint formatting (monorepo standard)

  **Configuration Updates:**

  - Update `@haven/eslint-config` to disable `ts/consistent-type-imports` for NestJS files (required for dependency injection)
  - Clean up API package.json to remove duplicate ESLint and Prettier dependencies
  - API inherits ESLint config from monorepo root

  **API Setup:**

  - NestJS 11 with Fastify adapter
  - TypeScript with decorators and metadata emission
  - Jest testing framework configured
  - Hot reload enabled for development
  - Basic "Hello World" endpoint at GET /

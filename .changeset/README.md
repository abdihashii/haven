# Changesets - Version Management

This monorepo uses [Changesets](https://github.com/changesets/changesets) for **version-only** workflow. We do not publish packages to npm.

## Quick Start

### Adding a changeset

When you make changes to workspace packages, run:

```bash
pnpm changeset
```

This will:

1. Prompt you to select which packages changed
2. Ask for the bump type (major/minor/patch)
3. Request a summary (becomes the changelog entry)
4. Generate a `.changeset/*.md` file

Commit this file with your changes.

## Understanding Monorepo Versioning

### Root Package vs Workspace Packages

**Root Package** (`haven` @ 0.0.1):

- Just a monorepo container - **never gets versioned**
- Stays at 0.0.1 indefinitely
- Marked `"private": true` (cannot be published)
- Only contains workspace configuration and shared dev dependencies

**Workspace Packages** (versioned by changesets):

- `apps/web` - TanStack Start frontend
- `apps/api` - NestJS API Gateway
- `apps/dispatcher` - NestJS background worker
- `packages/shared` - Shared runtime code
- `packages/api-client` - Typed HTTP client
- `packages/eslint-config` - Shared ESLint config
- `packages/tsconfig` - Shared TypeScript configs

Each workspace package versions **independently** based on changesets.

## Version Packages Workflow

1. **On PR** - The `changeset-check` workflow ensures you've added a changeset
   - Skip for chore/docs changes by adding the `skip-changeset` label

2. **On merge to main** - The `version-packages` workflow:
   - Detects accumulated changeset files
   - Opens a "Version Packages" PR that:
     - Bumps versions in workspace `package.json` files
     - Updates `CHANGELOG.md` files
     - Deletes consumed changeset files

3. **Merge Version PR** - Versions are committed to main
   - **Only workspace packages get versioned** (root stays at 0.0.1)

## Version-Only Mode

This repository uses changesets in **version-only mode**:

- ✅ Automatic version bumping for workspace packages
- ✅ Changelog generation
- ✅ Dependency version synchronization
- ❌ No npm publishing (packages are internal)

Our packages are internal to the Haven monorepo and deployed to Fly.io, not published to npm.

## Why Version-Only?

1. **Internal Packages** - Haven's packages are internal to the monorepo
2. **Unified Deployment** - Apps and packages deploy together to Fly.io
3. **No Distribution** - No need to publish to npm registry
4. **Changelog Benefits** - Still get automatic changelog generation and version tracking

## Configuration

- **Config:** `.changeset/config.json`
  - `"access": "restricted"` - Prevents accidental npm publishing
  - `"baseBranch": "main"` - Version PRs compare against main
- **Workflows:**
  - `.github/workflows/changeset-check.yml` - Enforce changesets on PRs
  - `.github/workflows/version-packages.yml` - Create version PRs
- **Documentation:** `docs/architecture.md` - Section 11

## Useful Commands

```bash
# Add a changeset
pnpm changeset

# Check changeset status
pnpm changeset status

# View changeset help
pnpm changeset --help
```

**Note:** The `pnpm changeset version` command is run automatically by the GitHub Actions workflow - you don't need to run it locally.

## Expected Behavior

### When You See "No publish script found" in CI Logs

This message is **expected and harmless**. The changesets/action checks for a publish script, and when it doesn't find one, it logs this message. Since we use version-only mode, this is correct behavior.

### When Versions Bump

Versions only bump for **workspace packages**, not the root:

- ❌ Root `package.json` stays at 0.0.1
- ✅ Workspace packages (apps/_, packages/_) bump according to changesets

### When Nothing Gets Versioned

If you merge a PR and no versions bump, it's because:

1. The PR used the `skip-changeset` label (e.g., for chore/docs changes)
2. No changeset file was included
3. The changeset didn't select any workspace packages

## Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Using Changesets with pnpm](https://pnpm.io/using-changesets)
- [Changesets Action](https://github.com/changesets/action)

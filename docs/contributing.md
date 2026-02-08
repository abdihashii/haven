# Contributing to Haven

Thank you for contributing to Haven! This guide will help you understand our development workflow.

## Making Changes

### 1. Create a Branch

```bash
git checkout -b <type>/<description>
```

**Branch types:**
- `feat/` - New features
- `fix/` - Bug fixes
- `chore/` - Maintenance tasks
- `docs/` - Documentation updates

### 2. Make Your Changes

Write your code following our style guidelines (enforced by ESLint).

### 3. Add a Changeset

**Every PR that modifies code requires a changeset.**

#### For Features, Fixes, or Breaking Changes

```bash
pnpm changeset add
```

Follow the prompts:
1. **Select packages**: Choose which packages your changes affect
2. **Version bump**:
   - `patch` (0.0.X) - Bug fixes, minor changes
   - `minor` (0.X.0) - New features, non-breaking changes
   - `major` (X.0.0) - Breaking changes
3. **Summary**: Describe your changes (used in CHANGELOG)

#### For Chores, Docs, or CI/CD Changes

```bash
pnpm changeset add --empty
```

Then edit the generated `.changeset/*.md` file to add a description.

#### Skipping Changesets

If your PR truly doesn't need a changeset (rare cases), add the `skip-changeset` label to your PR.

**Examples of skip-worthy PRs:**
- Pure documentation updates (README, comments)
- CI/CD configuration changes that don't affect code
- Repo maintenance (updating .gitignore, etc.)

### 4. Commit and Push

```bash
git add .
git commit -m "feat: add user authentication"
git push origin <your-branch>
```

**Commit Message Format:**
- Start with type: `feat:`, `fix:`, `chore:`, `docs:`
- Use present tense: "add feature" not "added feature"
- Keep it concise but descriptive

### 5. Create a Pull Request

Open a PR on GitHub. Our CI will:
- ✅ Run linting checks
- ✅ Verify a changeset exists (or `skip-changeset` label is applied)
- ✅ Run tests (when added)

If the changeset check fails, you'll see a helpful comment explaining what to do.

## Development Commands

```bash
# Linting
pnpm run lint              # Check for linting errors
pnpm run lint:fix          # Auto-fix linting errors

# Changesets
pnpm changeset add         # Add a changeset
pnpm changeset status      # Check changeset status

# Testing (coming soon)
pnpm test                  # Run all tests
```

## Code Quality

### Linting

We use ESLint with ANTFU's config for both linting and formatting.

- **Auto-fix on save**: Configured in VSCode (see `.vscode/settings.json`)
- **Auto-fix on commit**: Pre-commit hook runs `lint-staged`
- **CI enforcement**: PRs must pass linting to merge

**Do not install Prettier** - ESLint handles formatting.

### Style Guide

- Single quotes (`'` not `"`)
- No semicolons
- 2-space indentation
- Trailing commas in multiline
- Sorted imports (auto-sorted)

All of this is enforced automatically by ESLint!

## Monorepo Structure

```
/haven
├── /apps
│   ├── /web         # TanStack Start (React 19)
│   ├── /api         # NestJS Gateway
│   └── /dispatcher  # NestJS Worker
├── /packages
│   ├── /shared              # Shared runtime code
│   ├── /api-client          # Typed HTTP client
│   ├── /eslint-config       # Shared ESLint config
│   └── /tsconfig            # Shared TypeScript configs
└── /docs            # Documentation
```

## Need Help?

- **Changeset errors?** Check the PR comment for instructions
- **Linting errors?** Run `pnpm run lint:fix`
- **Questions?** Open a discussion or ask in the PR

Thank you for contributing! 🚀

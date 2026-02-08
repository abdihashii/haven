# Contributing to Haven

Thank you for contributing! This guide covers the essentials for making changes.

📚 **For detailed information, see:**
- [Architecture Reference](architecture.md) - System design, tech stack, monorepo structure
- [Product Spec](product-spec.md) - Product requirements and user flows
- [ESLint Config](../packages/eslint-config/README.md) - Code style and linting setup

## Quick Start

### Prerequisites

See [README.md](../README.md) for Node.js and pnpm version requirements.

### Local Development

See [Architecture Reference - Local Development](architecture.md#10-local-development) for instructions on running the dev environment.

## Contribution Workflow

### 1. Create a Branch

```bash
git checkout -b <type>/<description>
```

**Branch naming:**
- `feat/` - New features
- `fix/` - Bug fixes
- `chore/` - Maintenance tasks
- `docs/` - Documentation updates

### 2. Make Your Changes

Code style is enforced automatically by ESLint (see [packages/eslint-config](../packages/eslint-config/README.md)).

### 3. Add a Changeset

**Every PR that modifies code requires a changeset.** See [Architecture Reference - Versioning](architecture.md#11-versioning-changesets) for details.

**Quick reference:**

```bash
# For features, fixes, breaking changes
pnpm changeset add

# For chores, docs, CI/CD (no version bump)
pnpm changeset add --empty
```

If your PR doesn't need a changeset (rare), add the `skip-changeset` label.

### 4. Commit and Push

```bash
git commit -m "feat: add user authentication"
git push origin <your-branch>
```

**Commit format:** `<type>: <description>` using present tense

### 5. Create a Pull Request

CI will automatically:
- ✅ Check linting
- ✅ Verify changeset exists (or `skip-changeset` label)
- ✅ Run tests (when added)
- 💬 Comment with instructions if changeset is missing

## Common Commands

```bash
# Linting
pnpm run lint              # Check for errors
pnpm run lint:fix          # Auto-fix errors

# Changesets
pnpm changeset add         # Add changeset
pnpm changeset status      # Check changeset status
```

## Getting Help

- **Changeset errors?** Check the auto-generated PR comment
- **Linting errors?** Run `pnpm run lint:fix`
- **Architecture questions?** See [Architecture Reference](architecture.md)
- **Other questions?** Open a discussion or ask in your PR

Thank you for contributing! 🚀

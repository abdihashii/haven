# Build stage
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/api ./apps/api

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the API
RUN pnpm --filter @haven/api build

# Production stage
FROM node:22-alpine AS runner

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

WORKDIR /app

# Copy workspace files for production install
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Set working directory to api
WORKDIR /app/apps/api

# Expose port
EXPOSE 3000

# Set NODE_ENV
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/main.js"]

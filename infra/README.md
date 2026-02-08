# Haven Infrastructure

This directory contains all infrastructure configuration for Haven - both local development (Docker Compose) and production deployment (Fly.io).

## Overview

**Local Development:** Docker Compose provides PostgreSQL, NATS, and MinIO for a complete local environment.

**Production:** Fly.io hosts the database, applications (web, API, dispatcher), and Tigris for S3-compatible storage.

## Quick Start

```bash
# Start all local infrastructure
pnpm infra:up

# Start specific services
pnpm db:up

# Stop all infrastructure
pnpm infra:down
```

---

## Local Development

### Prerequisites

- Docker and Docker Compose installed
- pnpm installed

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm infra:up` | Start all local services (PostgreSQL, NATS, MinIO) |
| `pnpm infra:down` | Stop all local services |
| `pnpm infra:logs` | View logs from all services |
| `pnpm db:up` | Start PostgreSQL only |
| `pnpm db:down` | Stop PostgreSQL only |
| `pnpm db:logs` | View PostgreSQL logs |
| `pnpm db:shell` | Access PostgreSQL shell (psql) |

---

## Service 1: Database (PostgreSQL)

### Local Development

**Start PostgreSQL:**
```bash
pnpm db:up
# or
pnpm infra:up
```

**Access database shell:**
```bash
pnpm db:shell
```

**Common psql commands:**
```sql
\l              -- List all databases
\dt             -- List all tables
\c haven_dev    -- Connect to haven_dev database
\d table_name   -- Describe table schema
\q              -- Quit
```

**Connection Details (Local):**
- Host: `localhost`
- Port: `5432`
- Database: `haven_dev`
- User: `haven`
- Password: `haven_dev_password`
- Connection String: `postgresql://haven:haven_dev_password@localhost:5432/haven_dev`

### Production (Fly.io Postgres)

**Prerequisites:**
- [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/) installed
- Fly.io account authenticated (`fly auth login`)

**Provision database:**
```bash
fly postgres create --name haven-db --region ord
```

Options:
- `--region ord` - Chicago region (adjust to your location)
- `--vm-size shared-cpu-1x` - Smallest VM (scale up as needed)
- `--volume-size 10` - 10GB storage
- `--initial-cluster-size 1` - Single instance (use `--ha` for HA)

**⚠️ Save credentials immediately - shown only once!**

**Connect from local machine (admin/migrations):**
```bash
# Create proxy tunnel
fly proxy 5433:5432 -a haven-db

# Connect via psql
psql postgresql://username:password@localhost:5433/haven_production
```

**Connect from Fly.io apps (internal network):**
```bash
# Set as secret in your app
fly secrets set DATABASE_URL="postgresql://user:pass@haven-db.internal:5432/haven_production" -a your-app
```

**Management commands:**
```bash
fly status -a haven-db                    # Check status
fly logs -a haven-db                      # View logs
fly postgres connect -a haven-db          # Direct console access
fly postgres backup list -a haven-db      # List backups
fly volumes extend vol_xxx -s 20 -a haven-db  # Scale storage
```

---

## Service 2: Message Queue (NATS JetStream)

**Status:** 🚧 Coming Soon

NATS JetStream will provide the event bus for asynchronous processing between the API and dispatcher services.

**Planned local setup:**
- Image: `nats:latest`
- Port: `4222` (client), `8222` (monitoring)
- Data persistence via Docker volume

**Planned production:**
- Self-hosted NATS on Fly.io, OR
- Managed alternative (e.g., Upstash Kafka)

**To enable locally:**
Uncomment the `nats` service section in `docker-compose.yml`

---

## Service 3: Object Storage (MinIO / S3)

**Status:** 🚧 Coming Soon

MinIO provides S3-compatible object storage for local development. Production uses Tigris (Fly.io's S3-compatible storage).

**Planned local setup:**
- Image: `minio/minio:latest`
- Port: `9000` (API), `9001` (console)
- Root user: `haven`
- Root password: `haven_dev_password`

**Planned production:**
```bash
fly storage create --name haven-storage
```

Tigris credentials are auto-injected into Fly.io apps via environment variables.

**To enable locally:**
Uncomment the `minio` service section in `docker-compose.yml`

---

## Production Deployment (Fly.io)

### How Fly.io Deployment Works

Fly.io has **two types of resources**:

1. **Managed Services** (Database, Storage)
   - Provisioned via CLI commands (`fly postgres create`, `fly storage create`)
   - Fly.io manages everything - you just get credentials
   - **No configuration files needed**

2. **Your Applications** (API, Web, Dispatcher)
   - Each app has its own `fly.toml` in its directory (`apps/api/fly.toml`)
   - The `fly.toml` tells Fly.io how to build and run your code
   - Deploy with `fly deploy`

### Service Architecture

| Service | App Name | Type | Provisioning | Status |
|---------|----------|------|--------------|--------|
| Database | `haven-db` | Managed | `fly postgres create` | ✅ Ready |
| Storage | `haven-storage` | Managed | `fly storage create` | 🚧 Coming Soon |
| API | `haven-api` | App | `fly deploy` (from apps/api/) | 🚧 Coming Soon |
| Web | `haven-web` | App | `fly deploy` (from apps/web/) | 🚧 Coming Soon |
| Dispatcher | `haven-dispatcher` | App | `fly deploy` (from apps/dispatcher/) | 🚧 Coming Soon |

### Deployment Order

1. **Provision Database** (one-time setup):
   ```bash
   fly postgres create --name haven-db --region ord
   ```
   Save the credentials output!

2. **Provision Storage** (when needed):
   ```bash
   fly storage create --name haven-storage
   ```

3. **Deploy Applications** (when built):
   ```bash
   # Each app deploys from its own directory
   cd apps/api && fly launch        # First time: creates fly.toml
   cd apps/api && fly deploy        # Subsequent deploys
   ```

4. **Connect Apps to Database**:
   ```bash
   fly secrets set DATABASE_URL="postgres://..." -a haven-api
   ```

### Future App Configuration

When you create `apps/api/`, `apps/web/`, etc., each will have its own `fly.toml` that looks like:

```toml
# apps/api/fly.toml (example)
app = "haven-api"
primary_region = "ord"

[build]
dockerfile = "Dockerfile"

[env]
NODE_ENV = "production"

[[services]]
internal_port = 3000
protocol = "tcp"
```

---

## Troubleshooting

### Local Services Won't Start

**Check Docker:**
```bash
docker ps                    # List running containers
docker compose -f infra/docker-compose.yml ps  # Check service status
```

**Port conflicts:**
```bash
lsof -i :5432   # Check if PostgreSQL port is in use
lsof -i :4222   # Check if NATS port is in use
lsof -i :9000   # Check if MinIO port is in use
```

**View logs:**
```bash
pnpm infra:logs              # All services
pnpm db:logs                 # PostgreSQL only
```

### Can't Connect to Database

**Check container health:**
```bash
docker inspect haven-db | grep -A 10 Health
```

**Test connection:**
```bash
docker exec -it haven-db psql -U haven -d haven_dev -c "SELECT 1"
```

### Production Issues

**Database not responding:**
```bash
fly status -a haven-db       # Check if running
fly logs -a haven-db         # Check for errors
```

**Apps can't reach database:**
- Verify both are in the same Fly.io organization
- Check DATABASE_URL secret is set: `fly secrets list -a your-app`
- Ensure using `.internal` hostname for internal connections

---

## Data Persistence

### Local

Data persists in Docker volumes:
- `postgres_data` - Database files
- `nats_data` - Message queue (when enabled)
- `minio_data` - Object storage (when enabled)

Volumes survive `pnpm infra:down`. To completely wipe:
```bash
pnpm infra:down
docker volume rm infra_postgres_data infra_nats_data infra_minio_data
```

### Production

- **PostgreSQL:** Daily automatic backups (7-day retention on free tier)
- **Tigris:** Durable S3-compatible storage with replication
- **Fly Volumes:** Persistent storage for applications if needed

---

## Next Steps

1. **Provision production database** - Run `fly postgres create`
2. **Build application layer** - Create `apps/api`, `apps/web`, `apps/dispatcher`
3. **Define database schema** - Add TypeORM entities and migrations
4. **Enable NATS and MinIO** - Uncomment services when building event-driven features
5. **Deploy to production** - Use `fly launch` for each application

---

## Reference Links

- [Fly.io Postgres Docs](https://fly.io/docs/postgres/)
- [Fly.io Tigris Storage Docs](https://fly.io/docs/tigris/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [NATS JetStream Docs](https://docs.nats.io/nats-concepts/jetstream)
- [MinIO Docs](https://min.io/docs/minio/linux/index.html)

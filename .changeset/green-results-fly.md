---
---

Add infrastructure foundation for local development and production deployment. Includes Docker Compose configuration for PostgreSQL (with placeholders for NATS and MinIO), CLI-based Fly.io Postgres provisioning instructions, infrastructure management scripts (infra:up, infra:down, db:shell, test:infra), and comprehensive multi-service documentation.

**Features:**
- Docker Compose setup with PostgreSQL, NATS, and MinIO placeholders
- Infrastructure management scripts with Docker health checks (preinfra:up, predb:up)
- Enhanced error handling for database shell access
- Fly.io deployment documentation with detailed provisioning workflow
- Test script for infrastructure validation (test:infra)

**Security & Best Practices:**
- Local dev credentials marked with security warnings
- Refined .gitignore patterns to avoid excluding legitimate SQL files
- Environment file usage instructions in documentation
- Password manager recommendations for production credentials

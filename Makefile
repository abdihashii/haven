.PHONY: haven-db-local haven-db-prod haven-db-prod-shell

haven-db-local:
	@docker info > /dev/null 2>&1 || (echo "Error: Docker is not running. Please start Docker Desktop and try again." && exit 1)
	@docker compose -f infra/docker-compose.yml ps postgres 2>/dev/null | grep -q "running" || (echo "Error: Local database is not running. Start it with: pnpm db:up" && exit 1)
	@echo "=== Haven Dev Database ==="
	@echo ""
	@echo "  Host:     localhost"
	@echo "  Port:     5432"
	@echo "  User:     haven"
	@echo "  Password: haven_dev_password"
	@echo "  Database: haven_dev"
	@echo "  URL:      postgresql://haven:haven_dev_password@localhost:5432/haven_dev"
	@echo ""
	@echo "Shell: pnpm db:shell"

haven-db-prod:
	@command -v fly > /dev/null 2>&1 || (echo "Error: Fly CLI is not installed. Install it: https://fly.io/docs/hands-on/install-flyctl/" && exit 1)
	@fly auth whoami > /dev/null 2>&1 || (echo "Error: Not logged in to Fly.io. Run: fly auth login" && exit 1)
	@echo "=== Haven Prod Database (via Fly proxy) ==="
	@echo ""
	@echo "  Host:     localhost"
	@echo "  Port:     15432"
	@echo "  User:     abdirahmanhaji_haven_api"
	@echo "  Database: abdirahmanhaji_haven_api"
	@echo "  SSL:      off"
	@echo ""
	@echo "Opening tunnel... (Ctrl+C to close)"
	@echo ""
	fly proxy 15432:5432 --app abdirahmanhaji-haven-db

haven-db-prod-shell:
	@command -v fly > /dev/null 2>&1 || (echo "Error: Fly CLI is not installed. Install it: https://fly.io/docs/hands-on/install-flyctl/" && exit 1)
	@fly auth whoami > /dev/null 2>&1 || (echo "Error: Not logged in to Fly.io. Run: fly auth login" && exit 1)
	fly postgres connect --app abdirahmanhaji-haven-db

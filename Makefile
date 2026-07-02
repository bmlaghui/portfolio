.PHONY: help dev prod prod-build prod-check prod-stop prod-status prod-logs prod-seed stop status logs seed migrate migrate-prod rebuild clean restart-build

DOCKER_COMPOSE ?= docker compose
PROD_ENV ?= .env.prod
PROD_COMPOSE = $(DOCKER_COMPOSE) --env-file $(PROD_ENV) -f docker-compose.prod.yml
DEV_COMPOSE = $(DOCKER_COMPOSE) --env-file .env -f docker-compose.yml

help:
	@echo "Portfolio DevOps Commands:"
	@echo "  make dev            - Start development environment"
	@echo "  make prod-check     - Validate production env and compose config"
	@echo "  make prod-build     - Build production frontend/backend images"
	@echo "  make prod           - Build and start production environment"
	@echo "  make prod-status    - Show production container status"
	@echo "  make prod-logs      - View production logs (SERVICE=name)"
	@echo "  make prod-seed      - Seed production database intentionally"
	@echo "  make prod-stop      - Stop production environment"
	@echo "  make stop           - Stop all containers"
	@echo "  make status         - Show container status"
	@echo "  make logs           - View development logs (SERVICE=name)"
	@echo "  make migrate        - Run Prisma migrations (dev)"
	@echo "  make migrate-prod   - Run Prisma migrations (prod)"
	@echo "  make seed           - Seed development database"
	@echo "  make rebuild        - Rebuild all images"
	@echo "  make clean          - Clean up unused resources"

dev:
	$(DEV_COMPOSE) up -d
	@echo "Development: http://localhost:4000 | Backend: http://localhost:3000"

prod-check:
	@test -f $(PROD_ENV) || (echo "Missing $(PROD_ENV). Run: cp .env.prod.example $(PROD_ENV) && edit values" && exit 1)
	@! grep -q "change_me" $(PROD_ENV) || (echo "Refusing production start: replace all change_me values in $(PROD_ENV)" && exit 1)
	$(PROD_COMPOSE) config >/dev/null
	@echo "Production configuration is valid"

prod-build: prod-check
	$(PROD_COMPOSE) build frontend backend

prod: prod-check
	$(PROD_COMPOSE) up -d --build
	@echo "Production: http://localhost:8081"

prod-stop:
	@if [ -f "$(PROD_ENV)" ]; then \
		$(PROD_COMPOSE) down; \
	else \
		echo "Skipping prod down: $(PROD_ENV) not found"; \
	fi

prod-status:
	$(PROD_COMPOSE) ps

prod-logs:
	@if [ -z "$(SERVICE)" ]; then \
		$(PROD_COMPOSE) logs -f; \
	else \
		$(PROD_COMPOSE) logs -f $(SERVICE); \
	fi

prod-seed: prod-check
	@echo "WARNING: this will reseed production database data."
	@printf "Type SEED_PROD to continue: "; \
	read confirm; \
	if [ "$$confirm" != "SEED_PROD" ]; then echo "Cancelled"; exit 1; fi
	$(PROD_COMPOSE) exec backend npx prisma db seed

stop:
	$(DEV_COMPOSE) down
	@if [ -f "$(PROD_ENV)" ]; then \
		$(PROD_COMPOSE) down; \
	else \
		echo "Skipping prod down: $(PROD_ENV) not found"; \
	fi

status:
	@$(DEV_COMPOSE) ps || true
	@if [ -f "$(PROD_ENV)" ]; then \
		$(PROD_COMPOSE) ps || true; \
	else \
		echo "Skipping prod status: $(PROD_ENV) not found"; \
	fi

logs:
	@if [ -z "$(SERVICE)" ]; then \
		echo "Usage: make logs SERVICE=frontend|backend|db|redis"; \
	else \
		$(DEV_COMPOSE) logs -f $(SERVICE); \
	fi

migrate:
	$(DEV_COMPOSE) exec backend npx prisma migrate dev

migrate-prod: prod-check
	$(PROD_COMPOSE) exec backend npx prisma migrate deploy

seed:
	$(DEV_COMPOSE) exec backend npx prisma db seed

rebuild:
	$(DEV_COMPOSE) build --no-cache frontend backend
	@if [ -f "$(PROD_ENV)" ]; then \
		$(PROD_COMPOSE) build --no-cache frontend backend; \
	else \
		echo "Skipping prod rebuild: $(PROD_ENV) not found"; \
	fi

clean:
	docker system prune -f --volumes

restart-build:
	$(DEV_COMPOSE) up --build -d

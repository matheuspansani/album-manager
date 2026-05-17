.PHONY: help install up down build logs restart clean seed status

help: ## Mostra esta ajuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Instala o Docker (macOS via Homebrew)
	@which docker > /dev/null 2>&1 && echo "Docker ja esta instalado" || (echo "Instalando Docker..." && brew install --cask docker && echo "Docker instalado. Abra o Docker Desktop antes de continuar.")

build: ## Builda as imagens Docker
	docker compose build

up: ## Sobe todos os containers
	docker compose up -d
	@echo ""
	@echo "Album Manager rodando:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:8000"
	@echo "  API Docs: http://localhost:8000/docs"
	@echo "  Postgres: localhost:5432"

down: ## Para todos os containers
	docker compose down

restart: ## Reinicia todos os containers
	docker compose restart

logs: ## Mostra os logs dos containers
	docker compose logs -f

logs-backend: ## Mostra logs do backend
	docker compose logs -f backend

status: ## Mostra o status dos containers
	docker compose ps

seed: ## Popula o album com as figurinhas
	@curl -s -X POST http://localhost:8000/api/stickers/seed | python3 -m json.tool

clean: ## Remove containers, volumes e imagens
	docker compose down -v --rmi local
	@echo "Containers, volumes e imagens removidos."

reset: ## Reseta o banco de dados e repopula
	docker compose exec db psql -U album -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	docker compose restart backend
	@sleep 3
	@$(MAKE) seed

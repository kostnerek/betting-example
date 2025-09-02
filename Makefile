docker-up:
	@echo "Starting up database..."
	docker-compose up -d

docker-down:
	@echo "Stopping and removing containers..."
	docker-compose down

migrate: migrate-odds migrate-bets

migrate-odds:
	@echo "Migrating odds database..."
	@npx prisma migrate dev --schema=./prisma/odds/schema.prisma > /dev/null 2>&1
	
migrate-bets:
	@echo "Migrating bets database..."
	@npx prisma migrate dev --schema=./prisma/bets/schema.prisma > /dev/null 2>&1
	

reset-migrations: reset-migrations-odds reset-migrations-bets

reset-migrations-odds:
	@echo "Resetting odds database..."
	@npx prisma migrate reset --schema=./prisma/odds/schema.prisma > /dev/null 2>&1

reset-migrations-bets:
	@echo "Resetting bets database..."
	@npx prisma migrate reset --schema=./prisma/bets/schema.prisma > /dev/null 2>&1

refresh-games:
	@echo "Refreshing games..."
	@curl --silent --output /dev/null \
	  --location 'http://$(or $(HOST),localhost):$(or $(PORT),3000)/api/games/refresh' \
	  --header 'Content-Type: application/json'

create-user:
	@echo "Creating user..."
	@curl --silent --output /dev/null \
	  --location 'http://$(or $(HOST),localhost):$(or $(PORT),3000)/api/user/register' \
	  --header 'Content-Type: application/json' \
	  --data '{"username": "test"}'

prisma-generate: 
	@echo "Generating prisma..."
	@yarn prisma:generate > /dev/null 2>&1

env:
	@echo "Preparing environment..."
	@if [ -f .env ]; then \
		echo ".env file exists, skipping..."; \
	else \
		printf "Provide the-odds-api API key: " && \
		read apikey && \
		cp -n .env.example .env && \
		echo "THE_ODDS_API_KEY=$$apikey" >> .env; \
	fi

wait-for-database:
	pwd
	@echo "Waiting for database to be ready..."
	@docker compose exec postgres_odds sh -c "/wait-for-postgres.sh"
	@docker compose exec postgres_bets sh -c "/wait-for-postgres.sh"

start-and-setup:
	@echo "Starting all services in background..."
	@yarn start:all > /dev/null 2>&1 & echo $$! > .services.pid
	@echo "Waiting for services to start up..."
	@sleep 2
	@echo "Running refresh-games and create-user..."
	@$(MAKE) refresh-games
	@$(MAKE) create-user
	@echo "Setup complete! Services are running in background."
	@echo "To stop services, run: make stop-services"

stop-services:
	@echo "Stopping all services..."
	@if [ -f .env ]; then \
		API_PORT=$$(grep '^PORT=' .env | cut -d'=' -f2); \
		ODDS_PORT=$$(grep '^ODDS_MS_PORT=' .env | cut -d'=' -f2); \
		BETS_PORT=$$(grep '^BETS_MS_PORT=' .env | cut -d'=' -f2); \
		echo "Killing processes on ports $$API_PORT, $$ODDS_PORT, $$BETS_PORT..."; \
		lsof -ti:$$API_PORT | xargs kill -TERM 2>/dev/null || true; \
		lsof -ti:$$ODDS_PORT | xargs kill -TERM 2>/dev/null || true; \
		lsof -ti:$$BETS_PORT | xargs kill -TERM 2>/dev/null || true; \
	else \
		echo "No .env file found, using default ports 3000, 6000, 6001..."; \
		lsof -ti:3000 | xargs kill -TERM 2>/dev/null || true; \
		lsof -ti:6000 | xargs kill -TERM 2>/dev/null || true; \
		lsof -ti:6001 | xargs kill -TERM 2>/dev/null || true; \
	fi
	@rm -f .services.pid 2>/dev/null || true
	@echo "Services stopped."

install:
	@echo "Installing dependencies..."
	@yarn install > /dev/null 2>&1

prepare: prisma-generate env docker-up wait-for-database migrate install start-and-setup stop-services


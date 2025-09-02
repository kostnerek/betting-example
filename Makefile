docker-up:
	@echo "Starting up database..."
	docker-compose up -d

docker-down:
	@echo "Stopping and removing containers..."
	docker-compose down

migrate: migrate-odds migrate-bets

migrate-odds:
	@echo "Migrating odds database..."
	npx prisma migrate dev --schema=./prisma/odds/schema.prisma
	
migrate-bets:
	@echo "Migrating bets database..."
	npx prisma migrate dev --schema=./prisma/bets/schema.prisma
	

reset-migrations: reset-migrations-odds reset-migrations-bets

reset-migrations-odds:
	@echo "Resetting odds database..."
	npx prisma migrate reset --schema=./prisma/odds/schema.prisma

reset-migrations-bets:
	@echo "Resetting bets database..."
	npx prisma migrate reset --schema=./prisma/bets/schema.prisma

refresh-games:
	@echo "Refreshing games..."
	curl http://$(or $(HOST),localhost):$(or $(PORT),3000)/api/games/refresh

create-user:
	@echo "Creating user..."
	curl --location 'http://$(or $(HOST),localhost):$(or $(PORT),3000)/api/user/register' --header 'Content-Type: application/json' --data '{"username": "test"}'

prisma-generate: 
	@echo "Generating prisma..."
	yarn prisma:generate
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

prepare: prisma-generate env docker-up migrate
	yarn

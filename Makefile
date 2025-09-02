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

run-all-services:
	@echo "Starting all services..."
	nest start api-gateway --watch & \
	nest start bets --watch & \
	nest start odds --watch

refresh-games:
	@echo "Refreshing games..."
	curl http://$(or $(HOST),localhost):$(or $(PORT),3000)/api/games/refresh

start: docker-up migrate run-all-services refresh-games

docker-up:
	@echo "Starting up database..."
	docker-compose up -d

docker-down:
	@echo "Stopping and removing containers..."
	docker-compose down

migrate: migrate-odds migrate-bets

migrate-odds:
	@echo "Migrating odds database..."
	npx prisma migrate dev --schema=./prisma/odds.prisma
	
migrate-bets:
	@echo "Migrating bets database..."
	npx prisma migrate dev --schema=./prisma/bets.prisma
	

reset-migrations: reset-migrations-odds reset-migrations-bets

reset-migrations-odds:
	@echo "Resetting odds database..."
	npx prisma migrate reset --schema=./prisma/odds.prisma

reset-migrations-bets:
	@echo "Resetting bets database..."
	npx prisma migrate reset --schema=./prisma/bets.prisma

run-all-services:
	@echo "Starting all services..."
	nest start api-gateway --watch & \
	nest start bets --watch & \
	nest start odds --watch


start: docker-up run-all-services

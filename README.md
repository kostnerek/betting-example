### Prerequisites
https://the-odds-api.com/ - api-key
`yarn`
`docker compose`
### Running app
To run all required services for app startup you'll need to run `make prepare` - it will ask for your api-key and will spin up services, migrate databases, create mock user with name `test` and pull fresh data from the-odds-api.com

After this step you can run all services using 
`yarn start:all`

Now you are up and running and can test application, with provided Postman collection

### Overview
App is done in NestJS, using microservices architecture with gRPC as transport layer between microservices and gateway. API-gateway is using REST as entry.

Handling of processing games' result is done using scheduling tasks using BullMQ, when new games are pulled they are scheduled for processing at `commenceTime` of game. When time comes it generates random result, and processes all bets which users put inside this system.

To speed this process up for testing there is endpoint /games/generate-results/:gameId which speeds processing of job tied to provided gameId

If encountered any problems running app, run everything manually:
`yarn`
`yarn prisma:generate`
`docker compose up -d`
`npx prisma migrate dev --schema=./prisma/odds/schema.prisma`
`npx prisma migrate dev --schema=./prisma/bets/schema.prisma`
`yarn start:all`
then you can use postman collection to run /game/refresh endpoint to pull fresh data from the-odds-api.com and run /user/register endpoint to create mock user with selected name.

If issues persists, contact me directly

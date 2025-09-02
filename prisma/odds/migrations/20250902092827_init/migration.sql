-- CreateEnum
CREATE TYPE "public"."BetTeam" AS ENUM ('HOME', 'AWAY');

-- CreateTable
CREATE TABLE "public"."Game" (
    "id" TEXT NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "commenceTime" TIMESTAMP(3) NOT NULL,
    "winner" "public"."BetTeam",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Odd" (
    "id" TEXT NOT NULL,
    "team" "public"."BetTeam" NOT NULL,
    "odds" DOUBLE PRECISION NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "Odd_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Odd_gameId_team_key" ON "public"."Odd"("gameId", "team");

-- AddForeignKey
ALTER TABLE "public"."Odd" ADD CONSTRAINT "Odd_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

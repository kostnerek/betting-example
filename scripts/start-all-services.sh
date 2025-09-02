#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting all services...${NC}"

# Function to kill all background processes on script exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping all services...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start each service in the background
echo -e "${BLUE}📡 Starting API Gateway...${NC}"
nest start api-gateway --watch &
API_GATEWAY_PID=$!

echo -e "${BLUE}🎲 Starting Bets Service...${NC}"
nest start bets --watch &
BETS_PID=$!

echo -e "${BLUE}📊 Starting Odds Service...${NC}"
nest start odds --watch &
ODDS_PID=$!

echo -e "${GREEN}✅ All services started!${NC}"
echo -e "${YELLOW}Services running:${NC}"
echo -e "  • API Gateway (PID: $API_GATEWAY_PID)"
echo -e "  • Bets Service (PID: $BETS_PID)"
echo -e "  • Odds Service (PID: $ODDS_PID)"
echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}\n"

# Wait for all background processes
wait

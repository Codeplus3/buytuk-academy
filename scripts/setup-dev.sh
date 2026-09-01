#!/bin/bash
# =============================================================================
# BuyTuk Academy - Development Environment Setup
# =============================================================================

set -e

echo "🚀 Starting BuyTuk Academy Development Setup..."

# 1. Check prerequisites
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install it first."
    exit 1
fi

# 2. Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# 3. Setup environment variables
if [ ! -f .env ]; then
    echo "⚙️  Copying .env.example to .env..."
    cp .env.example .env
    echo "⚠️  Please update the values in .env before proceeding."
else
    echo "✅ .env file already exists."
fi

# 4. Start infrastructure services
echo "🐳 Starting infrastructure services (Postgres, Redis)..."
docker-compose up -d postgres redis

# 5. Wait for services to be ready
echo " Waiting for services to be ready..."
sleep 5

# 6. Run database migrations
echo "🗄️  Running database migrations..."
pnpm db:push

echo "✅ Development environment setup complete!"
echo " Run 'pnpm dev' to start the application."
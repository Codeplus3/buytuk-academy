#!/bin/bash
# =============================================================================
# BuyTuk Academy - Verify Database Migrations
# =============================================================================

set -e

echo "🔍 Verifying database migrations..."

# Check if there are any pending migrations
if pnpm db:generate --dry-run | grep -q "No changes detected"; then
    echo "✅ Database schema is up to date."
else
    echo "⚠️  Database schema has changed. Please generate and apply migrations."
    echo " Run 'pnpm db:generate' and 'pnpm db:migrate'."
    exit 1
fi
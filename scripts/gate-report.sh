#!/bin/bash
# =============================================================================
# BuyTuk Academy - Pre-Commit / Pre-PR Gate Report
# =============================================================================

set -e

echo "🚦 Running Gate Report checks..."

# 1. Linting
echo "1️⃣  Checking linting..."
if ! pnpm lint; then
    echo "❌ Linting failed."
    exit 1
fi

# 2. Formatting
echo "2️⃣  Checking formatting..."
if ! pnpm format:check; then
    echo "❌ Formatting check failed. Run 'pnpm format' to fix."
    exit 1
fi

# 3. Type Checking
echo "3️⃣  Checking types..."
if ! pnpm type-check; then
    echo "❌ Type checking failed."
    exit 1
fi

# 4. Unit Tests
echo "4️⃣  Running unit tests..."
if ! pnpm test:unit; then
    echo "❌ Unit tests failed."
    exit 1
fi

echo "✅ All gate checks passed! Ready to commit/merge."
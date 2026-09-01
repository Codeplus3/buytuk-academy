#!/bin/bash
# =============================================================================
# BuyTuk Academy - Load Testing Script (k6)
# =============================================================================

set -e

TEST_DIR="tests/load"
RESULTS_DIR="tests/load/results"

mkdir -p ${RESULTS_DIR}

echo "📈 Starting Load Tests..."

# Check if k6 is installed
if ! command -v k6 &> /dev/null; then
    echo "❌ k6 is not installed. Please install it: https://k6.io/docs/getting-started/installation/"
    exit 1
fi

# Run API Load Test
echo "1️⃣  Running API Load Test..."
k6 run ${TEST_DIR}/api-test.js --out json=${RESULTS_DIR}/api-results.json

# Run WebSocket Load Test
echo "2️⃣  Running WebSocket Load Test..."
k6 run ${TEST_DIR}/websocket-test.js --out json=${RESULTS_DIR}/ws-results.json

echo "✅ Load tests completed. Results saved in ${RESULTS_DIR}."
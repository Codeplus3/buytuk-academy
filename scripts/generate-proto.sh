#!/bin/bash
# =============================================================================
# BuyTuk Academy - Generate gRPC Protobuf Files
# =============================================================================

set -e

PROTO_DIR="inference-gateway/proto"
GATEWAY_DIR="inference-gateway/gateway"

echo "🛠️  Generating gRPC code from proto files..."

# Check if grpc_tools is installed
if ! python3 -m grpc_tools.protoc --version &> /dev/null; then
    echo "❌ grpcio-tools is not installed. Run 'pip install grpcio-tools'."
    exit 1
fi

# Generate Python gRPC code
python3 -m grpc_tools.protoc \
    -I${PROTO_DIR} \
    --python_out=${GATEWAY_DIR} \
    --grpc_python_out=${GATEWAY_DIR} \
    ${PROTO_DIR}/inference.proto

echo "✅ gRPC code generated successfully in ${GATEWAY_DIR}."
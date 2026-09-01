# =============================================================================
# BuyTuk Academy - Inference Gateway Dockerfile
# =============================================================================

FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04 AS base

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Generate gRPC code (if needed at build time, though usually done in CI)
# RUN python3 -m grpc_tools.protoc -I./proto --python_out=./gateway --grpc_python_out=./gateway ./proto/inference.proto

EXPOSE 50050 50051 50052 50053 50054

# Default command runs the gateway server
CMD ["python3", "-m", "gateway.server"]
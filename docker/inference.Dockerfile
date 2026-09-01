# =============================================================================
# BuyTuk Academy - Inference Gateway Dockerfile
# =============================================================================

FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY inference-gateway/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy code
COPY inference-gateway/ .

EXPOSE 50050 50051 50052 50053 50054

CMD ["python", "-m", "gateway.server"]
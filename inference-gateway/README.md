# BuyTuk Academy - Inference Gateway

This module handles all Machine Learning inference tasks for the BuyTuk Academy platform.

## Architecture
- **Gateway**: Routes requests to specialized workers via gRPC.
- **Workers**: 
  - `whisper_worker`: Speech-to-Text (GPU).
  - `alignment_worker`: Forced Alignment (GPU).
  - `g2p_worker`: Grapheme-to-Phoneme (CPU).
  - `feedback_worker`: LLM-based feedback (CPU/API).

## Running Locally
1. Install dependencies: `pip install -r requirements.txt`
2. Generate proto files: `python -m grpc_tools.protoc -I./proto --python_out=. --grpc_python_out=. ./proto/inference.proto`
3. Run gateway: `python -m gateway.server`

## Docker
Build with GPU support:
```bash
docker build -t buytuk-inference .
docker run --gpus all -p 50050:50050 buytuk-inference
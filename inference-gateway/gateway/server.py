import os
import grpc
from concurrent import futures
from gateway.auth import AuthInterceptor
from gateway import inference_pb2_grpc

def serve():
    port = os.getenv("GATEWAY_PORT", "50050")
    api_key = os.getenv("INFERENCE_API_KEY", "dev-key")
    
    # Setup interceptors
    interceptors = [AuthInterceptor(api_key)]
    
    server = grpc.server(
        futures.ThreadPoolExecutor(max_workers=10),
        interceptors=interceptors
    )
    
    # Note: Services will be added here as they are implemented
    # inference_pb2_grpc.add_WhisperServiceServicer_to_server(WhisperServicer(), server)
    
    server.add_insecure_port(f"[::]:{port}")
    server.start()
    print(f" Inference Gateway started on port {port}")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
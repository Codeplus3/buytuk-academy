import os
import sys
from pathlib import Path
import grpc
from concurrent import futures
from gateway.auth import AuthInterceptor

sys.path.insert(0, str(Path(__file__).parent))
from gateway import inference_pb2_grpc
from gateway.proxy import AlignmentProxy, FeedbackProxy, G2PProxy, WhisperProxy

def serve():
    port = os.getenv("GATEWAY_PORT", "50050")
    api_key = os.getenv("INFERENCE_API_KEY", "dev-key")
    
    # Setup interceptors
    interceptors = [AuthInterceptor(api_key)]
    
    server = grpc.server(
        futures.ThreadPoolExecutor(max_workers=10),
        interceptors=interceptors
    )
    
    inference_pb2_grpc.add_WhisperServiceServicer_to_server(WhisperProxy(), server)
    inference_pb2_grpc.add_AlignmentServiceServicer_to_server(AlignmentProxy(), server)
    inference_pb2_grpc.add_G2PServiceServicer_to_server(G2PProxy(), server)
    inference_pb2_grpc.add_FeedbackServiceServicer_to_server(FeedbackProxy(), server)
    
    server.add_insecure_port(f"[::]:{port}")
    server.start()
    print(f" Inference Gateway started on port {port}")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
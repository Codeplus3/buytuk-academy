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
    api_key = os.getenv("INFERENCE_API_KEY", "")
    if not api_key:
        raise RuntimeError("INFERENCE_API_KEY must be configured")
    
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
    
    cert_file = os.getenv("INFERENCE_TLS_CERT")
    key_file = os.getenv("INFERENCE_TLS_KEY")
    if cert_file and key_file:
        credentials = grpc.ssl_server_credentials(((Path(key_file).read_bytes(), Path(cert_file).read_bytes()),))
        server.add_secure_port(f"[::]:{port}", credentials)
    elif os.getenv("INFERENCE_ALLOW_INSECURE", "false").lower() == "true":
        server.add_insecure_port(f"[::]:{port}")
    else:
        raise RuntimeError("TLS is required unless INFERENCE_ALLOW_INSECURE=true")
    server.start()
    print(f" Inference Gateway started on port {port}")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
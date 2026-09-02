import os
import sys
from pathlib import Path
import grpc
from concurrent import futures
sys.path.insert(0, str(Path(__file__).parents[1]))
sys.path.insert(0, str(Path(__file__).parents[1] / "gateway"))
from gateway import inference_pb2, inference_pb2_grpc

class G2PServicer:
    def __init__(self):
        print("Loading CAMeL Tools...")
        # self.analyzer = Analyzer(...)
        print("G2P models loaded.")

    def Convert(self, request, context):
        if not request.text.strip():
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "Text must not be empty")
        response = inference_pb2.G2PResponse(original=request.text, diacritized=request.text)
        response.phonemes.extend([character for character in request.text if not character.isspace()])
        return response

def serve():
    port = os.getenv("G2P_PORT", "50053")
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=4))
    inference_pb2_grpc.add_G2PServiceServicer_to_server(G2PServicer(), server)
    server.add_insecure_port(f"[::]:{port}")
    server.start()
    print(f"🔤 G2P Worker started on port {port}")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
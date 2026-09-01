import os
import torch
import whisper
import grpc
from concurrent import futures

# Mocking the generated proto imports for structure
# from gateway import inference_pb2, inference_pb2_grpc

class WhisperServicer:
    def __init__(self):
        print("Loading Whisper Model...")
        self.model = whisper.load_model(os.getenv("WHISPER_MODEL", "base"))
        print("Model loaded.")

    def Transcribe(self, request, context):
        # Implementation of STT logic
        # audio = np.frombuffer(request.audio.pcm_data, dtype=np.float32)
        # result = self.model.transcribe(audio)
        pass

def serve():
    port = os.getenv("WHISPER_PORT", "50051")
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=2))
    # inference_pb2_grpc.add_WhisperServiceServicer_to_server(WhisperServicer(), server)
    server.add_insecure_port(f"[::]:{port}")
    server.start()
    print(f"🎤 Whisper Worker started on port {port}")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
import os
import sys
from pathlib import Path
import grpc
from concurrent import futures
sys.path.insert(0, str(Path(__file__).parents[1]))
sys.path.insert(0, str(Path(__file__).parents[1] / "gateway"))
from gateway import inference_pb2, inference_pb2_grpc

class AlignmentServicer:
    def __init__(self):
        print("Loading Alignment Models (WhisperX/MMS)...")
        # self.model = whisperx.load_align_model(...)
        print("Alignment models loaded.")

    def AlignWord(self, request, context):
        words = request.transcript.split()
        if not words:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "Transcript must not be empty")
        duration = len(request.audio.pcm_data) / (4 * request.audio.sample_rate) if request.audio.sample_rate else 0
        step = duration / len(words) if duration else 0
        response = inference_pb2.AlignWordResponse()
        for index, word in enumerate(words):
            response.words.add(word=word, start=index * step, end=(index + 1) * step, confidence=1.0)
        return response

def serve():
    port = os.getenv("ALIGNMENT_PORT", "50052")
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=2))
    inference_pb2_grpc.add_AlignmentServiceServicer_to_server(AlignmentServicer(), server)
    server.add_insecure_port(f"[::]:{port}")
    server.start()
    print(f"🎯 Alignment Worker started on port {port}")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
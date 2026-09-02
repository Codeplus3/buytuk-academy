import os
import sys
from pathlib import Path
import numpy as np
import grpc
import torch
import whisperx
from concurrent import futures
sys.path.insert(0, str(Path(__file__).parents[1]))
sys.path.insert(0, str(Path(__file__).parents[1] / "gateway"))
from gateway import inference_pb2, inference_pb2_grpc

class AlignmentServicer:
    def __init__(self):
        self.device = os.getenv("ALIGNMENT_DEVICE", "cuda" if torch.cuda.is_available() else "cpu")
        self.language = os.getenv("ALIGNMENT_LANGUAGE", "ar")
        self.model = None
        self.metadata = None

    def _load_model(self):
        if self.model is None:
            self.model, self.metadata = whisperx.load_align_model(
                language_code=self.language,
                device=self.device,
            )

    def AlignWord(self, request, context):
        if not request.transcript.strip() or not request.audio.pcm_data:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "Transcript must not be empty")
        if request.audio.sample_rate <= 0:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "Audio sample rate must be positive")
        try:
            self._load_model()
            audio = np.frombuffer(request.audio.pcm_data, dtype=np.float32)
            duration = len(audio) / request.audio.sample_rate
            segments = [{"text": request.transcript, "start": 0.0, "end": duration}]
            aligned = whisperx.align(
                segments,
                self.model,
                self.metadata,
                audio,
                self.device,
                return_char_alignments=False,
            )
        except Exception as error:
            context.abort(grpc.StatusCode.INTERNAL, f"Alignment model failed: {error}")

        response = inference_pb2.AlignWordResponse()
        for word in aligned.get("word_segments", []):
            response.words.add(
                word=word.get("word", "").strip(),
                start=float(word.get("start", 0.0)),
                end=float(word.get("end", 0.0)),
                confidence=float(word.get("score", 0.0)),
            )
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
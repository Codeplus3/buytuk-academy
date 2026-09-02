import os
import sys
from pathlib import Path
import numpy as np
import torch
import whisper
import grpc
from concurrent import futures
sys.path.insert(0, str(Path(__file__).parents[1]))
sys.path.insert(0, str(Path(__file__).parents[1] / "gateway"))
from gateway import inference_pb2, inference_pb2_grpc


class WhisperServicer:
    def __init__(self):
        print("Loading Whisper Model...")
        self.model = whisper.load_model(os.getenv("WHISPER_MODEL", "base"))
        print("Model loaded.")

    def Transcribe(self, request, context):
        if request.audio.sample_rate != 16000 or not request.audio.pcm_data:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "Audio must be non-empty 16kHz float32 PCM")
        audio = np.frombuffer(request.audio.pcm_data, dtype=np.float32)
        result = self.model.transcribe(
            audio,
            language=request.language or None,
            word_timestamps=request.word_timestamps,
            fp16=torch.cuda.is_available(),
        )
        response = inference_pb2.TranscribeResponse(
            text=result.get("text", "").strip(),
            duration=len(audio) / request.audio.sample_rate,
        )
        if request.word_timestamps:
            for segment in result.get("segments", []):
                for word in segment.get("words", []):
                    response.words.add(
                        word=word.get("word", "").strip(),
                        start=float(word.get("start", 0)),
                        end=float(word.get("end", 0)),
                        confidence=float(word.get("probability", 0)),
                    )
        return response

def serve():
    port = os.getenv("WHISPER_PORT", "50051")
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=2))
    inference_pb2_grpc.add_WhisperServiceServicer_to_server(WhisperServicer(), server)
    server.add_insecure_port(f"[::]:{port}")
    server.start()
    print(f"🎤 Whisper Worker started on port {port}")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
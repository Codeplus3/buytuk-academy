import os
import torch
import whisper
import numpy as np

class WhisperService:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model_name = os.getenv("WHISPER_MODEL", "base")
        self.model = None

    def load_model(self):
        print(f"Loading Whisper model: {self.model_name} on {self.device}")
        self.model = whisper.load_model(self.model_name, device=self.device)
        print("Whisper model loaded successfully.")

    def transcribe(self, audio_array: np.ndarray, language: str = "ar"):
        if self.model is None:
            self.load_model()
        
        options = {"language": language, "task": "transcribe"}
        result = self.model.transcribe(audio_array, **options)
        return result
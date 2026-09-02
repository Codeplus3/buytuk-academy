import os
import torch
import whisperx

class WhisperXService:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = None
        self.metadata = None

    def load_model(self):
        print("Loading WhisperX alignment model...")
        self.model, self.metadata = whisperx.load_align_model(
            language_code=os.getenv("ALIGNMENT_LANGUAGE", "ar"),
            device=self.device,
        )

    def align(self, segments, audio_array):
        if self.model is None:
            self.load_model()
        
        return whisperx.align(
            segments,
            self.model,
            self.metadata,
            audio_array,
            self.device,
            return_char_alignments=False,
        )
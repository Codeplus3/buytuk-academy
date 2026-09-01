import os
import torch
# from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

class MMSService:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model_name = os.getenv("MMS_MODEL", "facebook/mms-1b-all")
        self.model = None
        self.processor = None

    def load_model(self):
        print(f"Loading MMS model: {self.model_name}")
        # self.processor = Wav2Vec2Processor.from_pretrained(self.model_name)
        # self.model = Wav2Vec2ForCTC.from_pretrained(self.model_name).to(self.device)
        print("MMS model loaded.")

    def extract_phonemes(self, audio_array):
        if self.model is None:
            self.load_model()
        
        # inputs = self.processor(audio_array, sampling_rate=16000, return_tensors="pt").to(self.device)
        # with torch.no_grad():
        #     logits = self.model(**inputs).logits
        # predicted_ids = torch.argmax(logits, dim=-1)
        # transcription = self.processor.batch_decode(predicted_ids)
        # return transcription
        return [] # Placeholder
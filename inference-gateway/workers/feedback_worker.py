import os
import json
import sys
from pathlib import Path
import grpc
from concurrent import futures
sys.path.insert(0, str(Path(__file__).parents[1]))
sys.path.insert(0, str(Path(__file__).parents[1] / "gateway"))
from gateway import inference_pb2, inference_pb2_grpc

class FeedbackServicer:
    def __init__(self):
        print("Initializing LLM Client...")
        # self.client = OpenAI(...) or google.generativeai.configure(...)
        print("LLM Client ready.")

    def GenerateFeedback(self, request, context):
        try:
            errors = json.loads(request.student_errors_json or "[]")
        except json.JSONDecodeError:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "student_errors_json must be valid JSON")
        count = len(errors) if isinstance(errors, list) else 1
        feedback = f"تم رصد {count} ملاحظة. راجع الأخطاء وجرّب التمرين مرة أخرى."
        return inference_pb2.FeedbackResponse(
            personalized_feedback=feedback,
            recommended_exercise_id="review-reading" if count else "practice-reading",
        )

def serve():
    port = os.getenv("FEEDBACK_PORT", "50054")
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    inference_pb2_grpc.add_FeedbackServiceServicer_to_server(FeedbackServicer(), server)
    server.add_insecure_port(f"[::]:{port}")
    server.start()
    print(f"🤖 Feedback Worker started on port {port}")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
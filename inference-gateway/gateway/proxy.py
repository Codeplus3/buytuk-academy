import os
from pathlib import Path

import grpc

from gateway import inference_pb2_grpc
from gateway.circuit_breaker import CircuitBreaker


class WorkerProxy:
    def __init__(self, target_env: str):
        self.target = os.getenv(target_env, "")
        self.breaker = CircuitBreaker()
        ca_file = os.getenv("INFERENCE_WORKER_CA_CERT")
        if self.target and ca_file:
            credentials = grpc.ssl_channel_credentials(root_certificates=Path(ca_file).read_bytes())
            self.channel = grpc.secure_channel(self.target, credentials)
        else:
            self.channel = grpc.insecure_channel(self.target) if self.target else None

    def forward(self, method, request, context):
        if method is None:
            context.abort(grpc.StatusCode.UNAVAILABLE, "Inference worker is not configured")
        if not self.target or self.channel is None:
            context.abort(grpc.StatusCode.UNAVAILABLE, "Inference worker is not configured")
        if not self.breaker.can_execute():
            context.abort(grpc.StatusCode.UNAVAILABLE, "Inference worker circuit is open")

        try:
            response = method(request, timeout=float(os.getenv("INFERENCE_WORKER_TIMEOUT", "30")))
            self.breaker.record_success()
            return response
        except grpc.RpcError as error:
            self.breaker.record_failure()
            context.abort(error.code(), error.details() or "Inference worker request failed")


class WhisperProxy(inference_pb2_grpc.WhisperServiceServicer):
    def __init__(self):
        self.worker = WorkerProxy("WHISPER_WORKER")
        self.stub = inference_pb2_grpc.WhisperServiceStub(self.worker.channel) if self.worker.channel else None

    def Transcribe(self, request, context):
        return self.worker.forward(self.stub.Transcribe if self.stub else None, request, context)


class AlignmentProxy(inference_pb2_grpc.AlignmentServiceServicer):
    def __init__(self):
        self.worker = WorkerProxy("ALIGNMENT_WORKER")
        self.stub = inference_pb2_grpc.AlignmentServiceStub(self.worker.channel) if self.worker.channel else None

    def AlignWord(self, request, context):
        return self.worker.forward(self.stub.AlignWord if self.stub else None, request, context)


class G2PProxy(inference_pb2_grpc.G2PServiceServicer):
    def __init__(self):
        self.worker = WorkerProxy("G2P_WORKER")
        self.stub = inference_pb2_grpc.G2PServiceStub(self.worker.channel) if self.worker.channel else None

    def Convert(self, request, context):
        return self.worker.forward(self.stub.Convert if self.stub else None, request, context)


class FeedbackProxy(inference_pb2_grpc.FeedbackServiceServicer):
    def __init__(self):
        self.worker = WorkerProxy("FEEDBACK_WORKER")
        self.stub = inference_pb2_grpc.FeedbackServiceStub(self.worker.channel) if self.worker.channel else None

    def GenerateFeedback(self, request, context):
        return self.worker.forward(self.stub.GenerateFeedback if self.stub else None, request, context)
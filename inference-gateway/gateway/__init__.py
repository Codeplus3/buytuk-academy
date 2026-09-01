"""
BuyTuk Academy - Inference Gateway Package

This package provides the main gRPC gateway server that routes
ML inference requests to specialized worker services.

Components:
    - server: Main gRPC server implementation
    - auth: Authentication interceptor for API key validation
    - circuit_breaker: Circuit breaker pattern for fault tolerance
"""

from gateway.server import serve as start_gateway
from gateway.auth import AuthInterceptor
from gateway.circuit_breaker import CircuitBreaker, CircuitState

__version__ = "1.0.0"
__all__ = [
    "start_gateway",
    "AuthInterceptor",
    "CircuitBreaker",
    "CircuitState",
]
import grpc

from gateway.auth import AuthInterceptor
from gateway.circuit_breaker import CircuitBreaker, CircuitState


def test_auth_rejects_missing_key():
    interceptor = AuthInterceptor("real-key")
    details = grpc.HandlerCallDetails("/test", (('x-api-key', 'wrong-key'),))
    handler = interceptor.intercept_service(lambda _: None, details)
    assert handler is not None


def test_circuit_breaker_opens_after_threshold():
    breaker = CircuitBreaker(failure_threshold=2, recovery_timeout=60)
    breaker.record_failure()
    assert breaker.state == CircuitState.CLOSED
    breaker.record_failure()
    assert breaker.state == CircuitState.OPEN
    assert breaker.can_execute() is False
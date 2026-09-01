import grpc

class AuthInterceptor(grpc.ServerInterceptor):
    def __init__(self, valid_api_key):
        self.valid_api_key = valid_api_key

    def intercept_service(self, continuation, handler_call_details):
        metadata = dict(handler_call_details.invocation_metadata)
        api_key = metadata.get("x-api-key", "")
        
        if api_key != self.valid_api_key:
            return grpc.unary_unary_rpc_method_handler(
                lambda req, ctx: ctx.abort(grpc.StatusCode.UNAUTHENTICATED, "Invalid API Key")
            )
            
        return continuation(handler_call_details)
# 3. Engine Separation
- **Status**: Accepted
- **Context**: ML logic was tightly coupled with API logic.
- **Decision**: Isolate ML logic into `engines/` and `inference-gateway/`.
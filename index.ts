/**
 * ─────────────────────────────────────────────────────────────────────────────
 * OfflineMediaEngine — Concrete Implementations Barrel
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Import from here to get the real (non-abstract) implementations.
 * The Worker file imports sub-modules directly to avoid bundling the bridge.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Worker Bridges
export { ConcreteWorkerBridge, getWorkerBridge } from "./worker-bridge";

// Engine & Performance
export { BenchmarkEngine }      from "./benchmark-engine";
export { GpuBridge }            from "./gpu";
export { OfflineMediaEngine }   from "../offline-media-engine";

// Type Definitions
export type { 
    BenchmarkResult, 
    GpuCapabilities, 
    GpuComputeResult, 
    GpuBenchmarkComparison 
} from "./types";

export type { 
    MediaEngineCapabilities, 
    BookMetadata, 
    TutorMessage, 
    VectorSearchResult 
} from "../offline-media-engine";
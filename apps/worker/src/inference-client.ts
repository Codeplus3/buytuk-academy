import { credentials, Metadata, type Client } from "@grpc/grpc-js";
import { loadPackageDefinition } from "@grpc/grpc-js";
import { load } from "@grpc/proto-loader";
import { readFile } from "node:fs/promises";
import path from "node:path";

interface InferenceResponse {
  text?: string;
  duration?: number;
  words?: Array<{ word?: string; start?: number; end?: number; confidence?: number }>;
  personalized_feedback?: string;
  recommended_exercise_id?: string;
}

type InferenceClient = Client & Record<string, (request: unknown, metadata: Metadata, options: unknown, callback: (error: Error | null, response: InferenceResponse) => void) => void>;

let clientPromise: Promise<InferenceClient> | null = null;

async function createClient(): Promise<InferenceClient> {
  const protoPath = process.env.INFERENCE_PROTO_PATH || path.resolve(process.cwd(), "inference-gateway/proto/inference.proto");
  await readFile(protoPath);
  const definition = await load(protoPath, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
  const loaded = loadPackageDefinition(definition) as unknown as {
    buytuk: { inference: { WhisperService: new (address: string, channelCredentials: ReturnType<typeof credentials.createInsecure>): InferenceClient } };
  };
  const target = process.env.INFERENCE_GATEWAY_URL || "localhost:50050";
  return new loaded.buytuk.inference.WhisperService(target, credentials.createInsecure());
}

function getClient(): Promise<InferenceClient> {
  clientPromise ??= createClient();
  return clientPromise;
}

async function transcribe(audio: Buffer, sampleRate: number, language = "ar"): Promise<InferenceResponse> {
  const client = await getClient();
  const metadata = new Metadata();
  const apiKey = process.env.INFERENCE_API_KEY;
  if (!apiKey) throw new Error("INFERENCE_API_KEY must be configured for worker inference");
  metadata.set("x-api-key", apiKey);

  return new Promise((resolve, reject) => {
    client.Transcribe(
      { audio: { pcm_data: audio, sample_rate: sampleRate }, language, word_timestamps: true },
      metadata,
      { deadline: Date.now() + Number(process.env.INFERENCE_WORKER_TIMEOUT_MS || 30000) },
      (error, response) => error ? reject(error) : resolve(response),
    );
  });
}

export async function transcribeAudio(audio: Buffer, sampleRate: number, language?: string): Promise<InferenceResponse> {
  return transcribe(audio, sampleRate, language);
}

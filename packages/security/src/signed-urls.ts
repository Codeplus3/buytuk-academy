// =============================================================================
// BuyTuk Academy - S3 Signed URLs Service
// =============================================================================

import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const BUCKET = process.env.S3_BUCKET || "buytuk-academy";
const AUDIO_BUCKET = process.env.S3_AUDIO_BUCKET || BUCKET;
const PRESIGNED_EXPIRES = parseInt(
  process.env.S3_PRESIGNED_EXPIRES || "3600",
  10
);

const s3 = new AWS.S3({
  region: process.env.AWS_REGION || "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export interface UploadUrlRequest {
  studentId: number;
  attemptId: number;
  contentType?: string;
  expiresInSeconds?: number;
}

export interface UploadUrlResponse {
  url: string;
  key: string;
  expiresAt: Date;
}

/**
 * Generate presigned URL for audio upload
 */
export async function generateUploadUrl(
  params: UploadUrlRequest
): Promise<UploadUrlResponse> {
  const {
    studentId,
    attemptId,
    contentType = "audio/webm",
    expiresInSeconds = PRESIGNED_EXPIRES,
  } = params;

  const timestamp = Date.now();
  const random = uuidv4().slice(0, 8);
  const key = `audio/${studentId}/${attemptId}/${timestamp}-${random}.webm`;

  const url = await s3.getSignedUrlPromise("putObject", {
    Bucket: AUDIO_BUCKET,
    Key: key,
    ContentType: contentType,
    Expires: expiresInSeconds,
    ServerSideEncryption: "aws:kms",
    Metadata: {
      studentId: studentId.toString(),
      attemptId: attemptId.toString(),
    },
  });

  return {
    url,
    key,
    expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
  };
}

/**
 * Generate presigned URL for audio download
 */
export async function generateDownloadUrl(
  key: string,
  expiresInSeconds: number = PRESIGNED_EXPIRES
): Promise<string> {
  if (!validateS3Key(key)) {
    throw new Error("Invalid S3 key format");
  }

  return s3.getSignedUrlPromise("getObject", {
    Bucket: AUDIO_BUCKET,
    Key: key,
    Expires: expiresInSeconds,
    ResponseContentDisposition: "attachment",
  });
}

/**
 * Generate presigned URL for report PDF
 */
export async function generateReportUrl(
  reportId: number,
  expiresInSeconds: number = PRESIGNED_EXPIRES
): Promise<string> {
  const key = `reports/${reportId}.pdf`;

  return s3.getSignedUrlPromise("getObject", {
    Bucket: BUCKET,
    Key: key,
    Expires: expiresInSeconds,
    ResponseContentType: "application/pdf",
  });
}

/**
 * Validate S3 key format (prevent path traversal)
 */
export function validateS3Key(key: string): boolean {
  if (key.includes("..") || key.includes("//")) {
    return false;
  }

  const allowedPrefixes = ["audio/", "reports/", "exports/", "avatars/"];
  return allowedPrefixes.some((prefix) => key.startsWith(prefix));
}

/**
 * Delete file from S3
 */
export async function deleteFromS3(key: string): Promise<void> {
  if (!validateS3Key(key)) {
    throw new Error("Invalid S3 key format");
  }

  await s3
    .deleteObject({
      Bucket: BUCKET,
      Key: key,
    })
    .promise();
}

/**
 * Check if file exists in S3
 */
export async function fileExists(key: string): Promise<boolean> {
  try {
    await s3
      .headObject({
        Bucket: BUCKET,
        Key: key,
      })
      .promise();
    return true;
  } catch (error: any) {
    if (error.code === "NotFound" || error.statusCode === 404) {
      return false;
    }
    throw error;
  }
}
// =============================================================================
// BuyTuk Academy - Error Codes
// =============================================================================

export enum ErrorCode {
  // Authentication
  AUTH_INVALID_CREDENTIALS = "AUTH_INVALID_CREDENTIALS",
  AUTH_TOKEN_EXPIRED = "AUTH_TOKEN_EXPIRED",
  AUTH_TOKEN_INVALID = "AUTH_TOKEN_INVALID",
  AUTH_UNAUTHORIZED = "AUTH_UNAUTHORIZED",
  AUTH_FORBIDDEN = "AUTH_FORBIDDEN",

  // Validation
  VALIDATION_FAILED = "VALIDATION_FAILED",
  VALIDATION_INVALID_INPUT = "VALIDATION_INVALID_INPUT",
  VALIDATION_REQUIRED_FIELD = "VALIDATION_REQUIRED_FIELD",

  // Resource
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  RESOURCE_ALREADY_EXISTS = "RESOURCE_ALREADY_EXISTS",
  RESOURCE_CONFLICT = "RESOURCE_CONFLICT",

  // Database
  DB_CONNECTION_FAILED = "DB_CONNECTION_FAILED",
  DB_QUERY_FAILED = "DB_QUERY_FAILED",
  DB_TRANSACTION_FAILED = "DB_TRANSACTION_FAILED",

  // Pipeline
  PIPELINE_AUDIO_TOO_LONG = "PIPELINE_AUDIO_TOO_LONG",
  PIPELINE_AUDIO_TOO_SHORT = "PIPELINE_AUDIO_TOO_SHORT",
  PIPELINE_STT_FAILED = "PIPELINE_STT_FAILED",
  PIPELINE_ALIGNMENT_FAILED = "PIPELINE_ALIGNMENT_FAILED",
  PIPELINE_G2P_FAILED = "PIPELINE_G2P_FAILED",
  PIPELINE_TIMEOUT = "PIPELINE_TIMEOUT",

  // Queue
  QUEUE_JOB_FAILED = "QUEUE_JOB_FAILED",
  QUEUE_JOB_TIMEOUT = "QUEUE_JOB_TIMEOUT",
  QUEUE_DLQ_REACHED = "QUEUE_DLQ_REACHED",

  // Inference
  INFERENCE_UNAVAILABLE = "INFERENCE_UNAVAILABLE",
  INFERENCE_TIMEOUT = "INFERENCE_TIMEOUT",
  INFERENCE_INVALID_RESPONSE = "INFERENCE_INVALID_RESPONSE",

  // Storage
  STORAGE_UPLOAD_FAILED = "STORAGE_UPLOAD_FAILED",
  STORAGE_DOWNLOAD_FAILED = "STORAGE_DOWNLOAD_FAILED",
  STORAGE_ENCRYPTION_FAILED = "STORAGE_ENCRYPTION_FAILED",

  // General
  INTERNAL_ERROR = "INTERNAL_ERROR",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: Record<string, any>;
  correlationId?: string;
}

export function createAppError(
  code: ErrorCode,
  message: string,
  details?: Record<string, any>,
  correlationId?: string
): AppError {
  return { code, message, details, correlationId };
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: "بيانات الدخول غير صحيحة",
  [ErrorCode.AUTH_TOKEN_EXPIRED]: "انتهت صلاحية الجلسة",
  [ErrorCode.AUTH_TOKEN_INVALID]: "الجلسة غير صالحة",
  [ErrorCode.AUTH_UNAUTHORIZED]: "غير مصرح بالوصول",
  [ErrorCode.AUTH_FORBIDDEN]: "ليس لديك صلاحية للوصول",
  [ErrorCode.VALIDATION_FAILED]: "فشل التحقق من البيانات",
  [ErrorCode.VALIDATION_INVALID_INPUT]: "بيانات إدخال غير صالحة",
  [ErrorCode.VALIDATION_REQUIRED_FIELD]: "حقل مطلوب مفقود",
  [ErrorCode.RESOURCE_NOT_FOUND]: "المورد غير موجود",
  [ErrorCode.RESOURCE_ALREADY_EXISTS]: "المورد موجود مسبقاً",
  [ErrorCode.RESOURCE_CONFLICT]: "تعارض في المورد",
  [ErrorCode.DB_CONNECTION_FAILED]: "فشل الاتصال بقاعدة البيانات",
  [ErrorCode.DB_QUERY_FAILED]: "فشل استعلام قاعدة البيانات",
  [ErrorCode.DB_TRANSACTION_FAILED]: "فشل معاملة قاعدة البيانات",
  [ErrorCode.PIPELINE_AUDIO_TOO_LONG]: "الصوت طويل جداً",
  [ErrorCode.PIPELINE_AUDIO_TOO_SHORT]: "الصوت قصير جداً",
  [ErrorCode.PIPELINE_STT_FAILED]: "فشل تحويل الصوت إلى نص",
  [ErrorCode.PIPELINE_ALIGNMENT_FAILED]: "فشل محاذاة النص",
  [ErrorCode.PIPELINE_G2P_FAILED]: "فشل تحويل الحروف إلى أصوات",
  [ErrorCode.PIPELINE_TIMEOUT]: "انتهت مهلة المعالجة",
  [ErrorCode.QUEUE_JOB_FAILED]: "فشل معالجة المهمة",
  [ErrorCode.QUEUE_JOB_TIMEOUT]: "انتهت مهلة المهمة",
  [ErrorCode.QUEUE_DLQ_REACHED]: "تم نقل المهمة إلى قائمة الانتظار الميتة",
  [ErrorCode.INFERENCE_UNAVAILABLE]: "خدمة الاستدلال غير متاحة",
  [ErrorCode.INFERENCE_TIMEOUT]: "انتهت مهلة خدمة الاستدلال",
  [ErrorCode.INFERENCE_INVALID_RESPONSE]: "استجابة غير صالحة من خدمة الاستدلال",
  [ErrorCode.STORAGE_UPLOAD_FAILED]: "فشل رفع الملف",
  [ErrorCode.STORAGE_DOWNLOAD_FAILED]: "فشل تحميل الملف",
  [ErrorCode.STORAGE_ENCRYPTION_FAILED]: "فشل تشفير الملف",
  [ErrorCode.INTERNAL_ERROR]: "خطأ داخلي في الخادم",
  [ErrorCode.RATE_LIMIT_EXCEEDED]: "تم تجاوز حد الطلبات",
  [ErrorCode.SERVICE_UNAVAILABLE]: "الخدمة غير متاحة حالياً",
};
// =============================================================================
// BuyTuk Academy - Row Level Security (RLS) Helpers
// =============================================================================

import { eq, and } from "drizzle-orm";
import { getDb } from "@buytuk/database";
import * as schema from "@buytuk/database/schema";

/**
 * Check if teacher has access to student
 */
export async function canTeacherAccessStudent(
  teacherId: number,
  studentId: number
): Promise<boolean> {
  const db = getDb();

  const result = await db
    .select()
    .from(schema.classStudents)
    .innerJoin(schema.classes, eq(schema.classStudents.classId, schema.classes.id))
    .where(
      and(
        eq(schema.classStudents.studentId, studentId),
        eq(schema.classes.teacherId, teacherId)
      )
    )
    .limit(1);

  return result.length > 0;
}

/**
 * Get student IDs accessible by teacher
 */
export async function getAccessibleStudents(
  teacherId: number
): Promise<number[]> {
  const db = getDb();

  const result = await db
    .select({ studentId: schema.classStudents.studentId })
    .from(schema.classStudents)
    .innerJoin(schema.classes, eq(schema.classStudents.classId, schema.classes.id))
    .where(eq(schema.classes.teacherId, teacherId));

  return result.map((r) => r.studentId);
}

/**
 * Check if user can access attempt
 */
export async function canAccessAttempt(
  userId: number,
  userRole: string,
  attemptId: number
): Promise<boolean> {
  const db = getDb();

  const [attempt] = await db
    .select()
    .from(schema.attempts)
    .where(eq(schema.attempts.id, attemptId))
    .limit(1);

  if (!attempt) {
    return false;
  }

  // Admin can access everything
  if (userRole === "admin") {
    return true;
  }

  // Student can access own attempts
  if (userRole === "student") {
    return attempt.studentId === userId;
  }

  // Teacher can access attempts from their students
  if (userRole === "teacher") {
    const [teacher] = await db
      .select()
      .from(schema.teachers)
      .where(eq(schema.teachers.userId, userId))
      .limit(1);

    if (!teacher) {
      return false;
    }

    return canTeacherAccessStudent(teacher.id, attempt.studentId);
  }

  return false;
}

/**
 * Check if user can access report
 */
export async function canAccessReport(
  userId: number,
  userRole: string,
  reportId: number
): Promise<boolean> {
  const db = getDb();

  const [report] = await db
    .select()
    .from(schema.reports)
    .where(eq(schema.reports.id, reportId))
    .limit(1);

  if (!report) {
    return false;
  }

  return canAccessAttempt(userId, userRole, report.attemptId);
}

/**
 * Check if user can access passage/content
 */
export async function canAccessContent(
  userId: number,
  userRole: string,
  contentId: number
): Promise<boolean> {
  const db = getDb();

  const [content] = await db
    .select()
    .from(schema.content)
    .where(eq(schema.content.id, contentId))
    .limit(1);

  if (!content) {
    return false;
  }

  // Admin can access everything
  if (userRole === "admin") {
    return true;
  }

  // Anyone can read published content
  if (content.status === "published") {
    return true;
  }

  // Creator can access their own content
  if (content.createdBy === userId) {
    return true;
  }

  return false;
}

/**
 * RLS Middleware factory for Express
 */
export function rlsMiddleware(
  getResourceId: (req: any) => number,
  resourceType: "attempt" | "report" | "content"
) {
  return async (req: any, res: any, next: any) => {
    const resourceId = getResourceId(req);
    const userId = req.userId;
    const userRole = req.userRole;

    let hasAccess = false;

    switch (resourceType) {
      case "attempt":
        hasAccess = await canAccessAttempt(userId, userRole, resourceId);
        break;
      case "report":
        hasAccess = await canAccessReport(userId, userRole, resourceId);
        break;
      case "content":
        hasAccess = await canAccessContent(userId, userRole, resourceId);
        break;
    }

    if (!hasAccess) {
      return res.status(403).json({
        error: "Access denied",
        code: "RLS_VIOLATION",
      });
    }

    next();
  };
}
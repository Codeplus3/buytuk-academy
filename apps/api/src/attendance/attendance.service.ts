import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import {
  attendanceRecords,
  classes,
  getDb,
  users,
} from '@buytuk/database';

export interface MarkAttendanceInput {
  classId: number;
  date: string;
  records: Array<{ studentId: number; status: string; notes?: string }>;
}

@Injectable()
export class AttendanceService {
  constructor(@Inject('DRIZZLE_DB') private readonly db: ReturnType<typeof getDb>) {}

  async listForUser(userId: number) {
    const [user] = await this.db.select({ role: users.role }).from(users).where(eq(users.id, userId));
    if (!user) throw new ForbiddenException('User not found');

    const baseQuery = this.db
      .select({
        id: attendanceRecords.id,
        studentId: attendanceRecords.studentId,
        studentName: users.username,
        className: classes.name,
        date: attendanceRecords.date,
        status: attendanceRecords.status,
        markedBy: attendanceRecords.markedBy,
        note: attendanceRecords.notes,
      })
      .from(attendanceRecords)
      .leftJoin(users, eq(users.id, attendanceRecords.studentId))
      .leftJoin(classes, eq(classes.id, attendanceRecords.classId));

    const rows = user.role === 'admin'
      ? await baseQuery
      : user.role === 'student'
        ? await baseQuery.where(eq(attendanceRecords.studentId, userId))
        : await baseQuery.where(eq(attendanceRecords.markedBy, userId));

    return rows.map((row) => ({
      ...row,
      className: row.className ?? '',
      studentName: row.studentName ?? '',
      date: row.date.toISOString().slice(0, 10),
    }));
  }

  async markForUser(userId: number, input: MarkAttendanceInput) {
    const [user] = await this.db.select({ role: users.role }).from(users).where(eq(users.id, userId));
    if (!user || !['admin', 'teacher'].includes(user.role)) {
      throw new ForbiddenException('Only teachers and admins can mark attendance');
    }

    const date = new Date(`${input.date}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime()) || !input.records.length) {
      throw new Error('A valid date and at least one attendance record are required');
    }

    await this.db.transaction(async (transaction) => {
      for (const record of input.records) {
        await transaction
          .insert(attendanceRecords)
          .values({
            classId: input.classId,
            date,
            studentId: record.studentId,
            status: record.status,
            notes: record.notes,
            markedBy: userId,
          })
          .onConflictDoUpdate({
            target: [attendanceRecords.studentId, attendanceRecords.classId, attendanceRecords.date],
            set: { status: record.status, notes: record.notes, markedBy: userId },
          });
      }
    });

    return this.listForUser(userId);
  }
}

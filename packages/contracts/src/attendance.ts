// =============================================================================
// BuyTuk Academy - Attendance Contracts
// =============================================================================

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceRecord {
  id: number;
  studentId: number;
  classId: number;
  date: Date;
  status: AttendanceStatus;
  checkInTime?: Date | null;
  checkOutTime?: Date | null;
  notes?: string | null;
  markedBy: number;
  createdAt: Date;
}

export interface DailyAttendance {
  date: Date;
  classId: number;
  records: Array<{
    studentId: number;
    studentName?: string | null;
    status: AttendanceStatus;
    checkInTime?: Date | null;
  }>;
  summary: {
    present: number;
    absent: number;
    late: number;
    excused: number;
  };
}

export interface MarkAttendanceRequest {
  classId: number;
  date: Date;
  records: Array<{
    studentId: number;
    status: AttendanceStatus;
    checkInTime?: Date;
    notes?: string;
  }>;
}

export interface AttendanceStats {
  studentId: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendanceRate: number;
}
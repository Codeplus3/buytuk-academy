import { demoAttendance, type AttendanceRecord, type AttendanceStatus } from "../app/attendance/types";

interface ApiAttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  className: string;
  date: string;
  status: AttendanceStatus;
  markedBy: number;
  note?: string | null;
}

function attendanceUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  return baseUrl ? `${baseUrl.replace(/\/$/, "")}/attendance` : "/api/attendance";
}

function getAccessToken(): string | null {
  return typeof window === "undefined" ? null : window.localStorage.getItem("buytuk_access_token");
}

function mapApiRecord(record: ApiAttendanceRecord): AttendanceRecord {
  return {
    id: record.id,
    studentId: record.studentId,
    studentName: record.studentName,
    className: record.className,
    subject: record.className,
    date: record.date,
    status: record.status,
    markedBy: String(record.markedBy),
    note: record.note ?? undefined,
  };
}

export async function loadAttendance(): Promise<{ records: AttendanceRecord[]; persistent: boolean }> {
  const accessToken = getAccessToken();
  if (!accessToken) return { records: demoAttendance, persistent: false };

  const response = await fetch(attendanceUrl(), {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Attendance request failed with HTTP ${response.status}`);
  const records = await response.json() as ApiAttendanceRecord[];
  return { records: records.map(mapApiRecord), persistent: true };
}

export async function saveAttendance(records: AttendanceRecord[]): Promise<void> {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("A signed-in user is required");

  const grouped = new Map<string, AttendanceRecord[]>();
  for (const record of records) {
    const group = grouped.get(record.date) ?? [];
    group.push(record);
    grouped.set(record.date, group);
  }

  for (const [date, dailyRecords] of grouped) {
    const response = await fetch(attendanceUrl(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        classId: Number(process.env.NEXT_PUBLIC_DEFAULT_CLASS_ID || 1),
        date,
        records: dailyRecords.map((record) => ({
          studentId: record.studentId,
          status: record.status,
          notes: record.note,
        })),
      }),
    });
    if (!response.ok) throw new Error(`Attendance save failed with HTTP ${response.status}`);
  }
}

import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  type Firestore,
  where,
} from "firebase/firestore";
import { ensureFirebaseAuth } from "./firebase";
import { demoAttendance, type AttendanceRecord } from "../app/attendance/types";

const ATTENDANCE_COLLECTION = "attendanceRecords";

function recordId(record: Pick<AttendanceRecord, "id" | "date" | "subject" | "studentId">): string {
  return String(record.id || `${record.date}_${record.subject}_${record.studentId}`)
    .replaceAll("/", "-");
}

function mapRecord(data: Record<string, unknown>, fallbackId: string): AttendanceRecord | null {
  if (typeof data.studentId !== "number" || typeof data.studentName !== "string" ||
      typeof data.subject !== "string" || typeof data.date !== "string" ||
      typeof data.status !== "string") return null;

  return {
    id: typeof data.id === "number" ? data.id : fallbackId,
    studentId: data.studentId,
    studentName: data.studentName,
    className: typeof data.className === "string" ? data.className : "",
    subject: data.subject,
    date: data.date,
    status: data.status as AttendanceRecord["status"],
    markedBy: typeof data.markedBy === "string" ? data.markedBy : "",
    note: typeof data.note === "string" ? data.note : undefined,
  };
}

export async function loadAttendance(): Promise<{ records: AttendanceRecord[]; persistent: boolean }> {
  const session = await ensureFirebaseAuth();
  if (!session) return { records: demoAttendance, persistent: false };

  const snapshot = await getDocs(query(
    collection(session.db, ATTENDANCE_COLLECTION),
    where("ownerUid", "==", session.user.uid),
  ));
  const records = snapshot.docs
    .map((item) => mapRecord(item.data(), item.id))
    .filter((record): record is AttendanceRecord => record !== null)
    .sort((left, right) => right.date.localeCompare(left.date));
  return { records, persistent: true };
}

export async function saveAttendance(records: AttendanceRecord[]): Promise<void> {
  const session = await ensureFirebaseAuth();
  if (!session) throw new Error("A signed-in Firebase user is required");
  await Promise.all(records.map((record) => saveRecord(session.db, record, session.user.uid)));
}

async function saveRecord(db: Firestore, record: AttendanceRecord, ownerUid: string): Promise<void> {
  await setDoc(doc(db, ATTENDANCE_COLLECTION, recordId(record)), {
    ...record,
    ownerUid,
    markedByUid: ownerUid,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}
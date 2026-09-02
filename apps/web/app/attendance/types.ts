export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceRecord {
  id: number | string;
  studentId: number;
  studentName: string;
  className: string;
  subject: string;
  date: string;
  status: AttendanceStatus;
  markedBy: string;
  note?: string;
}

export const statusLabels: Record<AttendanceStatus, string> = {
  present: "حاضر",
  absent: "غائب",
  late: "متأخر",
  excused: "معذور",
};

export const statusStyles: Record<AttendanceStatus, string> = {
  present: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  absent: "bg-rose-50 text-rose-700 ring-rose-200",
  late: "bg-amber-50 text-amber-700 ring-amber-200",
  excused: "bg-sky-50 text-sky-700 ring-sky-200",
};

export const demoAttendance: AttendanceRecord[] = [
  { id: 1, studentId: 101, studentName: "سارة أحمد", className: "الصف السادس / أ", subject: "اللغة العربية", date: "2026-09-01", status: "present", markedBy: "أ. محمد علي" },
  { id: 2, studentId: 102, studentName: "عمر خالد", className: "الصف السادس / أ", subject: "اللغة العربية", date: "2026-09-01", status: "late", markedBy: "أ. محمد علي", note: "وصل بعد بداية الحصة" },
  { id: 3, studentId: 103, studentName: "ليان يوسف", className: "الصف السادس / أ", subject: "اللغة العربية", date: "2026-09-01", status: "absent", markedBy: "أ. محمد علي" },
  { id: 4, studentId: 101, studentName: "سارة أحمد", className: "الصف السادس / أ", subject: "الرياضيات", date: "2026-08-31", status: "present", markedBy: "أ. نورة سالم" },
  { id: 5, studentId: 102, studentName: "عمر خالد", className: "الصف السادس / أ", subject: "الرياضيات", date: "2026-08-31", status: "present", markedBy: "أ. نورة سالم" },
  { id: 6, studentId: 103, studentName: "ليان يوسف", className: "الصف السادس / أ", subject: "الرياضيات", date: "2026-08-31", status: "excused", markedBy: "أ. نورة سالم", note: "موعد طبي" },
  { id: 7, studentId: 104, studentName: "فيصل حسن", className: "الصف السابع / ب", subject: "العلوم", date: "2026-09-01", status: "present", markedBy: "أ. خالد عمر" },
  { id: 8, studentId: 105, studentName: "نور علي", className: "الصف السابع / ب", subject: "العلوم", date: "2026-09-01", status: "absent", markedBy: "أ. خالد عمر" },
];

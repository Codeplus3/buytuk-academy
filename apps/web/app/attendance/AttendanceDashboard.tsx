"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, Clock3, FileText, Save, Users, XCircle } from "lucide-react";
import { loadAttendance, saveAttendance as saveAttendanceToApi } from "../../lib/attendance-store";
import {
  demoAttendance,
  statusLabels,
  statusStyles,
  type AttendanceRecord,
  type AttendanceStatus,
} from "./types";

type Role = "student" | "teacher" | "admin";

const students = [
  { id: 101, name: "سارة أحمد" },
  { id: 102, name: "عمر خالد" },
  { id: 103, name: "ليان يوسف" },
];

const subjects = ["اللغة العربية", "الرياضيات", "العلوم"];

function useAttendanceRecords() {
  const [records, setRecords] = useState<AttendanceRecord[]>(demoAttendance);
  const [persistent, setPersistent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance()
      .then((result) => { setRecords(result.records); setPersistent(result.persistent); })
      .catch(() => { setRecords(demoAttendance); setPersistent(false); })
      .finally(() => setLoading(false));
  }, []);

  return { records, setRecords, persistent, loading };
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusStyles[status]}`}>{statusLabels[status]}</span>;
}

function StatCard({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof Users; tone: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`rounded-xl p-3 ${tone}`}><Icon size={20} /></div>
      <div><div className="text-2xl font-extrabold text-slate-900">{value}</div><div className="text-sm text-slate-500">{label}</div></div>
    </div>
  );
}

function RecordsTable({ records }: { records: AttendanceRecord[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-right text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500"><tr>
            <th className="px-5 py-4 font-bold">الطالب</th><th className="px-5 py-4 font-bold">الفصل</th><th className="px-5 py-4 font-bold">المادة</th><th className="px-5 py-4 font-bold">التاريخ</th><th className="px-5 py-4 font-bold">الحالة</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => <tr key={record.id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-800">{record.studentName}</td><td className="whitespace-nowrap px-5 py-4 text-slate-500">{record.className}</td><td className="whitespace-nowrap px-5 py-4 text-slate-600">{record.subject}</td><td className="whitespace-nowrap px-5 py-4 text-slate-500">{record.date}</td><td className="px-5 py-4"><StatusBadge status={record.status} /></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      {records.length === 0 && <div className="p-10 text-center text-sm text-slate-500">لا توجد سجلات مطابقة.</div>}
    </div>
  );
}

function TeacherView() {
  const [date, setDate] = useState("2026-09-02");
  const [subject, setSubject] = useState(subjects[0]);
  const [statuses, setStatuses] = useState<Record<number, AttendanceStatus>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { records, setRecords, persistent } = useAttendanceRecords();

  const setAll = (status: AttendanceStatus) => setStatuses(Object.fromEntries(students.map((student) => [student.id, status])));
  const save = async () => {
    if (!persistent) { setSaved(false); return; }
    setSaving(true);
    const newRecords: AttendanceRecord[] = students.map((student) => ({
      id: `${date}_${subject}_${student.id}`,
      studentId: student.id,
      studentName: student.name,
      className: "الصف السادس / أ",
      subject,
      date,
      status: statuses[student.id] ?? "present",
      markedBy: "المعلم الحالي",
    }));
    const remaining = records.filter((record) => !newRecords.some((item) => item.id === record.id));
    try {
      await saveAttendanceToApi(newRecords);
      setRecords([...remaining, ...newRecords]);
      setSaved(true);
    } catch {
      setSaved(false);
    } finally {
      setSaving(false);
    }
  };

  return <>
    <Header role="teacher" title="تسجيل حضور الطلاب" description="سجل حضور فصلِك وتابع السجل اليومي من مكان واحد." />
    <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.3fr_0.7fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-extrabold text-slate-900">حضور اليوم</h2><p className="mt-1 text-sm text-slate-500">الصف السادس / أ</p></div><CalendarCheck className="text-sky-600" /></div>
        <div className="mb-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">المادة<select value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-sky-500">{subjects.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-sm font-bold text-slate-700">التاريخ<input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-sky-500" /></label></div>
        <div className="mb-4 flex flex-wrap gap-2"><span className="self-center text-xs font-bold text-slate-500">تعيين الكل:</span>{(["present", "absent", "late", "excused"] as AttendanceStatus[]).map((status) => <button key={status} onClick={() => setAll(status)} className={`rounded-lg px-3 py-2 text-xs font-bold ring-1 ${statusStyles[status]}`}>{statusLabels[status]}</button>)}</div>
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">{students.map((student) => <div key={student.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><span className="font-bold text-slate-800">{student.name}</span><select value={statuses[student.id] ?? "present"} onChange={(event) => setStatuses((current) => ({ ...current, [student.id]: event.target.value as AttendanceStatus }))} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500">{(Object.keys(statusLabels) as AttendanceStatus[]).map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></div>)}</div>
        <button onClick={() => void save()} disabled={saving || !persistent} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"><Save size={18} />{!persistent ? "سجّل الدخول للحفظ" : saving ? "جارٍ الحفظ..." : saved ? "تم حفظ الحضور" : `حفظ حضور ${students.length} طلاب`}</button>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm"><Users className="mb-6 text-sky-300" /><h2 className="text-lg font-extrabold">ملخص الحصة</h2><p className="mt-2 text-sm text-slate-300">{subject} · {date}</p><div className="mt-8 space-y-4">{(["present", "absent", "late"] as AttendanceStatus[]).map((status) => <div key={status} className="flex items-center justify-between border-b border-slate-700 pb-3 text-sm"><span className="text-slate-300">{statusLabels[status]}</span><strong>{students.filter((student) => (statuses[student.id] ?? "present") === status).length}</strong></div>)}</div></section>
    </div>
  </>;
}

function StudentView() {
  const { records: allRecords, loading } = useAttendanceRecords();
  const records = allRecords.filter((record) => record.studentId === 101);
  const present = records.filter((record) => record.status === "present").length;
  const rate = records.length === 0 ? 0 : Math.round((present / records.length) * 100);
  return <><Header role="student" title="سجل حضوري" description="تابع حضورك وغيابك في المواد الدراسية." /><div className="mx-auto max-w-6xl space-y-5">{loading ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">جارٍ تحميل السجل...</div> : <><div className="grid gap-4 sm:grid-cols-3"><StatCard label="نسبة الحضور" value={`${rate}%`} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-600" /><StatCard label="أيام الحضور" value={String(present)} icon={CalendarCheck} tone="bg-sky-50 text-sky-600" /><StatCard label="أيام الغياب" value={String(records.filter((record) => record.status === "absent").length)} icon={XCircle} tone="bg-rose-50 text-rose-600" /></div><RecordsTable records={records} /></>}</div></>;
}

function AdminView() {
  const [subject, setSubject] = useState("الكل");
  const { records: allRecords, loading } = useAttendanceRecords();
  const records = useMemo(() => subject === "الكل" ? allRecords : allRecords.filter((record) => record.subject === subject), [allRecords, subject]);
  const present = records.filter((record) => record.status === "present").length;
  const rate = records.length === 0 ? 0 : Math.round((present / records.length) * 100);
  return <><Header role="admin" title="لوحة الحضور المدرسية" description="نظرة عامة على حضور الطلاب مع أدوات التصفية والمتابعة." /><div className="mx-auto max-w-6xl space-y-5">{loading ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">جارٍ تحميل السجل...</div> : <><div className="grid gap-4 sm:grid-cols-3"><StatCard label="نسبة الحضور العامة" value={`${rate}%`} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-600" /><StatCard label="إجمالي السجلات" value={String(records.length)} icon={FileText} tone="bg-sky-50 text-sky-600" /><StatCard label="حالات الغياب" value={String(records.filter((record) => record.status === "absent").length)} icon={Clock3} tone="bg-amber-50 text-amber-600" /></div><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-extrabold text-slate-900">آخر سجلات الحضور</h2><select value={subject} onChange={(event) => setSubject(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-sky-500"><option>الكل</option>{subjects.map((item) => <option key={item}>{item}</option>)}</select></div><RecordsTable records={records} /></>}</div></>;
}

function Header({ role, title, description }: { role: Role; title: string; description: string }) {
  const labels = { student: "بوابة الطالب", teacher: "بوابة المعلم", admin: "بوابة الإدارة" };
  return <header className="mx-auto mb-8 max-w-6xl"><div className="mb-5 flex items-center justify-between"><span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-extrabold text-sky-700">{labels[role]}</span><a href="/" className="text-sm font-bold text-slate-500 hover:text-sky-600">العودة للرئيسية</a></div><h1 className="text-3xl font-extrabold tracking-tight text-slate-950">{title}</h1><p className="mt-2 text-slate-500">{description}</p></header>;
}

export function AttendanceDashboard({ role }: { role: Role }) {
  return <main className="min-h-screen bg-slate-50 px-4 py-8 font-arabic sm:px-6">{role === "teacher" ? <TeacherView /> : role === "admin" ? <AdminView /> : <StudentView />}</main>;
}

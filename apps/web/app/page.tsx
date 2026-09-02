// =============================================================================
// BuyTuk Academy - Home Page (Landing / Redirect)
// =============================================================================

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">
        مرحباً بك في أكاديمية بوتك
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-2xl">
        منصة تعليمية متكاملة تستخدم أحدث تقنيات الذكاء الاصطناعي لتقييم القراءة وتحسين مهارات الطلاب.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          تسجيل الدخول
        </Link>
        <Link 
          href="/register"
          className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
        >
          إنشاء حساب جديد
        </Link>
      </div>

      <nav className="mt-10 grid gap-3 text-sm sm:grid-cols-3" aria-label="بوابات الحضور">
        <Link href="/attendance/student" className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 shadow-sm transition hover:border-sky-400 hover:text-sky-700">
          بوابة حضور الطالب
        </Link>
        <Link href="/attendance/teacher" className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 shadow-sm transition hover:border-sky-400 hover:text-sky-700">
          بوابة تسجيل المعلم
        </Link>
        <Link href="/attendance/admin" className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 shadow-sm transition hover:border-sky-400 hover:text-sky-700">
          لوحة حضور الإدارة
        </Link>
      </nav>
    </main>
  );
}
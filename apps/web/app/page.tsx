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
    </main>
  );
}
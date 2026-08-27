import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: string, className?: string }) {
  let colorClass = "bg-gray-100 text-gray-800 border-gray-200";
  let label = status;

  switch (status.toLowerCase()) {
    case 'active':
    case 'published':
    case 'completed':
    case 'delivered':
      colorClass = "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      label = status === 'active' ? 'نشط' : status === 'published' ? 'منشور' : status === 'completed' ? 'مكتمل' : 'تم التوصيل';
      break;
    case 'suspended':
    case 'failed':
    case 'cancelled':
      colorClass = "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      label = status === 'suspended' ? 'موقوف' : status === 'failed' ? 'فشل' : 'ملغى';
      break;
    case 'trial':
    case 'pending':
    case 'draft':
      colorClass = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
      label = status === 'trial' ? 'تجريبي' : status === 'pending' ? 'قيد الانتظار' : 'مسودة';
      break;
    case 'expired':
    case 'archived':
      colorClass = "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
      label = status === 'expired' ? 'منتهي' : 'مؤرشف';
      break;
    case 'graded':
      colorClass = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      label = 'مصحح';
      break;
    case 'reviewed':
      colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
      label = 'تمت المراجعة';
      break;
    case 'submitted':
      colorClass = "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800";
      label = 'مُقدم';
      break;
    case 'sent':
      colorClass = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      label = 'مُرسل';
      break;
  }

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", colorClass, className)}>
      {label}
    </span>
  );
}

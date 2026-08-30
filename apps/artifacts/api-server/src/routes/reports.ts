import { Router } from "express";

const router = Router();

router.get("/reports/overview", (_req, res) => {
  res.json({
    period: "يوليو 2025",
    enrollmentTotal: 4840,
    enrollmentGrowth: 12.4,
    assessmentCompletionRate: 78.3,
    interventionSuccessRate: 86.1,
    evidencePendingReview: 3,
    topTenantsByActivity: [
      { label: "إدارة تعليم الرياض", value: 340, color: "#3B82F6" },
      { label: "وزارة التعليم - مكة", value: 280, color: "#10B981" },
      { label: "مجموعة مدارس جدة", value: 120, color: "#F59E0B" },
      { label: "مدارس الطائف الدولية", value: 88, color: "#8B5CF6" },
      { label: "مركز المدينة للتعلم", value: 34, color: "#EF4444" },
    ],
    monthlyTrend: [
      { label: "يناير", value: 62, color: "#3B82F6" },
      { label: "فبراير", value: 71, color: "#3B82F6" },
      { label: "مارس", value: 80, color: "#3B82F6" },
      { label: "أبريل", value: 74, color: "#3B82F6" },
      { label: "مايو", value: 83, color: "#3B82F6" },
      { label: "يونيو", value: 88, color: "#3B82F6" },
      { label: "يوليو", value: 78, color: "#3B82F6" },
    ],
  });
});

router.get("/reports/interventions", (_req, res) => {
  res.json({
    total: 54,
    active: 18,
    completed: 31,
    cancelled: 5,
    successRate: 86.1,
    avgDurationDays: 42,
    byType: [
      { label: "أكاديمي", value: 22, color: "#3B82F6" },
      { label: "سلوكي", value: 14, color: "#F59E0B" },
      { label: "اجتماعي انفعالي", value: 10, color: "#10B981" },
      { label: "نطق ولغة", value: 6, color: "#8B5CF6" },
      { label: "حركي", value: 2, color: "#EF4444" },
    ],
    trend: [
      { label: "يناير", value: 6, color: "#3B82F6" },
      { label: "فبراير", value: 9, color: "#3B82F6" },
      { label: "مارس", value: 8, color: "#3B82F6" },
      { label: "أبريل", value: 11, color: "#3B82F6" },
      { label: "مايو", value: 8, color: "#3B82F6" },
      { label: "يونيو", value: 7, color: "#3B82F6" },
      { label: "يوليو", value: 5, color: "#3B82F6" },
    ],
  });
});

router.get("/reports/assessments", (_req, res) => {
  res.json({
    total: 100,
    published: 72,
    avgScore: 69.4,
    completionRate: 78.3,
    byType: [
      { label: "قراءة", value: 38, color: "#3B82F6" },
      { label: "كتابة", value: 24, color: "#10B981" },
      { label: "إملاء", value: 19, color: "#F59E0B" },
      { label: "رياضيات", value: 12, color: "#EF4444" },
      { label: "شامل", value: 7, color: "#8B5CF6" },
    ],
    scoreDistribution: [
      { label: "0-20", value: 4, color: "#EF4444" },
      { label: "21-40", value: 11, color: "#F97316" },
      { label: "41-60", value: 28, color: "#F59E0B" },
      { label: "61-80", value: 38, color: "#84CC16" },
      { label: "81-100", value: 19, color: "#10B981" },
    ],
  });
});

export default router;

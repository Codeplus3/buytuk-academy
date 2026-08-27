import { Router } from "express";
import { tenants, schools, users, assessments, interventions, evidence, notifications } from "../data/mock";

const router = Router();

router.get("/dashboard/summary", (_req, res) => {
  const totalStudents = users.filter((u) => u.role === "student").length;
  const totalTeachers = users.filter((u) => u.role === "teacher").length;
  const pendingEvidenceReviews = evidence.filter((e) => e.requiresHumanReview && !e.reviewedBy).length;
  const today = new Date().toDateString();
  const notificationsSentToday = notifications.filter(
    (n) => n.sentAt && new Date(n.sentAt).toDateString() === today
  ).length;

  res.json({
    totalTenants: tenants.length,
    activeTenants: tenants.filter((t) => t.status === "active").length,
    totalSchools: schools.length,
    totalUsers: users.length,
    totalStudents,
    totalTeachers,
    totalAssessments: assessments.length,
    activeInterventions: interventions.filter((i) => i.status === "active").length,
    pendingEvidenceReviews,
    notificationsSentToday,
    systemHealthScore: 94.7,
    enrollmentGrowthPercent: 12.4,
  });
});

router.get("/dashboard/activity", (_req, res) => {
  res.json([
    { id: "act1", type: "user_created", description: "New teacher added", descriptionAr: "تم إضافة معلم جديد", entityId: "u3", entityType: "user", actorName: "نورة القحطاني", tenantName: "إدارة تعليم الرياض", createdAt: "2025-07-17T06:30:00.000Z" },
    { id: "act2", type: "assessment_published", description: "Assessment published", descriptionAr: "تم نشر تقييم جديد", entityId: "a1", entityType: "assessment", actorName: "محمد الغامدي", tenantName: "إدارة تعليم الرياض", createdAt: "2025-07-16T14:00:00.000Z" },
    { id: "act3", type: "intervention_started", description: "Intervention started for student", descriptionAr: "بدء برنامج تدخل لطالب", entityId: "int2", entityType: "intervention", actorName: "فاطمة الحربي", tenantName: "إدارة تعليم الرياض", createdAt: "2025-07-16T09:00:00.000Z" },
    { id: "act4", type: "evidence_uploaded", description: "Evidence uploaded and pending review", descriptionAr: "تم رفع دليل بانتظار المراجعة", entityId: "ev3", entityType: "evidence", actorName: "محمد الغامدي", tenantName: "إدارة تعليم الرياض", createdAt: "2025-07-15T11:00:00.000Z" },
    { id: "act5", type: "tenant_created", description: "New tenant onboarded", descriptionAr: "تم إضافة مستأجر جديد", entityId: "t4", entityType: "tenant", actorName: "عبدالله العتيبي", tenantName: "النظام", createdAt: "2025-07-14T08:00:00.000Z" },
    { id: "act6", type: "notification_sent", description: "Weekly report sent", descriptionAr: "تم إرسال التقرير الأسبوعي", entityId: "n1", entityType: "notification", actorName: "النظام", tenantName: "إدارة تعليم الرياض", createdAt: "2025-07-14T08:00:00.000Z" },
    { id: "act7", type: "school_created", description: "New school registered", descriptionAr: "تم تسجيل مدرسة جديدة", entityId: "s6", entityType: "school", actorName: "عبدالله العتيبي", tenantName: "مركز المدينة للتعلم", createdAt: "2025-07-13T10:00:00.000Z" },
    { id: "act8", type: "intervention_started", description: "Social-emotional intervention started", descriptionAr: "بدء تدخل اجتماعي انفعالي", entityId: "int4", entityType: "intervention", actorName: "سارة المالكي", tenantName: "مجموعة مدارس جدة الأهلية", createdAt: "2025-07-12T09:00:00.000Z" },
  ]);
});

router.get("/dashboard/charts", (_req, res) => {
  res.json({
    enrollmentOverTime: [
      { label: "يناير", value: 3200, color: "#3B82F6" },
      { label: "فبراير", value: 3580, color: "#3B82F6" },
      { label: "مارس", value: 3940, color: "#3B82F6" },
      { label: "أبريل", value: 4100, color: "#3B82F6" },
      { label: "مايو", value: 4420, color: "#3B82F6" },
      { label: "يونيو", value: 4680, color: "#3B82F6" },
      { label: "يوليو", value: 4840, color: "#3B82F6" },
    ],
    assessmentsByType: [
      { label: "قراءة", labelAr: "قراءة", value: 38, color: "#10B981" },
      { label: "كتابة", labelAr: "كتابة", value: 24, color: "#6366F1" },
      { label: "إملاء", labelAr: "إملاء", value: 19, color: "#F59E0B" },
      { label: "رياضيات", labelAr: "رياضيات", value: 12, color: "#EF4444" },
      { label: "شامل", labelAr: "شامل", value: 7, color: "#8B5CF6" },
    ],
    interventionsByStatus: [
      { label: "نشط", labelAr: "نشط", value: 18, color: "#10B981" },
      { label: "مكتمل", labelAr: "مكتمل", value: 31, color: "#6366F1" },
      { label: "ملغى", labelAr: "ملغى", value: 5, color: "#EF4444" },
    ],
    evidenceByType: [
      { label: "قراءة", labelAr: "قراءة", value: 42, color: "#3B82F6" },
      { label: "كتابة", labelAr: "كتابة", value: 28, color: "#10B981" },
      { label: "إملاء", labelAr: "إملاء", value: 16, color: "#F59E0B" },
      { label: "ملاحظة", labelAr: "ملاحظة", value: 9, color: "#8B5CF6" },
      { label: "تقييم", labelAr: "تقييم", value: 5, color: "#EF4444" },
    ],
  });
});

export default router;

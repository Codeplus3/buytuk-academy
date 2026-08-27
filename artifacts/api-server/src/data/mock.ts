import { randomUUID } from "crypto";

// ─── Tenants ─────────────────────────────────────────────────
export const tenants = [
  { id: "t1", nameEn: "Riyadh Education District", nameAr: "إدارة تعليم الرياض", status: "active", type: "school_district", contactEmail: "admin@riyadh-edu.sa", contactPhone: "+966112345678", schoolCount: 12, userCount: 340, studentCount: 4800, subscriptionPlan: "enterprise", subscriptionExpiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2024-01-15T08:00:00.000Z", updatedAt: "2025-06-01T10:00:00.000Z" },
  { id: "t2", nameEn: "Jeddah Private Schools Group", nameAr: "مجموعة مدارس جدة الأهلية", status: "active", type: "private_school", contactEmail: "info@jeddah-schools.sa", contactPhone: "+966122345678", schoolCount: 5, userCount: 120, studentCount: 1800, subscriptionPlan: "professional", subscriptionExpiresAt: "2026-06-30T00:00:00.000Z", createdAt: "2024-03-10T08:00:00.000Z", updatedAt: "2025-05-15T10:00:00.000Z" },
  { id: "t3", nameEn: "Ministry of Education - Makkah", nameAr: "وزارة التعليم - منطقة مكة المكرمة", status: "active", type: "government", contactEmail: "makkah@moe.gov.sa", contactPhone: "+966125001234", schoolCount: 28, userCount: 820, studentCount: 12500, subscriptionPlan: "enterprise", subscriptionExpiresAt: "2027-01-31T00:00:00.000Z", createdAt: "2023-09-01T08:00:00.000Z", updatedAt: "2025-04-20T10:00:00.000Z" },
  { id: "t4", nameEn: "Al Madinah Learning Center", nameAr: "مركز المدينة للتعلم", status: "trial", type: "ngo", contactEmail: "contact@madinah-lc.org", contactPhone: "+966148001234", schoolCount: 2, userCount: 34, studentCount: 310, subscriptionPlan: "starter", subscriptionExpiresAt: "2025-09-30T00:00:00.000Z", createdAt: "2025-06-01T08:00:00.000Z", updatedAt: "2025-07-01T10:00:00.000Z" },
  { id: "t5", nameEn: "Eastern Province Education", nameAr: "تعليم المنطقة الشرقية", status: "suspended", type: "government", contactEmail: "ep@moe.gov.sa", contactPhone: "+966138001234", schoolCount: 18, userCount: 490, studentCount: 7200, subscriptionPlan: "professional", subscriptionExpiresAt: "2025-03-31T00:00:00.000Z", createdAt: "2023-11-01T08:00:00.000Z", updatedAt: "2025-07-10T10:00:00.000Z" },
  { id: "t6", nameEn: "Taif International Schools", nameAr: "مدارس الطائف الدولية", status: "active", type: "private_school", contactEmail: "admin@taif-intl.sa", contactPhone: "+966127001234", schoolCount: 3, userCount: 88, studentCount: 950, subscriptionPlan: "professional", subscriptionExpiresAt: "2026-08-31T00:00:00.000Z", createdAt: "2024-05-15T08:00:00.000Z", updatedAt: "2025-06-10T10:00:00.000Z" },
];

// ─── Schools ─────────────────────────────────────────────────
export const schools = [
  { id: "s1", nameEn: "Al Faisaliah Primary School", nameAr: "مدرسة الفيصلية الابتدائية", tenantId: "t1", tenantName: "إدارة تعليم الرياض", status: "active", city: "الرياض", region: "منطقة الرياض", principalName: "أحمد بن سعد القحطاني", teacherCount: 24, studentCount: 420, phone: "+966114001234", createdAt: "2024-01-20T08:00:00.000Z", updatedAt: "2025-06-01T10:00:00.000Z" },
  { id: "s2", nameEn: "King Abdulaziz Model School", nameAr: "مدرسة الملك عبدالعزيز النموذجية", tenantId: "t1", tenantName: "إدارة تعليم الرياض", status: "active", city: "الرياض", region: "منطقة الرياض", principalName: "خالد عبدالله الشمري", teacherCount: 31, studentCount: 610, phone: "+966114002234", createdAt: "2024-01-20T08:00:00.000Z", updatedAt: "2025-05-15T10:00:00.000Z" },
  { id: "s3", nameEn: "Al Rawdah Elementary School", nameAr: "مدرسة الروضة الابتدائية", tenantId: "t2", tenantName: "مجموعة مدارس جدة الأهلية", status: "active", city: "جدة", region: "منطقة مكة المكرمة", principalName: "محمد إبراهيم الغامدي", teacherCount: 18, studentCount: 380, phone: "+966122001234", createdAt: "2024-03-15T08:00:00.000Z", updatedAt: "2025-06-01T10:00:00.000Z" },
  { id: "s4", nameEn: "Al Andalus International School", nameAr: "مدرسة الأندلس الدولية", tenantId: "t2", tenantName: "مجموعة مدارس جدة الأهلية", status: "active", city: "جدة", region: "منطقة مكة المكرمة", principalName: "سارة أحمد المالكي", teacherCount: 22, studentCount: 480, phone: "+966122002234", createdAt: "2024-03-15T08:00:00.000Z", updatedAt: "2025-05-10T10:00:00.000Z" },
  { id: "s5", nameEn: "Makkah Al Mukarramah School", nameAr: "مدرسة مكة المكرمة", tenantId: "t3", tenantName: "وزارة التعليم - منطقة مكة المكرمة", status: "active", city: "مكة المكرمة", region: "منطقة مكة المكرمة", principalName: "فاطمة علي الحربي", teacherCount: 40, studentCount: 890, phone: "+966125001234", createdAt: "2023-09-05T08:00:00.000Z", updatedAt: "2025-06-01T10:00:00.000Z" },
  { id: "s6", nameEn: "Al Madinah Learning Center School", nameAr: "مدرسة مركز المدينة للتعلم", tenantId: "t4", tenantName: "مركز المدينة للتعلم", status: "active", city: "المدينة المنورة", region: "منطقة المدينة المنورة", principalName: "يوسف عمر الأنصاري", teacherCount: 12, studentCount: 180, phone: "+966148001234", createdAt: "2025-06-05T08:00:00.000Z", updatedAt: "2025-07-01T10:00:00.000Z" },
];

// ─── Users ─────────────────────────────────────────────────
export const users = [
  { id: "u1", nameEn: "Abdullah Al-Otaibi", nameAr: "عبدالله العتيبي", email: "abdullah@buytuk.sa", role: "super_admin", status: "active", tenantId: "t1", tenantName: "إدارة تعليم الرياض", schoolId: null, schoolName: null, phone: "+966501234567", avatarUrl: null, lastLoginAt: "2025-07-17T06:30:00.000Z", createdAt: "2024-01-10T08:00:00.000Z", updatedAt: "2025-07-17T06:30:00.000Z" },
  { id: "u2", nameEn: "Nora Al-Qahtani", nameAr: "نورة القحطاني", email: "nora@riyadh-edu.sa", role: "tenant_admin", status: "active", tenantId: "t1", tenantName: "إدارة تعليم الرياض", schoolId: null, schoolName: null, phone: "+966502345678", avatarUrl: null, lastLoginAt: "2025-07-16T09:15:00.000Z", createdAt: "2024-01-20T08:00:00.000Z", updatedAt: "2025-06-01T10:00:00.000Z" },
  { id: "u3", nameEn: "Mohammed Al-Ghamdi", nameAr: "محمد الغامدي", email: "m.ghamdi@alfaisaliah.sa", role: "teacher", status: "active", tenantId: "t1", tenantName: "إدارة تعليم الرياض", schoolId: "s1", schoolName: "مدرسة الفيصلية الابتدائية", phone: "+966503456789", avatarUrl: null, lastLoginAt: "2025-07-15T07:45:00.000Z", createdAt: "2024-02-01T08:00:00.000Z", updatedAt: "2025-05-15T10:00:00.000Z" },
  { id: "u4", nameEn: "Fatima Al-Harbi", nameAr: "فاطمة الحربي", email: "f.harbi@alfaisaliah.sa", role: "teacher", status: "active", tenantId: "t1", tenantName: "إدارة تعليم الرياض", schoolId: "s1", schoolName: "مدرسة الفيصلية الابتدائية", phone: "+966504567890", avatarUrl: null, lastLoginAt: "2025-07-14T08:00:00.000Z", createdAt: "2024-02-05T08:00:00.000Z", updatedAt: "2025-04-20T10:00:00.000Z" },
  { id: "u5", nameEn: "Omar Al-Shammari", nameAr: "عمر الشمري", email: "omar@jeddah-schools.sa", role: "tenant_admin", status: "active", tenantId: "t2", tenantName: "مجموعة مدارس جدة الأهلية", schoolId: null, schoolName: null, phone: "+966505678901", avatarUrl: null, lastLoginAt: "2025-07-13T10:30:00.000Z", createdAt: "2024-03-10T08:00:00.000Z", updatedAt: "2025-05-01T10:00:00.000Z" },
  { id: "u6", nameEn: "Sara Al-Malki", nameAr: "سارة المالكي", email: "sara@andalus.sa", role: "school_admin", status: "active", tenantId: "t2", tenantName: "مجموعة مدارس جدة الأهلية", schoolId: "s4", schoolName: "مدرسة الأندلس الدولية", phone: "+966506789012", avatarUrl: null, lastLoginAt: "2025-07-12T09:00:00.000Z", createdAt: "2024-03-15T08:00:00.000Z", updatedAt: "2025-04-01T10:00:00.000Z" },
  { id: "u7", nameEn: "Ahmed Al-Zahrani", nameAr: "أحمد الزهراني", email: "a.zahrani@alfaisaliah.sa", role: "student", status: "active", tenantId: "t1", tenantName: "إدارة تعليم الرياض", schoolId: "s1", schoolName: "مدرسة الفيصلية الابتدائية", phone: null, avatarUrl: null, lastLoginAt: null, createdAt: "2024-09-01T08:00:00.000Z", updatedAt: "2024-09-01T08:00:00.000Z" },
  { id: "u8", nameEn: "Layla Al-Dosari", nameAr: "ليلى الدوسري", email: "l.dosari@alfaisaliah.sa", role: "student", status: "active", tenantId: "t1", tenantName: "إدارة تعليم الرياض", schoolId: "s1", schoolName: "مدرسة الفيصلية الابتدائية", phone: null, avatarUrl: null, lastLoginAt: null, createdAt: "2024-09-01T08:00:00.000Z", updatedAt: "2024-09-01T08:00:00.000Z" },
  { id: "u9", nameEn: "Khalid Al-Mutairi", nameAr: "خالد المطيري", email: "khalid@ep-moe.sa", role: "tenant_admin", status: "suspended", tenantId: "t5", tenantName: "تعليم المنطقة الشرقية", schoolId: null, schoolName: null, phone: "+966507890123", avatarUrl: null, lastLoginAt: "2025-03-01T10:00:00.000Z", createdAt: "2023-11-01T08:00:00.000Z", updatedAt: "2025-07-10T10:00:00.000Z" },
  { id: "u10", nameEn: "Hessa Al-Otaibi", nameAr: "حصة العتيبي", email: "hessa@alfaisaliah.sa", role: "guardian", status: "active", tenantId: "t1", tenantName: "إدارة تعليم الرياض", schoolId: "s1", schoolName: "مدرسة الفيصلية الابتدائية", phone: "+966508901234", avatarUrl: null, lastLoginAt: "2025-07-10T08:00:00.000Z", createdAt: "2024-09-01T08:00:00.000Z", updatedAt: "2024-09-01T08:00:00.000Z" },
];

// ─── Roles ─────────────────────────────────────────────────
export const roles = [
  { id: "r1", name: "super_admin", description: "مدير النظام الأعلى — صلاحية كاملة على جميع المستأجرين", tenantId: "t1", permissions: ["*:*"], userCount: 2, createdAt: "2024-01-10T08:00:00.000Z" },
  { id: "r2", name: "tenant_admin", description: "مدير المستأجر — إدارة كاملة داخل نطاق المستأجر", tenantId: "t1", permissions: ["schools:*", "users:*", "assessments:*", "interventions:*", "reports:read"], userCount: 6, createdAt: "2024-01-10T08:00:00.000Z" },
  { id: "r3", name: "school_admin", description: "مدير المدرسة — إدارة المدرسة والمعلمين والطلاب", tenantId: "t1", permissions: ["users:read", "users:create", "assessments:read", "interventions:read", "evidence:read"], userCount: 8, createdAt: "2024-01-10T08:00:00.000Z" },
  { id: "r4", name: "teacher", description: "معلم — إنشاء التقييمات ومتابعة الطلاب", tenantId: "t1", permissions: ["assessments:create", "assessments:read", "submissions:read", "interventions:read", "evidence:create", "evidence:read"], userCount: 42, createdAt: "2024-01-10T08:00:00.000Z" },
  { id: "r5", name: "student", description: "طالب — الوصول لتقييماته الخاصة فقط", tenantId: "t1", permissions: ["assessments:read:own", "submissions:create:own", "submissions:read:own"], userCount: 380, createdAt: "2024-01-10T08:00:00.000Z" },
];

// ─── Policies ─────────────────────────────────────────────────
export const policies = [
  { id: "p1", name: "سياسة المستأجر المعزول", tenantId: "t1", effect: "deny", resource: "tenants", actions: ["read", "update", "delete"], createdAt: "2024-01-10T08:00:00.000Z" },
  { id: "p2", name: "السماح بقراءة التقارير للمشرفين", tenantId: "t1", effect: "allow", resource: "reports", actions: ["read"], createdAt: "2024-01-15T08:00:00.000Z" },
  { id: "p3", name: "حظر حذف الأدلة", tenantId: "t1", effect: "deny", resource: "evidence", actions: ["delete"], createdAt: "2024-02-01T08:00:00.000Z" },
];

// ─── Assessments ─────────────────────────────────────────────
export const assessments = [
  { id: "a1", title: "Reading Fluency Assessment - Grade 3", titleAr: "تقييم طلاقة القراءة - الصف الثالث", type: "reading", status: "published", tenantId: "t1", tenantName: "إدارة تعليم الرياض", gradeLevel: "الصف الثالث", submissionCount: 48, avgScore: 72.4, publishedAt: "2025-03-01T08:00:00.000Z", createdAt: "2025-02-20T08:00:00.000Z", updatedAt: "2025-03-01T08:00:00.000Z" },
  { id: "a2", title: "Arabic Writing Skills - Grade 4", titleAr: "مهارات الكتابة العربية - الصف الرابع", type: "writing", status: "published", tenantId: "t1", tenantName: "إدارة تعليم الرياض", gradeLevel: "الصف الرابع", submissionCount: 36, avgScore: 65.8, publishedAt: "2025-03-15T08:00:00.000Z", createdAt: "2025-03-01T08:00:00.000Z", updatedAt: "2025-03-15T08:00:00.000Z" },
  { id: "a3", title: "Dictation Test - Grade 2", titleAr: "اختبار الإملاء - الصف الثاني", type: "dictation", status: "published", tenantId: "t2", tenantName: "مجموعة مدارس جدة الأهلية", gradeLevel: "الصف الثاني", submissionCount: 22, avgScore: 58.3, publishedAt: "2025-04-01T08:00:00.000Z", createdAt: "2025-03-20T08:00:00.000Z", updatedAt: "2025-04-01T08:00:00.000Z" },
  { id: "a4", title: "Math Fundamentals - Grade 3", titleAr: "أساسيات الرياضيات - الصف الثالث", type: "math", status: "draft", tenantId: "t1", tenantName: "إدارة تعليم الرياض", gradeLevel: "الصف الثالث", submissionCount: 0, avgScore: null, publishedAt: null, createdAt: "2025-06-15T08:00:00.000Z", updatedAt: "2025-07-01T08:00:00.000Z" },
  { id: "a5", title: "Comprehensive Learning Assessment", titleAr: "التقييم الشامل للتعلم", type: "comprehensive", status: "published", tenantId: "t3", tenantName: "وزارة التعليم - منطقة مكة المكرمة", gradeLevel: "الصف الخامس", submissionCount: 104, avgScore: 69.1, publishedAt: "2025-02-01T08:00:00.000Z", createdAt: "2025-01-15T08:00:00.000Z", updatedAt: "2025-02-01T08:00:00.000Z" },
  { id: "a6", title: "Reading Comprehension - Grade 5", titleAr: "الفهم القرائي - الصف الخامس", type: "reading", status: "archived", tenantId: "t1", tenantName: "إدارة تعليم الرياض", gradeLevel: "الصف الخامس", submissionCount: 62, avgScore: 71.0, publishedAt: "2024-10-01T08:00:00.000Z", createdAt: "2024-09-15T08:00:00.000Z", updatedAt: "2025-01-01T08:00:00.000Z" },
];

// ─── Submissions ─────────────────────────────────────────────
export const submissions = [
  { id: "sub1", assessmentId: "a1", assessmentTitle: "تقييم طلاقة القراءة - الصف الثالث", studentId: "u7", studentName: "أحمد الزهراني", status: "graded", score: 68, maxScore: 100, requiresHumanReview: true, submittedAt: "2025-03-05T09:00:00.000Z", gradedAt: "2025-03-06T11:00:00.000Z", createdAt: "2025-03-05T08:00:00.000Z" },
  { id: "sub2", assessmentId: "a1", assessmentTitle: "تقييم طلاقة القراءة - الصف الثالث", studentId: "u8", studentName: "ليلى الدوسري", status: "reviewed", score: 82, maxScore: 100, requiresHumanReview: true, submittedAt: "2025-03-05T10:00:00.000Z", gradedAt: "2025-03-07T09:00:00.000Z", createdAt: "2025-03-05T09:30:00.000Z" },
  { id: "sub3", assessmentId: "a2", assessmentTitle: "مهارات الكتابة العربية - الصف الرابع", studentId: "u7", studentName: "أحمد الزهراني", status: "submitted", score: null, maxScore: 100, requiresHumanReview: true, submittedAt: "2025-03-18T08:30:00.000Z", gradedAt: null, createdAt: "2025-03-18T08:00:00.000Z" },
  { id: "sub4", assessmentId: "a3", assessmentTitle: "اختبار الإملاء - الصف الثاني", studentId: "u8", studentName: "ليلى الدوسري", status: "pending", score: null, maxScore: 100, requiresHumanReview: true, submittedAt: null, gradedAt: null, createdAt: "2025-04-02T08:00:00.000Z" },
  { id: "sub5", assessmentId: "a5", assessmentTitle: "التقييم الشامل للتعلم", studentId: "u7", studentName: "أحمد الزهراني", status: "graded", score: 55, maxScore: 100, requiresHumanReview: true, submittedAt: "2025-02-10T09:00:00.000Z", gradedAt: "2025-02-12T10:00:00.000Z", createdAt: "2025-02-10T08:00:00.000Z" },
];

// ─── Interventions ─────────────────────────────────────────
export const interventions = [
  { id: "int1", studentId: "u7", studentName: "أحمد الزهراني", type: "academic", status: "active", tenantId: "t1", tenantName: "إدارة تعليم الرياض", assignedTeacherId: "u3", assignedTeacherName: "محمد الغامدي", iipStatus: "in_progress", startedAt: "2025-03-10T08:00:00.000Z", completedAt: null, createdAt: "2025-03-09T08:00:00.000Z", updatedAt: "2025-06-01T08:00:00.000Z" },
  { id: "int2", studentId: "u8", studentName: "ليلى الدوسري", type: "speech_language", status: "active", tenantId: "t1", tenantName: "إدارة تعليم الرياض", assignedTeacherId: "u4", assignedTeacherName: "فاطمة الحربي", iipStatus: "in_progress", startedAt: "2025-04-01T08:00:00.000Z", completedAt: null, createdAt: "2025-03-30T08:00:00.000Z", updatedAt: "2025-06-15T08:00:00.000Z" },
  { id: "int3", studentId: "u7", studentName: "أحمد الزهراني", type: "behavioral", status: "completed", tenantId: "t1", tenantName: "إدارة تعليم الرياض", assignedTeacherId: "u3", assignedTeacherName: "محمد الغامدي", iipStatus: "completed", startedAt: "2024-10-01T08:00:00.000Z", completedAt: "2025-02-28T08:00:00.000Z", createdAt: "2024-09-30T08:00:00.000Z", updatedAt: "2025-02-28T08:00:00.000Z" },
  { id: "int4", studentId: "u8", studentName: "ليلى الدوسري", type: "social_emotional", status: "active", tenantId: "t2", tenantName: "مجموعة مدارس جدة الأهلية", assignedTeacherId: "u6", assignedTeacherName: "سارة المالكي", iipStatus: "not_started", startedAt: "2025-07-01T08:00:00.000Z", completedAt: null, createdAt: "2025-06-30T08:00:00.000Z", updatedAt: "2025-07-01T08:00:00.000Z" },
  { id: "int5", studentId: "u7", studentName: "أحمد الزهراني", type: "motor", status: "cancelled", tenantId: "t3", tenantName: "وزارة التعليم - منطقة مكة المكرمة", assignedTeacherId: null, assignedTeacherName: null, iipStatus: "not_started", startedAt: null, completedAt: null, createdAt: "2025-05-01T08:00:00.000Z", updatedAt: "2025-05-10T08:00:00.000Z" },
];

// ─── Referrals ─────────────────────────────────────────────
export const referrals = [
  { id: "ref1", studentId: "u7", studentName: "أحمد الزهراني", referredBy: "u3", referredByName: "محمد الغامدي", status: "accepted", reason: "صعوبة في القراءة والكتابة — يحتاج تقييماً متخصصاً", createdAt: "2025-03-05T08:00:00.000Z" },
  { id: "ref2", studentId: "u8", studentName: "ليلى الدوسري", referredBy: "u4", referredByName: "فاطمة الحربي", status: "pending", reason: "صعوبات في النطق والتعبير اللغوي", createdAt: "2025-07-01T08:00:00.000Z" },
  { id: "ref3", studentId: "u7", studentName: "أحمد الزهراني", referredBy: "u3", referredByName: "محمد الغامدي", status: "closed", reason: "اضطراب فرط الحركة وتشتت الانتباه", createdAt: "2024-09-15T08:00:00.000Z" },
];

// ─── Evidence ─────────────────────────────────────────────
export const evidence = [
  { id: "ev1", studentId: "u7", studentName: "أحمد الزهراني", type: "reading", tenantId: "t1", tenantName: "إدارة تعليم الرياض", fileUrl: "/uploads/ev1.mp3", fileSizeBytes: 2400000, requiresHumanReview: true, reviewedBy: null, reviewedAt: null, aiAnalysisScore: 42, aiConfidence: 0.88, createdAt: "2025-03-06T09:00:00.000Z" },
  { id: "ev2", studentId: "u8", studentName: "ليلى الدوسري", type: "writing", tenantId: "t1", tenantName: "إدارة تعليم الرياض", fileUrl: "/uploads/ev2.pdf", fileSizeBytes: 850000, requiresHumanReview: true, reviewedBy: "u4", reviewedAt: "2025-03-08T10:00:00.000Z", aiAnalysisScore: 58, aiConfidence: 0.91, createdAt: "2025-03-07T08:00:00.000Z" },
  { id: "ev3", studentId: "u7", studentName: "أحمد الزهراني", type: "dictation", tenantId: "t1", tenantName: "إدارة تعليم الرياض", fileUrl: "/uploads/ev3.mp3", fileSizeBytes: 1800000, requiresHumanReview: true, reviewedBy: null, reviewedAt: null, aiAnalysisScore: 38, aiConfidence: 0.79, createdAt: "2025-04-10T09:00:00.000Z" },
  { id: "ev4", studentId: "u8", studentName: "ليلى الدوسري", type: "observation", tenantId: "t2", tenantName: "مجموعة مدارس جدة الأهلية", fileUrl: "/uploads/ev4.pdf", fileSizeBytes: 420000, requiresHumanReview: false, reviewedBy: "u6", reviewedAt: "2025-05-12T09:00:00.000Z", aiAnalysisScore: 74, aiConfidence: 0.95, createdAt: "2025-05-10T08:00:00.000Z" },
  { id: "ev5", studentId: "u7", studentName: "أحمد الزهراني", type: "assessment", tenantId: "t3", tenantName: "وزارة التعليم - منطقة مكة المكرمة", fileUrl: null, fileSizeBytes: null, requiresHumanReview: true, reviewedBy: null, reviewedAt: null, aiAnalysisScore: 51, aiConfidence: 0.83, createdAt: "2025-06-20T09:00:00.000Z" },
];

// ─── Notifications ─────────────────────────────────────────
export const notifications = [
  { id: "n1", channel: "email", status: "delivered", recipientId: "u2", recipientName: "نورة القحطاني", subject: "تقرير التقييمات الأسبوعية", body: "مرفق تقرير التقييمات للأسبوع الماضي.", tenantId: "t1", sentAt: "2025-07-14T08:00:00.000Z", deliveredAt: "2025-07-14T08:01:00.000Z", createdAt: "2025-07-14T08:00:00.000Z" },
  { id: "n2", channel: "sms", status: "delivered", recipientId: "u10", recipientName: "حصة العتيبي", subject: "تنبيه: جلسة التدخل المبكر", body: "تذكير بموعد جلسة التدخل غداً الساعة 9 صباحاً.", tenantId: "t1", sentAt: "2025-07-15T18:00:00.000Z", deliveredAt: "2025-07-15T18:00:30.000Z", createdAt: "2025-07-15T18:00:00.000Z" },
  { id: "n3", channel: "in_app", status: "sent", recipientId: "u3", recipientName: "محمد الغامدي", subject: "طالب جديد يحتاج مراجعة", body: "يحتاج أحمد الزهراني مراجعة تقرير الأداء.", tenantId: "t1", sentAt: "2025-07-16T09:30:00.000Z", deliveredAt: null, createdAt: "2025-07-16T09:30:00.000Z" },
  { id: "n4", channel: "email", status: "failed", recipientId: "u9", recipientName: "خالد المطيري", subject: "إشعار تجميد الحساب", body: "تم تعليق حسابك مؤقتاً.", tenantId: "t5", sentAt: "2025-07-10T10:00:00.000Z", deliveredAt: null, createdAt: "2025-07-10T10:00:00.000Z" },
  { id: "n5", channel: "push", status: "delivered", recipientId: "u4", recipientName: "فاطمة الحربي", subject: "مراجعة الدليل مطلوبة", body: "يوجد دليل جديد يحتاج مراجعتك (ADR-015).", tenantId: "t1", sentAt: "2025-07-17T07:00:00.000Z", deliveredAt: "2025-07-17T07:00:05.000Z", createdAt: "2025-07-17T07:00:00.000Z" },
];

// ─── Settings ─────────────────────────────────────────────
export let systemSettings = {
  platformNameEn: "BuyTuk Academy",
  platformNameAr: "أكاديمية بيتك",
  defaultLanguage: "ar",
  maintenanceMode: false,
  aiAnalysisEnabled: true,
  maxFileSizeMb: 50,
  allowedFileTypes: ["pdf", "mp3", "mp4", "jpg", "png", "docx"],
  emailProvider: "aws_ses",
  smsProvider: "unifonic",
  supportEmail: "support@buytuk.sa",
  privacyPolicyUrl: "https://buytuk.sa/privacy",
  termsOfServiceUrl: "https://buytuk.sa/terms",
};

// ─── Helpers ─────────────────────────────────────────────
export function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    pagination: { page, limit, total, totalPages },
  };
}

export function filterBy<T extends Record<string, unknown>>(
  items: T[],
  filters: Record<string, string | undefined>
): T[] {
  return items.filter((item) => {
    return Object.entries(filters).every(([key, val]) => {
      if (!val) return true;
      if (key === "search") {
        const q = val.toLowerCase();
        return Object.values(item).some(
          (v) => typeof v === "string" && v.toLowerCase().includes(q)
        );
      }
      return String(item[key]) === val;
    });
  });
}

export function newId() {
  return randomUUID();
}

export function now() {
  return new Date().toISOString();
}

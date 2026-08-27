import { useGetDashboardSummary, useGetDashboardActivity, useGetDashboardCharts } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, GraduationCap, Users, UserCheck, FileText, Activity, AlertCircle, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { StatusBadge } from "@/components/ui/status-badge";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

function SummaryCards() {
  const { data: summary, isLoading } = useGetDashboardSummary();

  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
      </div>
    );
  }

  const cards = [
    { title: "إجمالي المستأجرين", value: summary.totalTenants, sub: `${summary.activeTenants} نشط`, icon: Building2, color: "text-blue-600" },
    { title: "إجمالي المدارس", value: summary.totalSchools, sub: "عبر جميع المستأجرين", icon: GraduationCap, color: "text-indigo-600" },
    { title: "الطلاب المسجلين", value: summary.totalStudents, sub: `نمو ${summary.enrollmentGrowthPercent}%`, icon: Users, color: "text-green-600" },
    { title: "المعلمين النشطين", value: summary.totalTeachers, sub: "في النظام", icon: UserCheck, color: "text-amber-600" },
    { title: "التقييمات المنجزة", value: summary.totalAssessments, sub: "إجمالي التقييمات", icon: FileText, color: "text-purple-600" },
    { title: "التدخلات النشطة", value: summary.activeInterventions, sub: "تحتاج متابعة", icon: Activity, color: "text-rose-600" },
    { title: "أدلة قيد المراجعة", value: summary.pendingEvidenceReviews, sub: "مراجعة بشرية مطلوبة", icon: AlertCircle, color: "text-destructive" },
    { title: "مؤشر صحة النظام", value: `${summary.systemHealthScore}%`, sub: "الحالة العامة", icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <Card key={i} className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChartsSection() {
  const { data: charts, isLoading } = useGetDashboardCharts();
  
  if (isLoading || !charts) return <Skeleton className="h-[400px] w-full rounded-xl mb-8" />;

  const COLORS = ['#059669', '#d97706', '#2563eb', '#7c3aed', '#dc2626'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle>النمو في التسجيل</CardTitle>
          <CardDescription>نمو الطلاب المسجلين عبر الزمن</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.enrollmentOverTime} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={3} dot={{ r: 4, fill: "#059669", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle>توزيع التقييمات</CardTitle>
          <CardDescription>أنواع التقييمات المنجزة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.assessmentsByType} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis dataKey="label" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={100} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActivityFeed() {
  const { data: activities, isLoading } = useGetDashboardActivity();

  if (isLoading || !activities) return <Skeleton className="h-[400px] w-full rounded-xl" />;

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle>أحدث النشاطات</CardTitle>
        <CardDescription>الأنشطة الأخيرة على مستوى المنصة</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex gap-4">
              <div className="mt-1 bg-primary/10 p-2 rounded-full text-primary shrink-0">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{format(new Date(activity.createdAt), 'dd MMMM yyyy, HH:mm', { locale: ar })}</span>
                  <span>•</span>
                  <span>بواسطة: {activity.actorName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">الرئيسية</h1>
        <p className="text-muted-foreground">نظرة عامة على أداء أكاديمية بايتوك.</p>
      </div>
      
      <SummaryCards />
      <ChartsSection />
      <ActivityFeed />
    </div>
  );
}

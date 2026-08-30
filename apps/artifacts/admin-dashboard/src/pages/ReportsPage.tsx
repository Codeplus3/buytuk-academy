import { useGetReportsOverview, useGetInterventionReport, useGetAssessmentReport } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, TrendingUp, Activity, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

export function ReportsPage() {
  const { data: overview, isLoading: ovLoading } = useGetReportsOverview();
  const { data: intReport, isLoading: intLoading } = useGetInterventionReport();
  const { data: asmReport, isLoading: asmLoading } = useGetAssessmentReport();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">التقارير والإحصاءات</h1>
        <p className="text-muted-foreground">تحليل شامل للأداء على مستوى المنصة.</p>
      </div>

      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "إجمالي المسجلين", value: overview.enrollmentTotal.toLocaleString('ar-EG'), icon: TrendingUp, sub: `نمو ${overview.enrollmentGrowth}%`, color: "text-green-600" },
            { label: "نسبة إتمام التقييمات", value: `${overview.assessmentCompletionRate}%`, icon: FileText, sub: "من الجلسات المجدولة", color: "text-blue-600" },
            { label: "نجاح التدخلات", value: `${overview.interventionSuccessRate}%`, icon: Activity, sub: "من إجمالي البرامج", color: "text-indigo-600" },
            { label: "أدلة قيد المراجعة", value: overview.evidencePendingReview, icon: BarChart3, sub: "مراجعة بشرية معلقة", color: "text-amber-600" },
          ].map((s) => (
            <Card key={s.label} className="shadow-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="interventions">التدخلات</TabsTrigger>
          <TabsTrigger value="assessments">التقييمات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {ovLoading ? <Skeleton className="h-[350px] w-full rounded-xl" /> : overview && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm border-border/50">
                <CardHeader>
                  <CardTitle>الاتجاه الشهري</CardTitle>
                  <CardDescription>أداء المنصة خلال الفترة الماضية</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={overview.monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={2.5} dot={{ r: 4, fill: "#059669", stroke: "#fff", strokeWidth: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-border/50">
                <CardHeader>
                  <CardTitle>أكثر المستأجرين نشاطاً</CardTitle>
                  <CardDescription>بناءً على إجمالي الأنشطة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={overview.topTenantsByActivity} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                        <YAxis dataKey="label" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={130} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="interventions" className="space-y-6">
          {intLoading ? <Skeleton className="h-[350px] w-full rounded-xl" /> : intReport && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "إجمالي التدخلات", value: intReport.total },
                    { label: "نشطة حالياً", value: intReport.active },
                    { label: "مكتملة", value: intReport.completed },
                    { label: "متوسط المدة (يوم)", value: intReport.avgDurationDays },
                  ].map((s) => (
                    <Card key={s.label} className="shadow-sm border-border/50">
                      <CardContent className="pt-5">
                        <div className="text-2xl font-bold">{s.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <Card className="shadow-sm border-border/50">
                <CardHeader><CardTitle>توزيع أنواع التدخلات</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={intReport.byType} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={90} label={({ label, value }) => `${label}: ${value}`}>
                          {intReport.byType.map((entry, i) => <Cell key={i} fill={entry.color || "#3B82F6"} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          {asmLoading ? <Skeleton className="h-[350px] w-full rounded-xl" /> : asmReport && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm border-border/50">
                <CardHeader><CardTitle>توزيع الدرجات</CardTitle><CardDescription>توزيع درجات جميع التقييمات</CardDescription></CardHeader>
                <CardContent>
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={asmReport.scoreDistribution}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={36}>
                          {asmReport.scoreDistribution.map((entry, i) => <Cell key={i} fill={entry.color || "#3B82F6"} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-4">
                {[
                  { label: "إجمالي التقييمات", value: asmReport.total },
                  { label: "التقييمات المنشورة", value: asmReport.published },
                  { label: "متوسط الدرجة الكلي", value: `${asmReport.avgScore.toFixed(1)}%` },
                  { label: "نسبة الإتمام", value: `${asmReport.completionRate}%` },
                ].map((s) => (
                  <Card key={s.label} className="shadow-sm border-border/50">
                    <CardContent className="pt-5 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{s.label}</span>
                      <span className="text-xl font-bold">{s.value}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useParams, Link } from "wouter";
import { useGetSchool, useListUsers } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Users, UserCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function SchoolDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: school, isLoading } = useGetSchool(id!);
  const { data: teachersPage } = useListUsers({ schoolId: id, role: 'teacher' });
  const { data: studentsPage } = useListUsers({ schoolId: id, role: 'student' });

  if (isLoading) return <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}</div>;
  if (!school) return <div className="p-12 text-center text-muted-foreground">المدرسة غير موجودة</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/schools">
          <Button variant="ghost" size="icon"><ArrowRight className="h-4 w-4" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{school.nameAr || school.nameEn}</h1>
            <StatusBadge status={school.status} />
          </div>
          <p className="text-muted-foreground text-sm">{school.tenantName} — {school.city}, {school.region}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "المعلمون", value: school.teacherCount || 0, icon: UserCheck, color: "text-indigo-600" },
          { label: "الطلاب", value: school.studentCount || 0, icon: Users, color: "text-green-600" },
        ].map((s) => (
          <Card key={s.label} className="shadow-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent><div className="text-3xl font-bold">{s.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader><CardTitle>معلومات المدرسة</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">المدير</span><span>{school.principalName || '---'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">المدينة</span><span>{school.city || '---'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">المنطقة</span><span>{school.region || '---'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">الهاتف</span><span dir="ltr">{school.phone || '---'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">تاريخ التسجيل</span><span>{new Date(school.createdAt).toLocaleDateString('ar-EG')}</span></div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader><CardTitle>المعلمون</CardTitle></CardHeader>
          <CardContent className="p-0">
            {!teachersPage?.data?.length ? (
              <p className="p-4 text-sm text-muted-foreground">لا يوجد معلمون مسجلون.</p>
            ) : (
              <Table>
                <TableBody>
                  {teachersPage.data.slice(0, 5).map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 border border-border/50">
                            <AvatarFallback className="bg-primary/5 text-primary text-xs">{(u.nameAr || u.nameEn)?.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{u.nameAr || u.nameEn}</span>
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={u.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

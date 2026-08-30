import { useParams, Link } from "wouter";
import { useGetTenant, useListSchools, useListUsers, useSuspendTenant, useActivateTenant } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Building2, Users, GraduationCap, Ban, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export function TenantDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data: tenant, isLoading, refetch } = useGetTenant(id!);
  const { data: schoolsPage } = useListSchools({ tenantId: id });
  const { data: usersPage } = useListUsers({ tenantId: id });

  const suspendMutation = useSuspendTenant({ mutation: { onSuccess: () => { toast({ title: "تم إيقاف المستأجر" }); refetch(); } } });
  const activateMutation = useActivateTenant({ mutation: { onSuccess: () => { toast({ title: "تم تفعيل المستأجر" }); refetch(); } } });

  if (isLoading) return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}</div>;
  if (!tenant) return <div className="p-12 text-center text-muted-foreground">المستأجر غير موجود</div>;

  const TYPE_AR: Record<string, string> = { school_district: 'مديرية تعليم', private_school: 'مدرسة خاصة', government: 'حكومي', ngo: 'منظمة غير ربحية' };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/tenants">
          <Button variant="ghost" size="icon"><ArrowRight className="h-4 w-4" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{tenant.nameAr || tenant.nameEn}</h1>
            <StatusBadge status={tenant.status} />
          </div>
          <p className="text-muted-foreground text-sm">{TYPE_AR[tenant.type] || tenant.type}</p>
        </div>
        <div className="flex gap-2">
          {tenant.status === 'active' ? (
            <Button variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => suspendMutation.mutate({ id: tenant.id })}>
              <Ban className="h-4 w-4" />تعليق
            </Button>
          ) : (
            <Button variant="outline" className="gap-2 text-green-600 border-green-200 hover:bg-green-50"
              onClick={() => activateMutation.mutate({ id: tenant.id })}>
              <CheckCircle className="h-4 w-4" />تفعيل
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "المدارس", value: tenant.schoolCount || 0, icon: GraduationCap, color: "text-blue-600" },
          { label: "المستخدمين", value: tenant.userCount || 0, icon: Users, color: "text-indigo-600" },
          { label: "الطلاب", value: tenant.studentCount || 0, icon: Building2, color: "text-green-600" },
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
          <CardHeader><CardTitle>معلومات التواصل والاشتراك</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">البريد الإلكتروني</span><span dir="ltr">{tenant.contactEmail || '---'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">الهاتف</span><span dir="ltr">{tenant.contactPhone || '---'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">خطة الاشتراك</span><span className="font-medium">{tenant.subscriptionPlan || '---'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">تاريخ الانتهاء</span>
              <span>{tenant.subscriptionExpiresAt ? new Date(tenant.subscriptionExpiresAt).toLocaleDateString('ar-EG') : '---'}</span>
            </div>
            <div className="flex justify-between"><span className="text-muted-foreground">تاريخ التسجيل</span>
              <span>{new Date(tenant.createdAt).toLocaleDateString('ar-EG')}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader><CardTitle>المدارس التابعة</CardTitle></CardHeader>
          <CardContent className="p-0">
            {!schoolsPage?.data?.length ? (
              <p className="p-4 text-sm text-muted-foreground">لا توجد مدارس مسجلة.</p>
            ) : (
              <Table>
                <TableBody>
                  {schoolsPage.data.slice(0, 5).map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.nameAr || s.nameEn}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.city}</TableCell>
                      <TableCell><StatusBadge status={s.status} /></TableCell>
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

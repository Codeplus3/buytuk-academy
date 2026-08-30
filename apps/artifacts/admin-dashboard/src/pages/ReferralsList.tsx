import { useState } from "react";
import { useListReferrals } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Stethoscope } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ReferralsList() {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: page, isLoading } = useListReferrals({
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">الإحالات</h1>
        <p className="text-muted-foreground">سجل إحالات الطلاب للتقييم والتدخل.</p>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-3 border-b border-border/50">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44"><SelectValue placeholder="الحالة" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="pending">قيد الانتظار</SelectItem>
              <SelectItem value="accepted">مقبولة</SelectItem>
              <SelectItem value="rejected">مرفوضة</SelectItem>
              <SelectItem value="closed">مغلقة</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !page?.data?.length ? (
            <div className="p-12 text-center text-muted-foreground">
              <Stethoscope className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <p>لا توجد إحالات مطابقة.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الطالب</TableHead>
                  <TableHead>أُحيل بواسطة</TableHead>
                  <TableHead>سبب الإحالة</TableHead>
                  <TableHead>تاريخ الإحالة</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {page.data.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.studentName}</TableCell>
                    <TableCell className="text-sm">{r.referredByName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">{r.reason}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString('ar-EG')}
                    </TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

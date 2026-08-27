import { useState } from "react";
import { useListSubmissions } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { ClipboardCheck, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function SubmissionsList() {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: page, isLoading } = useListSubmissions({
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">الاختبارات (التسليمات)</h1>
        <p className="text-muted-foreground">سجل تسليمات الطلاب على كافة التقييمات.</p>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex gap-3 items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="الحالة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="submitted">مُقدم</SelectItem>
                <SelectItem value="graded">مصحح</SelectItem>
                <SelectItem value="reviewed">تمت المراجعة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !page?.data?.length ? (
            <div className="p-12 text-center text-muted-foreground">
              <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <p>لا توجد تسليمات مطابقة.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الطالب</TableHead>
                  <TableHead>التقييم</TableHead>
                  <TableHead className="text-center">الدرجة</TableHead>
                  <TableHead>المراجعة البشرية</TableHead>
                  <TableHead>تاريخ التسليم</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {page.data.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.studentName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[220px] truncate">{s.assessmentTitle}</TableCell>
                    <TableCell className="text-center">
                      {s.score != null
                        ? <span className={s.score >= 70 ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>{s.score}/{s.maxScore}</span>
                        : <span className="text-muted-foreground">---</span>}
                    </TableCell>
                    <TableCell>
                      {s.requiresHumanReview && (
                        <Badge variant="destructive" className="gap-1 text-xs">
                          <AlertTriangle className="h-3 w-3" />مطلوبة
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString('ar-EG') : '---'}
                    </TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
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

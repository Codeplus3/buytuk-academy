import { useState } from "react";
import { useListEvidence, useReviewEvidence } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileCheck, AlertTriangle, CheckCircle, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const TYPE_LABELS: Record<string, string> = {
  reading: 'قراءة', writing: 'كتابة', dictation: 'إملاء', observation: 'ملاحظة', assessment: 'تقييم'
};

export function EvidencePage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [reviewFilter, setReviewFilter] = useState("all");
  const { toast } = useToast();

  const { data: page, isLoading, refetch } = useListEvidence({
    type: typeFilter !== "all" ? typeFilter : undefined,
    requiresHumanReview: reviewFilter === "pending" ? true : reviewFilter === "reviewed" ? false : undefined,
  });

  const reviewMutation = useReviewEvidence({
    mutation: {
      onSuccess: () => { toast({ title: "تم تسجيل المراجعة بنجاح" }); refetch(); },
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">الأدلة</h1>
          <p className="text-muted-foreground">سجل الأدلة المرفوعة — المراجعة البشرية مطلوبة وفق ADR-015.</p>
        </div>
        {page && page.data.filter(e => e.requiresHumanReview && !e.reviewedBy).length > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium">
            <AlertTriangle className="h-4 w-4" />
            {page.data.filter(e => e.requiresHumanReview && !e.reviewedBy).length} أدلة تحتاج مراجعة بشرية
          </div>
        )}
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex gap-3 flex-wrap">
            <Select value={reviewFilter} onValueChange={setReviewFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="حالة المراجعة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأدلة</SelectItem>
                <SelectItem value="pending">بانتظار المراجعة</SelectItem>
                <SelectItem value="reviewed">تمت المراجعة</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="النوع" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {Object.entries(TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !page?.data?.length ? (
            <div className="p-12 text-center text-muted-foreground">
              <FileCheck className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <p>لا توجد أدلة مطابقة.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الطالب</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>تحليل الذكاء الاصطناعي</TableHead>
                  <TableHead>مستوى الثقة</TableHead>
                  <TableHead>المراجعة البشرية (ADR-015)</TableHead>
                  <TableHead>المراجع</TableHead>
                  <TableHead className="text-left">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {page.data.map((ev) => (
                  <TableRow key={ev.id} className={ev.requiresHumanReview && !ev.reviewedBy ? "bg-amber-50/40 dark:bg-amber-900/10" : ""}>
                    <TableCell className="font-medium">
                      <div>{ev.studentName}</div>
                      <div className="text-xs text-muted-foreground">{ev.tenantName}</div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                        {TYPE_LABELS[ev.type] || ev.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {ev.aiAnalysisScore != null ? (
                        <span className={ev.aiAnalysisScore < 50 ? "text-red-600 font-semibold" : ev.aiAnalysisScore < 70 ? "text-amber-600 font-semibold" : "text-green-600 font-semibold"}>
                          {ev.aiAnalysisScore}%
                        </span>
                      ) : <span className="text-muted-foreground">---</span>}
                    </TableCell>
                    <TableCell className="text-sm">
                      {ev.aiConfidence != null ? `${(ev.aiConfidence * 100).toFixed(0)}%` : '---'}
                    </TableCell>
                    <TableCell>
                      {ev.requiresHumanReview ? (
                        ev.reviewedBy ? (
                          <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200 text-xs">
                            <CheckCircle className="h-3 w-3" />تمت المراجعة
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1 text-xs">
                            <AlertTriangle className="h-3 w-3" />مطلوبة
                          </Badge>
                        )
                      ) : (
                        <span className="text-muted-foreground text-xs">غير مطلوبة</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {ev.reviewedBy || '---'}
                    </TableCell>
                    <TableCell className="text-left">
                      {ev.requiresHumanReview && !ev.reviewedBy && (
                        <Button size="sm" variant="outline" className="gap-1 text-xs"
                          onClick={() => reviewMutation.mutate({ id: ev.id, data: { reviewedBy: "مدير النظام", notes: "مراجعة يدوية", approved: true } })}>
                          <CheckCircle className="h-3 w-3" />مراجعة
                        </Button>
                      )}
                    </TableCell>
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

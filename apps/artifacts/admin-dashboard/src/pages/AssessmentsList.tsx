import { useState } from "react";
import { useListAssessments, usePublishAssessment, useDeleteAssessment } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Search, FileText, MoreHorizontal, Send } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const TYPE_LABELS: Record<string, string> = {
  reading: 'قراءة', writing: 'كتابة', dictation: 'إملاء', math: 'رياضيات', comprehensive: 'شامل'
};

export function AssessmentsList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { toast } = useToast();

  const { data: page, isLoading, refetch } = useListAssessments({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    type: typeFilter !== "all" ? typeFilter : undefined,
  });

  const publishMutation = usePublishAssessment({
    mutation: {
      onSuccess: () => { toast({ title: "تم نشر التقييم بنجاح" }); refetch(); },
      onError: () => toast({ title: "حدث خطأ", variant: "destructive" }),
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">التقييمات</h1>
          <p className="text-muted-foreground">إدارة التقييمات والاختبارات على مستوى المنصة.</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" />إنشاء تقييم</Button>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="بحث بعنوان التقييم..." className="pr-9"
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="الحالة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="draft">مسودة</SelectItem>
                <SelectItem value="published">منشور</SelectItem>
                <SelectItem value="archived">مؤرشف</SelectItem>
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
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <p>لا توجد تقييمات مطابقة.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>عنوان التقييم</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>المرحلة</TableHead>
                  <TableHead className="text-center">التسليمات</TableHead>
                  <TableHead className="text-center">متوسط الدرجة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-left">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {page.data.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium max-w-[260px]">
                      <div>{a.titleAr || a.title}</div>
                      <div className="text-xs text-muted-foreground">{a.tenantName}</div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                        {TYPE_LABELS[a.type] || a.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{a.gradeLevel || '---'}</TableCell>
                    <TableCell className="text-center font-medium">{a.submissionCount}</TableCell>
                    <TableCell className="text-center">
                      {a.avgScore != null ? (
                        <span className={a.avgScore >= 70 ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                          {a.avgScore.toFixed(1)}%
                        </span>
                      ) : <span className="text-muted-foreground">---</span>}
                    </TableCell>
                    <TableCell><StatusBadge status={a.status} /></TableCell>
                    <TableCell className="text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {a.status === 'draft' && (
                            <DropdownMenuItem onClick={() => publishMutation.mutate({ id: a.id })}
                              className="gap-2 text-green-600">
                              <Send className="h-4 w-4" />نشر التقييم
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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

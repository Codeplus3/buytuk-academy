import { useState } from "react";
import { useListInterventions, useUpdateIntervention } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Activity, CheckCircle, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const TYPE_LABELS: Record<string, string> = {
  academic: 'أكاديمي', behavioral: 'سلوكي', social_emotional: 'اجتماعي انفعالي',
  speech_language: 'نطق ولغة', motor: 'حركي'
};

const IIP_LABELS: Record<string, string> = {
  not_started: 'لم يبدأ', in_progress: 'جارٍ', completed: 'مكتمل'
};

export function InterventionsList() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: page, isLoading, refetch } = useListInterventions({
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const updateMutation = useUpdateIntervention({
    mutation: {
      onSuccess: () => { toast({ title: "تم تحديث التدخل" }); refetch(); },
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">التدخلات التعليمية</h1>
          <p className="text-muted-foreground">برامج التدخل المبكر والمتابعة الفردية للطلاب.</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" />تدخل جديد</Button>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="الحالة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="cancelled">ملغى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !page?.data?.length ? (
            <div className="p-12 text-center text-muted-foreground">
              <Activity className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <p>لا توجد تدخلات مطابقة.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الطالب</TableHead>
                  <TableHead>نوع التدخل</TableHead>
                  <TableHead>المعلم المسؤول</TableHead>
                  <TableHead>الخطة الفردية (IIP)</TableHead>
                  <TableHead>تاريخ البدء</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-left">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {page.data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div>{item.studentName}</div>
                      <div className="text-xs text-muted-foreground">{item.tenantName}</div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                        {TYPE_LABELS[item.type] || item.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{item.assignedTeacherName || <span className="text-muted-foreground">غير محدد</span>}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                        item.iipStatus === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                        item.iipStatus === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        {IIP_LABELS[item.iipStatus] || item.iipStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.startedAt ? new Date(item.startedAt).toLocaleDateString('ar-EG') : '---'}
                    </TableCell>
                    <TableCell><StatusBadge status={item.status} /></TableCell>
                    <TableCell className="text-left">
                      {item.status === 'active' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => updateMutation.mutate({ id: item.id, data: { status: 'completed' } })} className="gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />إغلاق كمكتمل
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

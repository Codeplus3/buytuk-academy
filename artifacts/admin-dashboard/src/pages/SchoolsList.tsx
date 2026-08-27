import { useState } from "react";
import { Link } from "wouter";
import { useListSchools } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Search, GraduationCap, MoreHorizontal, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function SchoolsList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: page, isLoading } = useListSchools({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">إدارة المدارس</h1>
          <p className="text-muted-foreground">عرض وإدارة المدارس عبر جميع المستأجرين.</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" />إضافة مدرسة</Button>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="بحث باسم المدرسة..." className="pr-9"
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="الحالة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشطة</SelectItem>
                <SelectItem value="inactive">غير نشطة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !page?.data?.length ? (
            <div className="p-12 text-center text-muted-foreground">
              <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <p>لم يتم العثور على مدارس.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم المدرسة</TableHead>
                  <TableHead>الجهة المستأجرة</TableHead>
                  <TableHead>المدينة</TableHead>
                  <TableHead>المدير</TableHead>
                  <TableHead className="text-center">معلمون</TableHead>
                  <TableHead className="text-center">طلاب</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-left">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {page.data.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.nameAr || s.nameEn}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.tenantName}</TableCell>
                    <TableCell className="text-sm">{s.city || '---'}</TableCell>
                    <TableCell className="text-sm">{s.principalName || '---'}</TableCell>
                    <TableCell className="text-center">{s.teacherCount || 0}</TableCell>
                    <TableCell className="text-center">{s.studentCount || 0}</TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                    <TableCell className="text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/schools/${s.id}`} className="flex items-center gap-2 cursor-pointer w-full">
                              <Eye className="h-4 w-4" />عرض التفاصيل
                            </Link>
                          </DropdownMenuItem>
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

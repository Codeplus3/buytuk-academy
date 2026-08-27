import { useState } from "react";
import { Link } from "wouter";
import { useListTenants } from "@workspace/api-client-react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Search, Building2, MoreHorizontal, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function TenantsList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { data: tenantsPage, isLoading } = useListTenants({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">إدارة المستأجرين</h1>
          <p className="text-muted-foreground">عرض وإدارة الجهات المستأجرة (مديريات، مدارس خاصة، جهات حكومية).</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة مستأجر جديد
        </Button>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="بحث باسم المستأجر..." 
                className="pl-8 pr-9" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="حالة المستأجر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="trial">تجريبي</SelectItem>
                  <SelectItem value="suspended">موقوف</SelectItem>
                  <SelectItem value="expired">منتهي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : !tenantsPage?.data?.length ? (
            <div className="p-12 text-center text-muted-foreground">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <p>لم يتم العثور على مستأجرين مطابقة لبحثك.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">اسم المستأجر</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الخطة</TableHead>
                  <TableHead className="text-center">المدارس</TableHead>
                  <TableHead className="text-center">المستخدمين</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenantsPage.data.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{tenant.nameAr || tenant.nameEn}</span>
                        <span className="text-xs text-muted-foreground">{tenant.contactEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell>{tenant.type}</TableCell>
                    <TableCell>{tenant.subscriptionPlan || 'أساسي'}</TableCell>
                    <TableCell className="text-center">{tenant.schoolCount || 0}</TableCell>
                    <TableCell className="text-center">{tenant.userCount || 0}</TableCell>
                    <TableCell>
                      <StatusBadge status={tenant.status} />
                    </TableCell>
                    <TableCell className="text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/tenants/${tenant.id}`} className="flex items-center gap-2 cursor-pointer w-full">
                              <Eye className="h-4 w-4" />
                              <span>عرض التفاصيل</span>
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

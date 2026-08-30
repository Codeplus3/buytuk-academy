import { useListRoles, useListPolicies } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Plus, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function RolesPage() {
  const { data: roles, isLoading: rolesLoading } = useListRoles();
  const { data: policies, isLoading: polLoading } = useListPolicies();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">الصلاحيات والأدوار</h1>
          <p className="text-muted-foreground">إدارة أدوار RBAC وسياسات ABAC لضمان عزل المستأجرين.</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" />دور جديد</Button>
      </div>

      <Tabs defaultValue="roles">
        <TabsList>
          <TabsTrigger value="roles" className="gap-2"><Shield className="h-4 w-4" />الأدوار</TabsTrigger>
          <TabsTrigger value="policies">سياسات ABAC</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-0">
              {rolesLoading ? (
                <div className="p-6 space-y-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : !roles?.length ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Shield className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p>لا توجد أدوار محددة.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم الدور</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>الصلاحيات</TableHead>
                      <TableHead className="text-center">المستخدمين</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-mono text-sm font-semibold text-primary">{role.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[280px]">{role.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[300px]">
                            {role.permissions.slice(0, 4).map((perm, i) => (
                              <span key={i} className="bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 px-2 py-0.5 rounded text-xs font-mono">
                                {perm}
                              </span>
                            ))}
                            {role.permissions.length > 4 && (
                              <span className="text-xs text-muted-foreground">+{role.permissions.length - 4}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-semibold">{role.userCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies">
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-base">محرك ABAC — DENY يكسب ALLOW دائماً</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {polLoading ? (
                <div className="p-6 space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
              ) : !policies?.length ? (
                <div className="p-12 text-center text-muted-foreground">
                  <p>لا توجد سياسات.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم السياسة</TableHead>
                      <TableHead>المورد</TableHead>
                      <TableHead>الإجراءات</TableHead>
                      <TableHead>التأثير</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {policies.map((policy) => (
                      <TableRow key={policy.id}>
                        <TableCell className="font-medium">{policy.name}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">{policy.resource}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {policy.actions.map((a, i) => (
                              <span key={i} className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-xs font-mono">{a}</span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {policy.effect === 'allow' ? (
                            <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3" />سماح
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1">
                              <XCircle className="h-3 w-3" />رفض
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

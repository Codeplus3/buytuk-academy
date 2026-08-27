import { useState } from "react";
import { useListNotifications, useGetNotificationStats, useSendNotification } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { Bell, Send, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";

const CHANNEL_LABELS: Record<string, string> = {
  email: 'البريد الإلكتروني', sms: 'رسالة نصية', in_app: 'داخل التطبيق', push: 'إشعار فوري'
};

export function NotificationsPage() {
  const [channelFilter, setChannelFilter] = useState("all");
  const [sendForm, setSendForm] = useState({ recipientId: "", subject: "", body: "", channel: "email" });
  const { toast } = useToast();

  const { data: page, isLoading, refetch } = useListNotifications({
    channel: channelFilter !== "all" ? channelFilter : undefined,
  });
  const { data: stats } = useGetNotificationStats();

  const sendMutation = useSendNotification({
    mutation: {
      onSuccess: () => {
        toast({ title: "تم إرسال الإشعار بنجاح" });
        setSendForm({ recipientId: "", subject: "", body: "", channel: "email" });
        refetch();
      },
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">الإشعارات</h1>
        <p className="text-muted-foreground">إدارة وإرسال الإشعارات عبر جميع القنوات.</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "إجمالي المُرسلة", value: stats.total, color: "text-foreground" },
            { label: "تم التوصيل", value: stats.delivered, color: "text-green-600" },
            { label: "فشل الإرسال", value: stats.failed, color: "text-red-600" },
            { label: "قيد الانتظار", value: stats.pending, color: "text-amber-600" },
          ].map((s) => (
            <Card key={s.label} className="shadow-sm border-border/50">
              <CardContent className="pt-6">
                <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Tabs defaultValue="log">
        <TabsList>
          <TabsTrigger value="log" className="gap-2"><Bell className="h-4 w-4" />سجل الإشعارات</TabsTrigger>
          <TabsTrigger value="send" className="gap-2"><Send className="h-4 w-4" />إرسال إشعار</TabsTrigger>
          <TabsTrigger value="stats" className="gap-2"><BarChart3 className="h-4 w-4" />الإحصاءات</TabsTrigger>
        </TabsList>

        <TabsContent value="log">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex gap-3">
                <Select value={channelFilter} onValueChange={setChannelFilter}>
                  <SelectTrigger className="w-52"><SelectValue placeholder="تصفية حسب القناة" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع القنوات</SelectItem>
                    {Object.entries(CHANNEL_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
              ) : !page?.data?.length ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Bell className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p>لا توجد إشعارات.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الموضوع</TableHead>
                      <TableHead>المستلم</TableHead>
                      <TableHead>القناة</TableHead>
                      <TableHead>وقت الإرسال</TableHead>
                      <TableHead>الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {page.data.map((n) => (
                      <TableRow key={n.id}>
                        <TableCell className="font-medium">{n.subject}</TableCell>
                        <TableCell className="text-sm">{n.recipientName}</TableCell>
                        <TableCell>
                          <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                            {CHANNEL_LABELS[n.channel] || n.channel}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {n.sentAt ? new Date(n.sentAt).toLocaleString('ar-EG') : '---'}
                        </TableCell>
                        <TableCell><StatusBadge status={n.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="send">
          <Card className="shadow-sm border-border/50 max-w-xl">
            <CardHeader>
              <CardTitle>إرسال إشعار جديد</CardTitle>
              <CardDescription>أرسل إشعاراً مباشراً لأي مستخدم في النظام.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>القناة</Label>
                <Select value={sendForm.channel} onValueChange={(v) => setSendForm(f => ({ ...f, channel: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CHANNEL_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>معرف المستلم</Label>
                <Input placeholder="u1, u2, ..." value={sendForm.recipientId}
                  onChange={(e) => setSendForm(f => ({ ...f, recipientId: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>الموضوع</Label>
                <Input placeholder="موضوع الإشعار" value={sendForm.subject}
                  onChange={(e) => setSendForm(f => ({ ...f, subject: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>نص الرسالة</Label>
                <Textarea placeholder="محتوى الإشعار..." rows={4} value={sendForm.body}
                  onChange={(e) => setSendForm(f => ({ ...f, body: e.target.value }))} />
              </div>
              <Button className="w-full gap-2" disabled={sendMutation.isPending || !sendForm.subject || !sendForm.body}
                onClick={() => sendMutation.mutate({ data: { channel: sendForm.channel as "email", recipientId: sendForm.recipientId || "u1", subject: sendForm.subject, body: sendForm.body } })}>
                <Send className="h-4 w-4" />{sendMutation.isPending ? "جارٍ الإرسال..." : "إرسال"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          {stats ? (
            <Card className="shadow-sm border-border/50">
              <CardHeader>
                <CardTitle>توزيع الإشعارات حسب القناة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stats.byChannel} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={110} label={({ label, value }) => `${label}: ${value}`}>
                        {stats.byChannel.map((entry, i) => (
                          <Cell key={i} fill={entry.color || "#3B82F6"} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ) : <Skeleton className="h-[300px] w-full" />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

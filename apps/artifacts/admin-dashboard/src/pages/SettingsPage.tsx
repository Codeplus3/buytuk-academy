import { useEffect, useState } from "react";
import { useGetSettings, useUpdateSettings } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export function SettingsPage() {
  const { data: settings, isLoading } = useGetSettings();
  const { toast } = useToast();
  const [form, setForm] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (settings) setForm({ ...settings });
  }, [settings]);

  const updateMutation = useUpdateSettings({
    mutation: {
      onSuccess: () => toast({ title: "تم حفظ الإعدادات بنجاح" }),
      onError: () => toast({ title: "حدث خطأ أثناء الحفظ", variant: "destructive" }),
    }
  });

  if (isLoading) return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}</div>;

  const set = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">إعدادات النظام</h1>
          <p className="text-muted-foreground">تكوين المنصة والخدمات الخارجية.</p>
        </div>
        <Button className="gap-2" onClick={() => updateMutation.mutate({ data: form as Parameters<typeof updateMutation.mutate>[0]['data'] })} disabled={updateMutation.isPending}>
          <Save className="h-4 w-4" />{updateMutation.isPending ? "جارٍ الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>

      {/* Platform identity */}
      <Card className="shadow-sm border-border/50">
        <CardHeader><CardTitle>هوية المنصة</CardTitle><CardDescription>الاسم والإعدادات العامة للمنصة.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>اسم المنصة (عربي)</Label>
              <Input value={(form.platformNameAr as string) || ''} onChange={(e) => set('platformNameAr', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>اسم المنصة (إنجليزي)</Label>
              <Input value={(form.platformNameEn as string) || ''} onChange={(e) => set('platformNameEn', e.target.value)} dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>بريد الدعم الفني</Label>
              <Input value={(form.supportEmail as string) || ''} onChange={(e) => set('supportEmail', e.target.value)} dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>اللغة الافتراضية</Label>
              <Select value={(form.defaultLanguage as string) || 'ar'} onValueChange={(v) => set('defaultLanguage', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="font-medium text-sm">وضع الصيانة</p>
                <p className="text-xs text-muted-foreground">تعطيل الوصول للمستخدمين مؤقتاً أثناء الصيانة.</p>
              </div>
              <Switch checked={!!(form.maintenanceMode)} onCheckedChange={(v) => set('maintenanceMode', v)} />
            </div>
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="font-medium text-sm">تحليل الذكاء الاصطناعي</p>
                <p className="text-xs text-muted-foreground">تفعيل خدمة تحليل الأدلة بالذكاء الاصطناعي (ADR-015).</p>
              </div>
              <Switch checked={!!(form.aiAnalysisEnabled)} onCheckedChange={(v) => set('aiAnalysisEnabled', v)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File settings */}
      <Card className="shadow-sm border-border/50">
        <CardHeader><CardTitle>إعدادات الملفات</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>الحجم الأقصى للملف (ميجابايت)</Label>
            <Input type="number" value={(form.maxFileSizeMb as number) || 50}
              onChange={(e) => set('maxFileSizeMb', Number(e.target.value))} className="w-40" />
          </div>
        </CardContent>
      </Card>

      {/* Providers */}
      <Card className="shadow-sm border-border/50">
        <CardHeader><CardTitle>مزودو الخدمات الخارجية</CardTitle><CardDescription>إعداد قنوات الإشعارات.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>مزود البريد الإلكتروني</Label>
              <Select value={(form.emailProvider as string) || 'aws_ses'} onValueChange={(v) => set('emailProvider', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="smtp">SMTP</SelectItem>
                  <SelectItem value="aws_ses">AWS SES</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>مزود الرسائل النصية (SMS)</Label>
              <Select value={(form.smsProvider as string) || 'unifonic'} onValueChange={(v) => set('smsProvider', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unifonic">Unifonic (MENA)</SelectItem>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="stc">STC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

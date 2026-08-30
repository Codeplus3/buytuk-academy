import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, Building2, Users, Shield, 
  FileText, ClipboardCheck, Activity, Stethoscope,
  Link as LinkIcon, FileCheck, Bell, BarChart3, Settings,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const sidebarNav = [
  {
    title: "الرئيسية",
    items: [
      { title: "لوحة القيادة", href: "/", icon: LayoutDashboard },
    ]
  },
  {
    title: "إدارة النظام",
    items: [
      { title: "المستأجرين", href: "/tenants", icon: Building2 },
      { title: "المدارس", href: "/schools", icon: GraduationCap },
      { title: "المستخدمين", href: "/users", icon: Users },
      { title: "الصلاحيات والأدوار", href: "/roles", icon: Shield },
    ]
  },
  {
    title: "التعليم والتدخل",
    items: [
      { title: "التقييمات", href: "/assessments", icon: FileText },
      { title: "الاختبارات (التسليمات)", href: "/submissions", icon: ClipboardCheck },
      { title: "التدخلات", href: "/interventions", icon: Activity },
      { title: "الإحالات", href: "/referrals", icon: Stethoscope },
    ]
  },
  {
    title: "المتابعة والتواصل",
    items: [
      { title: "الأدلة", href: "/evidence", icon: FileCheck },
      { title: "الإشعارات", href: "/notifications", icon: Bell },
    ]
  },
  {
    title: "تحليلات وإعدادات",
    items: [
      { title: "التقارير", href: "/reports", icon: BarChart3 },
      { title: "الإعدادات", href: "/settings", icon: Settings },
    ]
  }
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 border-l border-border bg-sidebar h-screen flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-border bg-sidebar">
        <div className="font-bold text-xl text-primary flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          <span>أكاديمية بايتوك</span>
        </div>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <nav className="px-4 space-y-6">
          {sidebarNav.map((group, i) => (
            <div key={i}>
              <h4 className="px-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
                {group.title}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}

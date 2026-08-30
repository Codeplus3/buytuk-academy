import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center">
        {/* Breadcrumb would go here, omitting for simplicity/reusability across pages, or implemented per-page */}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-2 h-2 w-2 bg-destructive rounded-full" />
        </Button>
        <div className="flex items-center gap-3 border-r border-border pr-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium leading-none">مدير النظام</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary">م.ن</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

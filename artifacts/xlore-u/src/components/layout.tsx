import { Link, useLocation } from "wouter";
import { useUser, useClerk } from "@clerk/react";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Map as MapIcon,
  GitCompare,
  ClipboardCheck,
  Bookmark,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useDarkMode } from "@/hooks/use-dark-mode";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/schools", label: "School Directory", icon: GraduationCap },
  { href: "/programs", label: "Programs", icon: BookOpen },
  { href: "/map", label: "School Map", icon: MapIcon },
  { href: "/compare", label: "Compare Institutions/Programs", icon: GitCompare },
  { href: "/assessment", label: "Self Assessment", icon: ClipboardCheck },
  { href: "/saved", label: "Saved Items", icon: Bookmark },
  { href: "/profile", label: "Profile", icon: User },
];

function SidebarNav({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const [location] = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { isDark, toggle } = useDarkMode();

  const isAdmin = user?.publicMetadata?.role === "admin";
  const items = isAdmin
    ? [...navItems, { href: "/admin", label: "Admin Panel", icon: ShieldCheck }]
    : navItems;

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-sidebar-border flex items-center gap-2.5">
        <span className="text-xl font-black text-sidebar-primary leading-none shrink-0">X</span>
        <h2 className="text-lg font-bold text-sidebar-foreground tracking-tight">Xlore U</h2>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {items.map((item) => {
          const active = location === item.href || location.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        <button
          onClick={toggle}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          {isDark ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Log Out
        </button>
        {user && (
          <div className="px-3 pt-3 pb-1">
            <p className="text-xs text-sidebar-foreground/50 truncate">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  const currentPage = [...navItems, { href: "/admin", label: "Admin Panel", icon: ShieldCheck }]
    .find(item => location === item.href || location.startsWith(item.href + "/"))?.label ?? "Xlore U";

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      <aside className="hidden md:flex flex-col w-60 lg:w-64 border-r bg-sidebar border-sidebar-border text-sidebar-foreground shrink-0">
        <SidebarNav />
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b bg-background shrink-0">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-1">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 p-0 bg-sidebar border-sidebar-border text-sidebar-foreground"
            >
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-semibold text-foreground truncate">{currentPage}</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-5 md:px-8 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

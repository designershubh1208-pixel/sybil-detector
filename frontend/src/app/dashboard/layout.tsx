"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Upload, History, Users, Settings, LogOut, Activity, Sparkles, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Copilot", href: "/dashboard/copilot", icon: Sparkles },
    { name: "Intelligence", href: "/dashboard/intelligence", icon: FolderKanban },
    { name: "Live Alerts", href: "/dashboard/monitoring", icon: Activity },
    { name: "New Analysis", href: "/dashboard/upload", icon: Upload },
    { name: "History", href: "/dashboard/history", icon: History },
    { name: "Team", href: "/dashboard/team", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--border)] bg-white flex flex-col">
        <div className="p-6 border-b border-[var(--border)]">
          <Link href="/" className="text-2xl font-bold tracking-tighter">Beacon</Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-[var(--accent)] text-white" 
                    : "text-[var(--secondary)] hover:bg-[var(--background)] hover:text-[var(--primary)]"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--border)]">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-[var(--secondary)] hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

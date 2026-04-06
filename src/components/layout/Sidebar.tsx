"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useSidebar } from "@/lib/sidebar-context";
import {
  BarChart3,
  MessageSquare,
  ClipboardList,
  FileInput,
  Shield,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import RoleIndicator from "./RoleIndicator";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/analytics", label: "AI Analytics", icon: MessageSquare },
  { href: "/surveys", label: "Surveys", icon: ClipboardList },
  { href: "/data-entry", label: "Data Entry", icon: FileInput },
];

const adminItem = { href: "/admin", label: "Admin", icon: Shield };

export default function Sidebar() {
  const pathname = usePathname();
  const { currentRole } = useAuth();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar-bg text-sidebar-text flex flex-col z-40 transition-all duration-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand + collapse toggle */}
      <div className={`pt-6 pb-2 ${collapsed ? "px-0" : "px-5"}`}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-1">
            <Globe className="w-5 h-5 text-brand-500" />
            <button
              onClick={toggle}
              className="mt-1 p-0.5 rounded text-slate-600 hover:text-slate-400 transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <span className="font-mono font-bold text-lg text-white">AMISA</span>
              </div>
              <button
                onClick={toggle}
                className="p-0.5 rounded text-slate-600 hover:text-slate-400 transition-colors"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-sm text-slate-400 mt-0.5 ml-7">Data System</p>
          </>
        )}
      </div>

      <div className={`my-3 border-b border-slate-700 ${collapsed ? "mx-2" : "mx-4"}`} />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-1">
        {navItems
          .filter((item) => !(currentRole === "school_user" && item.href === "/dashboard"))
          .map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 py-3 rounded-lg mx-2 text-sm transition-colors active:scale-[0.98] ${
                collapsed ? "justify-center px-0" : "px-4"
              } ${
                active
                  ? "bg-sidebar-active text-white"
                  : "text-slate-400 hover:bg-sidebar-hover hover:text-slate-200"
              }`}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}

        {currentRole === "network_admin" && (
          <>
            <div className={`my-3 border-b border-slate-700 ${collapsed ? "mx-2" : "mx-4"}`} />
            <Link
              href={adminItem.href}
              title={collapsed ? adminItem.label : undefined}
              className={`flex items-center gap-3 py-3 rounded-lg mx-2 text-sm transition-colors active:scale-[0.98] ${
                collapsed ? "justify-center px-0" : "px-4"
              } ${
                pathname === adminItem.href || pathname.startsWith(adminItem.href + "/")
                  ? "bg-sidebar-active text-white"
                  : "text-slate-400 hover:bg-sidebar-hover hover:text-slate-200"
              }`}
            >
              <adminItem.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && adminItem.label}
            </Link>
          </>
        )}
      </nav>

      {/* Bottom */}
      {!collapsed && <RoleIndicator />}
      {!collapsed && (
        <div className="px-4 pb-4">
          <a
            href="https://ahdatalytics.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors"
          >
            by AH Datalytics
          </a>
        </div>
      )}
    </aside>
  );
}

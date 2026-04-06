"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  BarChart3,
  MessageSquare,
  ClipboardList,
  FileInput,
  Shield,
  Globe,
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

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar-bg text-sidebar-text flex flex-col z-40">
      {/* Brand */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-brand-500" />
          <span className="font-mono font-bold text-lg text-white">AMISA</span>
        </div>
        <p className="text-sm text-slate-400 mt-0.5 ml-7">Data System</p>
      </div>

      <div className="mx-4 my-3 border-b border-slate-700" />

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
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 text-sm transition-colors active:scale-[0.98] ${
                active
                  ? "bg-sidebar-active text-white"
                  : "text-slate-400 hover:bg-sidebar-hover hover:text-slate-200"
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.label}
            </Link>
          );
        })}

        {currentRole === "network_admin" && (
          <>
            <div className="mx-4 my-3 border-b border-slate-700" />
            <Link
              href={adminItem.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 text-sm transition-colors active:scale-[0.98] ${
                pathname === adminItem.href || pathname.startsWith(adminItem.href + "/")
                  ? "bg-sidebar-active text-white"
                  : "text-slate-400 hover:bg-sidebar-hover hover:text-slate-200"
              }`}
            >
              <adminItem.icon className="w-[18px] h-[18px]" />
              {adminItem.label}
            </Link>
          </>
        )}
      </nav>

      {/* Bottom */}
      <RoleIndicator />
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
    </aside>
  );
}

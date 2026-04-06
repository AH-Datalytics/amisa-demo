"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Menu,
  X,
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

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { currentRole } = useAuth();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  let roleBadge = "text-slate-400";
  let roleLabel = "";
  if (currentRole === "network_admin") {
    roleBadge = "bg-brand-800/50 text-blue-200";
    roleLabel = "Admin";
  } else if (currentRole === "school_admin") {
    roleBadge = "bg-amber-900/50 text-amber-200";
    roleLabel = "School";
  } else if (currentRole === "school_user") {
    roleBadge = "bg-slate-700/50 text-slate-300";
    roleLabel = "User";
  }

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-sidebar-bg flex items-center justify-between px-4 z-50 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="text-slate-300 hover:text-white transition-colors"
          aria-label="Open navigation"
          aria-expanded={open}
          aria-controls="mobile-nav-drawer"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-brand-500" />
          <span className="font-mono font-bold text-sm text-white">
            AMISA Data System
          </span>
        </div>

        {roleLabel && (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-medium ${roleBadge}`}
          >
            {roleLabel}
          </span>
        )}
      </header>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 left-0 h-full w-72 bg-sidebar-bg z-[70] transform transition-transform duration-200 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-500" />
            <span className="font-mono font-bold text-lg text-white">
              AMISA
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-slate-400 px-5 ml-7 -mt-1">Data System</p>

        <div className="mx-4 my-3 border-b border-slate-700" />

        {/* Nav items */}
        <nav className="flex-1 py-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 text-sm transition-colors ${
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 text-sm transition-colors ${
                  pathname === adminItem.href ||
                  pathname.startsWith(adminItem.href + "/")
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

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0">
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
        </div>
      </div>
    </>
  );
}

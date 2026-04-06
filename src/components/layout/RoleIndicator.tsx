"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function RoleIndicator() {
  const { currentUser, currentRole, currentSchool, logout } = useAuth();
  const router = useRouter();

  if (!currentUser) return null;

  const handleSwitch = () => {
    logout();
    router.push("/login");
  };

  let badgeClasses = "bg-slate-700/50 text-slate-300";
  let badgeLabel = "";

  if (currentRole === "network_admin") {
    badgeClasses = "bg-brand-800/50 text-blue-200";
    badgeLabel = "Network Admin";
  } else if (currentRole === "school_admin") {
    badgeClasses = "bg-amber-900/50 text-amber-200";
    badgeLabel = "School Admin";
  } else if (currentRole === "school_user") {
    badgeClasses = "bg-slate-700/50 text-slate-300";
    const officeName = currentUser.office
      ? currentUser.office.charAt(0).toUpperCase() + currentUser.office.slice(1)
      : "Staff";
    badgeLabel = currentSchool
      ? `${officeName} - ${currentSchool.name.split(" ").slice(0, 2).join(" ")}`
      : officeName;
  }

  return (
    <div className="px-4 py-4 border-t border-slate-700">
      <p className="text-sm font-medium text-white truncate">
        {currentUser.name}
      </p>
      <span
        className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${badgeClasses}`}
      >
        {badgeLabel}
      </span>
      <button
        onClick={handleSwitch}
        className="flex items-center gap-1.5 mt-3 text-xs text-slate-500 hover:text-white transition-colors"
      >
        <LogOut className="w-3 h-3" />
        Switch Role
      </button>
    </div>
  );
}

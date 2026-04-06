"use client";

import { useState } from "react";
import { Shield, Users, GraduationCap, ScrollText } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AccessDenied from "@/components/ui/AccessDenied";
import UserManagement from "@/components/admin/UserManagement";
import SchoolManagement from "@/components/admin/SchoolManagement";
import AuditLog from "@/components/admin/AuditLog";

type Tab = "users" | "schools" | "audit";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "users", label: "Users", icon: Users },
  { id: "schools", label: "Schools", icon: GraduationCap },
  { id: "audit", label: "Audit Log", icon: ScrollText },
];

export default function AdminPage() {
  const { currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("users");

  if (currentRole !== "network_admin") {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-6 w-6 text-brand-800" />
          <h1 className="text-2xl font-mono font-bold text-brand-900">
            Administration
          </h1>
        </div>
        <p className="text-slate-500 text-sm">
          Manage users, schools, and review system activity
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6" aria-label="Admin tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 pb-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-brand-800 text-brand-800"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {activeTab === "users" && <UserManagement />}
        {activeTab === "schools" && <SchoolManagement />}
        {activeTab === "audit" && <AuditLog />}
      </div>
    </div>
  );
}

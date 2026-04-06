"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Shield, Building2, User, Globe } from "lucide-react";

const roles = [
  {
    userId: "admin-hq",
    icon: Shield,
    title: "Network Administrator",
    subtitle: "AMISA Headquarters",
    description:
      "Full access to all schools, data, surveys, and administration",
    borderColor: "border-brand-800",
    iconColor: "text-brand-800",
  },
  {
    userId: "admin-academia",
    icon: Building2,
    title: "School Administrator",
    subtitle: "Academia Americana de Sao Paulo",
    description: "Your school's data and anonymized peer benchmarking",
    borderColor: "border-accent-600",
    iconColor: "text-accent-600",
  },
  {
    userId: "user-admissions",
    icon: User,
    title: "School User",
    subtitle: "Admissions Office, Academia Americana de Sao Paulo",
    description: "Admissions Office data entry and reporting",
    borderColor: "border-slate-400",
    iconColor: "text-slate-400",
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (userId: string) => {
    login(userId);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-2xl">
        {/* Main card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2.5 mb-2">
              <Globe className="w-6 h-6 text-brand-500" />
              <h1 className="text-2xl font-mono font-bold text-slate-900">
                AMISA Data System
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              American International Schools in the Americas
            </p>
          </div>

          <hr className="border-slate-200 mb-6" />

          <p className="text-sm text-slate-600 mb-5 text-center">
            Select your role to explore the platform
          </p>

          {/* Role cards */}
          <div className="space-y-3">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.userId}
                  onClick={() => handleLogin(role.userId)}
                  className={`w-full text-left bg-white rounded-lg shadow-sm border border-slate-200 border-l-4 ${role.borderColor} p-5 hover:shadow-md transition-shadow cursor-pointer flex items-start gap-4 group`}
                >
                  <div
                    className={`mt-0.5 flex-shrink-0 ${role.iconColor} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {role.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {role.subtitle}
                    </p>
                    <p className="text-sm text-slate-600 mt-1.5">
                      {role.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-xs text-slate-400">
          Demo prototype by{" "}
          <a
            href="https://ahdatalytics.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-600 underline underline-offset-2 transition-colors"
          >
            AH Datalytics
          </a>
        </p>
      </div>
    </div>
  );
}

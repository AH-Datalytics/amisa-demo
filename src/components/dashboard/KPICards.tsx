"use client";

import { School, Users, DollarSign, TrendingUp, GraduationCap } from "lucide-react";
import { formatCurrency, formatNumber, formatPercent, formatRatio } from "@/lib/utils";

interface KPIs {
  totalSchools: number;
  totalEnrollment: number;
  avgTuition: number;
  avgRetention: number;
  avgStudentTeacherRatio: number;
}

interface KPICardsProps {
  kpis: KPIs;
}

const cards = [
  {
    key: "totalSchools" as const,
    label: "Total Schools",
    icon: School,
    format: (v: number) => formatNumber(v),
  },
  {
    key: "totalEnrollment" as const,
    label: "Total Enrollment",
    icon: Users,
    format: (v: number) => formatNumber(v),
  },
  {
    key: "avgTuition" as const,
    label: "Avg Tuition (High)",
    icon: DollarSign,
    format: (v: number) => formatCurrency(v),
  },
  {
    key: "avgRetention" as const,
    label: "Avg Retention",
    icon: TrendingUp,
    format: (v: number) => formatPercent(v),
  },
  {
    key: "avgStudentTeacherRatio" as const,
    label: "Avg Student-Teacher Ratio",
    icon: GraduationCap,
    format: (v: number) => formatRatio(v),
  },
];

export default function KPICards({ kpis }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const value = kpis[card.key];
        return (
          <div
            key={card.key}
            className="relative bg-white rounded-xl shadow-sm border border-slate-200 p-5 animate-fade-in-up card-interactive"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <Icon className="absolute top-4 right-4 h-5 w-5 text-slate-200" />
            <div className="text-3xl font-mono font-bold text-brand-900 pr-7">
              {card.format(value)}
            </div>
            <div className="mt-1 text-sm text-slate-500">{card.label}</div>
          </div>
        );
      })}
    </div>
  );
}

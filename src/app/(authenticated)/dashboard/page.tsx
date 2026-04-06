"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useFilteredData } from "@/hooks/useFilteredData";
import KPICards from "@/components/dashboard/KPICards";
import PeerFilters from "@/components/dashboard/PeerFilters";
import EnrollmentTrendsChart from "@/components/dashboard/EnrollmentTrendsChart";
import TuitionDistribution from "@/components/dashboard/TuitionDistribution";
import AdmissionsFunnel from "@/components/dashboard/AdmissionsFunnel";
import RetentionComparison from "@/components/dashboard/RetentionComparison";
import StudentTeacherRatio from "@/components/dashboard/StudentTeacherRatio";
import FacultyComposition from "@/components/dashboard/FacultyComposition";

function ChartCard({
  title,
  children,
  className = "",
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 animate-fade-in-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="font-mono text-lg font-semibold text-slate-800 mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const { currentRole, isLoading } = useAuth();
  const router = useRouter();
  const { filters, setFilters, filteredSchools, kpis, metrics } =
    useFilteredData();

  useEffect(() => {
    if (!isLoading && currentRole === "school_user") {
      router.push("/data-entry");
    }
  }, [currentRole, isLoading, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-mono font-bold text-brand-900">
          Benchmarking Dashboard
        </h1>
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (currentRole === "school_user") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-mono font-bold text-brand-900">
          Benchmarking Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Comparative analytics across {filteredSchools.length} AMISA member
          schools
        </p>
      </div>

      <KPICards kpis={kpis} />

      <PeerFilters filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Row 1: Enrollment trends spans full width */}
        <ChartCard title="Enrollment Trends (2022-2026)" className="md:col-span-2" delay={0}>
          <EnrollmentTrendsChart
            filteredSchools={filteredSchools}
            metrics={metrics}
          />
        </ChartCard>

        {/* Row 2: Tuition and Admissions side by side */}
        <ChartCard title="Tuition Distribution" delay={100}>
          <TuitionDistribution
            filteredSchools={filteredSchools}
            metrics={metrics}
          />
        </ChartCard>

        <ChartCard title="Admissions Funnel (Current Year)" delay={150}>
          <AdmissionsFunnel
            filteredSchools={filteredSchools}
            metrics={metrics}
          />
        </ChartCard>

        {/* Row 3: Retention and Student-Teacher Ratio side by side */}
        <ChartCard title="Retention Rate Comparison" delay={200}>
          <RetentionComparison
            filteredSchools={filteredSchools}
            metrics={metrics}
          />
        </ChartCard>

        <ChartCard title="Student-Teacher Ratio" delay={250}>
          <StudentTeacherRatio
            filteredSchools={filteredSchools}
            metrics={metrics}
          />
        </ChartCard>

        {/* Row 4: Faculty composition spans full width */}
        <ChartCard title="Faculty Nationality Composition" className="md:col-span-2" delay={300}>
          <FacultyComposition
            filteredSchools={filteredSchools}
            metrics={metrics}
          />
        </ChartCard>
      </div>
    </div>
  );
}

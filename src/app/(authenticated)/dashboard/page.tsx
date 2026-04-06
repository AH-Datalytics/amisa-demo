"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useFilteredData } from "@/hooks/useFilteredData";
import { exportCsv, makeExportFilename } from "@/lib/export-csv";
import KPICards from "@/components/dashboard/KPICards";
import PeerFilters from "@/components/dashboard/PeerFilters";
import EnrollmentTrendsChart, {
  getEnrollmentExportData,
} from "@/components/dashboard/EnrollmentTrendsChart";
import TuitionDistribution, {
  getTuitionExportData,
} from "@/components/dashboard/TuitionDistribution";
import AdmissionsFunnel, {
  getAdmissionsExportData,
} from "@/components/dashboard/AdmissionsFunnel";
import RetentionComparison, {
  getRetentionExportData,
} from "@/components/dashboard/RetentionComparison";
import StudentTeacherRatio, {
  getStudentTeacherExportData,
} from "@/components/dashboard/StudentTeacherRatio";
import FacultyComposition, {
  getFacultyExportData,
} from "@/components/dashboard/FacultyComposition";
import DataCompletenessHeatMap, {
  getCompletenessExportData,
} from "@/components/dashboard/DataCompletenessHeatMap";

function ChartCard({
  title,
  children,
  className = "",
  delay = 0,
  onExport,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onExport?: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 animate-fade-in-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-mono text-lg font-semibold text-slate-800">
          {title}
        </h2>
        {onExport && (
          <button
            onClick={onExport}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-100"
            aria-label={`Export ${title} as CSV`}
            title="Export as CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
      </div>
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
        <p className="text-slate-600">Loading dashboard...</p>
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

      <ChartCard
        title="Data Submission Status by Office"
        delay={0}
        onExport={() => {
          const { headers, rows } = getCompletenessExportData(filteredSchools);
          exportCsv(makeExportFilename("data-completeness"), headers, rows);
        }}
      >
        <DataCompletenessHeatMap filteredSchools={filteredSchools} />
      </ChartCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Row 1: Enrollment trends spans full width */}
        <ChartCard
          title="Enrollment Trends (2022-2026)"
          className="md:col-span-2"
          delay={0}
          onExport={() => {
            const { headers, rows } = getEnrollmentExportData(
              filteredSchools,
              metrics
            );
            exportCsv(makeExportFilename("enrollment-trends"), headers, rows);
          }}
        >
          <EnrollmentTrendsChart
            filteredSchools={filteredSchools}
            metrics={metrics}
          />
        </ChartCard>

        {/* Row 2: Tuition and Admissions side by side */}
        <ChartCard
          title="Tuition Distribution"
          delay={100}
          onExport={() => {
            const { headers, rows } = getTuitionExportData(
              filteredSchools,
              metrics
            );
            exportCsv(makeExportFilename("tuition-distribution"), headers, rows);
          }}
        >
          <TuitionDistribution
            filteredSchools={filteredSchools}
            metrics={metrics}
          />
        </ChartCard>

        <ChartCard
          title="Admissions Funnel (Current Year)"
          delay={150}
          onExport={() => {
            const { headers, rows } = getAdmissionsExportData(
              filteredSchools,
              metrics
            );
            exportCsv(makeExportFilename("admissions-funnel"), headers, rows);
          }}
        >
          <AdmissionsFunnel
            filteredSchools={filteredSchools}
            metrics={metrics}
          />
        </ChartCard>

        {/* Row 3: Retention and Student-Teacher Ratio side by side */}
        <ChartCard
          title="Retention Rate Comparison"
          delay={200}
          onExport={() => {
            const { headers, rows } = getRetentionExportData(
              filteredSchools,
              metrics
            );
            exportCsv(makeExportFilename("retention-comparison"), headers, rows);
          }}
        >
          <RetentionComparison
            filteredSchools={filteredSchools}
            metrics={metrics}
          />
        </ChartCard>

        <ChartCard
          title="Student-Teacher Ratio"
          delay={250}
          onExport={() => {
            const { headers, rows } = getStudentTeacherExportData(
              filteredSchools,
              metrics
            );
            exportCsv(
              makeExportFilename("student-teacher-ratio"),
              headers,
              rows
            );
          }}
        >
          <StudentTeacherRatio
            filteredSchools={filteredSchools}
            metrics={metrics}
          />
        </ChartCard>

        {/* Row 4: Faculty composition spans full width */}
        <ChartCard
          title="Faculty Nationality Composition"
          className="md:col-span-2"
          delay={300}
          onExport={() => {
            const { headers, rows } = getFacultyExportData(
              filteredSchools,
              metrics
            );
            exportCsv(makeExportFilename("faculty-composition"), headers, rows);
          }}
        >
          <FacultyComposition
            filteredSchools={filteredSchools}
            metrics={metrics}
          />
        </ChartCard>
      </div>
    </div>
  );
}

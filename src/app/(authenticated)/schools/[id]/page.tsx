"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  GraduationCap,
} from "lucide-react";
import { schools } from "@/data/schools";
import { metrics } from "@/data/metrics";
import { getSchoolMetrics, getLatestMetrics } from "@/lib/filters";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatRatio,
} from "@/lib/utils";

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h2 className="font-mono text-lg font-semibold text-slate-800 mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

interface KPICardProps {
  label: string;
  value: string;
}

function KPICard({ label, value }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className="text-2xl font-mono font-bold text-brand-900">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}

export default function SchoolDetailPage() {
  const params = useParams();
  const schoolId = params.id as string;

  const school = useMemo(
    () => schools.find((s) => s.id === schoolId),
    [schoolId]
  );
  const schoolMetrics = useMemo(
    () => getSchoolMetrics(metrics, schoolId),
    [schoolId]
  );
  const latest = useMemo(
    () => getLatestMetrics(metrics, schoolId),
    [schoolId]
  );

  if (!school) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <h1 className="text-2xl font-mono font-bold text-slate-800">
            School Not Found
          </h1>
          <p className="mt-2 text-slate-500">
            No school found with ID &ldquo;{schoolId}&rdquo;
          </p>
        </div>
      </div>
    );
  }

  const enrollmentTrendData = schoolMetrics.map((m) => ({
    year: m.year.toString(),
    enrollment: m.enrollment,
  }));

  const tuitionTrendData = schoolMetrics.map((m) => ({
    year: m.year.toString(),
    tuitionLow: m.tuitionLow,
    tuitionHigh: m.tuitionHigh,
  }));

  const retentionTrendData = schoolMetrics.map((m) => ({
    year: m.year.toString(),
    retentionRate: m.retentionRate,
  }));

  const facultyData = schoolMetrics.map((m) => ({
    year: m.year.toString(),
    hostCountry: m.facultyHostCountry,
    us: m.facultyUS,
    thirdCountry: m.facultyThirdCountry,
  }));

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* School Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-mono font-bold text-brand-900">
          {school.name}
        </h1>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-slate-400" />
            {school.city}, {school.country}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-slate-400" />
            Founded {school.founded}
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-slate-400" />
            {school.curriculum}
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="h-4 w-4 text-slate-400" />
            {school.accreditation}
          </span>
          <span className="flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-slate-400" />
            {school.gradeRange}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-400">
          Region: {school.region} | Size: {school.sizeCategory}
          {school.stateDeptAssisted && " | State Dept. Assisted"}
        </div>
      </div>

      {/* KPI Cards for this school */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          label="Enrollment"
          value={formatNumber(latest?.enrollment ?? school.enrollment)}
        />
        <KPICard
          label="Tuition (High)"
          value={formatCurrency(latest?.tuitionHigh ?? school.tuitionHigh)}
        />
        <KPICard
          label="Retention Rate"
          value={formatPercent(latest?.retentionRate ?? 0)}
        />
        <KPICard
          label="Student-Teacher Ratio"
          value={formatRatio(latest?.studentTeacherRatio ?? 0)}
        />
        <KPICard
          label="Faculty Count"
          value={formatNumber(latest?.facultyCount ?? 0)}
        />
      </div>

      {/* Trend charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Enrollment Over Time">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={enrollmentTrendData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: "#64748B" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748B" }}
                tickLine={false}
                tickFormatter={(v) => formatNumber(v)}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  fontSize: "13px",
                }}
                formatter={(value) => [formatNumber(Number(value)), "Enrollment"]}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="enrollment"
                stroke="#1E40AF"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#1E40AF" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tuition Range Over Time">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={tuitionTrendData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: "#64748B" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748B" }}
                tickLine={false}
                tickFormatter={(v) => formatCurrency(v)}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  fontSize: "13px",
                }}
                formatter={(value, name) => [
                  formatCurrency(Number(value)),
                  name === "tuitionLow" ? "Low" : "High",
                ]}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Bar dataKey="tuitionLow" fill="#93C5FD" radius={[4, 4, 0, 0]} maxBarSize={30}>
                {tuitionTrendData.map((_, i) => (
                  <Cell key={`low-${i}`} fill="#93C5FD" />
                ))}
              </Bar>
              <Bar dataKey="tuitionHigh" fill="#1E40AF" radius={[4, 4, 0, 0]} maxBarSize={30}>
                {tuitionTrendData.map((_, i) => (
                  <Cell key={`high-${i}`} fill="#1E40AF" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Retention Rate Over Time">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={retentionTrendData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: "#64748B" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748B" }}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  fontSize: "13px",
                }}
                formatter={(value) => [
                  formatPercent(Number(value)),
                  "Retention Rate",
                ]}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="retentionRate"
                stroke="#059669"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#059669" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Faculty Composition Over Time">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={facultyData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: "#64748B" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748B" }}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  fontSize: "13px",
                }}
                formatter={(value, name) => {
                  const labels: Record<string, string> = {
                    hostCountry: "Host-Country",
                    us: "US",
                    thirdCountry: "Third-Country",
                  };
                  return [`${Number(value).toFixed(1)}%`, labels[String(name)] || String(name)];
                }}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Bar
                dataKey="hostCountry"
                stackId="faculty"
                fill="#1E40AF"
                name="Host-Country"
              />
              <Bar
                dataKey="us"
                stackId="faculty"
                fill="#60A5FA"
                name="US"
              />
              <Bar
                dataKey="thirdCountry"
                stackId="faculty"
                fill="#CBD5E1"
                name="Third-Country"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

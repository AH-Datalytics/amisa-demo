"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/lib/utils";
import type { School, AnnualMetrics } from "@/lib/types";

interface EnrollmentTrendsChartProps {
  filteredSchools: School[];
  metrics: AnnualMetrics[];
}

const REGION_COLORS: Record<string, string> = {
  "South America": "#1E40AF",
  "Central America": "#059669",
  "Caribbean": "#D97706",
  "North America": "#7C3AED",
};

function getSchoolColor(school: School): string {
  return REGION_COLORS[school.region] || "#64748B";
}

export default function EnrollmentTrendsChart({
  filteredSchools,
  metrics,
}: EnrollmentTrendsChartProps) {
  const { chartData, schoolNames } = useMemo(() => {
    const years = [2022, 2023, 2024, 2025, 2026];
    const names: Record<string, string> = {};

    filteredSchools.forEach((s) => {
      names[s.id] = s.name;
    });

    const data = years.map((year) => {
      const point: Record<string, number | string> = { year: year.toString() };
      filteredSchools.forEach((school) => {
        const m = metrics.find(
          (metric) => metric.schoolId === school.id && metric.year === year
        );
        if (m) {
          point[school.id] = m.enrollment;
        }
      });
      return point;
    });

    return { chartData: data, schoolNames: names };
  }, [filteredSchools, metrics]);

  return (
    <div>
      <ResponsiveContainer width="100%" height={340}>
        <LineChart
          data={chartData}
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
            formatter={(value, name) => [
              formatNumber(Number(value)),
              schoolNames[String(name)] || String(name),
            ]}
            labelFormatter={(label) => `Year: ${label}`}
          />
          {filteredSchools.map((school) => (
            <Line
              key={school.id}
              type="monotone"
              dataKey={school.id}
              stroke={getSchoolColor(school)}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-5 mt-3 px-2">
        {Object.entries(REGION_COLORS).map(([region, color]) => (
          <span key={region} className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span
              className="inline-block w-4 h-0.5 flex-shrink-0 rounded"
              style={{ backgroundColor: color }}
            />
            {region}
          </span>
        ))}
      </div>
    </div>
  );
}

export function getEnrollmentExportData(
  filteredSchools: School[],
  metrics: AnnualMetrics[]
) {
  const years = [2022, 2023, 2024, 2025, 2026];
  const headers = ["School", ...years.map(String)];
  const rows = filteredSchools.map((school) => {
    const schoolMetrics = metrics
      .filter((m) => m.schoolId === school.id)
      .sort((a, b) => a.year - b.year);
    return [
      school.name,
      ...years.map((y) => {
        const m = schoolMetrics.find((sm) => sm.year === y);
        return m ? m.enrollment : "";
      }),
    ] as (string | number)[];
  });
  return { headers, rows };
}

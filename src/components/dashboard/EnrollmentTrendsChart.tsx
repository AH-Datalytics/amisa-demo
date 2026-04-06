"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatNumber } from "@/lib/utils";
import type { School, AnnualMetrics } from "@/lib/types";

interface EnrollmentTrendsChartProps {
  filteredSchools: School[];
  metrics: AnnualMetrics[];
}

const CHART_COLORS = [
  "#1E40AF",
  "#D97706",
  "#059669",
  "#DC2626",
  "#7C3AED",
  "#0891B2",
  "#BE185D",
  "#65A30D",
  "#EA580C",
  "#4338CA",
  "#0D9488",
  "#9333EA",
];

function shortenName(name: string): string {
  return name.length > 15 ? name.slice(0, 15) + "..." : name;
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

  const showScrollableLegend = filteredSchools.length > 6;

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
              schoolNames[String(name)] ? shortenName(schoolNames[String(name)]) : String(name),
            ]}
            labelFormatter={(label) => `Year: ${label}`}
          />
          {!showScrollableLegend && (
            <Legend
              formatter={(value) =>
                shortenName(schoolNames[String(value)] || String(value))
              }
              wrapperStyle={{ fontSize: "12px" }}
            />
          )}
          {filteredSchools.map((school, i) => (
            <Line
              key={school.id}
              type="monotone"
              dataKey={school.id}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {showScrollableLegend && (
        <div className="mt-3 max-h-24 overflow-y-auto border-t border-slate-100 pt-2">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-2">
            {filteredSchools.map((school, i) => (
              <Link
                key={school.id}
                href={`/schools/${school.id}`}
                className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-brand-700 transition-colors"
              >
                <span
                  className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                  }}
                />
                {shortenName(school.name)}
              </Link>
            ))}
          </div>
        </div>
      )}
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

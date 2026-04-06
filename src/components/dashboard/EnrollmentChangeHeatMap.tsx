"use client";

import { useMemo } from "react";
import type { School, AnnualMetrics } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface EnrollmentChangeHeatMapProps {
  filteredSchools: School[];
  metrics: AnnualMetrics[];
}

const YEARS = [2022, 2023, 2024, 2025, 2026];

function getChangeColor(pctChange: number): { bg: string; text: string } {
  if (pctChange > 5) return { bg: "bg-emerald-200", text: "text-emerald-800" };
  if (pctChange > 2) return { bg: "bg-emerald-100", text: "text-emerald-700" };
  if (pctChange > 0) return { bg: "bg-emerald-50", text: "text-emerald-600" };
  if (pctChange === 0) return { bg: "bg-slate-50", text: "text-slate-500" };
  if (pctChange > -2) return { bg: "bg-red-50", text: "text-red-600" };
  if (pctChange > -5) return { bg: "bg-red-100", text: "text-red-700" };
  return { bg: "bg-red-200", text: "text-red-800" };
}

export default function EnrollmentChangeHeatMap({
  filteredSchools,
  metrics,
}: EnrollmentChangeHeatMapProps) {
  const heatData = useMemo(() => {
    return filteredSchools.map((school) => {
      const schoolMetrics = metrics
        .filter((m) => m.schoolId === school.id)
        .sort((a, b) => a.year - b.year);

      const cells = YEARS.map((year, idx) => {
        const current = schoolMetrics.find((m) => m.year === year);
        if (!current) return null;

        if (idx === 0) {
          // First year: show absolute enrollment, no change
          return {
            year,
            enrollment: current.enrollment,
            change: null as number | null,
          };
        }

        const prevYear = YEARS[idx - 1];
        const prev = schoolMetrics.find((m) => m.year === prevYear);
        if (!prev) {
          return {
            year,
            enrollment: current.enrollment,
            change: null as number | null,
          };
        }

        const change =
          ((current.enrollment - prev.enrollment) / prev.enrollment) * 100;
        return { year, enrollment: current.enrollment, change };
      });

      return { school, cells };
    });
  }, [filteredSchools, metrics]);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2 pr-4 font-medium text-slate-600 sticky left-0 bg-white min-w-[180px]">
                School
              </th>
              {YEARS.map((year) => (
                <th
                  key={year}
                  className="text-center py-2 px-2 font-medium text-slate-600 min-w-[80px]"
                >
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatData.map(({ school, cells }) => (
              <tr key={school.id} className="border-t border-slate-100">
                <td className="py-2 pr-4 text-slate-700 font-medium sticky left-0 bg-white text-xs">
                  {school.name}
                </td>
                {cells.map((cell, idx) => {
                  if (!cell) {
                    return (
                      <td key={YEARS[idx]} className="py-2 px-1 text-center">
                        <div className="rounded px-2 py-1.5 text-[10px] font-medium bg-slate-50 text-slate-400">
                          --
                        </div>
                      </td>
                    );
                  }

                  if (cell.change === null) {
                    // First year or no previous data: show absolute enrollment
                    return (
                      <td key={cell.year} className="py-2 px-1 text-center">
                        <div
                          className="rounded px-2 py-1.5 text-[10px] font-medium bg-brand-50 text-brand-700"
                          title={`${school.name} ${cell.year}: ${formatNumber(cell.enrollment)} students`}
                        >
                          {formatNumber(cell.enrollment)}
                        </div>
                      </td>
                    );
                  }

                  const colors = getChangeColor(cell.change);
                  const sign = cell.change > 0 ? "+" : "";
                  return (
                    <td key={cell.year} className="py-2 px-1 text-center">
                      <div
                        className={`rounded px-2 py-1.5 text-[10px] font-medium ${colors.bg} ${colors.text}`}
                        title={`${school.name} ${cell.year}: ${formatNumber(cell.enrollment)} students (${sign}${cell.change.toFixed(1)}% YoY)`}
                      >
                        {sign}{cell.change.toFixed(1)}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-slate-500">
        <span className="font-medium text-slate-600">YoY Change:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-200 border border-emerald-300" />
          &gt;5%
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200" />
          2-5%
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-100" />
          0-2%
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-50 border border-red-100" />
          0 to -2%
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-100 border border-red-200" />
          -2 to -5%
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-200 border border-red-300" />
          &lt;-5%
        </div>
      </div>
    </div>
  );
}

export function getEnrollmentChangeExportData(
  filteredSchools: School[],
  metrics: AnnualMetrics[]
) {
  const headers = ["School", ...YEARS.map(String)];
  const rows = filteredSchools.map((school) => {
    const schoolMetrics = metrics
      .filter((m) => m.schoolId === school.id)
      .sort((a, b) => a.year - b.year);

    return [
      school.name,
      ...YEARS.map((year, idx) => {
        const current = schoolMetrics.find((m) => m.year === year);
        if (!current) return "";
        if (idx === 0) return current.enrollment;
        const prevYear = YEARS[idx - 1];
        const prev = schoolMetrics.find((m) => m.year === prevYear);
        if (!prev) return current.enrollment;
        const change =
          ((current.enrollment - prev.enrollment) / prev.enrollment) * 100;
        const sign = change > 0 ? "+" : "";
        return `${sign}${change.toFixed(1)}%`;
      }),
    ] as (string | number)[];
  });
  return { headers, rows };
}

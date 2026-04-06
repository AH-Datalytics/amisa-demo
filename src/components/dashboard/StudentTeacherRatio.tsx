"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { formatRatio } from "@/lib/utils";
import { getLatestMetrics } from "@/lib/filters";
import type { School, AnnualMetrics } from "@/lib/types";

interface StudentTeacherRatioProps {
  filteredSchools: School[];
  metrics: AnnualMetrics[];
}

function shortenName(name: string): string {
  return name.length > 18 ? name.slice(0, 18) + "..." : name;
}

function getRatioColor(ratio: number): string {
  if (ratio <= 8) return "#059669";
  if (ratio <= 10) return "#D97706";
  return "#DC2626";
}

interface ChartDatum {
  id: string;
  name: string;
  shortName: string;
  ratio: number;
}

export default function StudentTeacherRatio({
  filteredSchools,
  metrics,
}: StudentTeacherRatioProps) {
  const { chartData, avgRatio } = useMemo(() => {
    const data: ChartDatum[] = filteredSchools
      .map((school) => {
        const latest = getLatestMetrics(metrics, school.id);
        return {
          id: school.id,
          name: school.name,
          shortName: shortenName(school.name),
          ratio: latest?.studentTeacherRatio ?? 0,
        };
      })
      .sort((a, b) => a.ratio - b.ratio);

    const avg =
      data.length > 0
        ? data.reduce((sum, d) => sum + d.ratio, 0) / data.length
        : 0;

    return { chartData: data, avgRatio: avg };
  }, [filteredSchools, metrics]);

  const chartHeight = Math.max(300, chartData.length * 40 + 40);

  return (
    <div>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 50, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: "#64748B" }}
            tickLine={false}
            tickFormatter={(v) => `${v}:1`}
          />
          <YAxis
            dataKey="shortName"
            type="category"
            width={140}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tick={(props: any) => {
              const { x, y, payload } = props;
              const item = chartData.find((d) => d.shortName === payload.value);
              return (
                <g>
                  <a href={item ? `/schools/${item.id}` : "#"} style={{ cursor: "pointer" }}>
                    <text x={x - 4} y={y} dy={4} textAnchor="end" fontSize={11} fill="#64748B" className="hover:fill-[#1E40AF] hover:underline">
                      {payload.value}
                    </text>
                  </a>
                </g>
              );
            }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              fontSize: "13px",
            }}
            formatter={(value) => [formatRatio(Number(value)), "Ratio"]}
            labelFormatter={(_label, payload) => {
              if (payload && payload.length > 0) {
                return (payload[0].payload as ChartDatum).name;
              }
              return String(_label);
            }}
          />
          <ReferenceLine
            x={avgRatio}
            stroke="#94A3B8"
            strokeDasharray="4 4"
            label={{
              value: `Avg ${formatRatio(avgRatio)}`,
              position: "top",
              style: { fontSize: "11px", fill: "#64748B" },
            }}
          />
          <Bar dataKey="ratio" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getRatioColor(entry.ratio)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-2 flex items-center gap-4 justify-center text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#059669]" />
          8:1 or lower
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#D97706]" />
          8-10:1
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#DC2626]" />
          10:1+
        </span>
      </div>

    </div>
  );
}

export function getStudentTeacherExportData(
  filteredSchools: School[],
  metrics: AnnualMetrics[]
) {
  const headers = ["School", "Student-Teacher Ratio"];
  const rows = filteredSchools.map((school) => {
    const latest = getLatestMetrics(metrics, school.id);
    return [
      school.name,
      latest?.studentTeacherRatio ?? "",
    ] as (string | number)[];
  });
  return { headers, rows };
}

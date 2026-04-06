"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatPercent } from "@/lib/utils";
import { getLatestMetrics } from "@/lib/filters";
import type { School, AnnualMetrics } from "@/lib/types";

interface RetentionComparisonProps {
  filteredSchools: School[];
  metrics: AnnualMetrics[];
}

function shortenName(name: string): string {
  return name.length > 18 ? name.slice(0, 18) + "..." : name;
}

function getRetentionColor(rate: number): string {
  if (rate > 92) return "#059669";
  if (rate >= 88) return "#D97706";
  return "#DC2626";
}

interface ChartDatum {
  id: string;
  name: string;
  shortName: string;
  retentionRate: number;
}

export default function RetentionComparison({
  filteredSchools,
  metrics,
}: RetentionComparisonProps) {
  const chartData: ChartDatum[] = useMemo(() => {
    return filteredSchools
      .map((school) => {
        const latest = getLatestMetrics(metrics, school.id);
        return {
          id: school.id,
          name: school.name,
          shortName: shortenName(school.name),
          retentionRate: latest?.retentionRate ?? 0,
        };
      })
      .sort((a, b) => b.retentionRate - a.retentionRate);
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
            domain={[75, 100]}
            tick={{ fontSize: 12, fill: "#64748B" }}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            dataKey="shortName"
            type="category"
            width={140}
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              fontSize: "13px",
            }}
            formatter={(value) => [formatPercent(Number(value)), "Retention Rate"]}
            labelFormatter={(_label, payload) => {
              if (payload && payload.length > 0) {
                return (payload[0].payload as ChartDatum).name;
              }
              return String(_label);
            }}
          />
          <Bar dataKey="retentionRate" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getRetentionColor(entry.retentionRate)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-2 flex items-center gap-4 justify-center text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#059669]" />
          &gt;92%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#D97706]" />
          88-92%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#DC2626]" />
          &lt;88%
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 px-2">
        {chartData.map((d) => (
          <Link
            key={d.id}
            href={`/schools/${d.id}`}
            className="text-xs text-brand-600 hover:text-brand-800 hover:underline transition-colors"
          >
            {shortenName(d.name)}
          </Link>
        ))}
      </div>
    </div>
  );
}

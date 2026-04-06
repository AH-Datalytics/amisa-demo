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
import { formatCurrency } from "@/lib/utils";
import { getLatestMetrics } from "@/lib/filters";
import type { School, AnnualMetrics } from "@/lib/types";

interface TuitionDistributionProps {
  filteredSchools: School[];
  metrics: AnnualMetrics[];
}

function shortenName(name: string): string {
  return name.length > 18 ? name.slice(0, 18) + "..." : name;
}

interface ChartDatum {
  id: string;
  name: string;
  shortName: string;
  tuitionHigh: number;
  tuitionLow: number;
}

export default function TuitionDistribution({
  filteredSchools,
  metrics,
}: TuitionDistributionProps) {
  const chartData: ChartDatum[] = useMemo(() => {
    return filteredSchools
      .map((school) => {
        const latest = getLatestMetrics(metrics, school.id);
        return {
          id: school.id,
          name: school.name,
          shortName: shortenName(school.name),
          tuitionHigh: latest?.tuitionHigh ?? school.tuitionHigh,
          tuitionLow: latest?.tuitionLow ?? school.tuitionLow,
        };
      })
      .sort((a, b) => b.tuitionHigh - a.tuitionHigh);
  }, [filteredSchools, metrics]);

  const chartHeight = Math.max(300, chartData.length * 40 + 40);

  return (
    <div>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: "#64748B" }}
            tickLine={false}
            tickFormatter={(v) => formatCurrency(v)}
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
            formatter={(_value, _name, props) => {
              const d = props.payload as ChartDatum;
              return [
                `${formatCurrency(d.tuitionLow)} - ${formatCurrency(d.tuitionHigh)}`,
                "Tuition Range",
              ];
            }}
            labelFormatter={(_label, payload) => {
              if (payload && payload.length > 0) {
                return (payload[0].payload as ChartDatum).name;
              }
              return String(_label);
            }}
          />
          <Bar dataKey="tuitionHigh" radius={[0, 4, 4, 0]}>
            {chartData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill="#3B82F6"
                className="cursor-pointer hover:opacity-80"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
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

export function getTuitionExportData(
  filteredSchools: School[],
  metrics: AnnualMetrics[]
) {
  const headers = ["School", "Tuition Low", "Tuition High"];
  const rows = filteredSchools.map((school) => {
    const latest = getLatestMetrics(metrics, school.id);
    return [
      school.name,
      latest?.tuitionLow ?? "",
      latest?.tuitionHigh ?? "",
    ] as (string | number)[];
  });
  return { headers, rows };
}

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
  Legend,
} from "recharts";
import { getLatestMetrics } from "@/lib/filters";
import type { School, AnnualMetrics } from "@/lib/types";

interface FacultyCompositionProps {
  filteredSchools: School[];
  metrics: AnnualMetrics[];
}

function shortenName(name: string): string {
  return name.length > 15 ? name.slice(0, 15) + "..." : name;
}

interface ChartDatum {
  id: string;
  name: string;
  shortName: string;
  hostCountry: number;
  us: number;
  thirdCountry: number;
}

export default function FacultyComposition({
  filteredSchools,
  metrics,
}: FacultyCompositionProps) {
  const chartData: ChartDatum[] = useMemo(() => {
    return filteredSchools.map((school) => {
      const latest = getLatestMetrics(metrics, school.id);
      return {
        id: school.id,
        name: school.name,
        shortName: shortenName(school.name),
        hostCountry: latest?.facultyHostCountry ?? 0,
        us: latest?.facultyUS ?? 0,
        thirdCountry: latest?.facultyThirdCountry ?? 0,
      };
    });
  }, [filteredSchools, metrics]);

  return (
    <div>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis
            dataKey="shortName"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tick={(props: any) => {
              const { x, y, payload } = props;
              const item = chartData.find((d) => d.shortName === payload.value);
              return (
                <g transform={`rotate(-35, ${x}, ${y})`}>
                  <a href={item ? `/schools/${item.id}` : "#"} style={{ cursor: "pointer" }}>
                    <text x={x} y={y} dy={12} textAnchor="end" fontSize={10} fill="#64748B" className="hover:fill-[#1E40AF] hover:underline">
                      {payload.value}
                    </text>
                  </a>
                </g>
              );
            }}
            tickLine={false}
            height={60}
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
            labelFormatter={(_label, payload) => {
              if (payload && payload.length > 0) {
                return (payload[0].payload as ChartDatum).name;
              }
              return String(_label);
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px" }}
            formatter={(value) => {
              const labels: Record<string, string> = {
                hostCountry: "Host-Country",
                us: "US",
                thirdCountry: "Third-Country",
              };
              return labels[String(value)] || String(value);
            }}
          />
          <Bar
            dataKey="hostCountry"
            stackId="faculty"
            fill="#1E40AF"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="us"
            stackId="faculty"
            fill="#60A5FA"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="thirdCountry"
            stackId="faculty"
            fill="#CBD5E1"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export function getFacultyExportData(
  filteredSchools: School[],
  metrics: AnnualMetrics[]
) {
  const headers = [
    "School",
    "Host Country (%)",
    "US Faculty (%)",
    "Third Country (%)",
  ];
  const rows = filteredSchools.map((school) => {
    const latest = getLatestMetrics(metrics, school.id);
    return [
      school.name,
      latest?.facultyHostCountry ?? "",
      latest?.facultyUS ?? "",
      latest?.facultyThirdCountry ?? "",
    ] as (string | number)[];
  });
  return { headers, rows };
}

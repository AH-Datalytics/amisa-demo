"use client";

import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartConfig } from "@/lib/types";

const BRAND_COLORS = ["#1E40AF", "#D97706", "#059669", "#DC2626", "#7C3AED", "#0891B2"];

interface ResponseChartProps {
  config: ChartConfig;
}

export default function ResponseChart({ config }: ResponseChartProps) {
  const colors = config.colors ?? BRAND_COLORS;
  const yKeys = Array.isArray(config.yKey) ? config.yKey : [config.yKey];

  return (
    <div className="mt-3 bg-white rounded-xl border border-slate-200 p-4">
      <h4 className="text-sm font-semibold text-slate-700 mb-3">{config.title}</h4>
      <ResponsiveContainer width="100%" height={280}>
        {config.type === "pie" ? (
          <PieChart>
            <Pie
              data={config.data}
              dataKey={yKeys[0]}
              nameKey={config.xKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }: { name?: string; value?: number }) => `${name ?? ""}: ${value ?? ""}`}
            >
              {config.data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : config.type === "horizontal_bar" ? (
          <BarChart data={config.data} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis
              type="category"
              dataKey={config.yKey as string}
              tick={{ fontSize: 11, fill: "#64748b" }}
              width={110}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey={config.xKey} fill={colors[0]} radius={[0, 4, 4, 0]} />
          </BarChart>
        ) : config.type === "line" ? (
          <LineChart data={config.data} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey={config.xKey} tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            {yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: "11px" }} />}
            {yKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                dot={{ r: 3, fill: colors[i % colors.length] }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        ) : (
          // Default: vertical bar chart
          <BarChart data={config.data} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey={config.xKey}
              tick={{ fontSize: 11, fill: "#64748b" }}
              angle={-35}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            {yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: "11px" }} />}
            {yKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[i % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

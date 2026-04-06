"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { formatNumber, formatPercent } from "@/lib/utils";
import { getLatestMetrics } from "@/lib/filters";
import type { School, AnnualMetrics } from "@/lib/types";

interface AdmissionsFunnelProps {
  filteredSchools: School[];
  metrics: AnnualMetrics[];
}

const STAGE_COLORS = ["#1E40AF", "#3B82F6", "#D97706"];

export default function AdmissionsFunnel({
  filteredSchools,
  metrics,
}: AdmissionsFunnelProps) {
  const { funnelData, acceptanceRate, yieldRate } = useMemo(() => {
    const latestMetrics = filteredSchools
      .map((s) => getLatestMetrics(metrics, s.id))
      .filter(Boolean) as AnnualMetrics[];

    const totalApplications = latestMetrics.reduce(
      (sum, m) => sum + m.applications,
      0
    );
    const totalAcceptances = latestMetrics.reduce(
      (sum, m) => sum + m.acceptances,
      0
    );
    const totalEnrolledNew = latestMetrics.reduce(
      (sum, m) => sum + m.enrolledNew,
      0
    );

    const accRate =
      totalApplications > 0
        ? (totalAcceptances / totalApplications) * 100
        : 0;
    const yldRate =
      totalAcceptances > 0
        ? (totalEnrolledNew / totalAcceptances) * 100
        : 0;

    return {
      funnelData: [
        { stage: "Applications", value: totalApplications },
        { stage: "Acceptances", value: totalAcceptances },
        { stage: "Enrolled (New)", value: totalEnrolledNew },
      ],
      acceptanceRate: accRate,
      yieldRate: yldRate,
    };
  }, [filteredSchools, metrics]);

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={funnelData}
          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
        >
          <XAxis
            dataKey="stage"
            tick={{ fontSize: 12, fill: "#64748B" }}
            tickLine={false}
            axisLine={false}
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
            formatter={(value) => [formatNumber(Number(value)), "Count"]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={80}>
            {funnelData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={STAGE_COLORS[index]} />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v) => formatNumber(Number(v))}
              style={{ fontSize: "12px", fontWeight: 600, fill: "#334155" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-3 flex items-center justify-center gap-8 border-t border-slate-100 pt-3">
        <div className="text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wide">
            Acceptance Rate
          </div>
          <div className="text-lg font-mono font-bold text-brand-800">
            {formatPercent(acceptanceRate)}
          </div>
        </div>
        <div className="w-px h-8 bg-slate-200" />
        <div className="text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wide">
            Yield Rate
          </div>
          <div className="text-lg font-mono font-bold text-accent-600">
            {formatPercent(yieldRate)}
          </div>
        </div>
      </div>
    </div>
  );
}

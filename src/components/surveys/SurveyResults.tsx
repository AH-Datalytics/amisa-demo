"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { SurveyResultData } from "@/lib/types";

export default function SurveyResults({
  results,
}: {
  results: SurveyResultData[];
}) {
  return (
    <div className="space-y-6 pt-4">
      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
        Aggregated Results
      </p>
      {results.map((r) => (
        <div key={r.questionId} className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h4 className="text-sm font-medium text-slate-700">
              {r.questionTitle}
            </h4>
            <span className="text-xs text-slate-400">
              {r.responseCount} responses
            </span>
          </div>

          {r.questionType === "multiple-choice" && r.options && (
            <div className="h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={r.options}
                  layout="vertical"
                  margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E8F0"
                    horizontal={false}
                  />
                  <XAxis type="number" tick={{ fill: "#64748B", fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    tick={{ fill: "#64748B", fontSize: 11 }}
                    width={160}
                  />
                  <Tooltip
                    contentStyle={{
                      border: "1px solid #E2E8F0",
                      borderRadius: 8,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {r.questionType === "likert" && r.average !== undefined && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(r.average / 5) * 100}%` }}
                />
              </div>
              <span className="text-lg font-mono font-semibold text-blue-900">
                {r.average.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Check, Clock } from "lucide-react";
import type { Survey } from "@/lib/types";

type FilterTab = "all" | "completed" | "incomplete";

interface CompletionTrackerProps {
  survey: Survey;
}

export default function CompletionTracker({ survey }: CompletionTrackerProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const completedCount = survey.completions.filter((c) => c.completed).length;
  const totalCount = survey.completions.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredCompletions = survey.completions.filter((c) => {
    if (activeTab === "completed") return c.completed;
    if (activeTab === "incomplete") return !c.completed;
    return true;
  });

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: totalCount },
    { key: "completed", label: "Completed", count: completedCount },
    { key: "incomplete", label: "Incomplete", count: totalCount - completedCount },
  ];

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-5">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-mono font-semibold text-slate-800">
            {survey.title}
          </h3>
          <span className="text-2xl font-bold text-brand-800 shrink-0">
            {percentage}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="h-3 w-full rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full bg-brand-800 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">
            {completedCount} of {totalCount} schools completed
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === tab.key
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* School list */}
      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {filteredCompletions.map((completion) => (
          <div
            key={completion.schoolId}
            className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-slate-50 transition"
          >
            <span className="text-sm text-slate-700">{completion.schoolName}</span>
            {completion.completed ? (
              <div className="flex items-center gap-2">
                {completion.completedAt && (
                  <span className="text-xs text-slate-400">
                    {formatDate(completion.completedAt)}
                  </span>
                )}
                <Check className="h-4 w-4 text-green-600" />
              </div>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                <Clock className="h-3 w-3" />
                Incomplete
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

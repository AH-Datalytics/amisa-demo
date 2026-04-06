"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Eye, CheckCircle, XCircle, Calendar, FileText, Download } from "lucide-react";
import { surveys as initialSurveys } from "@/data/surveys";
import { useAuth } from "@/lib/auth-context";
import { exportCsv, makeExportFilename } from "@/lib/export-csv";
import type { Survey, SurveyStatus } from "@/lib/types";

const statusConfig: Record<SurveyStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-slate-100 text-slate-600" },
  pending_approval: { label: "Pending Approval", className: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", className: "bg-blue-100 text-blue-700" },
  distributed: { label: "Distributed", className: "bg-emerald-100 text-emerald-700" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700" },
};

interface SurveyListProps {
  onViewResults?: (survey: Survey) => void;
}

export default function SurveyList({ onViewResults }: SurveyListProps) {
  const { currentRole } = useAuth();
  const [surveyData, setSurveyData] = useState<Survey[]>(() =>
    initialSurveys.map((s) => ({ ...s }))
  );

  function handleApprove(surveyId: string) {
    setSurveyData((prev) =>
      prev.map((s) => (s.id === surveyId ? { ...s, status: "approved" as SurveyStatus } : s))
    );
  }

  function handleDeny(surveyId: string) {
    setSurveyData((prev) =>
      prev.map((s) => (s.id === surveyId ? { ...s, status: "draft" as SurveyStatus } : s))
    );
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-4">
      {/* Header with Create button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {surveyData.length} survey{surveyData.length !== 1 ? "s" : ""}
        </p>
        <Link
          href="/surveys/builder"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-900"
        >
          <Plus className="h-4 w-4" />
          Create New Survey
        </Link>
      </div>

      {/* Survey cards */}
      <div className="space-y-3">
        {surveyData.map((survey) => {
          const progress =
            survey.totalSchools > 0
              ? (survey.completedSchools / survey.totalSchools) * 100
              : 0;
          const config = statusConfig[survey.status];

          return (
            <div
              key={survey.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 transition hover:shadow-md card-interactive"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Left: info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-mono font-semibold text-slate-800 truncate">
                      {survey.title}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Created {formatDate(survey.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      {survey.questionCount} questions
                    </span>
                    <span>by {survey.createdBy}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>
                        {survey.completedSchools} of {survey.totalSchools} schools
                      </span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-brand-800 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {survey.status === "draft" && (
                    <Link
                      href="/surveys/builder"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                  )}

                  {survey.status === "pending_approval" && currentRole === "network_admin" && (
                    <>
                      <button
                        onClick={() => handleApprove(survey.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeny(survey.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Deny
                      </button>
                    </>
                  )}

                  {survey.status === "pending_approval" && currentRole !== "network_admin" && (
                    <span className="text-xs text-amber-600 italic">Awaiting admin review</span>
                  )}

                  {(survey.status === "distributed" || survey.status === "completed") && (
                    <>
                      <button
                        onClick={() => onViewResults?.(survey)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 transition hover:bg-brand-100"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Results
                      </button>
                      <button
                        onClick={() => {
                          const headers = ["School", "Completed", "Completion Date"];
                          const rows = survey.completions.map((c) => [
                            c.schoolName,
                            c.completed ? "Yes" : "No",
                            c.completedAt
                              ? new Date(c.completedAt).toLocaleDateString()
                              : "",
                          ]);
                          exportCsv(
                            makeExportFilename(survey.id),
                            headers,
                            rows
                          );
                        }}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-100"
                        aria-label={`Export ${survey.title} responses as CSV`}
                        title="Export responses as CSV"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

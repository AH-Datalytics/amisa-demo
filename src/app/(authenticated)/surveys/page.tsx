"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import SurveyList from "@/components/surveys/SurveyList";
import CompletionTracker from "@/components/surveys/CompletionTracker";
import type { Survey } from "@/lib/types";

export default function SurveysPage() {
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  function handleViewResults(survey: Survey) {
    setSelectedSurvey((prev) => (prev?.id === survey.id ? null : survey));
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-brand-800" />
          <h1 className="text-2xl font-mono font-bold text-brand-900">
            Surveys
          </h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Create, manage, and track survey completion
        </p>
      </div>

      {/* Survey list */}
      <SurveyList onViewResults={handleViewResults} />

      {/* Completion tracker */}
      {selectedSurvey && (
        <div className="pt-2">
          <CompletionTracker survey={selectedSurvey} />
        </div>
      )}
    </div>
  );
}

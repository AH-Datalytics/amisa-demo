"use client";

import Link from "next/link";
import { ArrowLeft, PenTool } from "lucide-react";
import SurveyCreatorWrapper from "@/components/surveys/SurveyCreatorWrapper";

export default function SurveyBuilderPage() {
  return (
    <div className="space-y-5">
      {/* Back link + header */}
      <div>
        <Link
          href="/surveys"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-800 transition mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Surveys
        </Link>
        <div className="flex items-center gap-2">
          <PenTool className="h-6 w-6 text-brand-800" />
          <h1 className="text-2xl font-mono font-bold text-brand-900">
            Survey Builder
          </h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Drag and drop to create surveys
        </p>
      </div>

      {/* Survey Creator */}
      <div className="min-h-[600px]">
        <SurveyCreatorWrapper />
      </div>
    </div>
  );
}

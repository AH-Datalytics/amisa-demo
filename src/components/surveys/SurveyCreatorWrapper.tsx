"use client";

import dynamic from "next/dynamic";

const SurveyCreatorInner = dynamic(
  () => import("./SurveyCreatorInner").then((mod) => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[600px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-slate-200 border-t-brand-800" />
          <p className="text-sm text-slate-500">Loading Survey Builder...</p>
        </div>
      </div>
    ),
  }
);

export default function SurveyCreatorWrapper() {
  return <SurveyCreatorInner />;
}

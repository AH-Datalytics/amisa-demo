"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";

interface OfficeStatus {
  name: string;
  submitted: boolean;
}

const offices: OfficeStatus[] = [
  { name: "Superintendent's Office", submitted: true },
  { name: "Learning Office", submitted: true },
  { name: "Human Resources", submitted: true },
  { name: "Admissions Office", submitted: true },
  { name: "Business Office", submitted: false },
  { name: "Medical Office", submitted: false },
  { name: "Alumni Office", submitted: false },
];

export default function SubmissionStatus() {
  const submitted = offices.filter((o) => o.submitted).length;
  const total = offices.length;
  const progressPercent = (submitted / total) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-mono font-bold text-brand-900">
          Data Submission Status
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {submitted} of {total} Offices Submitted
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mb-5">
        <div
          className="bg-green-500 h-2 rounded-full transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Office list */}
      <div className="space-y-3">
        {offices.map((office) => (
          <div
            key={office.name}
            className="flex items-center justify-between"
          >
            <span className="text-sm text-slate-700">{office.name}</span>
            {office.submitted ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Submitted
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                <AlertCircle className="h-3.5 w-3.5" />
                Incomplete
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

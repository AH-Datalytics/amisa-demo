"use client";

import { School, Office } from "@/lib/types";

const OFFICES: { key: Office; label: string }[] = [
  { key: "superintendent", label: "Supt" },
  { key: "learning", label: "Learn" },
  { key: "hr", label: "HR" },
  { key: "admissions", label: "Adm" },
  { key: "business", label: "Bus" },
  { key: "medical", label: "Med" },
  { key: "alumni", label: "Alum" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  submitted: { bg: "bg-emerald-100", text: "text-emerald-700" },
  partial: { bg: "bg-amber-100", text: "text-amber-700" },
  not_submitted: { bg: "bg-slate-100", text: "text-slate-400" },
};

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  partial: "In Progress",
  not_submitted: "Not Submitted",
};

export default function DataCompletenessHeatMap({
  filteredSchools,
}: {
  filteredSchools: School[];
}) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2 pr-4 font-medium text-slate-600 sticky left-0 bg-white min-w-[180px]">
                School
              </th>
              {OFFICES.map((o) => (
                <th
                  key={o.key}
                  className="text-center py-2 px-2 font-medium text-slate-600 min-w-[60px]"
                >
                  {o.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSchools.map((school) => (
              <tr key={school.id} className="border-t border-slate-100">
                <td className="py-2 pr-4 text-slate-700 font-medium sticky left-0 bg-white text-xs">
                  {school.name}
                </td>
                {OFFICES.map((o) => {
                  const sub = school.officeSubmissions.find(
                    (s) => s.office === o.key
                  );
                  const status = sub?.status ?? "not_submitted";
                  const colors = STATUS_COLORS[status];
                  return (
                    <td key={o.key} className="py-2 px-1 text-center">
                      <div
                        className={`rounded px-2 py-1.5 text-[10px] font-medium ${colors.bg} ${colors.text}`}
                        title={`${school.name} - ${o.label}: ${STATUS_LABELS[status]}`}
                      >
                        {status === "submitted"
                          ? "\u2713"
                          : status === "partial"
                          ? "\u00B7\u00B7\u00B7"
                          : "\u2014"}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200" />
          Submitted
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-100 border border-amber-200" />
          In Progress
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-100 border border-slate-200" />
          Not Submitted
        </div>
      </div>
    </div>
  );
}

export function getCompletenessExportData(filteredSchools: School[]) {
  const headers = ["School", ...OFFICES.map((o) => o.label)];
  const rows = filteredSchools.map((school) => [
    school.name,
    ...OFFICES.map((o) => {
      const sub = school.officeSubmissions.find((s) => s.office === o.key);
      return STATUS_LABELS[sub?.status ?? "not_submitted"];
    }),
  ]);
  return { headers, rows };
}

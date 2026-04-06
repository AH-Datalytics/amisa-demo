"use client";

import { useState, useMemo } from "react";
import { auditLog } from "@/data/audit-log";
import { schools } from "@/data/schools";
import { formatDateTime } from "@/lib/utils";

const actionBadgeStyles: Record<string, string> = {
  Login: "bg-blue-100 text-blue-700",
  "Data Submission": "bg-green-100 text-green-700",
  "Data Export": "bg-indigo-100 text-indigo-700",
  "Survey Completed": "bg-emerald-100 text-emerald-700",
  "Survey Approved": "bg-teal-100 text-teal-700",
  "User Created": "bg-purple-100 text-purple-700",
  "Role Changed": "bg-orange-100 text-orange-700",
  "Password Reset": "bg-slate-100 text-slate-700",
};

export default function AuditLog() {
  const [visibleCount, setVisibleCount] = useState(10);

  const schoolMap = useMemo(() => {
    const map: Record<string, string> = {};
    schools.forEach((s) => {
      map[s.id] = s.name;
    });
    return map;
  }, []);

  // Already sorted by most recent in data, but enforce it
  const sortedLog = useMemo(
    () =>
      [...auditLog].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    []
  );

  const visibleEntries = sortedLog.slice(0, visibleCount);
  const hasMore = visibleCount < sortedLog.length;

  return (
    <div>
      <p className="text-sm text-slate-500 mb-4">
        {sortedLog.length} recorded events
      </p>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                School
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {visibleEntries.map((entry, idx) => (
              <tr
                key={entry.id}
                className={`transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                  {formatDateTime(entry.timestamp)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-medium text-slate-900">
                    {entry.userName}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      actionBadgeStyles[entry.action] ||
                      "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {entry.action}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <span
                    className="text-sm text-slate-600 truncate block"
                    title={entry.details}
                  >
                    {entry.details}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                  {entry.schoolId
                    ? schoolMap[entry.schoolId] || entry.schoolId
                    : "AMISA HQ"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="text-sm font-medium text-brand-700 hover:text-brand-900 transition-colors"
          >
            Show More ({sortedLog.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}

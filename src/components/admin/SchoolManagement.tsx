"use client";

import { useState, useMemo } from "react";
import { schools } from "@/data/schools";
import { formatNumber } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import type { School } from "@/lib/types";

interface SchoolRow extends School {
  complianceSubmitted: number;
  complianceTotal: number;
}

const columnHelper = createColumnHelper<SchoolRow>();

function getComplianceValues(
  sizeCategory: string
): { submitted: number; total: number } {
  switch (sizeCategory) {
    case "large":
      return { submitted: 5, total: 7 };
    case "medium":
      return { submitted: 4, total: 7 };
    default:
      return { submitted: 3, total: 7 };
  }
}

function complianceColor(submitted: number, total: number): string {
  const pct = (submitted / total) * 100;
  if (pct > 80) return "bg-green-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function complianceTextColor(submitted: number, total: number): string {
  const pct = (submitted / total) * 100;
  if (pct > 80) return "text-green-700";
  if (pct >= 50) return "text-amber-700";
  return "text-red-700";
}

export default function SchoolManagement() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const data: SchoolRow[] = useMemo(
    () =>
      schools.map((school) => {
        const { submitted, total } = getComplianceValues(school.sizeCategory);
        return {
          ...school,
          complianceSubmitted: submitted,
          complianceTotal: total,
        };
      }),
    []
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "School Name",
        cell: (info) => (
          <a
            href={`/schools/${info.row.original.id}`}
            className="font-medium text-brand-800 hover:text-brand-900 hover:underline"
          >
            {info.getValue()}
          </a>
        ),
      }),
      columnHelper.accessor("country", {
        header: "Country",
        cell: (info) => (
          <span className="text-sm text-slate-700">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("enrollment", {
        header: "Enrollment",
        cell: (info) => (
          <span className="text-sm text-slate-700">
            {formatNumber(info.getValue())}
          </span>
        ),
      }),
      columnHelper.display({
        id: "compliance",
        header: "Data Compliance",
        cell: (info) => {
          const { complianceSubmitted, complianceTotal } = info.row.original;
          const pct = (complianceSubmitted / complianceTotal) * 100;
          return (
            <div className="flex items-center gap-2">
              <div className="w-20 bg-slate-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${complianceColor(
                    complianceSubmitted,
                    complianceTotal
                  )}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span
                className={`text-xs font-medium ${complianceTextColor(
                  complianceSubmitted,
                  complianceTotal
                )}`}
              >
                {complianceSubmitted}/{complianceTotal} offices
              </span>
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "status",
        header: "Status",
        cell: () => (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            Active
          </span>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <p className="text-sm text-slate-500 mb-4">
        {schools.length} schools in the AMISA network
      </p>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {data.map((school) => {
          const pct = (school.complianceSubmitted / school.complianceTotal) * 100;
          return (
            <div key={school.id} className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
              <div>
                <a
                  href={`/schools/${school.id}`}
                  className="font-medium text-brand-800 hover:text-brand-900 hover:underline"
                >
                  {school.name}
                </a>
              </div>
              <div className="text-sm text-slate-700">
                <span className="font-medium">Country:</span> {school.country}
              </div>
              <div className="text-sm text-slate-700">
                <span className="font-medium">Enrollment:</span> {formatNumber(school.enrollment)}
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Data Compliance</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${complianceColor(
                        school.complianceSubmitted,
                        school.complianceTotal
                      )}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${complianceTextColor(
                      school.complianceSubmitted,
                      school.complianceTotal
                    )}`}
                  >
                    {school.complianceSubmitted}/{school.complianceTotal}
                  </span>
                </div>
              </div>
              <div>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  Active
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-slate-50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-slate-700"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <ArrowUpDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

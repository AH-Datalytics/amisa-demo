"use client";

import { useState, useMemo } from "react";
import { users } from "@/data/users";
import { schools } from "@/data/schools";
import { formatDate } from "@/lib/utils";
import { UserPlus, ArrowUpDown } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import type { User } from "@/lib/types";

const columnHelper = createColumnHelper<User>();

const roleBadgeStyles: Record<string, string> = {
  network_admin: "bg-blue-100 text-blue-700",
  school_admin: "bg-amber-100 text-amber-700",
  school_user: "bg-slate-100 text-slate-600",
};

const roleLabels: Record<string, string> = {
  network_admin: "Network Admin",
  school_admin: "School Admin",
  school_user: "School User",
};

const officeLabels: Record<string, string> = {
  superintendent: "Superintendent",
  learning: "Learning",
  hr: "Human Resources",
  admissions: "Admissions",
  business: "Business",
  medical: "Medical",
  alumni: "Alumni",
};

export default function UserManagement() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const schoolMap = useMemo(() => {
    const map: Record<string, string> = {};
    schools.forEach((s) => {
      map[s.id] = s.name;
    });
    return map;
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <span className="font-medium text-slate-900">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => (
          <span className="text-slate-500">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("role", {
        header: "Role",
        cell: (info) => {
          const role = info.getValue();
          return (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeStyles[role]}`}
            >
              {roleLabels[role]}
            </span>
          );
        },
      }),
      columnHelper.accessor("schoolId", {
        header: "School",
        cell: (info) => {
          const schoolId = info.getValue();
          return (
            <span className="text-sm text-slate-700">
              {schoolId ? schoolMap[schoolId] || schoolId : "AMISA HQ"}
            </span>
          );
        },
      }),
      columnHelper.accessor("office", {
        header: "Office",
        cell: (info) => {
          const office = info.getValue();
          return (
            <span className="text-sm text-slate-600">
              {office ? officeLabels[office] || office : "-"}
            </span>
          );
        },
      }),
      columnHelper.accessor("lastLogin", {
        header: "Last Login",
        cell: (info) => (
          <span className="text-sm text-slate-500">
            {formatDate(info.getValue())}
          </span>
        ),
      }),
    ],
    [schoolMap]
  );

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          {users.length} users across the network
        </p>
        <button
          onClick={() => alert("Add User dialog would open here")}
          className="inline-flex items-center gap-1.5 bg-brand-800 hover:bg-brand-900 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <div>
              <div className="font-medium text-slate-900">{user.name}</div>
              <div className="text-sm text-slate-500">{user.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeStyles[user.role]}`}
              >
                {roleLabels[user.role]}
              </span>
            </div>
            <div className="text-sm text-slate-700">
              <span className="font-medium">School:</span>{" "}
              {user.schoolId ? schoolMap[user.schoolId] || user.schoolId : "AMISA HQ"}
            </div>
            {user.office && (
              <div className="text-sm text-slate-600">
                <span className="font-medium">Office:</span>{" "}
                {officeLabels[user.office] || user.office}
              </div>
            )}
          </div>
        ))}
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

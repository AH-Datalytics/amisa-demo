"use client";

import { FileInput } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AdmissionsForm from "@/components/data-entry/AdmissionsForm";
import FileUploadZone from "@/components/data-entry/FileUploadZone";
import SubmissionStatus from "@/components/data-entry/SubmissionStatus";

export default function DataEntryPage() {
  const { currentRole, currentUser } = useAuth();

  const officeName = currentUser?.office
    ? currentUser.office.charAt(0).toUpperCase() +
      currentUser.office.slice(1) +
      " Office"
    : null;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FileInput className="h-6 w-6 text-brand-800" />
          <h1 className="text-2xl font-mono font-bold text-brand-900">
            Data Entry
          </h1>
        </div>
        <p className="text-slate-500 text-sm">
          Submit your school&apos;s data
          {officeName && (
            <span className="text-slate-400"> &middot; {officeName}</span>
          )}
        </p>
      </div>

      {/* Network admin sees school selector + form */}
      {currentRole === "network_admin" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800 flex items-center gap-2">
          <FileInput className="h-4 w-4 flex-shrink-0" />
          Viewing as Network Admin &mdash; showing sample data entry for Academia Americana de Sao Paulo
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Form + Upload */}
        <div className="lg:col-span-2 space-y-6">
          <AdmissionsForm />
          <FileUploadZone />
        </div>

        {/* Right column: Submission status */}
        <div className="lg:col-span-1">
          <SubmissionStatus />
        </div>
      </div>
    </div>
  );
}

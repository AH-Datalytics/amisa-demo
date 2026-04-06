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

      {/* Network admin sees a different view */}
      {currentRole === "network_admin" ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <FileInput className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">
            Select a school to enter data
          </p>
          <p className="text-sm text-slate-400 mt-1">
            As a network administrator, navigate to a specific school to view or
            manage their data submissions.
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
}

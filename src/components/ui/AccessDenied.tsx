"use client";

import { Lock } from "lucide-react";

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <Lock className="w-12 h-12 text-slate-300 mb-4" />
      <h2 className="text-xl font-mono font-bold text-slate-700 mb-2">
        Access Restricted
      </h2>
      <p className="text-slate-500 mb-1">
        You don&apos;t have permission to view this data.
      </p>
      <p className="text-sm text-slate-400">
        Contact your administrator for access.
      </p>
    </div>
  );
}

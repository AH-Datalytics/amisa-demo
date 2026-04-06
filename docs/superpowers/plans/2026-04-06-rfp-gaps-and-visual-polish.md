# RFP Gap Closure + Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close all minor RFP functional gaps (export, heat map, survey results viz, additional filters) and unify the visual design to eliminate the "AI-generated" look.

**Architecture:** All changes are client-side in an existing Next.js 14 app with static mock data. No backend, no tests (demo prototype). Workstream A adds features; Workstream B refactors colors. Build verification via `npm run build` after each task.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Recharts, Lucide icons

**Note:** This project has no test infrastructure (no jest, vitest, or testing-library). Steps use `npm run build` as the verification gate instead of unit tests.

---

## File Structure

### New Files
- `src/lib/export-csv.ts` -- CSV generation utility (Task 1)
- `src/components/dashboard/DataCompletenessHeatMap.tsx` -- heat map component (Task 5)
- `src/components/surveys/SurveyResults.tsx` -- survey results visualization (Task 6)

### Modified Files
- `src/lib/types.ts` -- add governance type, officeSubmissions type, SurveyResultData type, extend FilterState (Tasks 3, 6)
- `src/data/schools.ts` -- add governance + officeSubmissions to each school (Task 3)
- `src/data/surveys.ts` -- add mock result data to distributed surveys (Task 6)
- `src/lib/filters.ts` -- add governance + gradeLevel filter logic (Task 4)
- `src/hooks/useFilteredData.ts` -- no changes needed (filters.ts handles it)
- `src/components/dashboard/PeerFilters.tsx` -- add 3 new filter groups (Task 4)
- `src/app/(authenticated)/dashboard/page.tsx` -- add export to ChartCard, add heat map card (Tasks 2, 5)
- `src/app/(authenticated)/surveys/page.tsx` -- add export button + results toggle (Tasks 6, 7)
- `src/components/dashboard/EnrollmentTrendsChart.tsx` -- expose data for export, update colors (Tasks 2, 8)
- `src/components/dashboard/TuitionDistribution.tsx` -- expose data for export (Task 2)
- `src/components/dashboard/AdmissionsFunnel.tsx` -- expose data for export, update colors (Tasks 2, 8)
- `src/components/dashboard/RetentionComparison.tsx` -- expose data for export (Task 2)
- `src/components/dashboard/StudentTeacherRatio.tsx` -- expose data for export (Task 2)
- `src/components/dashboard/FacultyComposition.tsx` -- expose data for export, update colors (Tasks 2, 8)
- `src/app/login/page.tsx` -- unify role card border colors (Task 9)

---

## Task 1: CSV Export Utility

**Files:**
- Create: `src/lib/export-csv.ts`

- [ ] **Step 1: Create the export utility**

```ts
// src/lib/export-csv.ts
export function exportCsv(
  filename: string,
  headers: string[],
  rows: (string | number)[][]
) {
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => {
        const str = String(cell);
        return str.includes(",") || str.includes('"')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function makeExportFilename(chartName: string): string {
  const date = new Date().toISOString().split("T")[0];
  return `amisa-${chartName}-${date}.csv`;
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build passes (new file is just a utility, no imports yet)

- [ ] **Step 3: Commit**

```bash
git add src/lib/export-csv.ts
git commit -m "feat: add CSV export utility"
```

---

## Task 2: Dashboard Chart Export Buttons

**Files:**
- Modify: `src/app/(authenticated)/dashboard/page.tsx`
- Modify: `src/components/dashboard/EnrollmentTrendsChart.tsx`
- Modify: `src/components/dashboard/TuitionDistribution.tsx`
- Modify: `src/components/dashboard/AdmissionsFunnel.tsx`
- Modify: `src/components/dashboard/RetentionComparison.tsx`
- Modify: `src/components/dashboard/StudentTeacherRatio.tsx`
- Modify: `src/components/dashboard/FacultyComposition.tsx`

**Depends on:** Task 1

- [ ] **Step 1: Update ChartCard to accept an onExport prop and render a download icon**

In `src/app/(authenticated)/dashboard/page.tsx`, update the `ChartCard` component:

```tsx
import { Download } from "lucide-react";

function ChartCard({
  title,
  children,
  className = "",
  delay = 0,
  onExport,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onExport?: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 animate-fade-in-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-mono text-lg font-semibold text-slate-800">
          {title}
        </h2>
        {onExport && (
          <button
            onClick={onExport}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-100"
            aria-label={`Export ${title} as CSV`}
            title="Export as CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Add export data functions to each chart component**

Each chart component needs to export a function that returns its data as `{ headers: string[], rows: (string | number)[][] }`. Add these as named exports alongside the default component export.

**EnrollmentTrendsChart.tsx** -- add at the bottom of the file:
```tsx
export function getEnrollmentExportData(
  filteredSchools: School[],
  metrics: AnnualMetrics[]
) {
  const years = [2022, 2023, 2024, 2025, 2026];
  const headers = ["School", ...years.map(String)];
  const rows = filteredSchools.map((school) => {
    const schoolMetrics = metrics
      .filter((m) => m.schoolId === school.id)
      .sort((a, b) => a.year - b.year);
    return [
      school.name,
      ...years.map((y) => {
        const m = schoolMetrics.find((sm) => sm.year === y);
        return m ? m.enrollment : "";
      }),
    ] as (string | number)[];
  });
  return { headers, rows };
}
```

**TuitionDistribution.tsx** -- add:
```tsx
export function getTuitionExportData(
  filteredSchools: School[],
  metrics: AnnualMetrics[]
) {
  const headers = ["School", "Tuition Low", "Tuition High"];
  const rows = filteredSchools.map((school) => {
    const latest = metrics
      .filter((m) => m.schoolId === school.id)
      .sort((a, b) => b.year - a.year)[0];
    return [school.name, latest?.tuitionLow ?? "", latest?.tuitionHigh ?? ""] as (string | number)[];
  });
  return { headers, rows };
}
```

**AdmissionsFunnel.tsx** -- add:
```tsx
export function getAdmissionsExportData(
  filteredSchools: School[],
  metrics: AnnualMetrics[]
) {
  const headers = ["School", "Applications", "Acceptances", "Enrolled"];
  const rows = filteredSchools.map((school) => {
    const latest = metrics
      .filter((m) => m.schoolId === school.id)
      .sort((a, b) => b.year - a.year)[0];
    return [
      school.name,
      latest?.applications ?? "",
      latest?.acceptances ?? "",
      latest?.enrolledNew ?? "",
    ] as (string | number)[];
  });
  return { headers, rows };
}
```

**RetentionComparison.tsx** -- add:
```tsx
export function getRetentionExportData(
  filteredSchools: School[],
  metrics: AnnualMetrics[]
) {
  const headers = ["School", "Retention Rate (%)"];
  const rows = filteredSchools.map((school) => {
    const latest = metrics
      .filter((m) => m.schoolId === school.id)
      .sort((a, b) => b.year - a.year)[0];
    return [school.name, latest?.retentionRate ?? ""] as (string | number)[];
  });
  return { headers, rows };
}
```

**StudentTeacherRatio.tsx** -- add:
```tsx
export function getStudentTeacherExportData(
  filteredSchools: School[],
  metrics: AnnualMetrics[]
) {
  const headers = ["School", "Student-Teacher Ratio"];
  const rows = filteredSchools.map((school) => {
    const latest = metrics
      .filter((m) => m.schoolId === school.id)
      .sort((a, b) => b.year - a.year)[0];
    return [school.name, latest?.studentTeacherRatio ?? ""] as (string | number)[];
  });
  return { headers, rows };
}
```

**FacultyComposition.tsx** -- add:
```tsx
export function getFacultyExportData(
  filteredSchools: School[],
  metrics: AnnualMetrics[]
) {
  const headers = ["School", "Host Country (%)", "US Faculty (%)", "Third Country (%)"];
  const rows = filteredSchools.map((school) => {
    const latest = metrics
      .filter((m) => m.schoolId === school.id)
      .sort((a, b) => b.year - a.year)[0];
    return [
      school.name,
      latest?.facultyHostCountry ?? "",
      latest?.facultyUS ?? "",
      latest?.facultyThirdCountry ?? "",
    ] as (string | number)[];
  });
  return { headers, rows };
}
```

- [ ] **Step 3: Wire up exports in dashboard page**

In `src/app/(authenticated)/dashboard/page.tsx`, import the export functions and the CSV utility, then pass `onExport` to each `ChartCard`:

```tsx
import { exportCsv, makeExportFilename } from "@/lib/export-csv";
import { getEnrollmentExportData } from "@/components/dashboard/EnrollmentTrendsChart";
import { getTuitionExportData } from "@/components/dashboard/TuitionDistribution";
import { getAdmissionsExportData } from "@/components/dashboard/AdmissionsFunnel";
import { getRetentionExportData } from "@/components/dashboard/RetentionComparison";
import { getStudentTeacherExportData } from "@/components/dashboard/StudentTeacherRatio";
import { getFacultyExportData } from "@/components/dashboard/FacultyComposition";
```

Then for each ChartCard, add the onExport prop. Example for enrollment:
```tsx
<ChartCard
  title="Enrollment Trends (2022-2026)"
  className="md:col-span-2"
  delay={0}
  onExport={() => {
    const { headers, rows } = getEnrollmentExportData(filteredSchools, metrics);
    exportCsv(makeExportFilename("enrollment-trends"), headers, rows);
  }}
>
```

Repeat the same pattern for all 6 ChartCards with their respective export functions.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build passes

- [ ] **Step 5: Commit**

```bash
git add src/app/\(authenticated\)/dashboard/page.tsx src/components/dashboard/
git commit -m "feat: add CSV export buttons to all dashboard charts"
```

---

## Task 3: School Data -- Add Governance and Office Submissions

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/data/schools.ts`

- [ ] **Step 1: Update types**

In `src/lib/types.ts`, add the governance type and office submissions to the School interface:

```ts
export type GovernanceType = "Nonprofit" | "Religious" | "Proprietary";

export interface OfficeSubmission {
  office: Office;
  status: "submitted" | "partial" | "not_submitted";
}
```

Add to the `School` interface:
```ts
export interface School {
  // ... existing fields ...
  governance: GovernanceType;
  officeSubmissions: OfficeSubmission[];
}
```

Add to `FilterState`:
```ts
export interface FilterState {
  sizeCategory: string[];
  tuitionBand: string[];
  region: string[];
  curriculum: string[];
  country: string[];
  governance: string[];
  gradeLevel: string[];
}
```

- [ ] **Step 2: Update each school in schools.ts**

Add `governance` and `officeSubmissions` to all 12 schools. Governance distribution: 7 Nonprofit, 3 Religious, 2 Proprietary.

Office submission statuses should vary realistically -- larger, more established schools have more offices submitted. Example for the first school:

```ts
{
  id: "academia-americana-sp",
  // ... existing fields ...
  governance: "Nonprofit",
  officeSubmissions: [
    { office: "superintendent", status: "submitted" },
    { office: "learning", status: "submitted" },
    { office: "hr", status: "submitted" },
    { office: "admissions", status: "submitted" },
    { office: "business", status: "submitted" },
    { office: "medical", status: "partial" },
    { office: "alumni", status: "submitted" },
  ],
},
```

Full governance assignments:
- academia-americana-sp: Nonprofit
- colegio-interamericano-norte: Nonprofit
- instituto-colombiano: Nonprofit
- colegio-pacifico: Religious
- academia-austral: Nonprofit
- escuela-centroamericana: Religious
- instituto-del-istmo: Nonprofit
- colegio-andino: Nonprofit
- academia-tropical: Proprietary
- colegio-caribe: Religious
- island-international: Proprietary
- instituto-bolivariano: Nonprofit

For officeSubmissions, vary status across schools so the heat map is interesting:
- Large schools (3): mostly "submitted" with 1-2 "partial"
- Medium schools (4): mix of "submitted", "partial", and 1-2 "not_submitted"
- Small schools (5): more "not_submitted" and "partial", fewer "submitted"

- [ ] **Step 3: Update defaultFilters in filters.ts**

```ts
export const defaultFilters: FilterState = {
  sizeCategory: [],
  tuitionBand: [],
  region: [],
  curriculum: [],
  country: [],
  governance: [],
  gradeLevel: [],
};
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build passes

- [ ] **Step 5: Commit**

```bash
git add src/lib/types.ts src/data/schools.ts src/lib/filters.ts
git commit -m "feat: add governance type and office submissions to school data"
```

---

## Task 4: Additional Peer Filters

**Files:**
- Modify: `src/lib/filters.ts`
- Modify: `src/components/dashboard/PeerFilters.tsx`

**Depends on:** Task 3

- [ ] **Step 1: Add filter logic to filters.ts**

Add a `getGradeLevel` helper and extend `filterSchools`:

```ts
export function getGradeLevel(gradeRange: string): string {
  if (gradeRange.startsWith("PreK")) return "PreK-12";
  if (gradeRange.startsWith("K")) return "K-12";
  return gradeRange;
}
```

Add to `filterSchools`, after the existing `country` check:

```ts
if (
  filters.governance.length > 0 &&
  !filters.governance.includes(school.governance)
)
  return false;
if (
  filters.gradeLevel.length > 0 &&
  !filters.gradeLevel.includes(getGradeLevel(school.gradeRange))
)
  return false;
```

- [ ] **Step 2: Add new filter groups to PeerFilters.tsx**

Add three new filter sections after the existing Curriculum section, using the same pill/tag pattern. Extract unique countries from the schools data:

```tsx
const countries = Array.from(new Set(schools.map((s) => s.country))).sort();
```

Add filter groups for:
- **Country** -- dynamic list from school data
- **Grade Levels** -- "PreK-12", "K-12" (derived from gradeRange)
- **Governance** -- "Nonprofit", "Religious", "Proprietary"

Each uses the same toggle pattern as existing filters:

```tsx
{/* Country */}
<div>
  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
    Country
  </h3>
  <div className="flex flex-wrap gap-2">
    {countries.map((c) => {
      const active = filters.country.includes(c);
      return (
        <button
          key={c}
          onClick={() =>
            setFilters((f) => ({
              ...f,
              country: active
                ? f.country.filter((x) => x !== c)
                : [...f.country, c],
            }))
          }
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            active
              ? "bg-brand-800 text-white border-brand-800"
              : "bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:shadow-sm"
          }`}
        >
          {c}
        </button>
      );
    })}
  </div>
</div>
```

Repeat the same pattern for Grade Levels (options: `["PreK-12", "K-12"]`) and Governance (options: `["Nonprofit", "Religious", "Proprietary"]`).

Import schools at the top of PeerFilters: `import { schools } from "@/data/schools";`

- [ ] **Step 3: Update the Clear All logic**

The existing "Clear All" button resets filters. Update it to also clear the new fields:

```ts
setFilters({
  sizeCategory: [],
  tuitionBand: [],
  region: [],
  curriculum: [],
  country: [],
  governance: [],
  gradeLevel: [],
});
```

Also update the `hasFilters` check to include the new fields.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build passes

- [ ] **Step 5: Commit**

```bash
git add src/lib/filters.ts src/components/dashboard/PeerFilters.tsx
git commit -m "feat: add country, grade level, and governance peer filters"
```

---

## Task 5: Data Completeness Heat Map

**Files:**
- Create: `src/components/dashboard/DataCompletenessHeatMap.tsx`
- Modify: `src/app/(authenticated)/dashboard/page.tsx`

**Depends on:** Task 3

- [ ] **Step 1: Create the heat map component**

```tsx
// src/components/dashboard/DataCompletenessHeatMap.tsx
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
```

- [ ] **Step 2: Add heat map to dashboard page**

In `src/app/(authenticated)/dashboard/page.tsx`, import and add the heat map between the PeerFilters and the chart grid:

```tsx
import DataCompletenessHeatMap, { getCompletenessExportData } from "@/components/dashboard/DataCompletenessHeatMap";
```

Add after PeerFilters, before the `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">`:

```tsx
<ChartCard
  title="Data Submission Status by Office"
  delay={0}
  onExport={() => {
    const { headers, rows } = getCompletenessExportData(filteredSchools);
    exportCsv(makeExportFilename("data-completeness"), headers, rows);
  }}
>
  <DataCompletenessHeatMap filteredSchools={filteredSchools} />
</ChartCard>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build passes

- [ ] **Step 4: Commit**

```bash
git add src/components/dashboard/DataCompletenessHeatMap.tsx src/app/\(authenticated\)/dashboard/page.tsx
git commit -m "feat: add data completeness heat map to dashboard"
```

---

## Task 6: Survey Results Visualization

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/data/surveys.ts`
- Create: `src/components/surveys/SurveyResults.tsx`
- Modify: `src/app/(authenticated)/surveys/page.tsx`

- [ ] **Step 1: Add SurveyResultData type**

In `src/lib/types.ts`, add:

```ts
export interface SurveyResultData {
  questionId: string;
  questionTitle: string;
  questionType: "multiple-choice" | "likert" | "open-response";
  options?: { label: string; count: number }[];
  average?: number;
  responseCount: number;
}
```

Add `results` to the `Survey` interface:

```ts
export interface Survey {
  // ... existing fields ...
  results?: SurveyResultData[];
}
```

- [ ] **Step 2: Add mock results data to surveys.ts**

Add `results` arrays to the two distributed surveys. For the enrollment/tuition survey:

```ts
results: [
  {
    questionId: "q1",
    questionTitle: "Primary enrollment challenge this year",
    questionType: "multiple-choice",
    options: [
      { label: "Declining applications", count: 3 },
      { label: "Retention of current families", count: 4 },
      { label: "Competition from local schools", count: 2 },
      { label: "Visa/immigration barriers", count: 1 },
      { label: "No significant challenge", count: 2 },
    ],
    responseCount: 8,
  },
  {
    questionId: "q2",
    questionTitle: "Satisfaction with current tuition pricing model",
    questionType: "likert",
    average: 3.6,
    responseCount: 8,
  },
  {
    questionId: "q3",
    questionTitle: "Planned tuition increase for next year",
    questionType: "multiple-choice",
    options: [
      { label: "0-3%", count: 2 },
      { label: "3-5%", count: 4 },
      { label: "5-8%", count: 1 },
      { label: "8%+", count: 0 },
      { label: "Decrease planned", count: 1 },
    ],
    responseCount: 8,
  },
],
```

For the faculty compensation survey (only 2 completions):

```ts
results: [
  {
    questionId: "q1",
    questionTitle: "Average faculty salary range (USD)",
    questionType: "multiple-choice",
    options: [
      { label: "$30k-$45k", count: 0 },
      { label: "$45k-$60k", count: 1 },
      { label: "$60k-$80k", count: 1 },
      { label: "$80k+", count: 0 },
    ],
    responseCount: 2,
  },
  {
    questionId: "q2",
    questionTitle: "Satisfaction with faculty compensation competitiveness",
    questionType: "likert",
    average: 2.8,
    responseCount: 2,
  },
],
```

- [ ] **Step 3: Create SurveyResults component**

```tsx
// src/components/surveys/SurveyResults.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { SurveyResultData } from "@/lib/types";

export default function SurveyResults({
  results,
}: {
  results: SurveyResultData[];
}) {
  return (
    <div className="space-y-6 pt-4">
      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
        Aggregated Results
      </p>
      {results.map((r) => (
        <div key={r.questionId} className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h4 className="text-sm font-medium text-slate-700">
              {r.questionTitle}
            </h4>
            <span className="text-xs text-slate-400">
              {r.responseCount} responses
            </span>
          </div>

          {r.questionType === "multiple-choice" && r.options && (
            <div className="h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={r.options}
                  layout="vertical"
                  margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E8F0"
                    horizontal={false}
                  />
                  <XAxis type="number" tick={{ fill: "#64748B", fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    tick={{ fill: "#64748B", fontSize: 11 }}
                    width={160}
                  />
                  <Tooltip
                    contentStyle={{
                      border: "1px solid #E2E8F0",
                      borderRadius: 8,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {r.questionType === "likert" && r.average !== undefined && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full"
                  style={{ width: `${(r.average / 5) * 100}%` }}
                />
              </div>
              <span className="text-lg font-mono font-semibold text-brand-800">
                {r.average.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Add View Results toggle to surveys page**

In `src/app/(authenticated)/surveys/page.tsx`, add state for which survey's results are shown and render the toggle + component. Add at the component level:

```tsx
const [showResults, setShowResults] = useState<string | null>(null);
```

Import the component:
```tsx
import SurveyResults from "@/components/surveys/SurveyResults";
```

For each survey card that has `survey.results`, add a "View Results" button and conditionally render the results panel. Place this inside the survey card, after the existing completion tracker:

```tsx
{survey.results && survey.results.length > 0 && (
  <>
    <button
      onClick={() =>
        setShowResults(showResults === survey.id ? null : survey.id)
      }
      className="text-xs text-brand-600 hover:text-brand-800 font-medium mt-2 transition-colors"
    >
      {showResults === survey.id ? "Hide Results" : "View Results"}
    </button>
    {showResults === survey.id && (
      <SurveyResults results={survey.results} />
    )}
  </>
)}
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: Build passes

- [ ] **Step 6: Commit**

```bash
git add src/lib/types.ts src/data/surveys.ts src/components/surveys/SurveyResults.tsx src/app/\(authenticated\)/surveys/page.tsx
git commit -m "feat: add survey results visualization with mock data"
```

---

## Task 7: Survey Response Export

**Files:**
- Modify: `src/app/(authenticated)/surveys/page.tsx`

**Depends on:** Task 1 (export utility), Task 6 (survey results data)

- [ ] **Step 1: Add export button to survey cards**

In `src/app/(authenticated)/surveys/page.tsx`, import the export utility:

```tsx
import { exportCsv, makeExportFilename } from "@/lib/export-csv";
import { Download } from "lucide-react";
```

For each survey card with status "distributed" or "completed", add an export button in the card header area next to the status badge:

```tsx
{(survey.status === "distributed" || survey.status === "completed") && (
  <button
    onClick={() => {
      const headers = ["School", "Completed", "Completion Date"];
      const rows = survey.completions.map((c) => [
        c.schoolName,
        c.completed ? "Yes" : "No",
        c.completedAt
          ? new Date(c.completedAt).toLocaleDateString()
          : "",
      ]);
      exportCsv(
        makeExportFilename(survey.id),
        headers,
        rows
      );
    }}
    className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-100"
    aria-label={`Export ${survey.title} responses as CSV`}
    title="Export responses as CSV"
  >
    <Download className="w-4 h-4" />
  </button>
)}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build passes

- [ ] **Step 3: Commit**

```bash
git add src/app/\(authenticated\)/surveys/page.tsx
git commit -m "feat: add CSV export button to distributed surveys"
```

---

## Task 8: Unified Chart Color Palette

**Files:**
- Modify: `src/components/dashboard/EnrollmentTrendsChart.tsx`
- Modify: `src/components/dashboard/AdmissionsFunnel.tsx`
- Modify: `src/components/dashboard/FacultyComposition.tsx`

- [ ] **Step 1: Update EnrollmentTrendsChart colors**

Replace the existing COLORS array with the new blue-monochrome palette:

```ts
const COLORS = [
  "#1E3A8A", // brand-900
  "#1E40AF", // brand-800
  "#1D4ED8", // brand-700
  "#2563EB", // brand-600
  "#3B82F6", // brand-500
  "#60A5FA", // brand-400
  "#93C5FD", // brand-300
  "#BFDBFE", // brand-200
  "#D97706", // accent (orange highlight)
  "#64748B", // slate-500
  "#94A3B8", // slate-400
  "#CBD5E1", // slate-300
];
```

- [ ] **Step 2: Update AdmissionsFunnel colors**

Change the three stage colors from `#1E40AF, #3B82F6, #D97706` to `#1E40AF, #3B82F6, #93C5FD` (three descending blues). Find the stage color definitions and replace them.

Also update the rate display colors at the bottom: change `text-accent-600` to `text-brand-600` for the yield rate so it no longer uses the orange accent.

- [ ] **Step 3: Update FacultyComposition colors**

Change the category colors from `#1E40AF, #D97706, #94A3B8` to `#1E40AF, #60A5FA, #CBD5E1` (dark blue, medium blue, light gray). Find the fill colors for the three Bar components and replace them.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build passes

- [ ] **Step 5: Visual check**

Open the deployed site and verify:
- Enrollment trends chart uses blue tones instead of rainbow
- Admissions funnel uses three blues instead of blue-blue-orange
- Faculty composition uses blue shades instead of blue-orange-gray
- RetentionComparison and StudentTeacherRatio still use green/orange/red (unchanged, semantic)

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/EnrollmentTrendsChart.tsx src/components/dashboard/AdmissionsFunnel.tsx src/components/dashboard/FacultyComposition.tsx
git commit -m "fix: unify chart colors to blue-monochrome palette"
```

---

## Task 9: Login Page + Chart Styling Consistency

**Files:**
- Modify: `src/app/login/page.tsx`
- Modify: all chart components (minor consistency pass)

- [ ] **Step 1: Unify login page role card borders**

In `src/app/login/page.tsx`, find the three role card border color assignments and change them all to use `border-brand-800`:

Replace:
- Network Admin: `border-brand-800` (already correct)
- School Admin: `border-accent-600` -> `border-brand-800`
- School User: `border-slate-400` -> `border-brand-800`

Also update the icon colors to all use `text-brand-800` instead of varying colors.

- [ ] **Step 2: Chart bar radius consistency**

Check each bar chart component. Add `radius={[2, 2, 0, 0]}` to all `<Bar>` components that don't already have it, for subtle top rounding:

- `TuitionDistribution.tsx`: verify/add `radius={[2, 2, 0, 0]}`
- `RetentionComparison.tsx`: verify/add `radius={[2, 2, 0, 0]}`
- `StudentTeacherRatio.tsx`: verify/add `radius={[2, 2, 0, 0]}`
- `FacultyComposition.tsx`: verify/add `radius={[2, 2, 0, 0]}` on each Bar
- `AdmissionsFunnel.tsx`: verify/add if applicable

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build passes

- [ ] **Step 4: Commit**

```bash
git add src/app/login/page.tsx src/components/dashboard/
git commit -m "fix: unify login card borders and normalize chart bar radius"
```

---

## Task 10: Build, Deploy, Verify

**Depends on:** All previous tasks

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: All pages build successfully

- [ ] **Step 2: Deploy to Vercel**

```bash
vercel --prod --scope ahdatalytics --yes
```

Expected: Deployment succeeds, aliased to amisa-demo.vercel.app

- [ ] **Step 3: Visual verification with Playwright**

Open the deployed site and verify:
1. Dashboard: export icons visible on each chart card, heat map renders with color-coded cells
2. Dashboard: peer filters show all 7 dimensions (size, tuition, region, curriculum, country, grade level, governance)
3. Dashboard: charts use unified blue palette (no rainbow)
4. Surveys: distributed surveys have export CSV button and "View Results" toggle
5. Survey results: bar charts for multiple-choice, Likert averages render correctly
6. Login: all three role cards have consistent blue left borders
7. Mobile (375px): heat map scrolls horizontally, filters wrap properly

- [ ] **Step 4: Final commit and push**

```bash
git push origin main
```

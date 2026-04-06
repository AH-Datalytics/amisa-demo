# AMISA Demo: RFP Gap Closure + Visual Polish

**Date:** 2026-04-06
**Status:** Approved
**Context:** The AMISA Data System demo (https://amisa-demo.vercel.app) is being submitted alongside a written proposal in response to AMISA's RFP. A cross-reference of the RFP against the demo revealed minor functional gaps, and internal review flagged the dashboard as looking too "AI-generated" due to excessive color variety and lack of unified style. This spec covers both workstreams.

**Constraint:** The RFP deadline is today (April 6, 2026). The proposal document can be submitted first; the demo URL is already live and can be updated throughout the day.

---

## Workstream A: Functional Gap Closure

### A1. Dashboard Chart Export

**Goal:** Show that chart data is exportable, addressing the RFP's data export requirements.

**Implementation:**
- Add a download icon (Lucide `Download`, 16x16) to the top-right corner of each `ChartCard` in `src/app/(authenticated)/dashboard/page.tsx`
- The `ChartCard` component gains an optional `onExport` callback prop
- Each chart component exposes its underlying data array to the parent via a simple getter or by passing data alongside the component
- On click, a shared `exportCsv(filename, headers, rows)` utility generates a CSV string and triggers a browser download via `Blob` + `URL.createObjectURL`
- Filename format: `amisa-{chart-name}-{YYYY-MM-DD}.csv`
- No server-side logic needed; pure client-side generation

**Utility location:** `src/lib/export-csv.ts`

**Files changed:**
- `src/lib/export-csv.ts` (new)
- `src/app/(authenticated)/dashboard/page.tsx` (ChartCard gets export button + onExport prop)
- Each chart component in `src/components/dashboard/` (expose data for export)

### A2. Survey Response Export

**Goal:** Show that survey response data can be exported, directly addressing RFP section 4.2.3 ("ability to export survey responses").

**Implementation:**
- Add an "Export CSV" button (small, secondary style) on each survey card in the survey list that has status "distributed" or "completed"
- Button appears in the survey card header area, next to the status badge
- On click, generates a CSV of mock response data: columns for School, Respondent, each question title, Completion Date
- Uses the same `exportCsv` utility from A1
- Mock response data is derived from the survey's question definitions + the existing completion tracker school list

**Files changed:**
- `src/app/(authenticated)/surveys/page.tsx` (add export button to survey cards)
- `src/data/surveys.ts` (add mock response data for distributed surveys)

### A3. Survey Results Visualization

**Goal:** Show aggregated survey results (not just completion tracking), addressing RFP section 4.3.1 ("survey results visualization").

**Implementation:**
- Add a "View Results" button/toggle on distributed and completed surveys in the survey list
- When expanded, shows a results panel below the survey card with:
  - A small Recharts horizontal bar chart for each multiple-choice question showing response distribution
  - Average score display for Likert-scale questions (shown as a number + visual bar)
  - Total response count header
- Mock aggregated results data added to `src/data/surveys.ts` for the two distributed surveys
- Results panel is a new component: `src/components/surveys/SurveyResults.tsx`
- Uses Recharts `BarChart` (horizontal) consistent with dashboard chart styling

**Mock data structure:**
```ts
interface SurveyResultData {
  questionId: string;
  questionTitle: string;
  questionType: "multiple-choice" | "likert" | "open-response";
  // For multiple-choice:
  options?: { label: string; count: number }[];
  // For likert:
  average?: number;
  responseCount: number;
}
```

**Files changed:**
- `src/components/surveys/SurveyResults.tsx` (new)
- `src/data/surveys.ts` (add mock result data)
- `src/app/(authenticated)/surveys/page.tsx` (add View Results toggle + render SurveyResults)

### A4. Heat Map: Data Submission Status by Office

**Goal:** Add a heat map visualization to the dashboard, addressing RFP section 4.3.4 ("heat maps") and demonstrating the Office-based data organization concept from section 2.

**Implementation:**
- New full-width `ChartCard` on the dashboard titled "Data Submission Status by Office"
- Positioned after the KPI cards and peer filters, before the existing chart grid
- Rows: filtered schools (respects peer filter selections)
- Columns: 7 Offices (Superintendent, Learning, HR, Admissions, Business, Medical, Alumni)
- Cell colors: green (`#059669`) for submitted, amber (`#D97706`) for partial/in-progress, slate-200 (`#E2E8F0`) for not submitted
- Built with CSS grid + Tailwind classes (not Recharts, since Recharts doesn't support heat maps natively)
- Includes a legend row below the grid
- Each cell has a tooltip on hover showing "{School} - {Office}: {Status}"
- School names in the left column, Office abbreviations in the header row
- Responsive: on mobile, horizontally scrollable with sticky school name column

**New data:** Add `officeSubmissions` to each school's data:
```ts
interface OfficeSubmission {
  office: string;
  status: "submitted" | "partial" | "not_submitted";
}
```

**Component:** `src/components/dashboard/DataCompletenessHeatMap.tsx` (new)

**Files changed:**
- `src/components/dashboard/DataCompletenessHeatMap.tsx` (new)
- `src/data/schools.ts` (add officeSubmissions to each school)
- `src/app/(authenticated)/dashboard/page.tsx` (add heat map card)

### A5. Additional Peer Filters

**Goal:** Cover all 7 filter dimensions mentioned in RFP section 4.3.2.

**Current filters (4):** Size, Tuition, Region, Curriculum
**Adding (3):** Country, Grade Levels, Governance

**Implementation:**

1. **Governance field:** Add `governance: "Nonprofit" | "Religious" | "Proprietary"` to each school in `src/data/schools.ts`. Distribution: ~7 Nonprofit, ~3 Religious, ~2 Proprietary across the 12 schools.

2. **Grade levels filter:** Parse existing `gradeRange` field into filter categories:
   - "PreK-12" (full range)
   - "K-12"
   - "PreK-8" or "6-12" (partial ranges)
   Use the existing `gradeRange` string values to bucket schools.

3. **Country filter:** Extract unique countries from existing school data. Show as multi-select tags like the other filters.

4. **Update PeerFilters component:** Add three new filter groups below the existing four. Same tag/pill UI pattern.

5. **Update FilterState type and useFilteredData hook** to include the new filter dimensions.

**Files changed:**
- `src/data/schools.ts` (add governance field)
- `src/components/dashboard/PeerFilters.tsx` (add 3 filter groups)
- `src/hooks/useFilteredData.ts` (add filtering logic for new dimensions)
- `src/lib/types.ts` (update FilterState type if defined there)

---

## Workstream B: Visual Design Polish

### B1. Unified Chart Color Palette

**Problem:** The dashboard uses 12+ distinct hue families across its charts (blue, orange, green, red, purple, cyan, rose, lime, indigo, teal, violet). This reads as "AI-generated rainbow" rather than a designed system.

**New palette -- "Brand Blue Monochrome with Purposeful Accents":**

For multi-series charts (enrollment trends with up to 12 schools):
```
#1E3A8A  (brand-900, darkest blue)
#1E40AF  (brand-800)
#1D4ED8  (brand-700)
#2563EB  (brand-600)
#3B82F6  (brand-500)
#60A5FA  (brand-400)
#93C5FD  (brand-300)
#BFDBFE  (brand-200)
#D97706  (accent-600, orange -- for "your school" or highlighted series)
#64748B  (slate-500, neutral gray)
#94A3B8  (slate-400, lighter gray)
#CBD5E1  (slate-300, lightest)
```

This gives 12 distinguishable values using only 2 hue families (blue + neutral) plus 1 accent (orange). Schools are plotted in sequential blue tones; the user's own school (if applicable) is highlighted in orange.

**Conditional coloring exception:** RetentionComparison and StudentTeacherRatio use green/orange/red to communicate performance thresholds. This is appropriate (semantic color conveying meaning per WCAG) and stays. But these are the ONLY charts using traffic-light colors.

**Files changed:**
- `src/components/dashboard/EnrollmentTrendsChart.tsx` (replace 12-color rainbow)
- `src/components/dashboard/AdmissionsFunnel.tsx` (use blue shades instead of blue-blue-orange)
- `src/components/dashboard/FacultyComposition.tsx` (use dark blue, medium blue, light gray)
- `src/components/dashboard/TuitionDistribution.tsx` (already brand-500, no change needed)

### B2. Dashboard-Wide Color Noise Reduction

**Specific changes per chart:**

- **AdmissionsFunnel:** Currently uses #1E40AF, #3B82F6, #D97706 for three stages. Change to #1E40AF, #3B82F6, #93C5FD (three blues descending). The funnel narrowing is already communicated by the bar widths; using orange for the final stage adds unnecessary color noise.
- **FacultyComposition:** Currently uses #1E40AF (Host), #D97706 (US), #94A3B8 (Third Country). Change to #1E40AF (Host), #60A5FA (US), #CBD5E1 (Third Country). Three tones of the same blue-gray family.
- **EnrollmentTrendsChart:** Replace rainbow with sequential blue palette from B1.
- **DataCompletenessHeatMap (new):** Use green/amber/gray as specified in A4. This is semantic (status communication), not decorative, so it's appropriate.

### B3. Chart Styling Consistency Pass

**Audit and normalize across all chart components:**
- Axis tick fill: `#64748B` (already consistent)
- Axis tick fontSize: `12` (already consistent)
- CartesianGrid stroke: `#E2E8F0` (already consistent)
- Tooltip: white bg, `1px solid #E2E8F0`, border-radius 8px, shadow `0 1px 3px rgba(0,0,0,0.1)`, fontSize 13px (already consistent)
- Legend fontSize: `12` (verify consistency)
- Line strokeWidth: `2` (verify)
- Bar radius: add subtle `[2, 2, 0, 0]` top rounding to all bar charts for a softer look (if not already present)

### B4. Login Page Refinement

**Current:** Three role cards with colored left borders (blue, orange, gray). The three-color scheme adds to the "multiple competing colors" feel.

**Change:** All three cards use the same brand-800 blue left border. Differentiate roles by icon and label text only, not by color. This simplifies the visual language on the first page the evaluator sees.

**Files changed:**
- `src/app/login/page.tsx` (unify left border color)

---

## Out of Scope

These items were identified during gap analysis but are not worth adding for the demo:
- Analyst role (4th permission tier) -- described in proposal, not needed in demo
- Google Forms integration -- described in proposal as a production feature
- SSO login flow -- described in proposal, not expected in a prototype
- Heat map alternatives (enrollment change, assessment performance) -- one heat map is sufficient
- Export as PDF -- CSV export is sufficient to demonstrate the capability

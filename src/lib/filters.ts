import type { School, AnnualMetrics, FilterState } from "@/lib/types";

export const defaultFilters: FilterState = {
  sizeCategory: [],
  tuitionBand: [],
  region: [],
  curriculum: [],
  country: [],
  governance: [],
  gradeLevel: [],
};

export function getTuitionBand(tuitionHigh: number): string {
  if (tuitionHigh < 10000) return "budget";
  if (tuitionHigh < 18000) return "mid";
  return "premium";
}

export function getGradeLevel(gradeRange: string): string {
  if (gradeRange.startsWith("PreK")) return "PreK-12";
  if (gradeRange.startsWith("K")) return "K-12";
  return gradeRange;
}

export function filterSchools(
  allSchools: School[],
  filters: FilterState
): School[] {
  return allSchools.filter((school) => {
    if (
      filters.sizeCategory.length > 0 &&
      !filters.sizeCategory.includes(school.sizeCategory)
    )
      return false;
    if (
      filters.tuitionBand.length > 0 &&
      !filters.tuitionBand.includes(getTuitionBand(school.tuitionHigh))
    )
      return false;
    if (
      filters.region.length > 0 &&
      !filters.region.includes(school.region)
    )
      return false;
    if (
      filters.curriculum.length > 0 &&
      !filters.curriculum.includes(school.curriculum)
    )
      return false;
    if (
      filters.country.length > 0 &&
      !filters.country.includes(school.country)
    )
      return false;
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
    return true;
  });
}

export function getLatestMetrics(
  allMetrics: AnnualMetrics[],
  schoolId: string
): AnnualMetrics | undefined {
  return allMetrics
    .filter((m) => m.schoolId === schoolId)
    .sort((a, b) => b.year - a.year)[0];
}

export function getSchoolMetrics(
  allMetrics: AnnualMetrics[],
  schoolId: string
): AnnualMetrics[] {
  return allMetrics
    .filter((m) => m.schoolId === schoolId)
    .sort((a, b) => a.year - b.year);
}

export function computeKPIs(
  filteredSchools: School[],
  allMetrics: AnnualMetrics[]
) {
  const latestMetrics = filteredSchools
    .map((s) => getLatestMetrics(allMetrics, s.id))
    .filter(Boolean) as AnnualMetrics[];

  const totalSchools = filteredSchools.length;
  const totalEnrollment = latestMetrics.reduce(
    (sum, m) => sum + m.enrollment,
    0
  );
  const avgTuition =
    latestMetrics.length > 0
      ? latestMetrics.reduce((sum, m) => sum + m.tuitionHigh, 0) /
        latestMetrics.length
      : 0;
  const avgRetention =
    latestMetrics.length > 0
      ? latestMetrics.reduce((sum, m) => sum + m.retentionRate, 0) /
        latestMetrics.length
      : 0;
  const avgStudentTeacherRatio =
    latestMetrics.length > 0
      ? latestMetrics.reduce((sum, m) => sum + m.studentTeacherRatio, 0) /
        latestMetrics.length
      : 0;

  return {
    totalSchools,
    totalEnrollment,
    avgTuition,
    avgRetention,
    avgStudentTeacherRatio,
  };
}

"use client";

import { useState, useMemo } from "react";
import { schools } from "@/data/schools";
import { metrics } from "@/data/metrics";
import { defaultFilters, filterSchools, computeKPIs } from "@/lib/filters";
import type { FilterState } from "@/lib/types";

export function useFilteredData() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const filteredSchools = useMemo(
    () => filterSchools(schools, filters),
    [filters]
  );

  const kpis = useMemo(
    () => computeKPIs(filteredSchools, metrics),
    [filteredSchools]
  );

  return {
    filters,
    setFilters,
    filteredSchools,
    allSchools: schools,
    kpis,
    metrics,
  };
}

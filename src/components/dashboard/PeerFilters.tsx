"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import type { FilterState } from "@/lib/types";
import { schools } from "@/data/schools";
import { getGradeLevel } from "@/lib/filters";

interface PeerFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const pillClass = (isActive: boolean) =>
  cn(
    "px-3 py-1 rounded-full text-sm transition-colors active:scale-95 whitespace-nowrap",
    isActive
      ? "bg-brand-800 text-white"
      : "bg-white border border-slate-200 text-slate-600 hover:border-brand-300 hover:shadow-sm"
  );

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export default function PeerFilters({ filters, setFilters }: PeerFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);
  const countries = Array.from(new Set(schools.map((s) => s.country))).sort();
  const gradeLevels = Array.from(
    new Set(schools.map((s) => getGradeLevel(s.gradeRange)))
  ).sort();
  const governanceTypes = ["Nonprofit", "Religious", "Proprietary"];

  const sizeOptions = [
    { value: "large", label: "Large (1200+)" },
    { value: "medium", label: "Medium (400-1200)" },
    { value: "small", label: "Small (<400)" },
  ];
  const tuitionOptions = [
    { value: "budget", label: "Budget (<$10k)" },
    { value: "mid", label: "Mid ($10k-$18k)" },
    { value: "premium", label: "Premium ($18k+)" },
  ];
  const regionOptions = [
    { value: "South America", label: "South America" },
    { value: "Central America", label: "Central America" },
    { value: "Caribbean", label: "Caribbean" },
    { value: "North America", label: "North America" },
  ];
  const curriculumOptions = [
    { value: "AP", label: "AP" },
    { value: "IB", label: "IB" },
    { value: "AP & IB", label: "AP & IB" },
  ];

  const toggleFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const hasActiveFilters = Object.values(filters).some((arr) => arr.length > 0);
  const activeCount = Object.values(filters).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  const clearAll = () => {
    setFilters({
      sizeCategory: [],
      tuitionBand: [],
      region: [],
      curriculum: [],
      country: [],
      governance: [],
      gradeLevel: [],
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">
            Peer Group Filters
          </span>
          {activeCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
              {activeCount}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          {/* Row 1: Size, Tuition, Region */}
          <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
            <FilterGroup label="Size">
              {sizeOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => toggleFilter("sizeCategory", o.value)}
                  className={pillClass(filters.sizeCategory.includes(o.value))}
                >
                  {o.label}
                </button>
              ))}
            </FilterGroup>

            <FilterGroup label="Tuition">
              {tuitionOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => toggleFilter("tuitionBand", o.value)}
                  className={pillClass(filters.tuitionBand.includes(o.value))}
                >
                  {o.label}
                </button>
              ))}
            </FilterGroup>

            <FilterGroup label="Region">
              {regionOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => toggleFilter("region", o.value)}
                  className={pillClass(filters.region.includes(o.value))}
                >
                  {o.label}
                </button>
              ))}
            </FilterGroup>
          </div>

          {/* Row 2: Country */}
          <FilterGroup label="Country">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => toggleFilter("country", c)}
                className={pillClass(filters.country.includes(c))}
              >
                {c}
              </button>
            ))}
          </FilterGroup>

          {/* Row 3: Curriculum, Grade Levels, Governance */}
          <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
            <FilterGroup label="Curriculum">
              {curriculumOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => toggleFilter("curriculum", o.value)}
                  className={pillClass(filters.curriculum.includes(o.value))}
                >
                  {o.label}
                </button>
              ))}
            </FilterGroup>

            <FilterGroup label="Grade Levels">
              {gradeLevels.map((g) => (
                <button
                  key={g}
                  onClick={() => toggleFilter("gradeLevel", g)}
                  className={pillClass(filters.gradeLevel.includes(g))}
                >
                  {g}
                </button>
              ))}
            </FilterGroup>

            <FilterGroup label="Governance">
              {governanceTypes.map((gt) => (
                <button
                  key={gt}
                  onClick={() => toggleFilter("governance", gt)}
                  className={pillClass(filters.governance.includes(gt))}
                >
                  {gt}
                </button>
              ))}
            </FilterGroup>

            {hasActiveFilters && (
              <div className="flex items-end ml-auto self-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAll();
                  }}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

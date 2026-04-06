"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { FilterState } from "@/lib/types";

interface PeerFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

interface FilterGroup {
  label: string;
  key: keyof FilterState;
  options: { value: string; label: string }[];
}

const filterGroups: FilterGroup[] = [
  {
    label: "Size",
    key: "sizeCategory",
    options: [
      { value: "large", label: "Large (1200+)" },
      { value: "medium", label: "Medium (400-1200)" },
      { value: "small", label: "Small (<400)" },
    ],
  },
  {
    label: "Tuition",
    key: "tuitionBand",
    options: [
      { value: "budget", label: "Budget (<$10k)" },
      { value: "mid", label: "Mid ($10k-$18k)" },
      { value: "premium", label: "Premium ($18k+)" },
    ],
  },
  {
    label: "Region",
    key: "region",
    options: [
      { value: "South America", label: "South America" },
      { value: "Central America", label: "Central America" },
      { value: "Caribbean", label: "Caribbean" },
      { value: "North America", label: "North America" },
    ],
  },
  {
    label: "Curriculum",
    key: "curriculum",
    options: [
      { value: "AP", label: "AP" },
      { value: "IB", label: "IB" },
      { value: "AP & IB", label: "AP & IB" },
    ],
  },
];

export default function PeerFilters({ filters, setFilters }: PeerFiltersProps) {
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className="flex flex-wrap items-start gap-6">
        {filterGroups.map((group) => (
          <div key={group.key} className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {group.label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {group.options.map((option) => {
                const isActive = filters[group.key].includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => toggleFilter(group.key, option.value)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm transition-colors active:scale-95",
                      isActive
                        ? "bg-brand-800 text-white"
                        : "bg-white border border-slate-200 text-slate-600 hover:border-brand-300 hover:shadow-sm"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {hasActiveFilters && (
          <div className="flex items-end ml-auto">
            <button
              onClick={clearAll}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { metrics } from "@/data/metrics";
import { CheckCircle2 } from "lucide-react";

interface FormData {
  applications: number;
  acceptances: number;
  enrolled: number;
  waitList: number;
  attrition: number;
  attritionReason: string;
}

interface FormErrors {
  applications?: string;
  acceptances?: string;
  enrolled?: string;
  waitList?: string;
  attrition?: string;
  attritionReason?: string;
}

export default function AdmissionsForm() {
  const { currentUser, currentSchool } = useAuth();

  const getDefaultValues = useCallback((): FormData => {
    if (currentSchool) {
      const schoolMetrics = metrics.find(
        (m) => m.schoolId === currentSchool.id && m.year === 2026
      );
      if (schoolMetrics) {
        return {
          applications: schoolMetrics.applications,
          acceptances: schoolMetrics.acceptances,
          enrolled: schoolMetrics.enrolledNew,
          waitList: Math.round(schoolMetrics.applications * 0.08),
          attrition: Math.round(schoolMetrics.enrollment * 0.04),
          attritionReason: "Family Relocation",
        };
      }
    }
    return {
      applications: 0,
      acceptances: 0,
      enrolled: 0,
      waitList: 0,
      attrition: 0,
      attritionReason: "Family Relocation",
    };
  }, [currentSchool]);

  const [formData, setFormData] = useState<FormData>(getDefaultValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setFormData(getDefaultValues());
  }, [getDefaultValues]);

  const yieldRate =
    formData.acceptances > 0
      ? ((formData.enrolled / formData.acceptances) * 100).toFixed(1)
      : "0.0";

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.applications < 0) {
      newErrors.applications = "Must be 0 or greater";
    }
    if (formData.acceptances < 0) {
      newErrors.acceptances = "Must be 0 or greater";
    } else if (formData.acceptances > formData.applications) {
      newErrors.acceptances = "Cannot exceed application count";
    }
    if (formData.enrolled < 0) {
      newErrors.enrolled = "Must be 0 or greater";
    } else if (formData.enrolled > formData.acceptances) {
      newErrors.enrolled = "Cannot exceed acceptance count";
    }
    if (formData.waitList < 0) {
      newErrors.waitList = "Must be 0 or greater";
    }
    if (formData.attrition < 0) {
      newErrors.attrition = "Must be 0 or greater";
    }
    if (!formData.attritionReason) {
      newErrors.attritionReason = "Please select a reason";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    if (field === "attritionReason") {
      setFormData((prev) => ({ ...prev, [field]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: Number(value) || 0 }));
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const officeName = currentUser?.office
    ? currentUser.office.charAt(0).toUpperCase() + currentUser.office.slice(1) + " Office"
    : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-mono font-bold text-brand-900">
          Admissions Data Entry
        </h2>
        {officeName && (
          <p className="text-sm text-slate-500 mt-1">{officeName}</p>
        )}
        {currentSchool && (
          <p className="text-sm text-slate-500 mt-0.5">
            {currentSchool.name} &middot; 2025-26 Academic Year
          </p>
        )}
      </div>

      {showSuccess && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          Data saved successfully
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Application Count */}
          <div>
            <label
              htmlFor="applications"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Application Count
            </label>
            <input
              id="applications"
              type="number"
              min={0}
              required
              value={formData.applications}
              onChange={(e) => handleChange("applications", e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none ${
                errors.applications
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />
            {errors.applications && (
              <p className="mt-1 text-xs text-red-500">{errors.applications}</p>
            )}
          </div>

          {/* Acceptance Count */}
          <div>
            <label
              htmlFor="acceptances"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Acceptance Count
            </label>
            <input
              id="acceptances"
              type="number"
              min={0}
              required
              value={formData.acceptances}
              onChange={(e) => handleChange("acceptances", e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none ${
                errors.acceptances
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />
            {errors.acceptances && (
              <p className="mt-1 text-xs text-red-500">{errors.acceptances}</p>
            )}
          </div>

          {/* Enrolled Count */}
          <div>
            <label
              htmlFor="enrolled"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Enrolled Count
            </label>
            <input
              id="enrolled"
              type="number"
              min={0}
              required
              value={formData.enrolled}
              onChange={(e) => handleChange("enrolled", e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none ${
                errors.enrolled
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />
            {errors.enrolled && (
              <p className="mt-1 text-xs text-red-500">{errors.enrolled}</p>
            )}
          </div>

          {/* Yield Rate (auto-calculated) */}
          <div>
            <label
              htmlFor="yieldRate"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Yield Rate
            </label>
            <input
              id="yieldRate"
              type="text"
              readOnly
              value={`${yieldRate}%`}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 outline-none cursor-default"
            />
          </div>

          {/* Wait List Count */}
          <div>
            <label
              htmlFor="waitList"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Wait List Count
            </label>
            <input
              id="waitList"
              type="number"
              min={0}
              required
              value={formData.waitList}
              onChange={(e) => handleChange("waitList", e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none ${
                errors.waitList
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />
            {errors.waitList && (
              <p className="mt-1 text-xs text-red-500">{errors.waitList}</p>
            )}
          </div>

          {/* Attrition Count */}
          <div>
            <label
              htmlFor="attrition"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Attrition Count
            </label>
            <input
              id="attrition"
              type="number"
              min={0}
              required
              value={formData.attrition}
              onChange={(e) => handleChange("attrition", e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none ${
                errors.attrition
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />
            {errors.attrition && (
              <p className="mt-1 text-xs text-red-500">{errors.attrition}</p>
            )}
          </div>
        </div>

        {/* Primary Attrition Reason */}
        <div>
          <label
            htmlFor="attritionReason"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Primary Attrition Reason
          </label>
          <select
            id="attritionReason"
            required
            value={formData.attritionReason}
            onChange={(e) => handleChange("attritionReason", e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none ${
              errors.attritionReason
                ? "border-red-500"
                : "border-slate-300"
            }`}
          >
            <option value="Family Relocation">Family Relocation</option>
            <option value="Affordability">Affordability</option>
            <option value="Academic">Academic</option>
            <option value="Other">Other</option>
          </select>
          {errors.attritionReason && (
            <p className="mt-1 text-xs text-red-500">
              {errors.attritionReason}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto bg-brand-800 hover:bg-brand-900 text-white font-medium text-sm rounded-lg px-6 py-2.5 transition-colors"
        >
          Save Admissions Data
        </button>
      </form>
    </div>
  );
}

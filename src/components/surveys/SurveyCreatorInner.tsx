"use client";

import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import "survey-core/survey-core.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import { useEffect, useRef } from "react";

const sampleSurveyJSON = {
  title: "2026-27 Annual Enrollment & Tuition Data Collection",
  description:
    "Please provide your school's enrollment and tuition data for the 2026-27 academic year.",
  pages: [
    {
      name: "enrollment",
      title: "Enrollment Data",
      elements: [
        {
          type: "matrix",
          name: "enrollmentByDivision",
          title: "Total Enrollment by Division",
          columns: [{ value: "count", text: "Student Count" }],
          rows: [
            { value: "ec", text: "Early Childhood (PreK-K)" },
            { value: "es", text: "Elementary (G1-5)" },
            { value: "ms", text: "Middle School (G6-8)" },
            { value: "hs", text: "High School (G9-12)" },
          ],
          isRequired: true,
        },
        {
          type: "text",
          name: "newStudents",
          title: "Total New Students Enrolled This Year",
          inputType: "number",
          isRequired: true,
          validators: [{ type: "numeric", minValue: 0 }],
        },
        {
          type: "text",
          name: "totalApplications",
          title: "Total Applications Received",
          inputType: "number",
          isRequired: true,
        },
        {
          type: "text",
          name: "totalAcceptances",
          title: "Total Acceptances Offered",
          inputType: "number",
          isRequired: true,
        },
      ],
    },
    {
      name: "tuition",
      title: "Tuition & Financial Data",
      elements: [
        {
          type: "matrix",
          name: "tuitionByLevel",
          title: "Annual Day Tuition by Grade Level (USD)",
          columns: [
            { value: "low", text: "Lowest" },
            { value: "high", text: "Highest" },
          ],
          rows: [
            { value: "ec", text: "Early Childhood" },
            { value: "es", text: "Elementary" },
            { value: "ms", text: "Middle School" },
            { value: "hs", text: "High School" },
          ],
          isRequired: true,
        },
        {
          type: "text",
          name: "financialAidPercent",
          title: "Percentage of Students Receiving Financial Aid",
          inputType: "number",
          isRequired: true,
          validators: [{ type: "numeric", minValue: 0, maxValue: 100 }],
        },
        {
          type: "text",
          name: "totalFinancialAid",
          title: "Total Financial Aid Awarded (USD)",
          inputType: "number",
          isRequired: true,
        },
      ],
    },
    {
      name: "attrition",
      title: "Student Attrition",
      elements: [
        {
          type: "text",
          name: "attritionCount",
          title: "Number of Students Who Left This Year",
          inputType: "number",
          isRequired: true,
        },
        {
          type: "dropdown",
          name: "primaryAttritionReason",
          title: "Primary Reason for Student Attrition",
          choices: [
            "Family Relocation",
            "Affordability",
            "Academic Concerns",
            "School Dissatisfaction",
            "Other",
          ],
          isRequired: true,
        },
        {
          type: "text",
          name: "studentTeacherRatio",
          title: "Current Student-Teacher Ratio",
          inputType: "number",
          isRequired: true,
          description: "e.g., enter 9.5 for a 9.5:1 ratio",
        },
      ],
    },
  ],
};

export default function SurveyCreatorInner() {
  const creatorRef = useRef<SurveyCreator | null>(null);

  useEffect(() => {
    if (!creatorRef.current) {
      const creator = new SurveyCreator({
        showLogicTab: true,
        showTranslationTab: false,
        isAutoSave: false,
      });
      creator.JSON = sampleSurveyJSON;
      creatorRef.current = creator;
    }
  }, []);

  if (!creatorRef.current) {
    // Create on first render so the component can mount immediately
    const creator = new SurveyCreator({
      showLogicTab: true,
      showTranslationTab: false,
      isAutoSave: false,
    });
    creator.JSON = sampleSurveyJSON;
    creatorRef.current = creator;
  }

  return (
    <div className="h-full" style={{ minHeight: 600 }}>
      <SurveyCreatorComponent creator={creatorRef.current} />
    </div>
  );
}

"use client";

import React from "react";
import { MessageSquare, Sparkles } from "lucide-react";

const EXAMPLE_QUERIES = [
  {
    text: "How does our admissions yield compare to schools of similar size?",
    icon: "sparkles" as const,
  },
  {
    text: "Which schools have the highest retention rates?",
    icon: "message" as const,
  },
  {
    text: "What's the average student-teacher ratio for schools with tuition above $15,000?",
    icon: "sparkles" as const,
  },
  {
    text: "Show me enrollment trends across all South American schools",
    icon: "message" as const,
  },
  {
    text: "Which offices have the lowest survey completion rates?",
    icon: "sparkles" as const,
  },
  {
    text: "Compare faculty turnover rates between large and small schools",
    icon: "message" as const,
  },
];

interface ExampleQueriesProps {
  onSelect: (query: string) => void;
}

export default function ExampleQueries({ onSelect }: ExampleQueriesProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Example Questions
      </h3>
      {EXAMPLE_QUERIES.map((query, index) => (
        <button
          key={index}
          onClick={() => onSelect(query.text)}
          className="w-full text-left bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 rounded-lg p-3 text-sm text-slate-700 cursor-pointer transition-all flex items-start gap-2.5"
        >
          {query.icon === "sparkles" ? (
            <Sparkles className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
          ) : (
            <MessageSquare className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
          )}
          <span className="leading-snug">{query.text}</span>
        </button>
      ))}
    </div>
  );
}

"use client";

import React, { useState, useCallback } from "react";
import { Sparkles, ChevronDown, ChevronUp, Bot, BarChart3, MessageCircle } from "lucide-react";
import ChatInterface from "@/components/analytics/ChatInterface";
import ExampleQueries from "@/components/analytics/ExampleQueries";

export default function AnalyticsPage() {
  const [externalQuery, setExternalQuery] = useState<string | null>(null);
  const [mobileExamplesOpen, setMobileExamplesOpen] = useState(false);

  const handleSelectQuery = useCallback((query: string) => {
    setExternalQuery(query);
    setMobileExamplesOpen(false);
  }, []);

  const handleExternalQueryHandled = useCallback(() => {
    setExternalQuery(null);
  }, []);

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-brand-700" />
          <h1 className="text-2xl font-mono font-bold text-brand-900">AI Analytics</h1>
        </div>
        <p className="text-slate-500 mt-1 ml-8.5">
          Ask questions about your data in natural language
        </p>
      </div>

      {/* Mobile: collapsible example queries */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileExamplesOpen(!mobileExamplesOpen)}
          className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700"
        >
          <span className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-brand-600" />
            Example Questions
          </span>
          {mobileExamplesOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>
        {mobileExamplesOpen && (
          <div className="mt-2">
            <ExampleQueries onSelect={handleSelectQuery} />
          </div>
        )}
      </div>

      {/* Desktop: two-column layout */}
      <div className="flex gap-5" style={{ height: "calc(100vh - 200px)" }}>
        {/* Left sidebar - hidden on mobile */}
        <div className="hidden lg:flex lg:flex-col lg:w-80 lg:shrink-0 gap-4">
          <ExampleQueries onSelect={handleSelectQuery} />

          {/* How it works card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-brand-600" />
              How it works
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ask a question about enrollment, admissions, retention, faculty, or survey data.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  AI analyzes data across all schools in the network, respecting your access permissions.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Get insights with auto-generated charts and data visualizations.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Powered by Claude AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 min-w-0">
          <ChatInterface
            externalQuery={externalQuery}
            onExternalQueryHandled={handleExternalQueryHandled}
          />
        </div>
      </div>
    </div>
  );
}

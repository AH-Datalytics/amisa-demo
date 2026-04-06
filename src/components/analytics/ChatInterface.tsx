"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import ChatMessage from "./ChatMessage";

const WELCOME_MESSAGE: ChatMessageType = {
  id: "welcome",
  role: "assistant",
  content:
    "Welcome to AMISA AI Analytics. Ask me anything about school data, enrollment trends, benchmarking, or survey results. I'll analyze the data and generate visualizations for you.",
  chartConfig: null,
  timestamp: new Date(),
};

interface ChatInterfaceProps {
  externalQuery?: string | null;
  onExternalQueryHandled?: () => void;
}

export default function ChatInterface({ externalQuery, onExternalQueryHandled }: ChatInterfaceProps) {
  const { currentRole, currentSchool } = useAuth();
  const [messages, setMessages] = useState<ChatMessageType[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const processedQueryRef = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMessage: ChatMessageType = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        chartConfig: null,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);

      // Auto-resize textarea back to default
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: trimmed,
            role: currentRole ?? "network_admin",
            schoolId: currentSchool?.id ?? null,
          }),
        });

        const data = await response.json();

        const assistantMessage: ChatMessageType = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.text ?? "I was unable to process that request. Please try again.",
          chartConfig: data.chartConfig ?? null,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        const errorMessage: ChatMessageType = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "I encountered a connection issue. Please check your network and try again.",
          chartConfig: null,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, currentRole, currentSchool]
  );

  // Handle external query from ExampleQueries sidebar
  useEffect(() => {
    if (externalQuery && externalQuery !== processedQueryRef.current && !isLoading) {
      processedQueryRef.current = externalQuery;
      sendMessage(externalQuery);
      onExternalQueryHandled?.();
    }
  }, [externalQuery, isLoading, sendMessage, onExternalQueryHandled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-resize
    const target = e.target;
    target.style.height = "auto";
    target.style.height = Math.min(target.scrollHeight, 120) + "px";
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing data...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-200 p-3 bg-slate-50">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask about enrollment, admissions, faculty, or survey data..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
            className="shrink-0 bg-brand-700 hover:bg-brand-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg p-2.5 transition-colors"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1.5 ml-1">
          Press Enter to send, Shift+Enter for a new line
        </p>
      </div>
    </div>
  );
}

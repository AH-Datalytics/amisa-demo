"use client";

import React from "react";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import ResponseChart from "./ResponseChart";

interface ChatMessageProps {
  message: ChatMessageType;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%]">
          <div className="bg-brand-800 text-white rounded-2xl rounded-br-sm px-4 py-3">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          <p className="text-xs text-slate-400 mt-1 text-right">{formatTime(message.timestamp)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%]">
        <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3">
          <p className="text-sm text-slate-700 leading-relaxed">{message.content}</p>
        </div>
        {message.chartConfig && (
          <ResponseChart config={message.chartConfig} />
        )}
        <p className="text-xs text-slate-400 mt-1">{formatTime(message.timestamp)}</p>
      </div>
    </div>
  );
}

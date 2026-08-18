"use client";

import { useState } from "react";
import { profile } from "@/content/profile";

export type Message = {
  role: "user" | "assistant";
  content: string;
  projectSlug?: string;
};

const GREETING: Message = {
  role: "assistant",
  content: `Hi! I'm here to guide you through ${profile.name}'s work — ask me about his projects or experience and I'll point you to the right place.`,
};

export function useGuideChat() {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const started = messages.length > 1;

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const content = input.trim();
    if (!content || loading) return;

    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.text || "...",
          projectSlug: data.navigateTo || undefined,
        },
      ]);
    } catch {
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return { messages, input, setInput, loading, error, sendMessage, started };
}

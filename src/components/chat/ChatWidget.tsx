"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { profile } from "@/content/profile";
import { useGuideChat } from "./useGuideChat";
import { ChatThread } from "./ChatThread";

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { messages, input, setInput, loading, error, sendMessage } =
    useGuideChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  // The home page has its own full-size guide chat, so the floating
  // widget only needs to appear once the visitor has navigated away.
  if (pathname === "/") return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 flex h-[30rem] w-96 flex-col rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <span className="text-sm font-medium">Portfolio guide</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            <ChatThread messages={messages} loading={loading} error={error} />
          </div>

          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${profile.name}'s work…`}
              className="w-full rounded-full border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
              disabled={loading}
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white disabled:opacity-40 dark:bg-white dark:text-black"
            >
              ↑
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950 text-white shadow-lg dark:bg-white dark:text-black"
        aria-label="Toggle chat"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}

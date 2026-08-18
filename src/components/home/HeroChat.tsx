"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { profile } from "@/content/profile";
import { useGuideChat } from "@/components/chat/useGuideChat";
import { ChatThread } from "@/components/chat/ChatThread";

export function HeroChat() {
  const [mounted, setMounted] = useState(false);
  const { messages, input, setInput, loading, error, sendMessage, started } =
    useGuideChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <section
      className={`mx-auto flex w-full max-w-2xl flex-col px-6 pb-12 transition-[min-height,padding-top] duration-500 ${
        started ? "min-h-[45vh] justify-start pt-16" : "min-h-[70vh] justify-center"
      }`}
    >
      <div
        className={`text-center transition-all duration-700 ease-out ${
          started ? "mb-6" : "mb-8"
        } ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <h1
          className={`font-semibold tracking-tight text-zinc-950 transition-all duration-500 dark:text-zinc-50 ${
            started ? "text-2xl" : "text-4xl sm:text-5xl"
          }`}
        >
          {profile.name}
        </h1>
        {!started && (
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
            Ask me about his projects, or tell me what you&apos;re looking for
            and I&apos;ll point you the right way.
          </p>
        )}
      </div>

      {started && (
        <div
          ref={scrollRef}
          className="mb-4 max-h-[50vh] space-y-3 overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50"
        >
          <ChatThread messages={messages} loading={loading} error={error} />
        </div>
      )}

      <form
        onSubmit={sendMessage}
        className={`flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-2 py-2 shadow-sm transition-all duration-700 ease-out dark:border-zinc-700 dark:bg-zinc-900 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <span className="pl-3 text-zinc-400" aria-hidden>
          💬
        </span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${profile.name}'s work…`}
          className="w-full bg-transparent px-1 py-2 text-base outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={loading || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white disabled:opacity-40 dark:bg-white dark:text-black"
        >
          ↑
        </button>
      </form>

      {!started && (
        <div
          className={`mt-6 flex justify-center gap-3 text-sm font-medium transition-all duration-700 ease-out ${
            mounted ? "translate-y-0 opacity-100 delay-150" : "translate-y-4 opacity-0"
          }`}
        >
          <Link
            href="/projects"
            className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Browse projects
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            About me
          </Link>
        </div>
      )}
    </section>
  );
}

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chatContext";
import { projects } from "@/content/projects";

export const runtime = "nodejs";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 20;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const messages: ChatMessage[] | undefined = body?.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Missing messages." }, { status: 400 });
  }

  const trimmed = messages.slice(-MAX_MESSAGES).map((m) => ({
    role: m.role,
    content: String(m.content).slice(0, 4000),
  }));

  const response = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 500,
    system: buildSystemPrompt(),
    messages: trimmed,
    tools: [
      {
        name: "navigate_to_project",
        description:
          "Send the visitor to a specific project's detail page on the portfolio site.",
        input_schema: {
          type: "object",
          properties: {
            slug: {
              type: "string",
              enum: projects.map((p) => p.slug),
              description: "The slug of the project to navigate to.",
            },
          },
          required: ["slug"],
        },
      },
    ],
  });

  let text = "";
  let navigateTo: string | null = null;

  for (const block of response.content) {
    if (block.type === "text") {
      text += block.text;
    } else if (block.type === "tool_use" && block.name === "navigate_to_project") {
      const input = block.input as { slug?: string };
      if (input.slug) navigateTo = input.slug;
    }
  }

  return NextResponse.json({ text, navigateTo });
}

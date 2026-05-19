import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface DocContext {
  label: string;
  year: string;
  text: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

function buildSystem(docs: DocContext[]): string {
  const docsText = docs.length > 0
    ? docs.map((d) => `=== ${d.label} (${d.year}) ===\n${d.text}`).join("\n\n")
    : "Aucun document chargé.";

  return `Tu es un assistant juridique spécialisé dans les textes constitutionnels de la République Démocratique du Congo. Réponds TOUJOURS en français. Cite les articles avec le format <art>Article X — Document</art>. Sois clair et accessible.\n\nDOCUMENTS:\n${docsText}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, docs }: { messages: Message[]; docs: DocContext[] } = body;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      system: buildSystem(docs || []),
      messages,
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

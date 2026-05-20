import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      system: "Tu es un assistant juridique expert en textes constitutionnels de la République Démocratique du Congo. Réponds toujours en français. Cite les articles précis dans tes réponses.",
      messages,
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

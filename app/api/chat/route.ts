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
  const docsText = docs
    .map((d) => `=== DOCUMENT: ${d.label} (${d.year}) ===\n${d.text}\n=== FIN DU DOCUMENT ===`)
    .join("\n\n");

  return `Tu es un assistant juridique expert spécialisé EXCLUSIVEMENT dans les textes constitutionnels de la République Démocratique du Congo.

RÈGLES ABSOLUES :
1. Réponds UNIQUEMENT aux questions relatives aux textes constitutionnels congolais fournis.
2. Pour toute question hors sujet, explique poliment ta spécialisation.
3. Cite TOUJOURS les articles précis et le document source avec le format: <art>Article X — Nom du document (Année)</art>
4. Explique en langage clair et accessible pour tous.
5. Réponds TOUJOURS en français.
6. Si une question porte sur plusieurs textes (ex: évolution constitutionnelle), compare et cite chaque document pertinent.
7. Si le document requis n'est pas chargé, indique à l'utilisateur de l'activer dans la liste à gauche.
8. Structure tes réponses clairement avec des paragraphes. Évite les listes à puces excessives.

DOCUMENTS CONSTITUTIONNELS DISPONIBLES :
${docsText || "Aucun document chargé. Demandez à l'utilisateur d'activer des documents dans la barre latérale."}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, docs }: { messages: Message[]; docs: DocContext[] } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const system = buildSystem(docs || []);

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      system,
      messages,
    });

    // Stream the response as Server-Sent Events
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              const data = JSON.stringify({ text: chunk.delta.text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Stream error";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { DOCUMENTS } from "@/app/lib/documents";

const cache = new Map<string, string>();

async function extractPdfText(url: string): Promise<string> {
  if (cache.has(url)) return cache.get(url)!;
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; RDC-Constitution/1.0)" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} fetching PDF`);
  const buffer = await response.arrayBuffer();
  const { extractText } = await import("unpdf");
  const { text } = await extractText(new Uint8Array(buffer), { mergePages: true });
  const clean = text.replace(/\s+/g, " ").trim().substring(0, 40000);
  cache.set(url, clean);
  return clean;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const docId = searchParams.get("id");
  if (!docId) return NextResponse.json({ error: "Missing doc id" }, { status: 400 });
  const doc = DOCUMENTS.find((d) => d.id === docId);
  if (!doc) return NextResponse.json({ error: "Unknown document" }, { status: 404 });
  try {
    const text = await extractPdfText(doc.url);
    return NextResponse.json({ id: docId, text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

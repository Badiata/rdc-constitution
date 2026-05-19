import { NextRequest, NextResponse } from "next/server";
import { DOCUMENTS } from "@/app/lib/documents";

const cache = new Map<string, string>();

async function extractPdfText(url: string): Promise<string> {
  if (cache.has(url)) return cache.get(url)!;

  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; RDC-Constitution-Assistant/1.0)" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const buffer = Buffer.from(await response.arrayBuffer());

  // Use pdfjs-dist in Node mode
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
  const pdf = await loadingTask.promise;

  const maxPages = Math.min(pdf.numPages, 80);
  const parts: string[] = [];
  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    parts.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
  }

  const text = parts.join("\n").replace(/\s+/g, " ").trim().substring(0, 40000);
  cache.set(url, text);
  return text;
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

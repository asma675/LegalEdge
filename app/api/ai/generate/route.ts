import { NextResponse } from "next/server";
import { generateWithOpenAI } from "@/lib/openai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { prompt, docText } = await req.json();
    const system =
      "You are LegalEdge, a professional-grade AI assistant for lawyers and business professionals. " +
      "Be accurate, structured, and concise. Add a short disclaimer: Not legal advice.";

    const input =
      (docText ? `DOCUMENT:\n${docText}\n\n` : "") +
      `USER REQUEST:\n${prompt}`;

    const text = await generateWithOpenAI(input, { system });
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 });
  }
}

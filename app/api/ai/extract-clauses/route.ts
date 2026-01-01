import { NextResponse } from "next/server";
import { generateWithOpenAI } from "@/lib/openai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const system =
      "Return STRICT JSON only: { clauses: [{ name, risk, recommendation, quote }] }";

    const raw = await generateWithOpenAI(text.slice(0, 18000), { system });
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ clauses: [] });
  }
}

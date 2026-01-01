import { NextResponse } from "next/server";
import pdf from "pdf-parse";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;
  const buf = Buffer.from(await file.arrayBuffer());

  if (file.type.includes("pdf")) {
    const data = await pdf(buf);
    return NextResponse.json({ text: data.text });
  }
  return NextResponse.json({ text: buf.toString("utf-8") });
}

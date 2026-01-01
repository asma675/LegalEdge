import { NextResponse } from "next/server";
import { Document, Packer, Paragraph } from "docx";

export async function POST(req: Request) {
  const { text } = await req.json();
  const doc = new Document({
    sections: [{ children: text.split("\n").map(l => new Paragraph(l)) }],
  });
  const buf = await Packer.toBuffer(doc);
  return new NextResponse(buf, {
    headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  });
}

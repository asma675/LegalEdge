'use client';

import { useEffect, useMemo, useState } from "react";
import { Button, Card, Container } from "@/components/ui";
import Link from "next/link";
import { signOut } from "next-auth/react";

type Clause = { name: string; risk: string; recommendation: string; quote?: string };

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function Workspace() {
  const [prompt, setPrompt] = useState("");
  const [docText, setDocText] = useState("");
  const [result, setResult] = useState("");
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [busy, setBusy] = useState(false);
  const [uploadName, setUploadName] = useState<string | null>(null);
  const hasAnyText = useMemo(() => (result || docText || prompt).trim().length > 0, [result, docText, prompt]);

  const generate = async () => {
    setBusy(true);
    setClauses([]);
    try {
      const r = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, docText }),
      });
      const data = await r.json();
      setResult(data.text || "");
    } catch (e: any) {
      setResult(`Error: ${e?.message || "Failed to generate"}`);
    } finally {
      setBusy(false);
    }
  };

  const extractClauses = async () => {
    setBusy(true);
    try {
      const r = await fetch("/api/ai/extract-clauses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: docText || result || prompt }),
      });
      const data = await r.json();
      setClauses(Array.isArray(data.clauses) ? data.clauses : []);
      if (data.note) setResult((prev) => prev || data.note);
    } catch (e: any) {
      setResult(`Error: ${e?.message || "Failed to extract clauses"}`);
    } finally {
      setBusy(false);
    }
  };

  const onUpload = async (file: File) => {
    setBusy(true);
    setUploadName(file.name);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await r.json();
      setDocText(data.text || "");
    } catch (e: any) {
      setDocText(`Error reading file: ${e?.message || "failed"}`);
    } finally {
      setBusy(false);
    }
  };

  const exportDocx = async () => {
    const text = result || docText || prompt;
    const r = await fetch("/api/export/docx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "LegalEdge Output", text }),
    });
    const blob = await r.blob();
    downloadBlob(blob, "legaledge-output.docx");
  };

  const exportPdf = async () => {
    const text = result || docText || prompt;
    const r = await fetch("/api/export/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "LegalEdge Output", text }),
    });
    const blob = await r.blob();
    downloadBlob(blob, "legaledge-output.pdf");
  };

  return (
    <main className="py-10">
      <Container>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs text-slate-400">Workspace</div>
            <h1 className="text-2xl font-extrabold">LegalEdge</h1>
            <p className="mt-1 text-sm text-slate-300">Generate drafts, extract clauses, export DOCX/PDF, and analyze uploaded documents.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/"><Button variant="ghost">Home</Button></Link>
            <Link href="/pricing"><Button variant="ghost">Pricing</Button></Link>
            <Button variant="secondary" onClick={() => signOut({ callbackUrl: "/" })}>Sign out</Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-5">
          <Card className="p-5 md:col-span-2">
            <div className="font-bold">1) Upload document (beta)</div>
            <p className="mt-2 text-sm text-slate-300">Upload a PDF or TXT. We’ll extract text server-side.</p>

            <label className="mt-4 block cursor-pointer rounded-xl border border-dashed border-white/15 bg-black/30 p-4 text-sm text-slate-300 hover:bg-white/5">
              <input
                className="hidden"
                type="file"
                accept=".pdf,.txt,text/plain,application/pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onUpload(f);
                }}
              />
              <div className="font-semibold">Choose file</div>
              <div className="mt-1 text-xs text-slate-400">
                {uploadName ? `Selected: ${uploadName}` : "PDF/TXT supported"}
              </div>
            </label>

            <div className="mt-4">
              <div className="text-xs text-slate-400">Extracted text</div>
              <textarea
                className="mt-2 h-64 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm outline-none focus:border-indigo-400/40"
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
                placeholder="Document text will appear here after upload…"
              />
            </div>
          </Card>

          <Card className="p-5 md:col-span-3">
            <div className="font-bold">2) Ask AI for drafting or analysis</div>
            <p className="mt-2 text-sm text-slate-300">
              Uses the OpenAI <b>Responses API</b> from a secure server route (API key stays on server).
            </p>

            <div className="mt-4">
              <div className="text-xs text-slate-400">Prompt</div>
              <textarea
                className="mt-2 h-28 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm outline-none focus:border-indigo-400/40"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Draft a demand letter for unpaid invoice. Include a deadline and professional tone."
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={generate} disabled={busy}>
                {busy ? "Working…" : "Generate with AI"}
              </Button>
              <Button variant="secondary" onClick={extractClauses} disabled={busy}>
                Extract clauses + risks
              </Button>
              <Button variant="ghost" onClick={() => { setPrompt(""); setResult(""); setClauses([]); }}>
                Clear
              </Button>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={exportDocx} disabled={!hasAnyText || busy}>Export DOCX</Button>
                <Button variant="secondary" onClick={exportPdf} disabled={!hasAnyText || busy}>Export PDF</Button>
              </div>

              <div>
                <div className="text-xs text-slate-400">AI output</div>
                <pre className="mt-2 whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed">
{result || "No output yet."}
                </pre>
              </div>

              {clauses.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-slate-400">Extracted clauses (AI)</div>
                  <div className="mt-2 grid gap-3">
                    {clauses.map((c, idx) => (
                      <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="font-bold">{c.name}</div>
                        <div className="mt-2 text-sm text-slate-200"><b>Risk:</b> {c.risk}</div>
                        <div className="mt-2 text-sm text-slate-200"><b>Recommendation:</b> {c.recommendation}</div>
                        {c.quote && (
                          <div className="mt-2 text-xs text-slate-400">
                            <b>Quote:</b> “{c.quote}”
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-400">
                Disclaimer: Not legal advice. Always review, verify, and apply professional judgment.
              </p>
            </div>
          </Card>
        </div>
      </Container>
    </main>
  );
}

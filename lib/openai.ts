type OpenAIResponse = { output_text?: string };

/**
 * Uses OpenAI's Responses API (recommended for new projects).
 * Docs: https://platform.openai.com/docs/guides/text
 */
export async function generateWithOpenAI(input: string, opts?: { system?: string; model?: string }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const model = opts?.model || process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const system = opts?.system || "You are a precise assistant for lawyers and business professionals.";

  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: [
        { role: "system", content: [{ type: "text", text: system }] },
        { role: "user", content: [{ type: "text", text: input }] },
      ],
      temperature: 0.2,
    }),
  });

  if (!r.ok) {
    const msg = await r.text().catch(() => "");
    throw new Error(`OpenAI error: ${r.status} ${r.statusText} ${msg}`);
  }

  const data = (await r.json()) as OpenAIResponse;
  // The docs expose output_text as a convenient field.
  const text = (data as any).output_text || "";
  return text || "(No text returned)";
}

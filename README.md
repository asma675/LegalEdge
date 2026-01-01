# LegalEdge Pro (Next.js + Vercel)

This is a Vercel-ready Next.js app with:
- ✅ Real AI wired in (OpenAI Responses API via server route)
- ✅ Auth (NextAuth Credentials demo)
- ✅ Pricing page
- ✅ Law-firm SaaS UI polish (Tailwind)
- ✅ Document upload + text extraction (PDF/TXT)
- ✅ Clause extraction (AI)
- ✅ DOCX + PDF export

## Quick start
```bash
npm install
npm run dev
```

## Deploy to Vercel
Upload this repo/zip to Vercel.

### Required environment variables
- `OPENAI_API_KEY` (required for AI)
- `OPENAI_MODEL` (optional) e.g. `gpt-4.1-mini`

### Demo auth (optional)
- `DEMO_USER_EMAIL` (default: demo@legaledge.ai)
- `DEMO_USER_PASSWORD` (default: legaledge-demo)

## Notes
- AI calls happen server-side in `/app/api/ai/*` so your API key is not exposed to the browser.
- PDF extraction uses `pdf-parse` (best for text-based PDFs).
- Exports are generated server-side (DOCX via `docx`, PDF via `pdf-lib`).

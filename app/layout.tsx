import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LegalEdge — AI for Lawyers & Business",
  description: "Professional AI drafting, clause extraction, and exports for legal teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

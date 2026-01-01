'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { Button, Card, Container } from "@/components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@legaledge.ai");
  const [password, setPassword] = useState("legaledge-demo");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/workspace",
    });

    // In redirect mode, res is usually undefined; keep fallback error for non-redirect cases
    if (res?.error) setError("Invalid credentials.");
    setLoading(false);
  };

  return (
    <main className="py-16">
      <Container>
        <div className="mx-auto max-w-md">
          <Link href="/" className="text-sm text-slate-300 hover:text-white">← Back to home</Link>

          <Card className="mt-4 p-6">
            <div className="text-xl font-extrabold">Sign in</div>
            <p className="mt-2 text-sm text-slate-300">
              Demo uses a credentials login (configure via environment variables).
            </p>

            <form className="mt-6 space-y-3" onSubmit={onSubmit}>
              <div>
                <label className="text-xs text-slate-400">Email</label>
                <input
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-indigo-400/40"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400">Password</label>
                <input
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-indigo-400/40"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
              </div>

              {error && <div className="text-sm text-red-300">{error}</div>}

              <Button className="w-full" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <div className="mt-4 text-xs text-slate-400">
              Defaults: <b>demo@legaledge.ai</b> / <b>legaledge-demo</b>
            </div>
          </Card>
        </div>
      </Container>
    </main>
  );
}

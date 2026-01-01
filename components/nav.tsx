import Link from "next/link";
import { Button, Container } from "./ui";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function Nav() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur">
      <Container>
        <div className="flex items-center gap-3 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 font-black text-slate-950">
              LE
            </div>
            <div>
              <div className="font-extrabold leading-none">LegalEdge</div>
              <div className="text-xs text-slate-400">Law-firm grade AI workspace</div>
            </div>
          </div>

          <nav className="ml-6 hidden items-center gap-4 text-sm text-slate-300 md:flex">
            <Link className="hover:text-white" href="#features">Features</Link>
            <Link className="hover:text-white" href="/pricing">Pricing</Link>
            <Link className="hover:text-white" href="/workspace">Workspace</Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/pricing"><Button variant="ghost">Pricing</Button></Link>
            {session ? (
              <Link href="/workspace"><Button>Open Workspace</Button></Link>
            ) : (
              <Link href="/login"><Button>Sign in</Button></Link>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}

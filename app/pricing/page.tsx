import Link from "next/link";
import { Nav } from "@/components/nav";
import { Button, Card, Container } from "@/components/ui";

function Tier({ name, price, items, featured }: { name: string; price: string; items: string[]; featured?: boolean }) {
  return (
    <Card className={"p-6 " + (featured ? "ring-1 ring-indigo-400/40" : "")}>
      <div className="text-lg font-bold">{name}</div>
      <div className="mt-3 text-3xl font-extrabold">{price}</div>
      <ul className="mt-4 space-y-2 text-sm text-slate-300">
        {items.map((x) => (
          <li key={x}>• {x}</li>
        ))}
      </ul>
      <div className="mt-6">
        <Link href="/workspace">
          <Button variant={featured ? "primary" : "secondary"} className="w-full">
            {featured ? "Start Professional" : "Choose"}
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export default function PricingPage() {
  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <Nav />
      <main className="py-14">
        <Container>
          <h1 className="text-4xl font-extrabold tracking-tight">Pricing</h1>
          <p className="mt-3 max-w-2xl text-slate-300 leading-relaxed">
            Simple plans for solo practitioners and teams. (Placeholder pricing — customize any time.)
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Tier
              name="Starter"
              price="$19/mo"
              items={["Templates + drafting", "Basic summaries", "Email-style outputs"]}
            />
            <Tier
              name="Professional"
              price="$59/mo"
              featured
              items={["Case-style analysis", "Document upload + clause extraction", "DOCX/PDF export"]}
            />
            <Tier
              name="Firm"
              price="Custom"
              items={["Team workspace", "SSO & audit logs (future)", "Compliance controls (future)"]}
            />
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            <b>Demo login:</b> Use the credentials in your environment variables (or defaults) to sign in and access the workspace.
          </div>
        </Container>
      </main>
    </>
  );
}

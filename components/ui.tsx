import React from "react";

export function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-4">{children}</div>;
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={"rounded-2xl border border-white/10 bg-white/5 shadow-glow backdrop-blur " + className}>
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition active:translate-y-[1px]";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 hover:opacity-95"
      : variant === "secondary"
      ? "border border-white/10 bg-white/5 hover:bg-white/10"
      : "hover:bg-white/10";
  return (
    <button className={base + " " + styles + " " + className} {...props}>
      {children}
    </button>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
      {children}
    </span>
  );
}

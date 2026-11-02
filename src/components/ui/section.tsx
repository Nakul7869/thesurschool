import type { ReactNode } from "react";

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 md:py-20 ${className}`}>{children}</section>;
}

export function SectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-8 max-w-2xl md:mb-12">
      {eyebrow ? <p className="mb-2 text-sm font-bold uppercase tracking-widest text-accent">{eyebrow}</p> : null}
      <h2 className="font-display text-4xl font-black leading-tight text-ink md:text-5xl">{title}</h2>
      {children ? <p className="mt-4 text-lg text-muted">{children}</p> : null}
    </header>
  );
}

export function PageTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="mx-auto w-full max-w-6xl px-4 pb-4 pt-12 sm:px-6 md:pt-20">
      <h1 className="font-display text-5xl font-black leading-none text-ink md:text-7xl">{title}</h1>
      {children ? <p className="mt-5 max-w-2xl text-lg text-muted">{children}</p> : null}
    </header>
  );
}

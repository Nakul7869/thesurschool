import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { LogoMark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "../actions/auth";

const ADMIN_LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/settings", label: "Details and contact" },
  { href: "/admin/courses", label: "Courses and fees" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/events", label: "Events and news" },
];

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="p-8 text-muted">Loading…</p>}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}

/** Nothing in the admin panel renders until the visitor is confirmed as the admin. */
async function Gate({ children }: { children: ReactNode }) {
  const { email } = await requireAdmin();
  return (
    <>
      <header className="border-b border-line bg-bg">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3 text-accent">
            <LogoMark className="h-10 w-auto" />
            <span className="font-display text-xl font-black text-ink">Admin</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/" target="_blank" className="font-bold text-accent underline underline-offset-4">
              View website
            </Link>
            <span className="hidden text-muted sm:inline">{email}</span>
            <ThemeToggle />
            <form action={signOut}>
              <button type="submit" className="min-h-11 rounded-full border border-line px-4 font-bold hover:bg-bg-soft">
                Sign out
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Admin" className="mx-auto flex w-full max-w-5xl gap-1 overflow-x-auto px-4 pb-2">
          {ADMIN_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold hover:bg-bg-soft">
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
    </>
  );
}

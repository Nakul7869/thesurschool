import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
      <p className="font-display text-8xl font-black text-accent">404</p>
      <h1 className="mt-4 font-display text-4xl font-black text-ink">This page is off-key</h1>
      <p className="mt-3 text-muted">We could not find what you were looking for.</p>
      <ButtonLink href="/" className="mt-8">
        Back to the home page
      </ButtonLink>
      <p className="mt-6">
        <Link href="/courses" className="font-bold text-accent underline underline-offset-4">
          Browse courses
        </Link>
      </p>
    </section>
  );
}

import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/brand-icons";
import { ButtonLink } from "@/components/ui/button-link";
import { contactLinks } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

export function CtaBand({ settings }: { settings: SiteSettings }) {
  const { whatsapp, tel } = contactLinks(settings);
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 md:pb-24">
      <div className="rounded-3xl bg-brand px-6 py-12 text-center text-on-brand md:px-12 md:py-16">
        <h2 className="font-display text-4xl font-black md:text-6xl">Ready to start playing?</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg opacity-90">
          Message {settings.teacherName} to book your first session or ask about fees and timings.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {whatsapp ? (
            <ButtonLink href={whatsapp} target="_blank" rel="noopener noreferrer" variant="whatsapp">
              <WhatsAppIcon className="size-5" />
              Chat on WhatsApp
            </ButtonLink>
          ) : null}
          {tel ? (
            <ButtonLink href={tel} className="border-2 border-on-brand bg-transparent text-on-brand hover:bg-on-brand hover:text-brand">
              <Phone className="size-5" aria-hidden="true" />
              Call now
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}

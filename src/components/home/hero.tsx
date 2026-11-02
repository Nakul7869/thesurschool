import { WhatsAppIcon } from "@/components/brand/brand-icons";
import { LogoMark } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button-link";
import { MediaImage } from "@/components/ui/media-image";
import { contactLinks } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";
import { Phone } from "lucide-react";

export function Hero({ settings }: { settings: SiteSettings }) {
  const { whatsapp, tel } = contactLinks(settings);
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-14 pt-10 sm:px-6 md:pb-24 md:pt-16 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <p className="inline-block rounded-full bg-brand px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-on-brand">
          Lessons with {settings.teacherName}
        </p>
        <h1 className="mt-6 font-display text-6xl font-black leading-[0.95] text-ink sm:text-7xl md:text-8xl">
          {settings.heroHeading}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted md:text-xl">{settings.heroSubheading}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {whatsapp ? (
            <ButtonLink href={whatsapp} target="_blank" rel="noopener noreferrer" variant="whatsapp">
              <WhatsAppIcon className="size-5" />
              Book on WhatsApp
            </ButtonLink>
          ) : null}
          {tel ? (
            <ButtonLink href={tel} variant="outline">
              <Phone className="size-5" aria-hidden="true" />
              Call now
            </ButtonLink>
          ) : null}
        </div>
      </div>
      <div className="tilt-frame mx-auto w-full max-w-md lg:max-w-none">
        <div className="relative aspect-[4/5] overflow-hidden bg-surface">
          {settings.teacherPhotoPath ? (
            <MediaImage
              path={settings.teacherPhotoPath}
              alt={`${settings.teacherName}, teacher at ${settings.schoolName}`}
              sizes="(min-width: 1024px) 40vw, 90vw"
              priority
            />
          ) : (
            <div className="grid h-full place-items-center text-accent">
              <LogoMark className="w-1/2 opacity-90" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

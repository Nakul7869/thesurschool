import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Mail, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from "@/components/brand/brand-icons";
import { PageTitle, Section } from "@/components/ui/section";
import { getSiteSettings } from "@/lib/data";
import { contactLinks } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact and booking",
  description: "Book a session with The Sur School on WhatsApp, by phone or by email.",
};

const SOCIAL_ICONS = { Instagram: InstagramIcon, YouTube: YouTubeIcon, Facebook: FacebookIcon };

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const { whatsapp, tel, mailto, phoneDisplay, whatsappDisplay, socials } = contactLinks(settings);
  return (
    <>
      <PageTitle title="Book a session">
        The quickest way to book is a message on WhatsApp. You can also call or send an email.
      </PageTitle>
      <Section className="!pt-8">
        <ul className="grid gap-5 md:grid-cols-3">
          {whatsapp ? (
            <ContactCard href={whatsapp} external title="WhatsApp" detail={whatsappDisplay} icon={<WhatsAppIcon className="size-7" />} highlight />
          ) : null}
          {tel ? <ContactCard href={tel} title="Call" detail={phoneDisplay} icon={<Phone className="size-7" aria-hidden="true" />} /> : null}
          {mailto ? <ContactCard href={mailto} title="Email" detail={settings.email} icon={<Mail className="size-7" aria-hidden="true" />} /> : null}
        </ul>
        {socials.length > 0 ? (
          <ul className="mt-8 flex flex-wrap gap-3" aria-label="Social media">
            {socials.map(({ name, label, href }) => {
              const Icon = SOCIAL_ICONS[name];
              return (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 font-semibold text-ink hover:bg-bg-soft">
                    <Icon className="size-4" />
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        ) : null}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Info title="How classes are held">{settings.classModesNote}</Info>
          {settings.serviceArea ? <Info title="Home visit area">{settings.serviceArea}</Info> : null}
          <Info title="Grading classes">{settings.gradingNote}</Info>
        </div>
      </Section>
    </>
  );
}

type ContactCardProps = { href: string; title: string; detail: string; icon: ReactNode; external?: boolean; highlight?: boolean };

function ContactCard({ href, title, detail, icon, external, highlight }: ContactCardProps) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`flex h-full flex-col gap-3 rounded-2xl p-6 transition hover:-translate-y-1 ${
          highlight ? "bg-[#0f7a40] text-white" : "border border-line bg-surface text-ink"
        }`}
      >
        {icon}
        <span className="text-2xl font-bold">{title}</span>
        <span className="break-words font-semibold">{detail}</span>
      </a>
    </li>
  );
}

function Info({ title, children }: { title: string; children: ReactNode }) {
  if (!children) return null;
  return (
    <div className="rounded-2xl border border-line p-6">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <p className="mt-2 text-muted">{children}</p>
    </div>
  );
}

import { bookingMessage, formatPhone, mailtoLink, telLink, whatsappLink } from "./contact";
import type { SiteSettings } from "./types";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
] as const;

export type Social = { name: "Instagram" | "YouTube" | "Facebook"; href: string };

export function contactLinks(settings: SiteSettings) {
  const socials: Social[] = [
    { name: "Instagram" as const, href: settings.instagramUrl },
    { name: "YouTube" as const, href: settings.youtubeUrl },
    { name: "Facebook" as const, href: settings.facebookUrl },
  ].filter((social) => social.href !== "");

  return {
    whatsapp: whatsappLink(settings.whatsappNumber, bookingMessage({ school: settings.schoolName })),
    tel: telLink(settings.phone),
    mailto: mailtoLink(settings.email, `Class enquiry for ${settings.schoolName}`),
    phoneDisplay: formatPhone(settings.phone),
    whatsappDisplay: formatPhone(settings.whatsappNumber),
    socials,
  };
}

/** WhatsApp link that opens with a message about one course level already typed. */
export function courseWhatsappLink(
  settings: SiteSettings,
  course: { instrument: string; level?: string; grading?: boolean },
): string | null {
  const message = bookingMessage({ school: settings.schoolName, ...course });
  return whatsappLink(settings.whatsappNumber, message);
}

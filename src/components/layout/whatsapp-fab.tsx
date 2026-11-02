import { WhatsAppIcon } from "@/components/brand/brand-icons";
import { contactLinks } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

/** Round WhatsApp button that stays in the corner of every page. */
export function WhatsAppFab({ settings }: { settings: SiteSettings }) {
  const { whatsapp } = contactLinks(settings);
  if (!whatsapp) return null;
  return (
    <a
      href={whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#0f7a40] text-white shadow-xl transition hover:scale-105 hover:bg-[#0b6634]"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}

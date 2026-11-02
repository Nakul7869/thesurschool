import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { WhatsAppIcon } from "@/components/brand/brand-icons";
import { ButtonLink } from "@/components/ui/button-link";
import { contactLinks } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

export function Header({ settings }: { settings: SiteSettings }) {
  const { whatsapp } = contactLinks(settings);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="relative mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label={`${settings.schoolName}, home`} className="shrink-0 text-accent">
          <Logo className="h-11 w-auto sm:h-12" label={settings.schoolName} />
        </Link>
        <NavLinks className="hidden items-center gap-1 lg:flex" />
        <div className="flex items-center gap-2">
          {whatsapp ? (
            <div className="hidden sm:block">
              <ButtonLink href={whatsapp} target="_blank" rel="noopener noreferrer" variant="whatsapp" className="min-h-11 px-5 text-sm">
                <WhatsAppIcon className="size-5" />
                Book on WhatsApp
              </ButtonLink>
            </div>
          ) : null}
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

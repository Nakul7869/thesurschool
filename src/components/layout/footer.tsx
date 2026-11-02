import { cacheLife } from "next/cache";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/components/brand/brand-icons";
import { Logo } from "@/components/brand/logo";
import { contactLinks, NAV_LINKS, type Social } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

const SOCIAL_ICONS: Record<Social["name"], typeof InstagramIcon> = {
  Instagram: InstagramIcon,
  YouTube: YouTubeIcon,
  Facebook: FacebookIcon,
};

const linkClass = "underline-offset-4 hover:underline";

export async function Footer({ settings }: { settings: SiteSettings }) {
  "use cache";
  cacheLife("days");
  const { whatsapp, tel, mailto, phoneDisplay, socials } = contactLinks(settings);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand text-on-brand">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo className="h-14 w-auto" label={settings.schoolName} />
          <p className="mt-5 max-w-xs text-sm opacity-90">{settings.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest opacity-80">Explore</h2>
          <ul className="space-y-2">
            {NAV_LINKS.filter((link) => link.href !== "/").map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest opacity-80">Contact</h2>
          <ul className="space-y-2 break-words">
            {whatsapp ? (
              <li>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp
                </a>
              </li>
            ) : null}
            {tel ? (
              <li>
                <a href={tel} className={linkClass}>
                  {phoneDisplay}
                </a>
              </li>
            ) : null}
            {mailto ? (
              <li>
                <a href={mailto} className={linkClass}>
                  {settings.email}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
        {socials.length > 0 ? (
          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest opacity-80">Follow</h2>
            <ul className="space-y-2">
              {socials.map(({ name, href }) => {
                const Icon = SOCIAL_ICONS[name];
                return (
                  <li key={name}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 ${linkClass}`}>
                      <Icon className="size-4" />
                      {name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="border-t border-white/20">
        <p className="mx-auto w-full max-w-6xl px-4 py-5 text-sm opacity-80 sm:px-6">
          © {year} {settings.schoolName}. {settings.teacherName}.
        </p>
      </div>
    </footer>
  );
}

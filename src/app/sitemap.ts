import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";
import { NAV_LINKS } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return NAV_LINKS.map((link) => ({ url: `${SITE_URL}${link.href === "/" ? "" : link.href}` }));
}

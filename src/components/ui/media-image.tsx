import Image from "next/image";
import { SUPABASE_URL } from "@/lib/env";
import { publicMediaUrl } from "@/lib/media";

type MediaImageProps = {
  path: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Photo stored in the site-media bucket. Fills its parent, which must be `relative` with a set size. */
export function MediaImage({ path, alt, sizes, priority, className }: MediaImageProps) {
  const src = publicMediaUrl(SUPABASE_URL, path);
  if (!src) return null;
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className ?? "object-cover"} />;
}

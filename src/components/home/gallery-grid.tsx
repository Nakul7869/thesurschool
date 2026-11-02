import Image from "next/image";
import { Play } from "lucide-react";
import { MediaImage } from "@/components/ui/media-image";
import { parseYouTube } from "@/lib/media";
import type { GalleryItem } from "@/lib/types";

export function GalleryGrid({ items, emptyText }: { items: GalleryItem[]; emptyText: string }) {
  if (items.length === 0) return <p className="rounded-2xl border border-dashed border-line p-8 text-muted">{emptyText}</p>;
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
      {items.map((item) => (
        <li key={item.id}>
          <figure>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
              {item.kind === "photo" ? (
                <MediaImage path={item.storagePath} alt={item.caption || "Photo from The Sur School"} sizes="(min-width: 768px) 33vw, 50vw" />
              ) : (
                <VideoThumb url={item.videoUrl ?? ""} caption={item.caption} />
              )}
            </div>
            {item.caption ? <figcaption className="mt-2 text-sm text-muted">{item.caption}</figcaption> : null}
          </figure>
        </li>
      ))}
    </ul>
  );
}

function VideoThumb({ url, caption }: { url: string; caption: string }) {
  const video = parseYouTube(url);
  if (!video) return null;
  return (
    <a href={video.watchUrl} target="_blank" rel="noopener noreferrer" aria-label={`Watch on YouTube: ${caption || "video"}`} className="group absolute inset-0">
      <Image src={video.thumbnailUrl} alt="" fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
      <span className="absolute inset-0 grid place-items-center bg-black/25 transition group-hover:bg-black/40">
        <span className="grid size-14 place-items-center rounded-full bg-white text-brand">
          <Play className="size-6 translate-x-0.5" fill="currentColor" aria-hidden="true" />
        </span>
      </span>
    </a>
  );
}

export const MEDIA_BUCKET = "site-media";

const YOUTUBE_ID = /^[\w-]{11}$/;
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"]);

export type VideoInfo = {
  id: string;
  embedUrl: string;
  thumbnailUrl: string;
  watchUrl: string;
};

export function publicMediaUrl(baseUrl: string | undefined, path: string | null | undefined): string | null {
  if (!baseUrl || !path) return null;
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${baseUrl.replace(/\/$/, "")}/storage/v1/object/public/${MEDIA_BUCKET}/${encoded}`;
}

function youtubeId(url: URL): string | null {
  if (url.hostname === "youtu.be") return url.pathname.slice(1).split("/")[0] ?? null;
  if (!YOUTUBE_HOSTS.has(url.hostname)) return null;
  if (url.pathname === "/watch") return url.searchParams.get("v");
  const match = url.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/);
  return match?.[1] ?? null;
}

export function parseYouTube(raw: string): VideoInfo | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const id = youtubeId(url);
  if (!id || !YOUTUBE_ID.test(id)) return null;
  return {
    id,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    watchUrl: `https://www.youtube.com/watch?v=${id}`,
  };
}

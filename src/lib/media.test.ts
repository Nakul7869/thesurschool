import { describe, expect, it } from "vitest";
import { parseYouTube, publicMediaUrl } from "./media";

describe("publicMediaUrl", () => {
  const base = "https://abc.supabase.co";

  it("builds a public storage URL", () => {
    expect(publicMediaUrl(base, "gallery/one.webp")).toBe(
      "https://abc.supabase.co/storage/v1/object/public/site-media/gallery/one.webp",
    );
  });

  it("ignores a trailing slash on the base URL", () => {
    expect(publicMediaUrl(base + "/", "a.jpg")).toBe(
      "https://abc.supabase.co/storage/v1/object/public/site-media/a.jpg",
    );
  });

  it("encodes unsafe characters in each path segment", () => {
    expect(publicMediaUrl(base, "gallery/my photo.jpg")).toContain("my%20photo.jpg");
  });

  it("returns null when the base URL or the path is missing", () => {
    expect(publicMediaUrl(undefined, "a.jpg")).toBeNull();
    expect(publicMediaUrl(base, null)).toBeNull();
    expect(publicMediaUrl(base, "")).toBeNull();
  });
});

describe("parseYouTube", () => {
  const id = "dQw4w9WgXcQ";

  const accepted = [
    "https://www.youtube.com/watch?v=" + id,
    "https://youtube.com/watch?v=" + id + "&t=10s",
    "https://m.youtube.com/watch?v=" + id,
    "https://youtu.be/" + id,
    "https://www.youtube.com/shorts/" + id,
    "https://www.youtube.com/embed/" + id,
  ];

  it.each(accepted)("extracts the id from %s", (url) => {
    expect(parseYouTube(url)?.id).toBe(id);
  });

  it("returns embed, thumbnail and watch URLs", () => {
    const video = parseYouTube("https://youtu.be/" + id);
    expect(video?.embedUrl).toBe("https://www.youtube-nocookie.com/embed/" + id);
    expect(video?.thumbnailUrl).toBe("https://i.ytimg.com/vi/" + id + "/hqdefault.jpg");
    expect(video?.watchUrl).toBe("https://www.youtube.com/watch?v=" + id);
  });

  const rejected = [
    "",
    "not a url",
    "https://vimeo.com/12345",
    "https://www.youtube.com/watch?v=short",
    "http://www.youtube.com/watch?v=" + id,
    "https://evil.example/watch?v=" + id,
    "javascript:alert(1)",
  ];

  it.each(rejected)("rejects '%s'", (url) => {
    expect(parseYouTube(url)).toBeNull();
  });
});

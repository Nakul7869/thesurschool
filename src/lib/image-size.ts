export const MAX_PHOTO_EDGE = 1600;
export const MAX_SOURCE_BYTES = 20 * 1024 * 1024;
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

/** Scales width and height down, keeping the shape, so the longer edge is at most `maxEdge`. Never scales up. */
export function fitWithin(width: number, height: number, maxEdge: number = MAX_PHOTO_EDGE): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= maxEdge) return { width, height };
  const scale = maxEdge / longest;
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

export function photoProblem(file: { type: string; size: number; name: string }): string | null {
  if (!(ACCEPTED_PHOTO_TYPES as readonly string[]).includes(file.type)) {
    return `${file.name} is not a JPEG, PNG or WebP photo.`;
  }
  if (file.size > MAX_SOURCE_BYTES) return `${file.name} is larger than 20 MB.`;
  return null;
}

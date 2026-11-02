import type { Course, CourseLevel, GalleryItem, SchoolEvent, SiteSettings, Stat } from "./types";

export type SettingsRow = {
  school_name: string;
  tagline: string;
  hero_heading: string;
  hero_subheading: string;
  teacher_name: string;
  teacher_title: string;
  teacher_bio: string;
  teacher_photo_path: string | null;
  whatsapp_number: string;
  phone: string;
  email: string;
  instagram_url: string;
  youtube_url: string;
  facebook_url: string;
  service_area: string;
  class_modes_note: string;
  grading_note: string;
  stats: unknown;
};

export type LevelRow = {
  id: string;
  course_id: string;
  level_name: string;
  description: string;
  duration: string;
  fee: string;
  offers_grading: boolean;
  grading_fee: string;
  sort_order: number;
  is_published: boolean;
};

export type CourseRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  sort_order: number;
  is_published: boolean;
  course_levels: LevelRow[] | null;
};

export type GalleryRow = {
  id: string;
  kind: "photo" | "video";
  storage_path: string | null;
  video_url: string | null;
  caption: string;
  sort_order: number;
  is_published: boolean;
};

export type EventRow = {
  id: string;
  kind: "event" | "news";
  title: string;
  summary: string;
  details: string;
  starts_on: string;
  location: string;
  tags: string[] | null;
  is_published: boolean;
};

function toStats(value: unknown): Stat[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const { value: statValue, label } = item as Record<string, unknown>;
    return typeof statValue === "string" && typeof label === "string" ? [{ value: statValue, label }] : [];
  });
}

export function toSettings(row: SettingsRow): SiteSettings {
  return {
    schoolName: row.school_name,
    tagline: row.tagline,
    heroHeading: row.hero_heading,
    heroSubheading: row.hero_subheading,
    teacherName: row.teacher_name,
    teacherTitle: row.teacher_title,
    teacherBio: row.teacher_bio,
    teacherPhotoPath: row.teacher_photo_path || null,
    whatsappNumber: row.whatsapp_number,
    phone: row.phone,
    email: row.email,
    instagramUrl: row.instagram_url,
    youtubeUrl: row.youtube_url,
    facebookUrl: row.facebook_url,
    serviceArea: row.service_area,
    classModesNote: row.class_modes_note,
    gradingNote: row.grading_note,
    stats: toStats(row.stats),
  };
}

export function toLevel(row: LevelRow): CourseLevel {
  return {
    id: row.id,
    courseId: row.course_id,
    levelName: row.level_name,
    description: row.description,
    duration: row.duration,
    fee: row.fee,
    offersGrading: row.offers_grading,
    gradingFee: row.grading_fee,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
  };
}

const bySortOrder = <T extends { sortOrder: number }>(a: T, b: T) => a.sortOrder - b.sortOrder;

export function toCourse(row: CourseRow): Course {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    levels: (row.course_levels ?? []).map(toLevel).sort(bySortOrder),
  };
}

export function toGalleryItem(row: GalleryRow): GalleryItem {
  return {
    id: row.id,
    kind: row.kind,
    storagePath: row.storage_path,
    videoUrl: row.video_url,
    caption: row.caption,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
  };
}

export function toEvent(row: EventRow): SchoolEvent {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    summary: row.summary,
    details: row.details,
    startsOn: row.starts_on,
    location: row.location,
    tags: row.tags ?? [],
    isPublished: row.is_published,
  };
}

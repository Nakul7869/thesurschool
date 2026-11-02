import "server-only";
import { DEFAULT_SETTINGS } from "./defaults";
import {
  toCourse,
  toEvent,
  toGalleryItem,
  toSettings,
  type CourseRow,
  type EventRow,
  type GalleryRow,
  type SettingsRow,
} from "./mappers";
import { requireAdmin } from "./auth";
import type { Course, GalleryItem, SchoolEvent, SiteSettings } from "./types";

function fail(what: string, message: string): never {
  throw new Error(`Could not load ${what}: ${message}`);
}

/** Admin versions of the data loaders: always fresh, and they include hidden (unpublished) items. */
export async function getAdminSettings(): Promise<SiteSettings> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) fail("settings", error.message);
  return data ? toSettings(data as SettingsRow) : DEFAULT_SETTINGS;
}

export async function getAdminCourses(): Promise<Course[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("courses").select("*, course_levels(*)").order("sort_order");
  if (error) fail("courses", error.message);
  return (data as CourseRow[]).map(toCourse);
}

export async function getAdminGallery(): Promise<GalleryItem[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) fail("gallery", error.message);
  return (data as GalleryRow[]).map(toGalleryItem);
}

export async function getAdminEvents(): Promise<SchoolEvent[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("events").select("*").order("starts_on", { ascending: false });
  if (error) fail("events", error.message);
  return (data as EventRow[]).map(toEvent);
}

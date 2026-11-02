import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { DEFAULT_COURSES, DEFAULT_EVENTS, DEFAULT_SETTINGS } from "./defaults";
import { hasSupabase } from "./env";
import { partitionEvents, todayInIndia } from "./format";
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
import { createPublicClient } from "./supabase/public";
import type { Course, GalleryItem, SchoolEvent, SiteSettings } from "./types";

/** Admin edits call updateTag("site"), so cached content refreshes straight away. */
export const SITE_TAG = "site";

function fail(table: string, message: string): never {
  throw new Error(`Could not load ${table}: ${message}`);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag(SITE_TAG);
  if (!hasSupabase) return DEFAULT_SETTINGS;

  const { data, error } = await createPublicClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) fail("site settings", error.message);
  return data ? toSettings(data as SettingsRow) : DEFAULT_SETTINGS;
}

export async function getCourses(): Promise<Course[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(SITE_TAG);
  if (!hasSupabase) return DEFAULT_COURSES;

  const { data, error } = await createPublicClient()
    .from("courses")
    .select("*, course_levels(*)")
    .eq("is_published", true)
    .order("sort_order");
  if (error) fail("courses", error.message);
  return (data as CourseRow[]).map((row) => {
    const course = toCourse(row);
    return { ...course, levels: course.levels.filter((level) => level.isPublished) };
  });
}

export async function getGallery(): Promise<GalleryItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(SITE_TAG);
  if (!hasSupabase) return [];

  const { data, error } = await createPublicClient()
    .from("gallery_items")
    .select("*")
    .eq("is_published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) fail("gallery", error.message);
  return (data as GalleryRow[]).map(toGalleryItem);
}

export async function getEvents(): Promise<{ upcoming: SchoolEvent[]; past: SchoolEvent[] }> {
  "use cache";
  cacheLife("hours");
  cacheTag(SITE_TAG);

  let events = DEFAULT_EVENTS;
  if (hasSupabase) {
    const { data, error } = await createPublicClient().from("events").select("*").eq("is_published", true);
    if (error) fail("events", error.message);
    events = (data as EventRow[]).map(toEvent);
  }
  return partitionEvents(events, todayInIndia(new Date()));
}

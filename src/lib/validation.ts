import { z } from "zod";
import { toInternationalDigits } from "./contact";
import { parseYouTube } from "./media";

const MAX_TAGS = 6;
const MAX_TAG_LENGTH = 24;
const MAX_STATS = 6;
const STORAGE_PATH = /^[A-Za-z0-9][A-Za-z0-9_\-./]*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const requiredText = (max: number) =>
  z.string().trim().min(1, "This field is required").max(max, `Keep it under ${max} characters`);
const optionalText = (max: number) => z.string().trim().max(max, `Keep it under ${max} characters`);

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

const optionalHttpsUrl = optionalText(300).refine(
  (value) => value === "" || isHttpsUrl(value),
  "Enter a full link starting with https://",
);

const phoneNumber = z
  .string()
  .trim()
  .refine((value) => toInternationalDigits(value) !== "", "Enter a valid phone number, for example 98765 43210");

const checkbox = z.preprocess((value) => value === "on" || value === "true" || value === true, z.boolean());

const storagePath = z
  .string()
  .trim()
  .max(200)
  .refine((value) => value === "" || (STORAGE_PATH.test(value) && !value.includes("..")), "Invalid photo path");

const teacherPhotoPath = storagePath.refine((value) => value === "" || value.startsWith("teacher/"), "Invalid photo path");

const sortOrder = z.coerce.number().int("Use a whole number").min(0).max(10_000);

function isRealDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function parseTags(raw: string): string[] {
  const seen = new Set<string>();
  for (const part of raw.split(",")) {
    const tag = part.trim().slice(0, MAX_TAG_LENGTH);
    if (tag) seen.add(tag);
  }
  return [...seen].slice(0, MAX_TAGS);
}

export const statSchema = z.object({
  value: requiredText(20),
  label: requiredText(40),
});

export const settingsSchema = z.object({
  schoolName: requiredText(80),
  tagline: optionalText(160),
  heroHeading: requiredText(80),
  heroSubheading: optionalText(300),
  teacherName: requiredText(80),
  teacherTitle: optionalText(120),
  teacherBio: optionalText(3000),
  teacherPhotoPath,
  whatsappNumber: phoneNumber,
  phone: phoneNumber,
  email: z.string().trim().max(120).pipe(z.email("Enter a valid email address")),
  instagramUrl: optionalHttpsUrl,
  instagramUrl2: optionalHttpsUrl,
  youtubeUrl: optionalHttpsUrl,
  facebookUrl: optionalHttpsUrl,
  serviceArea: optionalText(300),
  classModesNote: optionalText(300),
  gradingNote: optionalText(600),
  stats: z.array(statSchema).max(MAX_STATS),
});

export const courseSchema = z.object({
  name: requiredText(60),
  tagline: optionalText(160),
  description: optionalText(1000),
  sortOrder,
  isPublished: checkbox,
});

export const levelSchema = z.object({
  courseId: z.string().uuid("Invalid course"),
  levelName: requiredText(40),
  description: optionalText(600),
  duration: optionalText(80),
  fee: optionalText(80),
  offersGrading: checkbox,
  gradingFee: optionalText(80),
  sortOrder,
  isPublished: checkbox,
});

export const eventSchema = z.object({
  kind: z.enum(["event", "news"]),
  title: requiredText(120),
  summary: optionalText(300),
  details: optionalText(3000),
  startsOn: z.string().trim().refine(isRealDate, "Pick a valid date"),
  location: optionalText(160),
  tags: z.string().max(300).transform(parseTags),
  isPublished: checkbox,
});

export const galleryVideoSchema = z.object({
  videoUrl: z.string().trim().refine((value) => parseYouTube(value) !== null, "Paste a YouTube video link"),
  caption: optionalText(140),
});

export const galleryCaptionSchema = z.object({
  caption: optionalText(140),
  isPublished: checkbox,
  sortOrder,
});

export const galleryPhotosSchema = z.object({
  paths: z
    .array(storagePath.refine((value) => value !== "", "Invalid photo path"))
    .min(1, "Choose at least one photo")
    .max(30),
});

/** Collects `stats.N.value` / `stats.N.label` form fields, skipping rows left completely empty. */
export function readStats(form: FormData): { value: string; label: string }[] {
  const rows: { value: string; label: string }[] = [];
  for (let index = 0; index < MAX_STATS; index += 1) {
    const value = String(form.get(`stats.${index}.value`) ?? "").trim();
    const label = String(form.get(`stats.${index}.label`) ?? "").trim();
    if (value || label) rows.push({ value, label });
  }
  return rows;
}

/** Plain object of form fields, without the internal keys Next adds to Server Action forms. */
export function formToObject(form: FormData): Record<string, FormDataEntryValue> {
  const result: Record<string, FormDataEntryValue> = {};
  for (const [key, value] of form.entries()) {
    if (!key.startsWith("$ACTION")) result[key] = value;
  }
  return result;
}

export function firstErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in result)) result[key] = issue.message;
  }
  return result;
}

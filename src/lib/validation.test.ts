import { describe, expect, it } from "vitest";
import {
  eventSchema,
  firstErrors,
  galleryVideoSchema,
  levelSchema,
  parseTags,
  readStats,
  settingsSchema,
} from "./validation";

const validSettings = {
  schoolName: "The Sur School",
  tagline: "Music lessons",
  heroHeading: "Find your sur.",
  heroSubheading: "Lessons online and at home.",
  teacherName: "Nakul Raikhelkar",
  teacherTitle: "Pianist and teacher",
  teacherBio: "Playing piano for 15+ years.",
  teacherPhotoPath: "",
  whatsappNumber: "9381517689",
  phone: "9381517689",
  email: "thesurschool@gmail.com",
  instagramUrl: "",
  instagramUrl2: "",
  youtubeUrl: "https://youtube.com/@thesurschool",
  facebookUrl: "",
  serviceArea: "Goa",
  classModesNote: "Online and home visits",
  gradingNote: "Grading exam preparation",
  stats: [{ value: "15+", label: "Years playing" }],
};

describe("settingsSchema", () => {
  it("accepts valid settings", () => {
    expect(settingsSchema.safeParse(validSettings).success).toBe(true);
  });

  it("rejects an invalid WhatsApp number", () => {
    const result = settingsSchema.safeParse({ ...validSettings, whatsappNumber: "12" });
    expect(result.success).toBe(false);
    if (!result.success) expect(firstErrors(result.error).whatsappNumber).toBeTruthy();
  });

  it("rejects an invalid email", () => {
    expect(settingsSchema.safeParse({ ...validSettings, email: "nope" }).success).toBe(false);
  });

  it("rejects a social link that is not https", () => {
    expect(settingsSchema.safeParse({ ...validSettings, instagramUrl: "http://instagram.com/x" }).success).toBe(false);
    expect(settingsSchema.safeParse({ ...validSettings, instagramUrl: "javascript:alert(1)" }).success).toBe(false);
  });

  it("accepts a second Instagram link and rejects an unsafe one", () => {
    expect(settingsSchema.safeParse({ ...validSettings, instagramUrl2: "https://instagram.com/second" }).success).toBe(true);
    expect(settingsSchema.safeParse({ ...validSettings, instagramUrl2: "http://instagram.com/second" }).success).toBe(false);
  });

  it("rejects a photo path that tries to leave the bucket", () => {
    expect(settingsSchema.safeParse({ ...validSettings, teacherPhotoPath: "../secret.png" }).success).toBe(false);
  });

  it("accepts a normal photo path", () => {
    expect(settingsSchema.safeParse({ ...validSettings, teacherPhotoPath: "teacher/abc-123.webp" }).success).toBe(true);
  });

  it("requires a school name", () => {
    expect(settingsSchema.safeParse({ ...validSettings, schoolName: "  " }).success).toBe(false);
  });
});

describe("levelSchema", () => {
  const level = {
    courseId: "5b0c3b3e-0f0a-4d8e-9e0a-3a6b0d3f9c11",
    levelName: "Basic",
    description: "",
    duration: "45 min",
    fee: "Ask on WhatsApp",
    offersGrading: "on",
    gradingFee: "",
    sortOrder: "1",
    isPublished: "on",
  };

  it("turns checkbox values and numeric strings into typed values", () => {
    const parsed = levelSchema.parse(level);
    expect(parsed.offersGrading).toBe(true);
    expect(parsed.isPublished).toBe(true);
    expect(parsed.sortOrder).toBe(1);
  });

  it("treats a missing checkbox as false", () => {
    const withoutPublished: Record<string, string> = { ...level };
    delete withoutPublished.isPublished;
    expect(levelSchema.parse(withoutPublished).isPublished).toBe(false);
  });

  it("rejects a course id that is not a uuid", () => {
    expect(levelSchema.safeParse({ ...level, courseId: "1; drop table" }).success).toBe(false);
  });
});

describe("eventSchema", () => {
  const event = {
    kind: "event",
    title: "Annual recital",
    summary: "Students perform",
    details: "",
    startsOn: "2026-12-20",
    location: "Online",
    tags: "recital, piano",
    isPublished: "on",
  };

  it("parses tags into an array", () => {
    expect(eventSchema.parse(event).tags).toEqual(["recital", "piano"]);
  });

  it("rejects a malformed date", () => {
    expect(eventSchema.safeParse({ ...event, startsOn: "20-12-2026" }).success).toBe(false);
  });

  it("rejects an impossible date", () => {
    expect(eventSchema.safeParse({ ...event, startsOn: "2026-02-31" }).success).toBe(false);
  });

  it("rejects an unknown kind", () => {
    expect(eventSchema.safeParse({ ...event, kind: "party" }).success).toBe(false);
  });
});

describe("parseTags", () => {
  it("trims, drops empties and duplicates, and caps the count", () => {
    expect(parseTags(" a, b ,,a, c, d, e, f, g ")).toEqual(["a", "b", "c", "d", "e", "f"]);
  });

  it("returns an empty array for an empty string", () => {
    expect(parseTags("")).toEqual([]);
  });
});

describe("galleryVideoSchema", () => {
  it("accepts a YouTube link", () => {
    const input = { videoUrl: "https://youtu.be/dQw4w9WgXcQ", caption: "Recital" };
    expect(galleryVideoSchema.safeParse(input).success).toBe(true);
  });

  it("rejects other links", () => {
    expect(galleryVideoSchema.safeParse({ videoUrl: "https://example.com/v", caption: "" }).success).toBe(false);
  });
});

describe("readStats", () => {
  it("collects rows from form fields and skips empty rows", () => {
    const form = new FormData();
    form.set("stats.0.value", "15+");
    form.set("stats.0.label", "Years playing");
    form.set("stats.1.value", "");
    form.set("stats.1.label", "");
    form.set("stats.2.value", "100+");
    form.set("stats.2.label", "Students");
    expect(readStats(form)).toEqual([
      { value: "15+", label: "Years playing" },
      { value: "100+", label: "Students" },
    ]);
  });

  it("keeps half-filled rows so validation can complain about them", () => {
    const form = new FormData();
    form.set("stats.0.value", "15+");
    form.set("stats.0.label", "");
    expect(readStats(form)).toEqual([{ value: "15+", label: "" }]);
  });
});

describe("firstErrors", () => {
  it("returns the first message for each field path", () => {
    const result = levelSchema.safeParse({ levelName: "", courseId: "x" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = firstErrors(result.error);
      expect(typeof errors.levelName).toBe("string");
      expect(typeof errors.courseId).toBe("string");
    }
  });
});

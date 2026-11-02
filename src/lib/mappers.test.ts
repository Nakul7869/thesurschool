import { describe, expect, it } from "vitest";
import { toCourse, toEvent, toGalleryItem, toSettings, type CourseRow, type SettingsRow } from "./mappers";

const settingsRow: SettingsRow = {
  school_name: "The Sur School",
  tagline: "t",
  hero_heading: "h",
  hero_subheading: "s",
  teacher_name: "Nakul",
  teacher_title: "Teacher",
  teacher_bio: "Bio",
  teacher_photo_path: "",
  whatsapp_number: "919381517689",
  phone: "919381517689",
  email: "a@b.co",
  instagram_url: "",
  instagram_url_2: "",
  youtube_url: "",
  facebook_url: "",
  service_area: "",
  class_modes_note: "",
  grading_note: "",
  stats: [{ value: "15+", label: "Years" }, { value: 3, label: "bad" }, null, "x"],
};

describe("toSettings", () => {
  it("maps column names to camelCase", () => {
    expect(toSettings(settingsRow).schoolName).toBe("The Sur School");
    expect(toSettings(settingsRow).whatsappNumber).toBe("919381517689");
  });

  it("turns an empty photo path into null", () => {
    expect(toSettings(settingsRow).teacherPhotoPath).toBeNull();
  });

  it("keeps only well-formed stats", () => {
    expect(toSettings(settingsRow).stats).toEqual([{ value: "15+", label: "Years" }]);
  });

  it("returns no stats when the column is not an array", () => {
    expect(toSettings({ ...settingsRow, stats: {} }).stats).toEqual([]);
  });
});

describe("toCourse", () => {
  const level = (id: string, order: number) => ({
    id,
    course_id: "c1",
    level_name: id,
    description: "",
    duration: "",
    fee: "",
    offers_grading: true,
    grading_fee: "",
    sort_order: order,
    is_published: true,
  });

  const row: CourseRow = {
    id: "c1",
    slug: "piano",
    name: "Piano",
    tagline: "",
    description: "",
    sort_order: 0,
    is_published: true,
    course_levels: [level("Advanced", 2), level("Basic", 0), level("Medium", 1)],
  };

  it("sorts levels by sort order", () => {
    expect(toCourse(row).levels.map((l) => l.levelName)).toEqual(["Basic", "Medium", "Advanced"]);
  });

  it("handles a course with no levels", () => {
    expect(toCourse({ ...row, course_levels: null }).levels).toEqual([]);
  });
});

describe("toEvent and toGalleryItem", () => {
  it("defaults missing tags to an empty array", () => {
    const event = toEvent({
      id: "e1",
      kind: "news",
      title: "T",
      summary: "",
      details: "",
      starts_on: "2026-12-01",
      location: "",
      tags: null,
      is_published: true,
    });
    expect(event.tags).toEqual([]);
    expect(event.startsOn).toBe("2026-12-01");
  });

  it("maps gallery rows", () => {
    const item = toGalleryItem({
      id: "g1",
      kind: "photo",
      storage_path: "gallery/a.webp",
      video_url: null,
      caption: "Class",
      sort_order: 2,
      is_published: false,
    });
    expect(item).toMatchObject({ storagePath: "gallery/a.webp", sortOrder: 2, isPublished: false });
  });
});

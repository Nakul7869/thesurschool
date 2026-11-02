import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and joins words with dashes", () => {
    expect(slugify("Electric Guitar")).toBe("electric-guitar");
  });

  it("removes accents and punctuation", () => {
    expect(slugify("  Café & Bass!! ")).toBe("cafe-bass");
  });

  it("returns an empty string when nothing usable is left", () => {
    expect(slugify("???")).toBe("");
  });

  it("limits the length", () => {
    expect(slugify("a".repeat(100))).toHaveLength(60);
  });
});

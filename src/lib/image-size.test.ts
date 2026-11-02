import { describe, expect, it } from "vitest";
import { fitWithin, photoProblem } from "./image-size";

describe("fitWithin", () => {
  it("shrinks a wide photo so the long edge fits", () => {
    expect(fitWithin(4000, 3000, 1600)).toEqual({ width: 1600, height: 1200 });
  });

  it("shrinks a tall photo so the long edge fits", () => {
    expect(fitWithin(3000, 6000, 1600)).toEqual({ width: 800, height: 1600 });
  });

  it("never scales a small photo up", () => {
    expect(fitWithin(800, 600, 1600)).toEqual({ width: 800, height: 600 });
  });

  it("keeps at least one pixel on each side", () => {
    expect(fitWithin(10000, 1, 1600)).toEqual({ width: 1600, height: 1 });
  });
});

describe("photoProblem", () => {
  it("accepts JPEG, PNG and WebP under the size limit", () => {
    expect(photoProblem({ name: "a.jpg", type: "image/jpeg", size: 1000 })).toBeNull();
    expect(photoProblem({ name: "a.png", type: "image/png", size: 1000 })).toBeNull();
    expect(photoProblem({ name: "a.webp", type: "image/webp", size: 1000 })).toBeNull();
  });

  it("rejects other file types", () => {
    expect(photoProblem({ name: "a.gif", type: "image/gif", size: 10 })).toContain("not a JPEG");
    expect(photoProblem({ name: "a.pdf", type: "application/pdf", size: 10 })).toContain("not a JPEG");
  });

  it("rejects files over 20 MB", () => {
    expect(photoProblem({ name: "big.jpg", type: "image/jpeg", size: 21 * 1024 * 1024 })).toContain("20 MB");
  });
});

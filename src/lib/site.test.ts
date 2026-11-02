import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS } from "./defaults";
import { contactLinks, courseWhatsappLink, socialLabel } from "./site";

describe("contactLinks", () => {
  it("builds WhatsApp, phone and email links from the settings", () => {
    const links = contactLinks(DEFAULT_SETTINGS);
    expect(links.whatsapp).toContain("https://wa.me/919381517689?text=");
    expect(links.tel).toBe("tel:+919381517689");
    expect(links.mailto).toContain("mailto:thesurschool@gmail.com");
    expect(links.phoneDisplay).toBe("+91 93815 17689");
  });

  it("lists only the social links that are filled in", () => {
    const links = contactLinks({ ...DEFAULT_SETTINGS, instagramUrl: "https://instagram.com/thesurschool" });
    expect(links.socials).toEqual([
      { name: "Instagram", label: "Instagram @thesurschool", href: "https://instagram.com/thesurschool" },
    ]);
  });

  it("returns null links when the numbers are invalid", () => {
    const links = contactLinks({ ...DEFAULT_SETTINGS, whatsappNumber: "x", phone: "y", email: "z" });
    expect(links.whatsapp).toBeNull();
    expect(links.tel).toBeNull();
    expect(links.mailto).toBeNull();
  });
});

describe("courseWhatsappLink", () => {
  it("opens WhatsApp with the course in the message", () => {
    const link = courseWhatsappLink(DEFAULT_SETTINGS, { instrument: "Piano", level: "Medium", grading: true });
    const text = decodeURIComponent(link?.split("?text=")[1] ?? "");
    expect(text).toContain("Piano (Medium) grading classes");
  });
});

describe("two Instagram accounts", () => {
  it("lists both accounts, each labelled with its handle", () => {
    const links = contactLinks({
      ...DEFAULT_SETTINGS,
      instagramUrl: "https://instagram.com/thesurschool",
      instagramUrl2: "https://www.instagram.com/@nakul.music/",
    });
    expect(links.socials.map((s) => s.label)).toEqual(["Instagram @thesurschool", "Instagram @nakul.music"]);
  });
});

describe("socialLabel", () => {
  it("falls back to the plain name when there is no handle", () => {
    expect(socialLabel("Instagram", "https://instagram.com/")).toBe("Instagram");
    expect(socialLabel("Instagram", "not a url")).toBe("Instagram");
  });

  it("leaves other networks alone", () => {
    expect(socialLabel("YouTube", "https://youtube.com/@x")).toBe("YouTube");
  });
});

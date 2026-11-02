import { describe, expect, it } from "vitest";
import {
  bookingMessage,
  formatPhone,
  mailtoLink,
  telLink,
  toInternationalDigits,
  whatsappLink,
} from "./contact";

describe("toInternationalDigits", () => {
  it("adds India's country code to a 10 digit number", () => {
    expect(toInternationalDigits("9381517689")).toBe("919381517689");
  });

  it("keeps a number that already has a country code", () => {
    expect(toInternationalDigits("+91 93815 17689")).toBe("919381517689");
  });

  it("handles the 00 international prefix", () => {
    expect(toInternationalDigits("0091-9381517689")).toBe("919381517689");
  });

  it("replaces a leading trunk 0 with the country code", () => {
    expect(toInternationalDigits("09381517689")).toBe("919381517689");
  });

  it("returns an empty string for numbers that are too short or too long", () => {
    expect(toInternationalDigits("12345")).toBe("");
    expect(toInternationalDigits("1".repeat(16))).toBe("");
    expect(toInternationalDigits("")).toBe("");
  });

  it("uses a custom country code when asked", () => {
    expect(toInternationalDigits("4155550123", "1")).toBe("14155550123");
  });
});

describe("whatsappLink", () => {
  it("builds a wa.me link with an encoded message", () => {
    expect(whatsappLink("9381517689", "Hi & hello")).toBe(
      "https://wa.me/919381517689?text=Hi%20%26%20hello",
    );
  });

  it("builds a link without a message", () => {
    expect(whatsappLink("+919381517689")).toBe("https://wa.me/919381517689");
  });

  it("returns null for an invalid number", () => {
    expect(whatsappLink("abc")).toBeNull();
  });
});

describe("telLink", () => {
  it("builds a tel: link in international format", () => {
    expect(telLink("9381517689")).toBe("tel:+919381517689");
  });

  it("returns null for an invalid number", () => {
    expect(telLink("")).toBeNull();
  });
});

describe("mailtoLink", () => {
  it("builds a mailto link with an encoded subject", () => {
    expect(mailtoLink("thesurschool@gmail.com", "Class enquiry")).toBe(
      "mailto:thesurschool@gmail.com?subject=Class%20enquiry",
    );
  });

  it("builds a mailto link without a subject", () => {
    expect(mailtoLink("thesurschool@gmail.com")).toBe("mailto:thesurschool@gmail.com");
  });

  it("returns null for something that is not an email", () => {
    expect(mailtoLink("not-an-email")).toBeNull();
  });
});

describe("formatPhone", () => {
  it("groups Indian numbers for display", () => {
    expect(formatPhone("9381517689")).toBe("+91 93815 17689");
  });

  it("prefixes other valid numbers with a plus", () => {
    expect(formatPhone("+1 415 555 0123")).toBe("+14155550123");
  });

  it("returns the trimmed input when it cannot be parsed", () => {
    expect(formatPhone("  call us  ")).toBe("call us");
  });
});

describe("bookingMessage", () => {
  it("mentions instrument and level", () => {
    expect(
      bookingMessage({ school: "The Sur School", instrument: "Piano", level: "Medium" }),
    ).toBe("Hi, I'd like to book a session at The Sur School. I'm interested in Piano (Medium).");
  });

  it("mentions grading classes", () => {
    expect(
      bookingMessage({ school: "The Sur School", instrument: "Guitar", level: "Basic", grading: true }),
    ).toBe(
      "Hi, I'd like to book a session at The Sur School. I'm interested in Guitar (Basic) grading classes.",
    );
  });

  it("works with no course chosen", () => {
    expect(bookingMessage({ school: "The Sur School" })).toBe(
      "Hi, I'd like to book a session at The Sur School.",
    );
  });
});

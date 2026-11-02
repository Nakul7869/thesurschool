import { describe, expect, it } from "vitest";
import { formatEventDate, paragraphs, partitionEvents, todayInIndia } from "./format";

describe("todayInIndia", () => {
  it("returns the date in India, which is ahead of UTC", () => {
    expect(todayInIndia(new Date("2026-11-02T20:00:00Z"))).toBe("2026-11-03");
  });

  it("keeps the same day when India has not rolled over yet", () => {
    expect(todayInIndia(new Date("2026-11-02T10:00:00Z"))).toBe("2026-11-02");
  });
});

describe("formatEventDate", () => {
  it("formats a date-only string without shifting the day", () => {
    expect(formatEventDate("2026-12-05")).toBe("5 Dec 2026");
  });

  it("returns the input when it is not a date", () => {
    expect(formatEventDate("soon")).toBe("soon");
  });
});

describe("partitionEvents", () => {
  const events = [
    { id: "a", startsOn: "2026-12-01" },
    { id: "b", startsOn: "2026-10-01" },
    { id: "c", startsOn: "2026-11-02" },
    { id: "d", startsOn: "2027-01-15" },
  ];

  it("puts today and later into upcoming, soonest first", () => {
    const { upcoming } = partitionEvents(events, "2026-11-02");
    expect(upcoming.map((e) => e.id)).toEqual(["c", "a", "d"]);
  });

  it("puts earlier dates into past, latest first", () => {
    const { past } = partitionEvents(events, "2026-11-02");
    expect(past.map((e) => e.id)).toEqual(["b"]);
  });

  it("does not modify the input array", () => {
    const copy = [...events];
    partitionEvents(events, "2026-11-02");
    expect(events).toEqual(copy);
  });
});

describe("paragraphs", () => {
  it("splits on blank lines and trims", () => {
    expect(paragraphs("One.\n\n  Two.  \n\n\nThree.")).toEqual(["One.", "Two.", "Three."]);
  });

  it("returns an empty array for blank text", () => {
    expect(paragraphs("  \n\n ")).toEqual([]);
  });
});

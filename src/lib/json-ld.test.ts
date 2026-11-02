import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "./json-ld";

describe("serializeJsonLd", () => {
  it("never outputs a raw less-than sign, so a value cannot close the script tag", () => {
    const output = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(output).not.toContain("<");
    expect(output).not.toContain("</script>");
  });

  it("still parses back to the original value", () => {
    const value = { name: "A <b> school", n: 2 };
    expect(JSON.parse(serializeJsonLd(value))).toEqual(value);
  });
});

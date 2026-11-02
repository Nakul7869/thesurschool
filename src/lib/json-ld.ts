const BACKSLASH = String.fromCharCode(92);
const ESCAPED_LESS_THAN = `${BACKSLASH}u003c`;

/** JSON for a <script type="application/ld+json"> block. Escapes "<" so values can never close the script tag. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", ESCAPED_LESS_THAN);
}

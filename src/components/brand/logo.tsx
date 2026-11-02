import { LOGO_MARK, LOGO_WORDMARK } from "./logo-paths";

type LogoProps = { className?: string; label?: string };

/** The square "S" mark on its own. Colour follows the surrounding text colour. */
export function LogoMark({ className, label }: LogoProps) {
  return (
    <svg
      viewBox={LOGO_MARK.viewBox}
      className={className}
      fill="currentColor"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={LOGO_MARK.d} />
    </svg>
  );
}

/** Mark and "The Sur School" lettering together, as in the original logo. */
export function Logo({ className, label = "The Sur School" }: LogoProps) {
  const [, , markWidth, markHeight] = LOGO_MARK.viewBox.split(" ").map(Number);
  const [, , wordWidth, wordHeight] = LOGO_WORDMARK.viewBox.split(" ").map(Number);
  const gap = Math.round(markWidth * 0.2);
  const width = markWidth + gap + wordWidth;
  const height = Math.max(markHeight, wordHeight);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} fill="currentColor" role="img" aria-label={label}>
      <path d={LOGO_MARK.d} />
      <g transform={`translate(${markWidth + gap} 0)`}>
        <path d={LOGO_WORDMARK.d} />
      </g>
    </svg>
  );
}

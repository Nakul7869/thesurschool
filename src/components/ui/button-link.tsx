import type { AnchorHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "whatsapp";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-on-brand hover:opacity-90",
  outline: "border-2 border-brand text-ink hover:bg-brand hover:text-on-brand",
  whatsapp: "bg-[#0f7a40] text-white hover:bg-[#0b6634]",
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant };

/** A normal link that looks like a button. Use for WhatsApp, call and email actions. */
export function ButtonLink({ variant = "primary", className = "", ...props }: ButtonLinkProps) {
  return (
    <a
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-bold transition ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}

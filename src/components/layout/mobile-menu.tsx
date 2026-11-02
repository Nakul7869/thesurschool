"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLinks } from "./nav-links";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid size-11 place-items-center rounded-full border border-line text-ink"
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>
      {open ? (
        <div id="mobile-nav" className="absolute inset-x-0 top-full border-b border-line bg-bg px-4 pb-6 pt-2 shadow-lg">
          <NavLinks className="flex flex-col gap-1" onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}

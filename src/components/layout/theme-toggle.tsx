"use client";

import { Moon, Sun } from "lucide-react";
import { useLayoutEffect } from "react";

const STORAGE_KEY = "theme";

function storedTheme(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function ThemeToggle() {
  // React's dev-mode remount clears the attribute the inline script set, so re-apply it. No-op in production.
  useLayoutEffect(() => {
    const theme = storedTheme();
    if (theme === "light" || theme === "dark") document.documentElement.setAttribute("data-theme", theme);
  }, []);

  function toggle() {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing: the choice just won't be remembered.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark mode"
      className="grid size-11 place-items-center rounded-full border border-line text-ink transition hover:bg-bg-soft"
    >
      <Sun className="only-dark size-5" aria-hidden="true" />
      <Moon className="only-light size-5" aria-hidden="true" />
    </button>
  );
}

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** False until the Supabase keys are added; the public site then shows the built-in default content. */
export const hasSupabase = SUPABASE_URL !== "" && SUPABASE_KEY !== "";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://thesurschool.vercel.app").replace(/\/$/, "");

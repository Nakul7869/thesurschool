import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { hasSupabase } from "./env";
import { createClient } from "./supabase/server";

const LOGIN_PATH = "/admin/login";

/**
 * Confirms the visitor is the signed-in admin. Call it at the top of every admin page and Server Action.
 * The database enforces the same rule again through its security policies.
 */
export const requireAdmin = cache(async () => {
  await connection(); // always decided per request, never baked into a prerendered page
  if (!hasSupabase) redirect(LOGIN_PATH);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect(LOGIN_PATH);

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError || isAdmin !== true) redirect(`${LOGIN_PATH}?reason=not-admin`);
  return { supabase, email: data.user.email ?? "" };
});

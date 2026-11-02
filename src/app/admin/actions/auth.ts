"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { failure, type ActionState } from "@/lib/action-state";
import { hasSupabase } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const credentials = z.object({
  email: z.string().trim().max(120).pipe(z.email()),
  password: z.string().min(1).max(200),
});

export async function signIn(_previous: ActionState, formData: FormData): Promise<ActionState> {
  if (!hasSupabase) return failure("The site is not connected to Supabase yet. Add the Supabase keys first.");

  const parsed = credentials.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return failure("Enter your email address and password.");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return failure("That email and password did not work.");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) {
    await supabase.auth.signOut();
    return failure("This account is not allowed to manage the site.");
  }
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

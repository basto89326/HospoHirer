"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/serverClient";

async function ensureEmployerRow(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  name: string,
) {
  const { data: existing } = await supabase
    .from("employers")
    .select("auth_id")
    .eq("auth_id", userId)
    .maybeSingle();

  if (!existing) {
    await supabase.from("employers").insert({
      auth_id:    userId,
      name:       name || "New Employer",
      venue_name: "",
      venue_type: "",
      location:   "",
      phone:      "",
      email:      "",
      bio:        "",
      avatar_url: "",
      website:    "",
    });
  }
}

async function ensureWorkerRow(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  name: string,
) {
  const { data: existing } = await supabase
    .from("workers")
    .select("auth_id")
    .eq("auth_id", userId)
    .maybeSingle();

  if (!existing) {
    await supabase.from("workers").insert({
      auth_id:           userId,
      name:              name || "New Worker",
      location:          "",
      distanceKm:        10,
      availability:      "Casual",
      availabilityColor: "bg-blue-100 text-blue-700",
      avatarUrl:         "",
      online:            true,
      mostRecentRole:    "",
      mostRecentDates:   "",
      bio:               "",
      roles:             [],
      certifications:    [],
      workHistory:       [],
    });
  }
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email    = formData.get("email")    as string;
  const password = formData.get("password") as string;
  const name     = formData.get("name")     as string;
  const role     = formData.get("role")     as "worker" | "employer";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`);
  }

  // If the session exists the user was auto-confirmed (email confirmation disabled).
  // Create the worker row immediately instead of waiting for the callback.
  if (data.session && data.user && role === "worker") {
    await ensureWorkerRow(supabase, data.user.id, name);
    redirect("/worker");
  }

  if (data.session && data.user && role === "employer") {
    await ensureEmployerRow(supabase, data.user.id, name);
    redirect("/employer");
  }

  redirect("/auth/verify");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email    = formData.get("email")    as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
  }

  const role = data.user?.user_metadata?.role as string | undefined;
  const name = data.user?.user_metadata?.name as string | undefined;

  // Ensure a worker row exists (handles accounts created before this fix,
  // or any edge case where the callback didn't run).
  if (role === "worker") {
    await ensureWorkerRow(supabase, data.user.id, name ?? "New Worker");
  }

  if (role === "employer") {
    await ensureEmployerRow(supabase, data.user.id, name ?? "New Employer");
  }

  redirect(role === "employer" ? "/employer" : "/worker");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

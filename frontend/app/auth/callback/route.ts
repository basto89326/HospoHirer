import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/serverClient";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const role = data.user.user_metadata?.role as string | undefined;
      const name = data.user.user_metadata?.name as string | undefined;

      if (role === "worker") {
        const { data: existing } = await supabase
          .from("workers")
          .select("auth_id")
          .eq("auth_id", data.user.id)
          .maybeSingle();

        if (!existing) {
          await supabase.from("workers").insert({
            auth_id:           data.user.id,
            name:              name ?? "New Worker",
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

      return NextResponse.redirect(`${origin}${role === "employer" ? "/employer" : "/worker"}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=Could+not+verify+email`);
}

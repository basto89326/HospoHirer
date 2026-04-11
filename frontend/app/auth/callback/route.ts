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

      // Create the matching profile row on first sign-in
      if (role === "worker") {
        const { data: existing } = await supabase
          .from("applicant")
          .select("app_id")
          .eq("auth_id", data.user.id)
          .maybeSingle();

        if (!existing) {
          await supabase.from("applicant").insert({
            auth_id:          data.user.id,
            app_name:         name ?? "New Worker",
            app_dob:          "2000-01-01",   // placeholder — worker can update in dashboard
            app_suburb:       "",
            app_email:        data.user.email,
            app_radius_km:    10,
            app_exp:          "",
            app_availability: "Casual",
          });
        }
      } else if (role === "employer") {
        const { data: existing } = await supabase
          .from("hospo_company")
          .select("hc_id")
          .eq("auth_id", data.user.id)
          .maybeSingle();

        if (!existing) {
          await supabase.from("hospo_company").insert({
            auth_id: data.user.id,
            hc_name: name ?? "My Venue",
            hc_email: data.user.email,
          });
        }
      }

      return NextResponse.redirect(`${origin}${role === "employer" ? "/employer" : "/worker"}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=Could+not+verify+email`);
}

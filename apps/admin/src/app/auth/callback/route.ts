import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createProfile } from "@/modules/auth/otp-form/actions";

function safeNextPath(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return "/dashboard";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const user = data.user;
      if (user?.id && user.email) {
        try {
          await createProfile(user.id, user.email);
        } catch {
          // Profile upsert is best-effort; the session is still valid.
        }
      }

      return NextResponse.redirect(new URL(next, origin));
    }
  }

  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("error", "auth-callback");
  return NextResponse.redirect(loginUrl);
}
